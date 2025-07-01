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
    this.verifyBtn = null;
    this.nextBtn = null;
    this.levelIndicator = null;
    this.successModal = null;
    this.closeBtn = null;
  }
  // Para obtener specificContentDivs
  getAllUniqueContentDivIds(map) {
    const allIds = new Set(); // Usamos un Set para almacenar IDs únicos automáticamente
    for (const level in map) {
      if (Array.isArray(map[level])) {
        map[level].forEach(id => allIds.add(id));
      }
    }
    return Array.from(allIds); // Convertimos el Set de nuevo a un Array
  }

  // Inicializa los elementos DOM y los eventos
  init() {
    this.container = this.p.select("#questions");
    this.verifyBtn = this.p.select("#verifyBtn");
    this.nextBtn = this.p.select("#nextBtn");
    this.levelIndicator = this.p.select("#levelIndicator");
    this.successModal = this.p.select("#successModal");
    this.closeBtn = this.p.select("#closeModalBtn");

    if (this.verifyBtn) {
      this.verifyBtn.mousePressed(() => this.verifyAnswers());
    }
    if (this.nextBtn) {
      this.nextBtn.mousePressed(() => this.goToNextLevel());
    }
    if (this.closeBtn) {
      this.closeBtn.mousePressed(() => this.closeModal());
    }

    this.setupLevel(this.currentLevel);
  }

  // Configura el nivel actual
  setupLevel(level) {
    if (this.container) {
      this.container.html(""); // Limpiar contenido previo de preguntas
    }
    this.answers = {};
    this.validationResults = {};
    this.isVerified = false;

    const questions = this.levels[level];

    

    // Controlar la visibilidad de los divs de contenido al cambiar de nivel
    this.updateContentVisibility();

    // Reetablecer en blanco las cajas con conversion a asistemas numéricos
    if (this.binaryDisplay) this.binaryDisplay.html("0"); // Default 8-bit binary, or "0" depending on initial state
    if (this.decimalDisplay) this.decimalDisplay.html("0");
    if (this.hexDisplay) this.hexDisplay.html("0x0");
    if (this.dataTypeDisplay) this.dataTypeDisplay.html(""); // Or "Ningún bit activo" if that's the true initial state


    // Filtra las preguntas que no son solo enunciados para determinar si hay preguntas a calificar
    const gradedQuestions = questions ? questions.filter(q => !q.isStatement) : [];
    const hasGradedQuestions = gradedQuestions.length > 0;

    

    // Ajustar la visibilidad y estado de los botones
    if (this.verifyBtn) {
      if (hasGradedQuestions) { // Solo mostrar si hay preguntas a calificar
        this.verifyBtn.style("display", "inline-block");
        this.verifyBtn.attribute("disabled", ""); // Deshabilitarlo inicialmente
      } else {
        this.verifyBtn.style("display", "none"); // Ocultar si no hay preguntas a calificar
      }
    }

    if (this.nextBtn) {

      // this.nextBtn.style("display", "inline-block"); // Siempre mostrar el botón Siguiente
      if (this.currentLevel >= this.levels.length - 1) {
        this.nextBtn.style("display", "none"); // Ocultar en el último nivel
      } else {
        this.nextBtn.style("display", "inline-block"); // Mostrar en otros niveles
      }
      // if (hasGradedQuestions) {
      //   // this.nextBtn.attribute("disabled", ""); // Deshabilitarlo si hay preguntas a calificar
      // } else {
      //   this.nextBtn.removeAttribute("disabled"); // Habilitarlo si no hay preguntas (es un nivel de contenido o solo enunciados)
      // }
    }

    // Si hay preguntas (o enunciados), poblar el contenedor
    if (questions && questions.length > 0) {
      questions.forEach((q, index) => {
        const div = this.p.createDiv("");
        div.class("input-group");

        const label = this.p.createElement("label", `${index + 1}. ${q.question}`);
        label.attribute("for", q.id);

        div.child(label);

        // Si no es un enunciado, crea el input
        if (!q.isStatement) {
          const input = this.p.createInput("");
          input.attribute("type", "text");
          input.attribute("id", q.id);

          // Si tiene notInput === true, deshabilitar y poner texto predeterminado
          if (q.notInput === true) {
            input.attribute("disabled", "");
            input.value("Interactúa con el gráfico");
          }

          input.input(() => {
            this.answers[q.id] = input.value().trim();
            input.removeClass("correct");
            input.removeClass("incorrect");
            this.validationResults[q.id] = null;
            this.isVerified = false;
            this.updateVerifyButton();
            if (this.nextBtn) {
              this.nextBtn.attribute("disabled", "");
            }
          });
          div.child(input);
        }

        if (this.container) {
          this.container.child(div);
        }
      });
    }

    // Ajustar la visibilidad del contenedor de preguntas
    if (questions && questions.length > 0) { // Si hay cualquier tipo de "pregunta" (incluyendo enunciados)
      this.p.select(".container").style("display", "flex");
      this.p.select("#questionCard").style("display", "block");
    } else {
      this.p.select(".container").style("display", "none");
      this.p.select("#questionCard").style("display", "none"); // Ocultar también la tarjeta de preguntas
    }
    
    
    this.updateVerifyButton();
    this.updateLevelIndicator();
  }

  // Controla la visibilidad de los divs de contenido
  updateContentVisibility() {
    const currentLevelContentIds = this.contentVisibilityMap[this.currentLevel] || []; // Obtiene el arreglo de IDs para el nivel actual, o un arreglo vacío si no existe.

    this.specificContentDivs.forEach(id => {
      const div = document.getElementById(id);
      if (div) {
        if (currentLevelContentIds.includes(id)) { // Verifica si el ID actual está incluido en el arreglo de IDs del nivel
          div.classList.remove('hidden');
        } else {
          div.classList.add('hidden');
        }
      }
    });
  }

  // Actualiza el botón de verificar
  updateVerifyButton() {
    const currentQuestions = this.levels[this.currentLevel];
    // Solo considera las preguntas que no son solo enunciados
    const gradedQuestions = currentQuestions ? currentQuestions.filter(q => !q.isStatement) : [];

    if (gradedQuestions.length > 0) {
      const allFilled = gradedQuestions.every(q => this.answers[q.id]);
      if (this.verifyBtn) {
        if (allFilled) {
          this.verifyBtn.removeAttribute("disabled");
        } else {
          this.verifyBtn.attribute("disabled", "");
        }
      }
    } else {
      if (this.verifyBtn) this.verifyBtn.attribute("disabled", "");
    }
  }

  // Actualiza el indicador de nivel
  updateLevelIndicator() {
    if (this.levelIndicator) {
      this.levelIndicator.html(`${this.currentLevel + 1} / ${this.levels.length}`);
    }
  }

  // Verifica las respuestas
  verifyAnswers() {
    const currentQuestions = this.levels[this.currentLevel];
    // Solo verifica las preguntas que no son solo enunciados
    const gradedQuestions = currentQuestions ? currentQuestions.filter(q => !q.isStatement) : [];

    let allCorrect = true;

    gradedQuestions.forEach((q) => {
      const input = this.p.select(`#${q.id}`);
      if (input) {
        const answer = (this.answers[q.id] || "").toLowerCase();
        const correct = q.correctAnswer.toLowerCase();

        if (answer === correct) {
          input.addClass("correct");
          input.removeClass("incorrect");
          this.validationResults[q.id] = true;
        } else {
          input.addClass("incorrect");
          input.removeClass("correct");
          this.validationResults[q.id] = false;
          allCorrect = false;
        }
      }
    });

    this.isVerified = true;
    if (this.nextBtn) {
      if (allCorrect) {
        this.nextBtn.removeAttribute("disabled");
      } else {
        this.nextBtn.attribute("disabled", "");
      }
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
    this.currentLevel++;
    window.scrollTo(0, 0);

    if (this.currentLevel < this.levels.length) {
      this.setupLevel(this.currentLevel);
    } else {
      const finalMessage = "🎉 ¡Has completado todos los niveles!";
      if (this.successModal) {
        this.successModal.html(`<div class="modal-content"><h2>¡Felicidades!</h2><p>${finalMessage}</p><button id="closeFinalModalBtn">Reiniciar Quiz</button></div>`);
        this.p.select("#closeFinalModalBtn").mousePressed(() => {
          this.successModal.style("display", "none");
          this.currentLevel = 0;
          this.setupLevel(this.currentLevel);
        });
        this.successModal.style("display", "flex");
      } else {
        console.log(finalMessage);
      }
    }
  }

  setAnswerForGraphicInteractiveQuestion(questionId, answer) {
    // Busca la pregunta en el nivel actual para asegurarte de que existe y es del tipo correcto
    const currentQuestions = this.levels[this.currentLevel];
    const question = currentQuestions ? currentQuestions.find(q => q.id === questionId) : null;

    if (question) {
      // Verificar si la pregunta realmente tiene el input deshabilitado o es un enunciado
      const inputDisabled = question.notInput === true;
      if (!inputDisabled || question.isStatement) { // Si es un enunciado, no debería llamarse a esta función
        console.warn(`Advertencia: Intentando asignar respuesta manualmente a la pregunta '${questionId}', pero no está marcada como 'input: false' o es un enunciado.`);
        return;
      }

      this.answers[questionId] = answer.trim(); // Almacenar la respuesta
      this.validationResults[questionId] = null; // Resetear el resultado de validación

      // Actualizar el valor visual del input deshabilitado
      const inputElement = this.p.select(`#${questionId}`);
      if (inputElement) {
        inputElement.value(answer); // Actualiza el texto visible del input
      }

      // Vuelve a verificar si el botón "Verificar" debe habilitarse
      // Esto es crucial para que el usuario pueda validar después de interactuar con el gráfico
      this.isVerified = false; // Se establece en false porque se ha cambiado una respuesta
      this.updateVerifyButton();
    } else {
      console.error(`Error: Pregunta con ID '${questionId}' no encontrada en el nivel actual.`);
    }
  }
}