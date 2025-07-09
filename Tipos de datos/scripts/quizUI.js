class QuizUI {
  constructor(p5Instance, contentVisibilityMap) {
    this.p = p5Instance; // p5 instance for select, createElement, etc.
    this.contentVisibilityMap = contentVisibilityMap;
    this.specificContentDivs = this.getAllUniqueContentDivIds(contentVisibilityMap);

    // DOM elements (initialized in init)
    this.questionsContainer = null;
    this.verifyBtn = null;
    this.nextBtn = null;
    this.previousBtn = null; // New previous button
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
    this.previousBtn = this.p.select("#previousBtn"); // Initialize previous button
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

  // Create conversion labels display
  createConversionLabels(questionId, conversions) {
    const conversionDiv = this.p.createDiv("");
    conversionDiv.class("conversion-labels");
    conversionDiv.attribute("id", `conversion-${questionId}`);
    
    let conversionHTML = '<div class="conversion-container">';
    for (const [label, value] of Object.entries(conversions)) {
      conversionHTML += `<span class="conversion-item"><strong>${label}:</strong> ${value}</span>`;
    }
    conversionHTML += '</div>';
    
    conversionDiv.html(conversionHTML);
    return conversionDiv;
  }

  // Update conversion labels for a specific question
  updateConversionLabels(questionId, conversions) {
    const conversionDiv = this.p.select(`#conversion-${questionId}`);
    if (conversionDiv) {
      let conversionHTML = '<div class="conversion-container">';
      for (const [label, value] of Object.entries(conversions)) {
        conversionHTML += `<span class="conversion-item"><strong>${label}:</strong> ${value}</span>`;
      }
      conversionHTML += '</div>';
      conversionDiv.html(conversionHTML);
    }
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

          div.child(input);

          // Add conversion labels if the question has them
          if (q.conversionLabels && q.conversionLabels.length > 0) {
            const currentAnswer = currentAnswers[q.id];
            if (currentAnswer && currentAnswer !== "Interactúa con el gráfico") {
              // Create initial conversion labels if there's already an answer
              const conversions = this.getConversionsForAnswer(currentAnswer, q.conversionLabels);
              const conversionDiv = this.createConversionLabels(q.id, conversions);
              div.child(conversionDiv);
            } else {
              // Create empty conversion labels container
              const conversionDiv = this.createConversionLabels(q.id, {});
              div.child(conversionDiv);
            }
          }
        }
        this.questionsContainer.child(div);
      });
    } else {
      this.mainContainer.style("display", "none");
      this.questionCard.style("display", "none");
    }
  }

  // Helper method to get conversions for an answer
  getConversionsForAnswer(answer, conversionLabels) {
    const conversions = {};
    const numValue = parseInt(answer, 10);
    
    if (!isNaN(numValue) && conversionLabels && Array.isArray(conversionLabels)) {
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
            if (numValue >= -128 && numValue <= 127) {
              if (numValue >= 0) {
                conversions[label] = numValue.toString(2).padStart(8, '0');
              } else {
                const complement = ((~Math.abs(numValue)) + 1) & 0xFF;
                conversions[label] = complement.toString(2).padStart(8, '0');
              }
            }
            break;
          case "unsignedByte":
            if (numValue >= 0 && numValue <= 255) {
              conversions[label] = numValue.toString(2).padStart(8, '0');
            }
            break;
          default:
            conversions[label] = answer;
        }
        conversions[label] = conversions[label]+" ";
      });
    }
    
    return conversions;
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
  setVerifyButtonState(enabled, isVerified = false) {
    if (this.verifyBtn) {
      if (isVerified) {
        this.verifyBtn.attribute("disabled", "");
        this.verifyBtn.html("Verificado");
      } else {
        if (enabled) {
          this.verifyBtn.removeAttribute("disabled");
          this.verifyBtn.html("Verificar");
        } else {
          this.verifyBtn.attribute("disabled", "");
          this.verifyBtn.html("Verificar");
        }
      }
    }
  }

  // Controls the visibility and state of the next button
  setNextButtonState(currentLevelIndex, totalLevels) {
    if (this.nextBtn) {
      if (currentLevelIndex >= totalLevels - 1) {
        this.nextBtn.style("display", "none"); // Hide on last level
      } else {
        this.nextBtn.style("display", "inline-block"); // Show otherwise
        this.nextBtn.removeAttribute("disabled"); // Always enabled
      }
    }
  }

  // Controls the visibility and state of the previous button
  setPreviousButtonState(currentLevelIndex) {
    if (this.previousBtn) {
      if (currentLevelIndex <= 0) {
        this.previousBtn.style("display", "none"); // Hide on first level
      } else {
        this.previousBtn.style("display", "inline-block"); // Show otherwise
        this.previousBtn.removeAttribute("disabled"); // Always enabled
      }
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

  // Update conversion labels when answer changes
  updateConversionLabelsForQuestion(questionId, answer, conversionLabels) {
    if (conversionLabels && conversionLabels.length > 0) {
      const conversions = this.getConversionsForAnswer(answer, conversionLabels);
      this.updateConversionLabels(questionId, conversions);
    }
  }
}