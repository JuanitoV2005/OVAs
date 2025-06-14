function quiz1(p) {
  // Datos del quiz
  const levels = [
    [
      { id: "q1", question: "¿Cuál es la capital de Francia?", correctAnswer: "París" },
      { id: "q2", question: "¿Cuál es el océano más grande del mundo?", correctAnswer: "Pacífico" }
    ],
    [
      { id: "q3", question: "¿Quién escribió 'Don Quijote'?", correctAnswer: "Cervantes" },
      { id: "q4", question: "¿Cuántos planetas tiene el sistema solar?", correctAnswer: "8" }
    ],
    [
      { id: "q5", question: "¿En qué año cayó el Muro de Berlín?", correctAnswer: "1989" },
      { id: "q6", question: "¿Cuál es el país más grande del mundo?", correctAnswer: "Rusia" }
    ]
  ];

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
    // Creates a canvas of 400x400 pixels
    const canvas = p.createCanvas(400, 400);
    // Assigns the canvas to the HTML element with the ID "p5-container"
    canvas.parent("p5-container");
    // Sets the initial background color of the canvas
    p.background(240);
    // --- End of canvas logic ---

    // Associates existing DOM elements with p5.dom variables
    container = p.select("#questions");
    verifyBtn = p.select("#verifyBtn");
    nextBtn = p.select("#nextBtn");
    levelIndicator = p.select("#levelIndicator");
    successModal = p.select("#successModal");
    closeBtn = p.select("#closeModalBtn"); // Assuming you have a button with this ID to close the modal

    // Assign events using p5.dom methods
    if (verifyBtn) {
      verifyBtn.mousePressed(verifyAnswers);
    }
    if (nextBtn) {
      nextBtn.mousePressed(goToNextLevel);
    }
    if (closeBtn) {
      closeBtn.mousePressed(closeModal);
    }

    // Initialize the first level
    setupLevel(currentLevel);
  };

  // p.draw function to continuously draw on the canvas
  p.draw = function () {
    // Draws the canvas background in each frame
    p.background(240);
    // Sets the fill color for shapes
    p.fill(100, 150, 255); // A shade of blue
    // Removes the stroke (border) from shapes
    p.noStroke();
    // Draws an ellipse in the center of the canvas
    p.ellipse(p.width / 2, p.height / 2, 100, 100);
    // Sets the fill color for text
    p.fill(0); // Black
    // Aligns text to the center
    p.textAlign(p.CENTER, p.CENTER);
    // Draws the text "Quiz" in the center of the ellipse
    p.text("Quiz", p.width / 2, p.height / 2);
  };

  // Function to set up the level
  function setupLevel(level) {
    if (container) {
      container.html(""); // Clear previous content
    }
    answers = {};
    validationResults = {};
    isVerified = false;
    if (nextBtn) {
      nextBtn.attribute("disabled", ""); // Disable the "Next" button
    }

    const questions = levels[level];

    questions.forEach((q, index) => {
      const div = p.createDiv("");
      div.class("input-group");

      const label = p.createElement("label", `${index + 1}. ${q.question}`);
      label.attribute("for", q.id);

      const input = p.createInput("");
      input.attribute("type", "text");
      input.attribute("id", q.id);

      // Use input() to listen for input changes
      input.input(() => {
        answers[q.id] = input.value().trim();
        input.removeClass("correct");
        input.removeClass("incorrect");
        validationResults[q.id] = null;
        isVerified = false;
        updateVerifyButton();
        if (nextBtn) {
          nextBtn.attribute("disabled", "");
        }
      });

      div.child(label);
      div.child(input);
      if (container) {
        container.child(div);
      }
    });

    updateVerifyButton();
    updateLevelIndicator();
  }

  // Function to update the verify button
  function updateVerifyButton() {
    const currentQuestions = levels[currentLevel];
    const allFilled = currentQuestions.every(q => answers[q.id]);
    if (verifyBtn) {
      if (allFilled) {
        verifyBtn.removeAttribute("disabled");
      } else {
        verifyBtn.attribute("disabled", "");
      }
    }
  }

  // Function to update the level indicator
  function updateLevelIndicator() {
    if (levelIndicator) {
      levelIndicator.html(`Nivel ${currentLevel + 1} de ${levels.length}`);
    }
  }

  // Function to verify answers
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
        nextBtn.removeAttribute("disabled"); // Enable "Next" button if all are correct
      } else {
        nextBtn.attribute("disabled", "");
      }
    }

    // Removed the direct display of successModal here.
    // The final success modal will now only be shown in goToNextLevel when all levels are completed.
  }

  // Function to close the modal
  function closeModal() {
    if (successModal) {
      successModal.style("display", "none");
    }
  }

  // Function to go to the next level
  function goToNextLevel() {
    currentLevel++;
    if (currentLevel < levels.length) {
      setupLevel(currentLevel);
    } else {
      // Use a custom modal instead of alert()
      const finalMessage = "🎉 ¡Has completado todos los niveles!";
      if (successModal) {
        successModal.html(`<div class="modal-content"><p>${finalMessage}</p><button id="closeFinalModalBtn" class="bg-blue-500 text-white p-2 rounded-lg">Cerrar</button></div>`);
        p.select("#closeFinalModalBtn").mousePressed(() => successModal.style("display", "none"));
        successModal.style("display", "flex");
      } else {
        // Fallback if no modal is available (though a modal is recommended)
        console.log(finalMessage);
      }
      // You could add logic here to restart the quiz or show a final message.
    }
  }
}

// To start the sketch, ensure there is a container with the ID 'p5-sketch-container' in your HTML.
// For example: <div id="p5-sketch-container"></div>
// new p5(quiz1, "p5-sketch-container");
