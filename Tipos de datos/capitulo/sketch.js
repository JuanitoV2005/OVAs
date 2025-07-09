// The function sketchTema2 now focuses on P5.js initialization and canvas management
function sketchTema2(p) {

  numQ1 = Math.floor(Math.random() * 128); // 0, 1, 2, ..., 127
  numQ2 = -Math.floor(Math.random() * 129); // -0, -1, ..., -128

  // Quiz Data (remains here as the source of truth for questions)
  const levels = [
    // Introduction (index 0)
    null, // --> this level has no questions
    // Reto 1 (index 1)
    [
      { id: "q1", question: "¿Cuántos números negativos puede representar un byte?", correctAnswer: "128"},
      { id: "q2", question: `Responde en la fila 2 cómo se representa el número ${numQ1} en binario`, correctAnswer: numQ1 ,notInput: true, correctAnswer: numQ1, boardRows:[2] , answerFormat: "signedByte", conversionLabels: ["decimal", "binary"]},
      { id: "q3", question: `Responde en la fila 1 cómo se representa el número ${numQ2} en binario`,notInput: true, correctAnswer: numQ2, boardRows:[1] , answerFormat: "signedByte", conversionLabels: ["decimal", "binary"]},
    ],
    [
      { id: "q3", question: "Responde en la fila 1 cómo se representa el número -39 en binario",notInput: true, correctAnswer: -39, boardRows:[1] , answerFormat: "signedByte", conversionLabels: ["decimal", "binary"]}
    ]
  ];

  // Mapeo de niveles a los IDs de los divs de contenido a mostrar
  const contentVisibilityMap = {
    0: ['intro'],
    1: ['enunciado1'],
    2: ['enunciado2']
    };

  let quizController; // Renamed from quizNavigator

  // --- Canvas Drawing Strategies ---
  let gui = {
    "background": "#ffffff",
    "cellColor1": "#b58863",
    "cellColor2": "#f0d9b5",
    "cellLength": 50,
  }

  const tableroVacio = Array(8).fill().map(() => Array(8).fill(null))

  // Colores disponibles de piezas y sus códigos
  const pawnCodes = ['pw', 'pg', 'pr', 'pb', 'pk'];
  const pieceImages = {};

  // ChessBoard instances for each level
  // These should be created once.


  // Crear tablero 1
    const rows = 8, cols = 8;
    const pieces = Array.from({ length: rows }, () => Array(cols).fill(null));
    const assignedMap = Array.from({ length: rows }, () => Array(cols).fill(null));

    // Asignar códigos fijos
    for (let c = 0; c < cols; c++) {
      assignedMap[6][c] = 'pk'; // fila 6
      assignedMap[7][c] = 'pw'; // fila 7
    }
    assignedMap[6][0] = 'pr';
    assignedMap[7][0] = 'pg';

    tablero1 = new ChessBoard(
      p,
      [gui.cellColor1, gui.cellColor2],
      [20, 20],
      gui.cellLength,
      [rows, cols],
      pieces,
      pieceImages, // sin imágenes por ahora
      { minR: 0, maxR: 7, minC: 0, maxC: 7 }
    );

    tablero1.assignedCodeMap = assignedMap;

  const levelCanvasObjects = {
    0: null,
    1: tablero1,
    2: tablero1
  };

  class CanvasController {
    constructor(p, levelCanvasObjects, quizController) { // Pass quizController here
      this.p = p;
      this.levelCanvasObjects = levelCanvasObjects;
      this.quizController = quizController; // Store reference to quizController
      this.lastLevel = quizController.quizData.currentLevelIndex; // Get initial level from quizData
      this.visualStrategy = this.levelCanvasObjects[this.lastLevel];
    }

    setStrategy(levelIndex) {
      this.visualStrategy = this.levelCanvasObjects[levelIndex];
    }

    drawNoCanvas() {
      this.p.background(255, 255, 255, 0);
    }

    draw() {
      // Check if the level has changed by comparing currentLevel with lastLevel
      const currentQuizLevel = this.quizController.quizData.getCurrentLevelIndex(); // Get current level from QuizData
      if (currentQuizLevel !== this.lastLevel) {
        this.setStrategy(currentQuizLevel);
        if (this.visualStrategy && typeof this.visualStrategy.resetBoardAndDisplays === 'function') {
          this.visualStrategy.resetBoardAndDisplays();
        }
        this.lastLevel = currentQuizLevel;
      }

      if (this.visualStrategy && typeof this.visualStrategy.draw === 'function') {
        this.visualStrategy.draw();
      } else {
        this.drawNoCanvas();
        // Clear numerical displays if no canvas object is active
        this.quizController.updateDisplaysFromCanvas("", "", "", "");
      }
    }

    getNumDigits(label){
      switch (label) {
          case "signedByte":
            return 8;
            break;
          case "unsignedByte":
            return 8;
            break;
          case "int":
            return 32;
            break;
          case "short":
            return 16;
            break;
          default:
            return 0;
        }
    }

    mousePressed(mouseX, mouseY) {
      if (this.visualStrategy && typeof this.visualStrategy.mousePressed === 'function') {
        this.visualStrategy.mousePressed(mouseX, mouseY);

        // Send to quiz controller answer of questions that take board configuration:
        const currentLevelQuestions = this.quizController.quizData.getCurrentLevelQuestions();

        if (Array.isArray(currentLevelQuestions)) {
          currentLevelQuestions.forEach((question) => {
            if (question.notInput) { // Check if it's a graphic-interactive question
              const questionID = question.id;
              const boardRows = question.boardRows;
              let answer = this.visualStrategy.getBinaryString(boardRows);
              let numDigits = this.getNumDigits(question.dataType);
              answer = numDigits != 0? answer.slice(-numDigits): answer;
              answer = answer.slice(-8);
              
              // Call the new method on QuizController
              this.quizController.setAnswerForGraphicInteractiveQuestion(questionID, answer);
            }
          });
        }
      }
    }
  }

  let canvasController;

  // ------ Main Sketch Functions ------

  p.preload = () => {
    try {
      // pieceImages.pawnImg = p.loadImage('assets/chess/pawn.png');
      for (let code of pawnCodes) {
        let color = code[1];
        let name = code[0] === 'p' ? 'pawn' : 'unknown';
        pieceImages[code] = p.loadImage(`assets/chess/${name}-${color}.png`);
      }
    } catch (e) {
      console.error("Error loading images: ", e);
      alert("Could not load one or more chess piece images. Check paths in p.preload().");
    }
  };

  p.setup = function () {
    const canvas = p.createCanvas(gui.cellLength*8 + 50, gui.cellLength*8 + 40);
    canvas.parent("p5-container");
    p.background(gui.background);

    




    // Initialize QuizController, passing the necessary data and the p5 instance
    quizController = new QuizController(p, levels, contentVisibilityMap, null); // Pass null initially for canvasController

    // Now instantiate CanvasController, passing quizController
    canvasController = new CanvasController(p, levelCanvasObjects, quizController);
    quizController.canvasController = canvasController; // Set the reference

    quizController.init(); // Initialize the QuizController to set up DOM elements and events
  };

  p.draw = function () {
    canvasController.draw();
  };

  p.mousePressed = function () {
    if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
      canvasController.mousePressed(p.mouseX, p.mouseY);
    }
  }
};