// IEEE 754 to Decimal Converter JavaScript
class IEEE754ToDecimalConverter {
    constructor() {
        this.binaryInput = "01000001010001100000000000000000";
        this.currentStep = 1;
        this.answers = {
            signInterpretation: null,
            exponentDecimal: null,
            realExponent: null,
            normalizedBinary: null,
            normalizedDecimal: null,
            finalDecimal: null
        };

        this.correctAnswers = {
            signInterpretation: "positive",
            exponentDecimal: 130,
            realExponent: 3,
            normalizedBinary: "1.10001100000000000000000",
            normalizedDecimal: 1.546875,
            finalDecimal: 12.375
        };

        this.stepStatus = {
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false
        };

        this.initializeEventListeners();

        // Para restaurar progreso
        this.localStoragePrefix = 'ieee754-step-';
        this.restoreProgressFromStorage();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Step 1: Sign interpretation
        document.querySelectorAll('#step-1 .option-button').forEach(button => {
            button.addEventListener('click', (e) => this.selectOption(e, 1));
        });
        document.getElementById('verify-1').addEventListener('click', () => this.verifyStep(1));

        // Step 2: Exponent decimal conversion
        document.getElementById('exponent-decimal').addEventListener('input', (e) => this.validateInput(e, 2));
        document.getElementById('verify-2').addEventListener('click', () => this.verifyStep(2));

        // Step 3: Real exponent calculation
        document.getElementById('real-exponent').addEventListener('input', (e) => this.validateInput(e, 3));
        document.getElementById('verify-3').addEventListener('click', () => this.verifyStep(3));

        // Step 4: Normalized binary interpretation
        document.getElementById('normalized-binary').addEventListener('input', (e) => this.validateInput(e, 4));
        document.getElementById('verify-4').addEventListener('click', () => this.verifyStep(4));

        // Step 5: Normalized binary to decimal
        document.getElementById('normalized-decimal').addEventListener('input', (e) => this.validateInput(e, 5));
        document.getElementById('verify-5').addEventListener('click', () => this.verifyStep(5));

        // Step 6: Final decimal calculation
        document.getElementById('final-decimal').addEventListener('input', (e) => this.validateInput(e, 6));
        document.getElementById('verify-6').addEventListener('click', () => this.verifyStep(6));
    }

    selectOption(event, step) {
        const clickedButton = event.currentTarget;
        const stepContainer = document.getElementById(`step-${step}`);
        const allButtons = stepContainer.querySelectorAll('.option-button');

        // Remove selected class from all buttons
        allButtons.forEach(btn => btn.classList.remove('selected'));

        // Add selected class to clicked button
        clickedButton.classList.add('selected');

        // Store the selected value
        this.answers.signInterpretation = clickedButton.getAttribute('data-value');

        // Enable verify button
        document.getElementById('verify-1').disabled = false;
    }

    validateInput(event, step) {
        const input = event.target;
        const value = input.value.trim();

        // Enable verify button if there's input
        const verifyButton = document.getElementById(`verify-${step}`);
        verifyButton.disabled = value === '';

        // Store the value in answers
        switch (step) {
            case 2:
                this.answers.exponentDecimal = value ? parseInt(value) : null;
                break;
            case 3:
                this.answers.realExponent = value ? parseInt(value) : null;
                break;
            case 4:
                this.answers.normalizedBinary = value;
                break;
            case 5:
                this.answers.normalizedDecimal = value ? parseFloat(value) : null;
                break;
            case 6:
                this.answers.finalDecimal = value ? parseFloat(value) : null;
                break;
        }
    }

    verifyStep(step) {
        let isCorrect = false;
        let feedbackMessage = '';
        let feedbackType = 'incorrect';

        switch (step) {
            case 1:
                isCorrect = this.answers.signInterpretation === this.correctAnswers.signInterpretation;
                feedbackMessage = isCorrect
                    ? '¡Correcto! El bit de signo 0 indica que el número es positivo.'
                    : 'Incorrecto. Recuerda: 0 = positivo, 1 = negativo.';
                break;

            case 2:
                isCorrect = this.answers.exponentDecimal === this.correctAnswers.exponentDecimal;
                feedbackMessage = isCorrect
                    ? '¡Correcto! 10000010₂ = 130₁₀'
                    : `Incorrecto. Revisa tu conversión binaria a decimal.`;
                break;

            case 3:
                isCorrect = this.answers.realExponent === this.correctAnswers.realExponent;
                feedbackMessage = isCorrect
                    ? '¡Correcto! Exponente real = 130 - 127 = 3'
                    : `Incorrecto. Recuerda: Exponente real = Exponente almacenado - 127.`;
                break;

            case 4:
                isCorrect = this.answers.normalizedBinary === this.correctAnswers.normalizedBinary;
                feedbackMessage = isCorrect
                    ? '¡Correcto! El número normalizado incluye el "1" implícito seguido de la mantisa.'
                    : `Incorrecto. Recuerda incluir el "1" implícito antes del punto decimal.`;
                break;

            case 5:
                isCorrect = Math.abs(this.answers.normalizedDecimal - this.correctAnswers.normalizedDecimal) < 0.001;
                feedbackMessage = isCorrect
                    ? '¡Excelente! Has convertido correctamente la mantisa.'
                    : `Incorrecto. Revisa tu cálculo.`;
                break;

            case 6:
                isCorrect = Math.abs(this.answers.finalDecimal - this.correctAnswers.finalDecimal) < 0.001;
                feedbackMessage = isCorrect
                    ? '¡Excelente! Has convertido correctamente el número IEEE 754 a decimal.'
                    : `Incorrecto. Revisa tu cálculo.`;
                break;
        }

        // Para restaurar progreso
        this.showFeedback(step, feedbackMessage, isCorrect ? 'correct' : 'incorrect');
        this.updateStepStatus(step, isCorrect);

        if (isCorrect) {
            this.stepStatus[step] = true;
            this.saveStepToStorage(step); // <-- Guarda progreso
            this.unlockNextStep(step);
            this.updateProgress(step);
        }
    }

    // Para resturar progreso
    saveStepToStorage(step) {
        // Guarda solo respuestas verificadas y estado
        const answerKey = Object.keys(this.answers)[step - 1];
        localStorage.setItem(this.localStoragePrefix + 'stepStatus-' + step, 'true');
        localStorage.setItem(this.localStoragePrefix + 'answer-' + step, JSON.stringify(this.answers[answerKey]));
    }

    // Para restaurar progreso
    restoreProgressFromStorage() {
        let lastCompletedStep = 0;
        for (let step = 1; step <= 6; step++) {
            const status = localStorage.getItem(this.localStoragePrefix + 'stepStatus-' + step);
            const answer = localStorage.getItem(this.localStoragePrefix + 'answer-' + step);
            if (status === 'true' && answer !== null) {
                this.stepStatus[step] = true;
                lastCompletedStep = step;
                const answerKey = Object.keys(this.answers)[step - 1];
                this.answers[answerKey] = JSON.parse(answer);

                // 🔹 Quitar el locked también aquí para pasos ya correctos
                const stepElement = document.getElementById(`step-${step}`);
                const stepStatusElem = document.getElementById(`status-${step}`);
                stepElement.classList.remove('locked');
                stepStatusElem.classList.remove('locked');

                // Restaura UI y desbloquea el paso siguiente
                this.updateStepStatus(step, true);

                // Restaura respuesta en UI SOLO para pasos completados
                if (step === 1) {
                    const stepContainer = document.getElementById(`step-1`);
                    const allButtons = stepContainer.querySelectorAll('.option-button');
                    allButtons.forEach(btn => {
                        if (btn.getAttribute('data-value') === this.answers.signInterpretation) {
                            btn.classList.add('selected');
                        }
                    });
                    document.getElementById('verify-1').disabled = true;
                } else {
                    const input = document.querySelector(`#step-${step} .step-input`);
                    if (input) {
                        input.value = this.answers[answerKey];
                        input.disabled = true;
                    }
                    document.getElementById(`verify-${step}`).disabled = true;
                }

                this.updateProgress(step);
            }
        }
        // Desbloquea el siguiente paso (si existe), pero NO pongas respuesta en el input
        if (lastCompletedStep < 6) {
            const nextStep = lastCompletedStep + 1;
            const nextStepElement = document.getElementById(`step-${nextStep}`);
            const nextStepStatus = document.getElementById(`status-${nextStep}`);
            const nextStepInput = document.querySelector(`#step-${nextStep} .step-input`);
            nextStepElement.classList.remove('locked');
            nextStepStatus.classList.remove('locked');
            nextStepStatus.classList.add('pending');
            nextStepStatus.textContent = 'Pendiente';
            if (nextStepInput) {
                nextStepInput.disabled = false;
                nextStepInput.value = ''; // <-- Limpia el input
            }
        }
        // Si todos los pasos están completos, muestra el resultado final
        if (this.stepStatus[6]) {
            this.showFinalResult();
        }
    }

    showFeedback(step, message, type) {
        const feedbackElement = document.getElementById(`feedback-${step}`);
        feedbackElement.textContent = message;
        feedbackElement.className = `feedback-message ${type}`;
        feedbackElement.style.display = 'flex';
    }

    updateStepStatus(step, isCorrect) {
        const stepElement = document.getElementById(`step-${step}`);
        const stepBar = document.getElementById(`bar-${step}`);
        const stepNumber = document.getElementById(`number-${step}`);
        const stepStatus = document.getElementById(`status-${step}`);
        const verifyButton = document.getElementById(`verify-${step}`);

        if (isCorrect) {
            stepElement.classList.remove('incorrect');
            stepElement.classList.add('correct');
            stepBar.classList.add('correct');
            stepNumber.classList.add('correct');
            stepStatus.classList.remove('pending', 'incorrect');
            stepStatus.classList.add('correct');
            stepStatus.textContent = 'Correcto ✓';
            verifyButton.classList.add('correct');
            verifyButton.textContent = 'Completado ✓';
        } else {
            stepElement.classList.remove('correct');
            stepElement.classList.add('incorrect');
            stepBar.classList.add('incorrect');
            stepNumber.classList.add('incorrect');
            stepStatus.classList.remove('pending', 'correct');
            stepStatus.classList.add('incorrect');
            stepStatus.textContent = 'Incorrecto ✗';
        }

        // Update option buttons for step 1
        if (step === 1) {
            const stepContainer = document.getElementById(`step-${step}`);
            const allButtons = stepContainer.querySelectorAll('.option-button');
            allButtons.forEach(btn => {
                const value = btn.getAttribute('data-value');
                if (value === this.correctAnswers.signInterpretation) {
                    btn.classList.add('correct');
                } else if (btn.classList.contains('selected') && !isCorrect) {
                    btn.classList.add('incorrect');
                }
            });
        }

        // Update input styling for other steps
        if (step > 1) {
            const input = document.querySelector(`#step-${step} .step-input`);
            if (input) {
                input.classList.remove('correct', 'incorrect');
                input.classList.add(isCorrect ? 'correct' : 'incorrect');
            }
        }
    }

    unlockNextStep(currentStep) {
        if (currentStep < 6) {
            const nextStep = currentStep + 1;
            const nextStepElement = document.getElementById(`step-${nextStep}`);
            const nextStepStatus = document.getElementById(`status-${nextStep}`);
            const nextStepInput = document.querySelector(`#step-${nextStep} .step-input`);

            // Unlock next step
            nextStepElement.classList.remove('locked');
            nextStepStatus.classList.remove('locked');
            nextStepStatus.classList.add('pending');
            nextStepStatus.textContent = 'Pendiente';

            // Enable input if exists
            if (nextStepInput) {
                nextStepInput.disabled = false;
            }

            // Enable option buttons for step 1 if we're unlocking step 2
            if (nextStep === 2) {
                // This case is handled in the constructor
            }

            this.currentStep = nextStep;
        } else {
            // Show final result
            this.showFinalResult();
        }
    }

    updateProgress(completedStep) {
        // Update progress indicator
        const progressStep = document.getElementById(`progress-${completedStep}`);
        const connector = document.getElementById(`connector-${completedStep}`);

        progressStep.classList.remove('current', 'pending');
        progressStep.classList.add('completed');

        if (connector) {
            connector.classList.add('completed');
        }

        // Update current step indicator
        if (completedStep < 6) {
            const nextProgressStep = document.getElementById(`progress-${completedStep + 1}`);
            nextProgressStep.classList.remove('pending');
            nextProgressStep.classList.add('current');
        }
    }

    showFinalResult() {
        const finalResultElement = document.getElementById('final-result');
        if (finalResultElement) {
            finalResultElement.style.display = 'block';
            finalResultElement.classList.remove('locked');
        }

        // Enable next button if it exists
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.disabled = false;
        }

        // Update level indicator or any other final UI updates
        this.updateFinalUI();
    }

    updateFinalUI() {
        // Update the level indicator to show completion
        // const levelIndicator = document.getElementById('levelIndicator');
        // if (levelIndicator) {
        //     levelIndicator.textContent = '5 / 5 ✓';
        //     levelIndicator.style.color = '#10b981';
        //     levelIndicator.style.fontWeight = 'bold';
        // }

        // You could add more final UI updates here
        // For example, confetti animation, success sounds, etc.
        return;
    }

    // Helper method to reset a specific step (useful for debugging or if you want to add reset functionality)
    resetStep(step) {
        const stepElement = document.getElementById(`step-${step}`);
        const stepBar = document.getElementById(`bar-${step}`);
        const stepNumber = document.getElementById(`number-${step}`);
        const stepStatus = document.getElementById(`status-${step}`);
        const verifyButton = document.getElementById(`verify-${step}`);
        const feedbackElement = document.getElementById(`feedback-${step}`);

        stepElement.classList.remove('correct', 'incorrect');
        stepBar.classList.remove('correct', 'incorrect');
        stepNumber.classList.remove('correct', 'incorrect');
        stepStatus.classList.remove('correct', 'incorrect');
        stepStatus.classList.add('pending');
        stepStatus.textContent = 'Pendiente';
        verifyButton.classList.remove('correct');
        verifyButton.disabled = true;
        feedbackElement.style.display = 'none';

        // Reset inputs
        const input = document.querySelector(`#step-${step} .step-input`);
        if (input) {
            input.value = '';
            input.classList.remove('correct', 'incorrect');
        }

        // Reset option buttons for step 1
        if (step === 1) {
            const stepContainer = document.getElementById(`step-${step}`);
            const allButtons = stepContainer.querySelectorAll('.option-button');
            allButtons.forEach(btn => {
                btn.classList.remove('selected', 'correct', 'incorrect');
            });
        }

        this.stepStatus[step] = false;
        this.answers[Object.keys(this.answers)[step - 1]] = null;
    }
}

// Initialize the converter when the page loads
document.addEventListener('DOMContentLoaded', function () {
    const converter = new IEEE754ToDecimalConverter();

    // Make converter globally accessible for debugging
    window.converter = converter;
});