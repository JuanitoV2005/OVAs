class QuizData {
  constructor(levelsData) {
    this.levels = levelsData;
    this.currentLevelIndex = 0;
    this.allLevelAnswers = {}; // To store user answers for all levels
    this.allLevelValidationResults = {}; // To store validation outcomes for all levels
    this.verifiedLevels = new Set(); // Track which levels have been verified
    this.initialLevelsData = JSON.parse(JSON.stringify(levelsData)); // Store initial data for reset
    this.initializeDynamicQuestions(); // Call this once on construction
  }

  // Helper to add dynamic questions
  initializeDynamicQuestions() {
    // Dynamic question for Reto 4
    const randomValue4 = Math.floor(Math.random() * (15 - 5 + 1)) + 5;
    const binaryAnswer4 = randomValue4.toString(2).padStart(4, '0');
    if (this.levels[4]) { // Ensure Reto 4 exists
      // Check if the dynamic question already exists to prevent duplicates on reset
      const q5Exists = this.levels[4].some(q => q.id === "q5");
      if (!q5Exists) {
        this.levels[4].push({
          id: "q5",
          question: `Representa el número binario ${randomValue4} usando peones`,
          correctAnswer: binaryAnswer4,
          notInput: true
        });
      }
    }

    // Dynamic question for Reto 5
    const randomByte5 = Math.floor(Math.random() * 256); // between 0 and 255
    const binaryByte5 = randomByte5.toString(2).padStart(8, '0');
    if (this.levels[5]) { // Ensure Reto 5 exists
      // Check if the dynamic question already exists to prevent duplicates on reset
      const q6Exists = this.levels[5].some(q => q.id === "q6");
      if (!q6Exists) {
        this.levels[5].push({
          id: "q6",
          question: `Escribe en el tablero el número ${randomByte5}`,
          correctAnswer: binaryByte5,
          notInput: true
        });
      }
    }
  }

  // Convert value to specified format
  convertToFormat(value, format) {
    const numValue = parseInt(value, 10);
    
    switch (format) {
      case "signedByte":
        // For signed byte (-128 to 127), convert to 8-bit two's complement binary
        if (numValue >= -128 && numValue <= 127) {
          if (numValue >= 0) {
            return numValue.toString(2).padStart(8, '0');
          } else {
            // Two's complement for negative numbers
            const complement = ((~Math.abs(numValue)) + 1) & 0xFF;
            return complement.toString(2).padStart(8, '0');
          }
        }
        break;
      case "unsignedByte":
        // For unsigned byte (0 to 255)
        if (numValue >= 0 && numValue <= 255) {
          return numValue.toString(2).padStart(8, '0');
        }
        break;
      case "signedNibble":
        // For signed nibble (-8 to 7)
        if (numValue >= -8 && numValue <= 7) {
          if (numValue >= 0) {
            return numValue.toString(2).padStart(4, '0');
          } else {
            const complement = ((~Math.abs(numValue)) + 1) & 0xF;
            return complement.toString(2).padStart(4, '0');
          }
        }
        break;
      case "unsignedNibble":
        // For unsigned nibble (0 to 15)
        if (numValue >= 0 && numValue <= 15) {
          return numValue.toString(2).padStart(4, '0');
        }
        break;
      case "binary":
        return value; // Already in binary format
      case "decimal":
        return numValue.toString();
      case "hex":
        return "0x" + numValue.toString(16).toUpperCase();
      default:
        return value;
    }
    return value;
  }

  // Get conversion labels for a question
  getConversionLabels(value, conversionLabels) {
    const conversions = {};
    const numValue = parseInt(value, 10);
    
    if (conversionLabels && Array.isArray(conversionLabels)) {
      conversionLabels.forEach(label => {
        switch (label) {
          case "decimal":
            conversions[label] = numValue.toString();
            break;
          case "binary":
            if (numValue >= 0) {
              conversions[label] = numValue.toString(2);
            } else {
              // For negative numbers, show two's complement
              const complement = ((~Math.abs(numValue)) + 1) & 0xFF;
              conversions[label] = complement.toString(2).padStart(8, '0');
            }
            break;
          case "hex":
            conversions[label] = "0x" + Math.abs(numValue).toString(16).toUpperCase();
            break;
          case "signedByte":
            conversions[label] = this.convertToFormat(value, "signedByte");
            break;
          case "unsignedByte":
            conversions[label] = this.convertToFormat(value, "unsignedByte");
            break;
          default:
            conversions[label] = value;
        }
      });
    }
    
    return conversions;
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
      return true;
    }
    return false;
  }

  goToPreviousLevel() {
    if (this.currentLevelIndex > 0) {
      this.currentLevelIndex--;
      return true;
    }
    return false;
  }

  goToLevel(index) {
    if (index >= 0 && index < this.levels.length) {
      this.currentLevelIndex = index;
      return true;
    }
    return false;
  }

  // Resets quiz entirely, including dynamic questions
  resetQuiz() {
    this.currentLevelIndex = 0;
    this.allLevelAnswers = {};
    this.allLevelValidationResults = {};
    this.verifiedLevels.clear();
    this.levels = JSON.parse(JSON.stringify(this.initialLevelsData)); // Reset levels to initial state
    this.initializeDynamicQuestions(); // Re-add dynamic questions
  }

  setAnswer(levelIndex, questionId, answer) {
    if (!this.allLevelAnswers[levelIndex]) {
      this.allLevelAnswers[levelIndex] = {};
    }
    this.allLevelAnswers[levelIndex][questionId] = answer.trim();
    // When an answer is set, clear its validation result for that level
    if (this.allLevelValidationResults[levelIndex]) {
      this.allLevelValidationResults[levelIndex][questionId] = null;
    }
    // If user changes answer, level is no longer "verified"
    this.verifiedLevels.delete(levelIndex);
  }

  getAnswer(levelIndex, questionId) {
    return (this.allLevelAnswers[levelIndex] && this.allLevelAnswers[levelIndex][questionId]) || "";
  }

  getAnswersForLevel(levelIndex) {
    return this.allLevelAnswers[levelIndex] || {};
  }

  validateAnswers(levelIndex = this.currentLevelIndex) {
    let allCorrect = true;
    const questions = this.levels[levelIndex];
    if (!questions) return false;

    // Initialize validation results for the current level if not already
    if (!this.allLevelValidationResults[levelIndex]) {
      this.allLevelValidationResults[levelIndex] = {};
    }

    const gradedQuestions = questions.filter(q => !q.isStatement);

    gradedQuestions.forEach(q => {
      const userAnswer = (this.getAnswer(levelIndex, q.id) || "").toLowerCase();
      let correctAnswer;

      // Handle different answer formats
      if (q.answerFormat && q.notInput) {
        // For notInput questions with specific format, convert the correct answer
        correctAnswer = this.convertToFormat(q.correctAnswer, q.answerFormat).toLowerCase();
      } else {
        // For regular questions, use the answer as-is
        correctAnswer = q.correctAnswer.toString().toLowerCase();
      }

      if (userAnswer === correctAnswer) {
        this.allLevelValidationResults[levelIndex][q.id] = true;
      } else {
        this.allLevelValidationResults[levelIndex][q.id] = false;
        allCorrect = false;
      }
    });

    // Mark current level as verified *only if allCorrect*
    // if (allCorrect) {
    //   this.verifiedLevels.add(levelIndex);
    // } else {
    //   this.verifiedLevels.delete(levelIndex); // Remove if it was previously verified but now incorrect
    // }
    // Marcar como verificado aunque existan respuestas incorrectas:
    this.verifiedLevels.add(levelIndex);
    
    return allCorrect;
  }

  isLevelVerified(levelIndex = this.currentLevelIndex) {
    return this.verifiedLevels.has(levelIndex);
  }

  getValidationResultsForLevel(levelIndex = this.currentLevelIndex) {
    return this.allLevelValidationResults[levelIndex] || {};
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