class QuizData {
  constructor(levelsData) {
    this.levels = levelsData;
    this.currentLevelIndex = 0;
    this.answers = {}; // To store user answers
    this.validationResults = {}; // To store validation outcomes
    this.initializeDynamicQuestions(); // Call this once on construction
  }

  // Helper to add dynamic questions
  initializeDynamicQuestions() {
    // Dynamic question for Reto 4
    const randomValue = Math.floor(Math.random() * (15 - 5 + 1)) + 5;
    const binaryAnswer = randomValue.toString(2).padStart(4, '0');
    if (this.levels[4]) { // Ensure Reto 4 exists
      this.levels[4].push({
        id: "q5",
        question: `Representa el número binario ${randomValue} usando peones`,
        correctAnswer: binaryAnswer,
        notInput: true
      });
    }

    // Dynamic question for Reto 5
    const randomByte = Math.floor(Math.random() * 256); // between 0 and 255
    const binaryByte = randomByte.toString(2).padStart(8, '0');
    if (this.levels[5]) { // Ensure Reto 5 exists
      this.levels[5].push({
        id: "q6",
        question: `Escribe en el tablero el número ${randomByte}`,
        correctAnswer: binaryByte,
        notInput: true
      });
    }
  }

  getCurrentLevelQuestions() {
    return this.levels[this.currentLevelIndex];
  }

  getTotalLevels() {
    return this.levels.length;
  }

  goToNextLevel() {
    if (this.currentLevelIndex < this.levels.length - 1) {
      this.currentLevelIndex++;
      this.resetLevelAnswers(); // Reset answers when moving to a new level
      return true;
    }
    return false;
  }

  goToLevel(index) {
    if (index >= 0 && index < this.levels.length) {
      this.currentLevelIndex = index;
      this.resetLevelAnswers();
      return true;
    }
    return false;
  }

  resetLevelAnswers() {
    this.answers = {};
    this.validationResults = {};
  }

  resetQuiz() {
    this.currentLevelIndex = 0;
    this.answers = {};
    this.validationResults = {};
    // Re-initialize dynamic questions if they are mutable or dependent on reset
    this.initializeDynamicQuestions();
  }

  setAnswer(questionId, answer) {
    this.answers[questionId] = answer.trim();
    this.validationResults[questionId] = null; // Mark as unvalidated
  }

  getAnswer(questionId) {
    return this.answers[questionId];
  }

  validateAnswers() {
    let allCorrect = true;
    const questions = this.getCurrentLevelQuestions();
    if (!questions) return false;

    const gradedQuestions = questions.filter(q => !q.isStatement);

    gradedQuestions.forEach(q => {
      const userAnswer = (this.answers[q.id] || "").toLowerCase();
      const correctAnswer = q.correctAnswer.toLowerCase();
      if (userAnswer === correctAnswer) {
        this.validationResults[q.id] = true;
      } else {
        this.validationResults[q.id] = false;
        allCorrect = false;
      }
    });
    return allCorrect;
  }

  getValidationResult(questionId) {
    return this.validationResults[questionId];
  }

  getCurrentLevelIndex() {
    return this.currentLevelIndex;
  }

  getGradedQuestionsForCurrentLevel() {
    const questions = this.getCurrentLevelQuestions();
    return questions ? questions.filter(q => !q.isStatement) : [];
  }

  hasGradedQuestionsForCurrentLevel() {
    return this.getGradedQuestionsForCurrentLevel().length > 0;
  }
}
















class QuizUI {
  constructor(p5Instance, contentVisibilityMap) {
    this.p = p5Instance; // p5 instance for select, createElement, etc.
    this.contentVisibilityMap = contentVisibilityMap;
    this.specificContentDivs = this.getAllUniqueContentDivIds(contentVisibilityMap);

    // DOM elements (initialized in init)
    this.questionsContainer = null;
    this.verifyBtn = null;
    this.nextBtn = null;
    this.levelIndicator = null;
    this.successModal = null;
    this.closeModalBtn = null;
    this.questionCard = null;
    this.mainContainer = null;

    // Display elements for numerical conversions
    this.binaryDisplay = null;
    this.decimalDisplay = null;
    this.hexDisplay = null;
    this.dataTypeDisplay = null;
  }

  // For getting specificContentDivs
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
    this.questionsContainer = this.p.select("#questions");
    this.verifyBtn = this.p.select("#verifyBtn");
    this.nextBtn = this.p.select("#nextBtn");
    this.levelIndicator = this.p.select("#levelIndicator");
    this.successModal = this.p.select("#successModal");
    this.closeModalBtn = this.p.select("#closeModalBtn"); // Standard close button
    this.questionCard = this.p.select("#questionCard");
    this.mainContainer = this.p.select(".container");

    // Initialize numerical display elements
    this.binaryDisplay = this.p.select("#binary-value");
    this.decimalDisplay = this.p.select("#decimal-value");
    this.hexDisplay = this.p.select("#hex-value");
    this.dataTypeDisplay = this.p.select("#data-type");

    // Event listeners will be set by QuizController, not here.
    // This UI class just provides the methods to interact with the DOM.
  }

  // Renders the questions for the current level
  renderQuestions(questions, currentAnswers) {
    if (this.questionsContainer) {
      this.questionsContainer.html(""); // Clear previous content
    }

    if (questions && questions.length > 0) {
      this.mainContainer.style("display", "flex");
      this.questionCard.style("display", "block");

      questions.forEach((q, index) => {
        const div = this.p.createDiv("");
        div.class("input-group");

        const label = this.p.createElement("label", `${index + 1}. ${q.question}`);
        label.attribute("for", q.id);
        div.child(label);

        if (!q.isStatement) {
          const input = this.p.createInput("");
          input.attribute("type", "text");
          input.attribute("id", q.id);

          if (q.notInput === true) {
            input.attribute("disabled", "");
            input.value(currentAnswers[q.id] || "Interactúa con el gráfico");
          } else {
            input.value(currentAnswers[q.id] || ""); // Set stored answer
          }

          // We don't attach input listener here, it will be done by the controller
          div.child(input);
        }
        this.questionsContainer.child(div);
      });
    } else {
      this.mainContainer.style("display", "none");
      this.questionCard.style("display", "none");
    }
  }

  // Retrieves answers from input fields
  getAnswersFromUI(questions) {
    const answers = {};
    if (questions) {
      questions.forEach(q => {
        if (!q.isStatement && !q.notInput) { // Only get from user-inputtable fields
          const input = this.p.select(`#${q.id}`);
          if (input) {
            answers[q.id] = input.value().trim();
          }
        }
      });
    }
    return answers;
  }

  // Updates the visual state of inputs based on validation results
  applyValidationResults(validationResults, questions) {
    if (questions) {
      questions.forEach(q => {
        if (!q.isStatement) {
          const input = this.p.select(`#${q.id}`);
          if (input) {
            input.removeClass("correct");
            input.removeClass("incorrect");
            if (validationResults[q.id] === true) {
              input.addClass("correct");
            } else if (validationResults[q.id] === false) {
              input.addClass("incorrect");
            }
          }
        }
      });
    }
  }

  // Clears validation styling
  clearValidationStyles(questions) {
    if (questions) {
      questions.forEach(q => {
        if (!q.isStatement) {
          const input = this.p.select(`#${q.id}`);
          if (input) {
            input.removeClass("correct");
            input.removeClass("incorrect");
          }
        }
      });
    }
  }

  // Manages visibility of content divs
  updateContentVisibility(currentLevelIndex) {
    const currentLevelContentIds = this.contentVisibilityMap[currentLevelIndex] || [];
    this.specificContentDivs.forEach(id => {
      const div = document.getElementById(id);
      if (div) {
        if (currentLevelContentIds.includes(id)) {
          div.classList.remove('hidden');
        } else {
          div.classList.add('hidden');
        }
      }
    });
  }

  // Updates the level indicator text
  updateLevelIndicator(currentLevel, totalLevels) {
    if (this.levelIndicator) {
      this.levelIndicator.html(`${currentLevel + 1} / ${totalLevels}`);
    }
  }

  // Controls the state of the verify button
  setVerifyButtonState(enabled) {
    if (this.verifyBtn) {
      if (enabled) {
        this.verifyBtn.removeAttribute("disabled");
      } else {
        this.verifyBtn.attribute("disabled", "");
      }
    }
  }

  // Controls the visibility and state of the next button
  setNextButtonState(currentLevelIndex, totalLevels, hasGradedQuestions) {
    if (this.nextBtn) {
      if (currentLevelIndex >= totalLevels - 1) {
        this.nextBtn.style("display", "none"); // Hide on last level
      } else {
        this.nextBtn.style("display", "inline-block"); // Show otherwise
      }
      // The next button's disabled state will be controlled by the QuizController based on quiz progress.
    }
  }

  showSuccessModal(message, isFinalLevel = false, onRestartCallback = null, onCloseCallback = null) {
    if (this.successModal) {
      let modalContentHtml = `
        <div class="modal-content">
          <button class="close-modal" id="closeXBtn">&times;</button>
          <h2>¡Felicidades!</h2>
          <p>${message}</p>
      `;

      if (isFinalLevel) {
        modalContentHtml += `<button id="closeFinalModalBtn">Reiniciar Quiz</button>`;
      } else {
        modalContentHtml += `<button id="continueModalBtn">Continuar</button>`; // New ID for continue
      }
      modalContentHtml += `</div>`;
      this.successModal.html(modalContentHtml);

      // Attach new listeners
      this.p.select("#closeXBtn").mousePressed(() => {
        this.successModal.style("display", "none");
        if (onCloseCallback) onCloseCallback();
      });

      if (isFinalLevel) {
        this.p.select("#closeFinalModalBtn").mousePressed(() => {
          this.successModal.style("display", "none");
          if (onRestartCallback) onRestartCallback();
        });
      } else {
        this.p.select("#continueModalBtn").mousePressed(() => { // Attach to new button
          this.successModal.style("display", "none");
          if (onCloseCallback) onCloseCallback(); // Use onCloseCallback for continue
        });
      }
      this.successModal.style("display", "flex");
    }
  }

  hideSuccessModal() {
    if (this.successModal) {
      this.successModal.style("display", "none");
    }
  }

  // Update numerical conversion displays
  updateNumericalDisplays(binary, decimal, hex, dataType) {
    if (this.binaryDisplay) this.binaryDisplay.html(binary || "00000000");
    if (this.decimalDisplay) this.decimalDisplay.html(decimal || "0");
    if (this.hexDisplay) this.hexDisplay.html(hex || "0x0");
    if (this.dataTypeDisplay) this.dataTypeDisplay.html(dataType || "");
  }

  // Set the value of a specific input field (used for graphic interaction)
  setInputValue(id, value) {
    const input = this.p.select(`#${id}`);
    if (input) {
      input.value(value);
    }
  }
}















class QuizController {
  constructor(p5Instance, levelsData, contentVisibilityMap, canvasController) {
    this.p = p5Instance;
    this.quizData = new QuizData(levelsData);
    this.quizUI = new QuizUI(p5Instance, contentVisibilityMap);
    this.canvasController = canvasController; // Reference to your P5 canvas logic
    this.isVerified = false; // Tracks if current level's answers have been verified
  }

  init() {
    this.quizUI.init(); // Initialize UI elements

    // Attach event listeners using methods from this controller
    if (this.quizUI.verifyBtn) {
      this.quizUI.verifyBtn.mousePressed(() => this.verifyAnswers());
    }
    if (this.quizUI.nextBtn) {
      this.quizUI.nextBtn.mousePressed(() => this.goToNextLevel());
    }

    this.setupLevel(); // Initial setup for the first level
  }

  setupLevel() {
    window.scrollTo(0, 0); // Scroll to top on level change

    this.isVerified = false; // Reset verification status for new level

    const currentLevelQuestions = this.quizData.getCurrentLevelQuestions();
    const currentLevelIndex = this.quizData.getCurrentLevelIndex();
    const totalLevels = this.quizData.getTotalLevels();
    const hasGradedQuestions = this.quizData.hasGradedQuestionsForCurrentLevel();

    this.quizUI.renderQuestions(currentLevelQuestions, this.quizData.answers); // Pass stored answers
    this.quizUI.clearValidationStyles(currentLevelQuestions); // Clear styles on new level

    // Attach input listeners for *text* inputs (not graphic ones)
    if (currentLevelQuestions) {
      currentLevelQuestions.forEach(q => {
        if (!q.isStatement && !q.notInput) { // Only for questions with actual user input
          const input = this.p.select(`#${q.id}`);
          if (input) {
            input.input(() => {
              this.quizData.setAnswer(q.id, input.value()); // Update data model
              this.isVerified = false; // Reset verification if answer changes
              this.updateVerifyButtonState();
            });
          }
        }
      });
    }

    this.quizUI.updateContentVisibility(currentLevelIndex);
    this.quizUI.updateLevelIndicator(currentLevelIndex, totalLevels);
    this.quizUI.setNextButtonState(currentLevelIndex, totalLevels, hasGradedQuestions);
    this.updateVerifyButtonState(); // Update button state based on initial fill
    this.quizUI.updateNumericalDisplays("00000000", "0", "0x0", ""); // Reset displays
    if (this.canvasController.visualStrategy && typeof this.canvasController.visualStrategy.resetBoardAndDisplays === 'function') {
      this.canvasController.visualStrategy.resetBoardAndDisplays();
    }
  }

  updateVerifyButtonState() {
    const gradedQuestions = this.quizData.getGradedQuestionsForCurrentLevel();
    if (gradedQuestions.length > 0) {
      const allTextInputsFilled = gradedQuestions.every(q => {
        // For 'notInput' questions, we assume they are "filled" if the graphic provides a value.
        // For regular inputs, check if there's an answer.
        return q.notInput || (this.quizData.getAnswer(q.id) && this.quizData.getAnswer(q.id).length > 0);
      });
      this.quizUI.setVerifyButtonState(allTextInputsFilled);
    } else {
      this.quizUI.setVerifyButtonState(false); // Disable if no graded questions
    }
  }

  verifyAnswers() {
    // First, update answers from UI for non-graphic questions
    const uiAnswers = this.quizUI.getAnswersFromUI(this.quizData.getCurrentLevelQuestions());
    for (const id in uiAnswers) {
      this.quizData.setAnswer(id, uiAnswers[id]);
    }

    const allCorrect = this.quizData.validateAnswers();
    this.isVerified = true;

    // Apply visual feedback
    this.quizUI.applyValidationResults(
      this.quizData.validationResults,
      this.quizData.getCurrentLevelQuestions()
    );

    if (allCorrect) {
      const currentLevelIndex = this.quizData.getCurrentLevelIndex();
      const totalLevels = this.quizData.getTotalLevels();

      if (currentLevelIndex >= totalLevels - 1) {
        // Last level completed
        this.quizUI.showSuccessModal(
          "🎉 ¡Has completado todos los niveles!",
          true, // isFinalLevel = true
          () => this.restartQuiz(),
          null // No specific close callback needed for final modal
        );
      } else {
        // Level completed, but not the last one
        this.quizUI.showSuccessModal(
          "¡Excelente trabajo! Has respondido correctamente todas las preguntas de este nivel.",
          false, // isFinalLevel = false
          null,
          () => {
            // Callback for continuing after closing non-final success modal
            // This is where you might decide to auto-advance or just allow user to click Next
            // For now, we'll let `goToNextLevel` handle the actual progression
          }
        );
      }
    }
  }

  goToNextLevel() {
    const currentLevelIndex = this.quizData.getCurrentLevelIndex();
    const totalLevels = this.quizData.getTotalLevels();
    const hasGradedQuestions = this.quizData.hasGradedQuestionsForCurrentLevel();

    // Only proceed if all graded questions are correct (if there are any)
    // or if there are no graded questions (i.e., it's an intro/statement level)
    if (hasGradedQuestions && !this.quizData.validateAnswers()) {
      alert("Por favor, corrige tus respuestas antes de avanzar.");
      return;
    }

    if (this.quizData.goToNextLevel()) {
      this.setupLevel(); // Setup the new level
    } else {
      // Already on the last level, or an issue
      // This case should ideally be handled by `verifyAnswers` for the final level,
      // but as a fallback, ensure the modal is shown if "Next" is pressed when it shouldn't be.
      console.log("No more levels to go to.");
    }
  }

  restartQuiz() {
    this.quizData.resetQuiz();
    this.setupLevel();
  }

  // Called by CanvasController when graphic interaction changes an answer
  setAnswerForGraphicInteractiveQuestion(questionId, answer) {
    this.quizData.setAnswer(questionId, answer);
    this.quizUI.setInputValue(questionId, answer); // Update the disabled input field
    this.updateVerifyButtonState();
  }

  // Called by CanvasController to update numerical displays
  updateDisplaysFromCanvas(binary, decimal, hex, dataType) {
    this.quizUI.updateNumericalDisplays(binary, decimal, hex, dataType);
  }
}



























