class QuizNavigator {
  constructor(p, levels, contentVisibilityMap) {
    this.p = p;
    this.levels = levels;
    this.contentVisibilityMap = contentVisibilityMap;
    this.specificContentDivs = this.getAllUniqueContentDivIds(contentVisibilityMap);
    this.currentLevel = 0;
    this.answers = {};
    this.validationResults = {};
    this.isVerified = false;

    // Variables para elementos DOM de p5.js
    this.container = null;
    this.prevBtn = null;
    this.nextBtn = null;
    this.levelIndicator = null;
    this.successModal = null;
    this.closeBtn = null;
  }

  // Para obtener specificContentDivs
  getAllUniqueContentDivIds(map) {
    const allIds = new Set();
    for (const level in map) {
      if (Array.isArray(map[level])) {
        map[level].forEach(id => allIds.add(id));
      }
    }
    return Array.from(allIds);
  }

  init() {
    this.container = this.p.select("#questions");
    this.prevBtn = this.p.select("#prevBtn");
    this.nextBtn = this.p.select("#nextBtn");
    this.levelIndicator = this.p.select("#levelIndicator");
    this.successModal = this.p.select("#successModal");
    this.closeBtn = this.p.select("#closeModalBtn");

    if (this.prevBtn) this.prevBtn.mousePressed(() => this.goToPrevLevel());
    if (this.nextBtn) this.nextBtn.mousePressed(() => this.goToNextLevel());
    if (this.closeBtn) this.closeBtn.mousePressed(() => this.closeModal());

    this.setupLevel(this.currentLevel);
  }

  setupLevel(level) {
    if (this.container) this.container.html("");

    this.answers = {};
    this.validationResults = {};
    this.isVerified = false;

    const questions = this.levels[level];
    this.updateContentVisibility();

    if (this.prevBtn) {
      if (this.currentLevel === 0) {
        this.prevBtn.style("display", "none");
      } else {
        this.prevBtn.style("display", "inline-block");
      }
    }
    if (this.nextBtn) {
      if (this.currentLevel >= this.levels.length - 1) {
        this.nextBtn.style("display", "none");
      } else {
        this.nextBtn.style("display", "inline-block");
      }
    }

    // Poblar preguntas
    if (questions && questions.length > 0) {
      questions.forEach((q, index) => {
        const div = this.p.createDiv("");
        div.class("input-group");

        // --- Generar enunciado dinámico si es "variable" ---
        let questionText = q.question;
        if (q.type === "variable" && typeof q.generateVars === "function") {
          const vars = q.generateVars();
          q.correctAnswer = vars.correctAnswer; // actualizar la respuesta correcta
          if (q.questionTemplate) {
            questionText = q.questionTemplate(vars.a ?? vars.n ?? vars.m, vars.b ?? vars.n);
          }
        }

        const label = this.p.createElement("label", `${index + 1}. ${questionText}`);
        label.attribute("for", q.id);
        div.child(label);

        if (!q.isStatement) {
          // === TEXT ===
          if (q.type === "text") {
            const input = this.p.createInput("");
            input.attribute("type", "text");
            input.attribute("id", q.id);

            input.input(() => {
              this.answers[q.id] = input.value().trim();
              input.removeClass("correct");
              input.removeClass("incorrect");
              this.validationResults[q.id] = null;
              this.isVerified = false;
            });

            div.child(input);
          }

          // === MULTIPLE (opciones tipo radio) ===
          else if (q.type === "multiple") {
            const opcionesDiv = this.p.createDiv();
            opcionesDiv.class("opciones");

            q.options.forEach(opt => {
              const label = this.p.createElement("label");
              label.class("opcion");

              const input = this.p.createElement("input");
              input.attribute("type", "radio");
              input.attribute("name", q.id);
              input.attribute("value", opt);

              const span = this.p.createElement("span", opt);

              label.child(input);
              label.child(span);
              opcionesDiv.child(label);

              // === Capturar respuesta seleccionada ===
              input.changed(() => {
                this.answers[q.id] = input.value();
                this.validationResults[q.id] = null;
                this.isVerified = false;
              });
            });

            div.child(opcionesDiv);
          }

          // === VARIABLE ===
          else if (q.type === "variable") {
            const input = this.p.createInput("");
            input.attribute("type", "text");
            input.attribute("id", q.id);

            input.input(() => {
              this.answers[q.id] = input.value().trim();
              input.removeClass("correct");
              input.removeClass("incorrect");
              this.validationResults[q.id] = null;
              this.isVerified = false;
            });

            div.child(input);
          }
        }

        if (this.container) this.container.child(div);
      });
    }

    // Visibilidad de contenedor de preguntas
    if (questions && questions.length > 0) {
      this.p.select(".container").style("display", "flex");
      this.p.select("#questionCard").style("display", "block");
    } else {
      this.p.select(".container").style("display", "none");
      this.p.select("#questionCard").style("display", "none");
    }

    this.updateLevelIndicator();
  }

  // Controla la visibilidad de los divs de contenido
  updateContentVisibility() {
    const currentLevelContentIds = this.contentVisibilityMap[this.currentLevel] || [];

    // Muestra/oculta todos los divs específicos
    this.specificContentDivs.forEach(id => {
      const div = document.getElementById(id);
      if (!div) return;
      if (currentLevelContentIds.includes(id)) div.classList.remove('hidden');
      else div.classList.add('hidden');
    });

    // Colocar la UI del laberinto dentro del enunciado visible correcto
    const blocklyCard = document.getElementById('laberintoUI');
    if (blocklyCard) {
      if (currentLevelContentIds.includes('laberintoUI')) {
        blocklyCard.classList.remove('hidden');

        const visibleEnunciadoId = currentLevelContentIds.find(id => id.startsWith('enunciado'));
        if (visibleEnunciadoId) {
          const target = document.getElementById(visibleEnunciadoId);
          if (target && !target.contains(blocklyCard)) {
            target.appendChild(blocklyCard);
          }
        }

        // Asegurar toolbox del nivel
        if (typeof window.initBlockly === 'function') {
          window.initBlockly(this.currentLevel);
        }
      } else {
        blocklyCard.classList.add('hidden');
      }
    }
  }

  // Actualiza el indicador de nivel
  updateLevelIndicator() {
    if (this.levelIndicator) {
      this.levelIndicator.html(`${this.currentLevel + 1} / ${this.levels.length}`);
    }
  }

  // Cierra el modal
  closeModal() {
    if (this.successModal) {
      this.successModal.style("display", "none");
    }
    if (this.currentLevel < this.levels.length) {
      this.updateContentVisibility();
    }
  }

  // Avanza al siguiente nivel
  goToNextLevel() {
    this.validateAnswers();  // valida antes de avanzar
    this.currentLevel++;
    window.scrollTo(0, 0);

    if (this.currentLevel < this.levels.length) {
      this.setupLevel(this.currentLevel);

      //  Actualiza el toolbox del workspace para este nivel
      if (typeof window.initBlockly === 'function') {
        window.initBlockly(this.currentLevel);
      }

      if (this.p && typeof this.p.resetAll === 'function') {
        this.p.resetAll(this.currentLevel);
      }
    } else {
      // === Al completar todos los niveles ===
      const totalCorrectos = SCORMManager.puntosLaberintos + SCORMManager.puntosPreguntas;
      const totalPosibles = SCORMManager.totalLaberintos + SCORMManager.totalPreguntas;
      const score = Math.round((totalCorrectos / totalPosibles) * 100);

      const finalMessage = `
      <div style="text-align:center;">
        <h2>🎉 ¡Felicidades! Has completado todos los niveles de este capítulo.</h2>
        <p>Tu nota es:</p>
        <p style="font-size: 24px; font-weight: bold; color: #007bff;">
          ${score} / 100
        </p>
      </div>
    `;

      if (this.successModal) {
        this.successModal.html(
          `<div class="modal-content">
           ${finalMessage}
           <button id="closeFinalModalBtn">Reiniciar Quiz</button>
         </div>`
        );

        this.p.select("#closeFinalModalBtn").mousePressed(() => {
          this.successModal.style("display", "none");
          this.currentLevel = 0;
          this.setupLevel(this.currentLevel);

          if (this.p && typeof this.p.resetAll === 'function') {
            this.p.resetAll(this.currentLevel);
          }

          if (typeof window.initBlockly === 'function') {
            window.initBlockly(this.currentLevel);
          }
        });

        this.successModal.style("display", "flex");

        // 🔗 Registrar en SCORM al final
        if (typeof doSetValue === "function") {
          doSetValue("cmi.core.score.raw", score.toString());
          doSetValue("cmi.core.lesson_status", "completed");
          doCommit();
        }
      } else {
        console.log(`🎉 ¡Has completado todos los niveles! Nota: ${score}/100`);
      }
    }
  }


  goToPrevLevel() {
    if (this.currentLevel > 0) {
      this.currentLevel--;
      window.scrollTo(0, 0);
      this.setupLevel(this.currentLevel);

      if (typeof window.initBlockly === 'function') {
        window.initBlockly(this.currentLevel);
      }

      if (this.p && typeof this.p.resetAll === 'function') {
        this.p.resetAll(this.currentLevel);
      }
    }
  }

  validateAnswers() {
    const questions = this.levels[this.currentLevel];
    if (!questions) return;

    questions.forEach(q => {
      const userAnswer = (this.answers[q.id] || "").toLowerCase().trim();
      const correctAnswer = (q.correctAnswer || "").toLowerCase().trim();

      if (userAnswer === correctAnswer) {
        if (this.validationResults[q.id] !== true) {
          SCORMManager.registrarRespuestaCorrecta(); // solo si no estaba registrada
        }
        this.validationResults[q.id] = true;
      } else {
        this.validationResults[q.id] = false;
      }
    });

    this.isVerified = true;

    // 🔗 Siempre reflejar cambios en SCORM
    if (typeof SCORMManager !== "undefined") {
      SCORMManager.actualizarSCORM();
    }
  }
}
