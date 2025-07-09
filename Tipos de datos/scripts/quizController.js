class QuizController {
  constructor(p5Instance, levelsData, contentVisibilityMap, canvasController) {
    this.p = p5Instance;
    this.quizData = new QuizData(levelsData);
    this.quizUI = new QuizUI(p5Instance, contentVisibilityMap);
    this.canvasController = canvasController; // Reference to your P5 canvas logic
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
    if (this.quizUI.previousBtn) {
      this.quizUI.previousBtn.mousePressed(() => this.goToPreviousLevel());
    }

    this.setupLevel(); // Initial setup for the first level
  }

  setupLevel() {
    window.scrollTo(0, 0); // Scroll to top on level change

    const currentLevelQuestions = this.quizData.getCurrentLevelQuestions();
    const currentLevelIndex = this.quizData.getCurrentLevelIndex();
    const totalLevels = this.quizData.getTotalLevels();
    const isLevelPreviouslyVerified = this.quizData.isLevelVerified(currentLevelIndex);
    const currentLevelAnswers = this.quizData.getAnswersForLevel(currentLevelIndex);
    const currentLevelValidationResults = this.quizData.getValidationResultsForLevel(currentLevelIndex);

    this.quizUI.renderQuestions(currentLevelQuestions, currentLevelAnswers); // Pass stored answers
    
    // Apply validation results if the level was previously verified
    if (isLevelPreviouslyVerified) {
      this.quizUI.applyValidationResults(currentLevelValidationResults, currentLevelQuestions);
    } else {
      this.quizUI.clearValidationStyles(currentLevelQuestions); // Clear styles on new level if not verified
    }

    // Attach input listeners for *text* inputs (not graphic ones)
    if (currentLevelQuestions) {
      currentLevelQuestions.forEach(q => {
        if (!q.isStatement && !q.notInput) { // Only for questions with actual user input
          const input = this.p.select(`#${q.id}`);
          if (input) {
            input.input(() => {
              this.quizData.setAnswer(currentLevelIndex, q.id, input.value()); // Update data model for specific level
              this.updateVerifyButtonState();
              
              // Update conversion labels if they exist
              if (q.conversionLabels && q.conversionLabels.length > 0) {
                this.quizUI.updateConversionLabelsForQuestion(q.id, input.value(), q.conversionLabels);
              }
            });
          }
        }
      });
    }

    this.quizUI.updateContentVisibility(currentLevelIndex);
    this.quizUI.updateLevelIndicator(currentLevelIndex, totalLevels);
    this.quizUI.setNextButtonState(currentLevelIndex, totalLevels);
    this.quizUI.setPreviousButtonState(currentLevelIndex);
    this.updateVerifyButtonState(); // Update button state based on initial fill and verification status
    this.quizUI.updateNumericalDisplays("00000000", "0", "0x0", ""); // Reset displays
    
    if (this.canvasController.visualStrategy && typeof this.canvasController.visualStrategy.resetBoardAndDisplays === 'function') {
      this.canvasController.visualStrategy.resetBoardAndDisplays();
    }
  }

  updateVerifyButtonState() {
    const gradedQuestions = this.quizData.getGradedQuestionsForCurrentLevel();
    const currentLevelIndex = this.quizData.getCurrentLevelIndex();
    const isLevelVerified = this.quizData.isLevelVerified(currentLevelIndex); // Get actual verification status
    
    if (gradedQuestions.length > 0) {
      if (isLevelVerified) { // If the level is verified, disable and show "Verificado"
        this.quizUI.setVerifyButtonState(false, true); 
      } else {
        const allTextInputsFilled = gradedQuestions.every(q => {
          // For 'notInput' questions, we assume they are "filled" if the graphic provides a value.
          // For regular inputs, check if there's an answer.
          const answer = this.quizData.getAnswer(currentLevelIndex, q.id);
          return q.notInput || (answer && answer.length > 0);
        });
        this.quizUI.setVerifyButtonState(allTextInputsFilled, false);
      }
    } else {
      this.quizUI.setVerifyButtonState(false, false); // Disable if no graded questions
    }
  }

  verifyAnswers() {
    const currentLevelIndex = this.quizData.getCurrentLevelIndex();
    // Only verify if not already verified for the current level
    if (this.quizData.isLevelVerified(currentLevelIndex)) {
      return;
    }

    // First, update answers from UI for non-graphic questions
    const uiAnswers = this.quizUI.getAnswersFromUI(this.quizData.getCurrentLevelQuestions());
    for (const id in uiAnswers) {
      this.quizData.setAnswer(currentLevelIndex, id, uiAnswers[id]);
    }

    const allCorrect = this.quizData.validateAnswers(currentLevelIndex);

    // Apply visual feedback
    this.quizUI.applyValidationResults(
      this.quizData.getValidationResultsForLevel(currentLevelIndex),
      this.quizData.getCurrentLevelQuestions()
    );

    // Update button state to show as verified
    this.updateVerifyButtonState();

    if (allCorrect) {
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

    // No restrictions - allow advancement regardless of verification or correctness
    if (this.quizData.goToNextLevel()) {
      this.setupLevel(); // Setup the new level
    } else {
      // Already on the last level
      console.log("No more levels to go to.");
    }
  }

  goToPreviousLevel() {
    // No restrictions - allow going back regardless of verification or correctness
    if (this.quizData.goToPreviousLevel()) {
      this.setupLevel(); // Setup the previous level
    } else {
      // Already on the first level
      console.log("Already on the first level.");
    }
  }

  restartQuiz() {
    this.quizData.resetQuiz();
    this.setupLevel();
  }

  // Called by CanvasController when graphic interaction changes an answer
  setAnswerForGraphicInteractiveQuestion(questionId, answer) {
    const currentLevelIndex = this.quizData.getCurrentLevelIndex();
    const currentLevelQuestions = this.quizData.getCurrentLevelQuestions();
    
    // Find the question to get its properties
    const question = currentLevelQuestions.find(q => q.id === questionId);
    
    if (question) {
      // Store the answer (this will be the string representation in the specified format)
      this.quizData.setAnswer(currentLevelIndex, questionId, answer);
      
      // Update the disabled input field
      this.quizUI.setInputValue(questionId, answer);
      
      // Update conversion labels if they exist
      if (question.conversionLabels && question.conversionLabels.length > 0) {
        // The answer comes as a string in the specified format, but we need to get
        // the original numeric value to show proper conversions
        let numericValue = answer;
        
        // If the answer format is binary, convert to decimal for conversions
        if (question.answerFormat === 'signedByte' || question.answerFormat === 'unsignedByte') {
          // For binary representations, we need to convert back to decimal
          if (answer.match(/^[01]+$/)) {
            // It's a binary string
            if (question.answerFormat === 'signedByte') {
              // Handle two's complement for signed bytes
              const decimal = parseInt(answer, 2);
              if (decimal >= 128) {
                numericValue = decimal - 256; // Convert from unsigned to signed
              } else {
                numericValue = decimal;
              }
            } else {
              numericValue = parseInt(answer, 2);
            }
          } else {
            // It's already a decimal number
            numericValue = parseInt(answer, 10);
          }
        }
        
        this.quizUI.updateConversionLabelsForQuestion(questionId, numericValue.toString(), question.conversionLabels);
      }
    }
    
    this.updateVerifyButtonState();
  }

  // Called by CanvasController to update numerical displays
  updateDisplaysFromCanvas(binary, decimal, hex, dataType) {
    this.quizUI.updateNumericalDisplays(binary, decimal, hex, dataType);
  }
}