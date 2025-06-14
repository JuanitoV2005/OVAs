function quiz1(p) {
  // Datos del quiz
  const levels = [
    // Nivel 1 (índice 0)
    [
      { id: "q1", question: "¿Cuál es la capital de Francia?", correctAnswer: "París" },
      { id: "q2", question: "¿Cuál es el océano más grande del mundo?", correctAnswer: "Pacífico" }
    ],
    // Nivel 2 (índice 1) - Mostrar 'explicacion-intermedia'
    null, // Este nivel no tiene preguntas
    // Nivel 3 (índice 2) - Mostrar 'intro' (por defecto)
    [
      { id: "q5", question: "¿En qué año cayó el Muro de Berlín?", correctAnswer: "1989" },
      { id: "q6", question: "¿Cuál es el país más grande del mundo?", correctAnswer: "Rusia" }
    ],
    // Nivel 4 (índice 3) - Mostrar 'intro' (por defecto), preguntas adicionales si las hubiera
    [
        { id: "q7", question: "¿Cuál es la capital de Italia?", correctAnswer: "Roma" },
        { id: "q8", question: "¿Dónde está la Torre Eiffel?", correctAnswer: "París" }
    ],
    // Nivel 5 (índice 4) - Mostrar 'conclusion'
    null // Este nivel no tiene preguntas
  ];

  // Mapeo de niveles a los IDs de los divs de contenido a mostrar
  const contentVisibilityMap = {
    0: 'intro',              // Nivel 1 (índice 0)
    1: 'explicacion-intermedia', // Nivel 2 (índice 1)
    2: 'intro',              // Nivel 3 (índice 2)
    3: 'intro',              // Nivel 4 (índice 3)
    4: 'conclusion'          // Nivel 5 (índice 4)
  };

  let currentLevel = 0;
  let answers = {};
  let validationResults = {};
  let isVerified = false;

  // Variables para elementos DOM de p5.js
  let container;
  let verifyBtn;
  let nextBtn;
  let levelIndicator;
  let successModal;
  let closeBtn;

  p.setup = function() {
    console.log(`Iniciando sketchTema3.`);

    // --- Lógica para dibujar el canvas ---
    const canvas = p.createCanvas(400, 400);
    canvas.parent("p5-container");
    p.background(240);
    // --- End of canvas logic ---

    // Asociar elementos DOM existentes con variables de p5.dom
    container = p.select("#questions");
    verifyBtn = p.select("#verifyBtn");
    nextBtn = p.select("#nextBtn");
    levelIndicator = p.select("#levelIndicator");
    successModal = p.select("#successModal");
    closeBtn = p.select("#closeModalBtn"); // Asegúrate que este ID exista en tu HTML

    // Asignar eventos usando métodos de p5.dom
    if (verifyBtn) {
      verifyBtn.mousePressed(verifyAnswers);
    }
    if (nextBtn) {
      nextBtn.mousePressed(goToNextLevel);
    }
    if (closeBtn) {
      closeBtn.mousePressed(closeModal);
    }

    // Inicializar el primer nivel
    setupLevel(currentLevel);
  };

  p.draw = function () {
    p.background(240);
    p.fill(100, 150, 255);
    p.noStroke();
    p.ellipse(p.width / 2, p.height / 2, 100, 100);
    p.fill(0);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Quiz", p.width / 2, p.height / 2);
  };

  // Función para configurar el nivel
  function setupLevel(level) {
    if (container) {
      container.html(""); // Limpiar contenido previo de preguntas
    }
    answers = {};
    validationResults = {};
    isVerified = false;
    // La deshabilitación de 'nextBtn' ya está aquí

    const questions = levels[level];

    // Controlar la visibilidad de los divs de contenido al cambiar de nivel
    updateContentVisibility();

    // Determinar si el nivel actual tiene preguntas
    const hasQuestions = (questions && questions.length > 0);

    // Ajustar la visibilidad del contenedor de preguntas
    if (hasQuestions) {
      p.select(".container").style("display", "flex"); // O "block" o "grid" según tu CSS original
      p.select("#questionCard").style("display", "block");
    } else {
      p.select(".container").style("display", "none");
    }

    // Ajustar la visibilidad y estado de los botones
    if (verifyBtn) {
      if (hasQuestions) {
        verifyBtn.style("display", "inline-block"); // Mostrar el botón Verificar
        verifyBtn.attribute("disabled", ""); // Deshabilitarlo inicialmente
      } else {
        verifyBtn.style("display", "none"); // Ocultar el botón Verificar
      }
    }

    if (nextBtn) {
      nextBtn.style("display", "inline-block"); // Siempre mostrar el botón Siguiente
      if (hasQuestions) {
        nextBtn.attribute("disabled", ""); // Deshabilitarlo si hay preguntas
      } else {
        nextBtn.removeAttribute("disabled"); // Habilitarlo si no hay preguntas (es un nivel de contenido)
      }
    }

    // Si hay preguntas, poblar el contenedor de preguntas
    if (hasQuestions) {
      questions.forEach((q, index) => {
        const div = p.createDiv("");
        div.class("input-group");

        const label = p.createElement("label", `${index + 1}. ${q.question}`);
        label.attribute("for", q.id);

        const input = p.createInput("");
        input.attribute("type", "text");
        input.attribute("id", q.id);

        input.input(() => {
          answers[q.id] = input.value().trim();
          input.removeClass("correct");
          input.removeClass("incorrect");
          validationResults[q.id] = null;
          isVerified = false;
          updateVerifyButton(); // Esto se encargará de habilitar/deshabilitar Verificar si se necesita
          if (nextBtn) {
            nextBtn.attribute("disabled", ""); // Deshabilitar Siguiente si el usuario está modificando la respuesta
          }
        });

        div.child(label);
        div.child(input);
        if (container) {
          container.child(div);
        }
      });
    }

    updateVerifyButton(); // Llama a esta función para establecer el estado inicial de Verificar
    updateLevelIndicator();
  }

  // Nueva función para controlar la visibilidad de los divs de contenido
  function updateContentVisibility() {
    // Obtener SOLO los divs de contenido que están definidos en el contentVisibilityMap
    const specificContentDivs = ['intro', 'explicacion-intermedia', 'conclusion']; // Lista de IDs de los divs que manejas

    specificContentDivs.forEach(id => {
      const div = document.getElementById(id);
      if (div) {
        if (id === contentVisibilityMap[currentLevel]) {
            // Muestra el div quitando la clase 'hidden'
            div.classList.remove('hidden');
        } else {
            // Oculta el div añadiendo la clase 'hidden'
            div.classList.add('hidden');
        }
    }
    });
  }


  // Función para actualizar el botón de verificar
  function updateVerifyButton() {
    const currentQuestions = levels[currentLevel];
    // Solo habilitar "Verificar" si hay preguntas y todas están llenas
    if (currentQuestions && currentQuestions.length > 0) {
        const allFilled = currentQuestions.every(q => answers[q.id]);
        if (verifyBtn) {
            if (allFilled) {
                verifyBtn.removeAttribute("disabled");
            } else {
                verifyBtn.attribute("disabled", "");
            }
        }
    } else {
        // En niveles sin preguntas, verifyBtn ya está oculto por setupLevel, no necesita deshabilitarse aquí.
        // Asegurarse de que no esté habilitado por si acaso.
        if (verifyBtn) verifyBtn.attribute("disabled", "");
    }
  }

  // Función para actualizar el indicador de nivel
  function updateLevelIndicator() {
    if (levelIndicator) {
      levelIndicator.html(`${currentLevel + 1} / ${levels.length}`);
    }
  }

  // Función para verificar respuestas
  function verifyAnswers() {
    const currentQuestions = levels[currentLevel];
    let allCorrect = true;

    currentQuestions.forEach((q) => {
      const input = p.select(`#${q.id}`);
      if (input) {
        const answer = (answers[q.id] || "").toLowerCase();
        const correct = q.correctAnswer.toLowerCase();

        if (answer === correct) {
          input.addClass("correct");
          input.removeClass("incorrect");
          validationResults[q.id] = true;
        } else {
          input.addClass("incorrect");
          input.removeClass("correct");
          validationResults[q.id] = false;
          allCorrect = false;
        }
      }
    });

    isVerified = true;
    if (nextBtn) {
      if (allCorrect) {
        nextBtn.removeAttribute("disabled"); // Habilitar "Siguiente" si todas son correctas
      } else {
        nextBtn.attribute("disabled", "");
      }
    }
  }

  // Función para cerrar el modal (general)
  function closeModal() {
    if (successModal) {
      successModal.style("display", "none");
    }
    // Después de cerrar el modal, asegúrate de que la visibilidad del contenido sea correcta para el nuevo nivel
    if (currentLevel < levels.length) {
        updateContentVisibility(); // Vuelve a verificar la visibilidad
    }
  }

  // Función para ir al siguiente nivel
  function goToNextLevel() {
    currentLevel++; // Siempre avanzamos el nivel

    if (currentLevel < levels.length) {
      setupLevel(currentLevel); // Configura el siguiente nivel
      // setupLevel ya maneja el estado inicial de los botones
    } else {
      // Si se completaron todos los niveles
      const finalMessage = "🎉 ¡Has completado todos los niveles!";
      if (successModal) {
        successModal.html(`<div class="modal-content"><h2>¡Felicidades!</h2><p>${finalMessage}</p><button id="closeFinalModalBtn">Reiniciar Quiz</button></div>`);
        p.select("#closeFinalModalBtn").mousePressed(() => {
          successModal.style("display", "none");
          currentLevel = 0; // Reiniciar el quiz
          setupLevel(currentLevel);
        });
        successModal.style("display", "flex");
      } else {
        console.log(finalMessage);
      }
    }
  }
}

// Para iniciar el sketch, asegúrate de que haya un contenedor con el ID 'p5-sketch-container' en tu HTML.
// Por ejemplo: <div id="p5-sketch-container"></div>
// new p5(quiz1, "p5-sketch-container");