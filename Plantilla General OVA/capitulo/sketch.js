// La función principal para inicializar el tema 2 del OVA, configurando el canvas y el flujo de preguntas
function sketchTema2(p) {

  // --- Definición de niveles y preguntas ---
  // Cada elemento del array representa un nivel con sus respectivas preguntas y respuestas correctas.
  const levels = [
    null, // Nivel 0: Introducción, no contiene preguntas
    // Nivel 1
    [
      { id: "q1", question: "Pregunta 1", correctAnswer: "1" },
      { id: "q2", question: "Pregunta 2", correctAnswer: "0" }
    ],
    // Nivel 2
    [
      { id: "q1", question: "Pregunta 1", correctAnswer: "2" },
      { id: "q2", question: "Pregunta 2", correctAnswer: "4" },
      { id: "q3", question: "Pregunta 3", correctAnswer: "3" }
    ],
    // Nivel 3
    [
      { id: "q1", question: "Pregunta 1", correctAnswer: "8" },
      { id: "q2", question: "Pregunta 2", correctAnswer: "4" },
      { id: "q3", question: "Pregunta 3", correctAnswer: "1" },
      { id: "q4", question: "Usa el tablero para colocar peones y formar el número 5", correctAnswer: "101", notInput: true }
    ],
    // Nivel 4
    [
      { id: "q1", question: "Pregunta 1", correctAnswer: "2" },
      { id: "q2", question: "Pregunta 2", correctAnswer: "4" },
      { id: "q3", question: "Pregunta 3", correctAnswer: "3" },
      { id: "q4", question: "Pregunta 4", correctAnswer: "101", notInput: true }
    ],
    // Nivel 5
    [
      { id: "q1", question: "Pregunta 1", correctAnswer: "2" },
      { id: "q2", question: "Pregunta 2", correctAnswer: "4" },
      { id: "q3", question: "Pregunta 3", correctAnswer: "3" },
      { id: "q4", question: "Pregunta 4", correctAnswer: "101", notInput: true }
    ],
    // Nivel 6
    [
      { id: "q1", question: "Pregunta 1", correctAnswer: "2" },
      { id: "q2", question: "Pregunta 2", correctAnswer: "4" },
      { id: "q3", question: "Pregunta 3", correctAnswer: "3" },
      { id: "q4", question: "Pregunta 4", correctAnswer: "101", notInput: true }
    ],
    // Nivel 7 - Enteros (int)
    [
      { id: "q1", question: "Pregunta 1", correctAnswer: "2" },
      { id: "q2", question: "Pregunta 2", correctAnswer: "4" },
      { id: "q3", question: "Pregunta 3", correctAnswer: "3" },
      { id: "q4", question: "Pregunta 4", correctAnswer: "101", notInput: true }
    ],
    // Nivel 8 - Punto flotante (double)
    [
      { id: "q1", question: "Pregunta 1", correctAnswer: "2" },
      { id: "q2", question: "Pregunta 2", correctAnswer: "4" },
      { id: "q3", question: "Pregunta 3", correctAnswer: "3" },
      { id: "q4", question: "Pregunta 4", correctAnswer: "101", notInput: true }
    ],
    null // Nivel 9: Conclusión
  ];

  // --- Relación entre los niveles y el contenido HTML que se muestra ---
  const contentVisibilityMap = {
    0: ['intro'],
    1: ['enunciado1', 'decimal-label'],
    2: ['enunciado2', 'explicacion-intermedia', 'decimal-label'],
    3: ['enunciado3', 'decimal-label'],
    4: ['enunciado4', 'hex-label', 'binary-label', 'decimal-label'],
    5: ['enunciado5', 'hex-label', 'binary-label', 'decimal-label'],
    6: ['enunciado6', 'hex-label', 'decimal-label'],
    7: ['enunciado7', 'hex-label', 'binary-label', 'decimal-label'],
    8: ['enunciado8', 'hex-label', 'binary-label', 'decimal-label'],
    9: ['conclusion']
  };

  // Preguntas dinámicas para retos específicos
  const randomValue = Math.floor(Math.random() * (15 - 5 + 1)) + 5; // Número aleatorio entre 5 y 15
  const binaryAnswer = randomValue.toString(2).padStart(4, '0'); // Conversión a binario (4 bits)
  levels[4].push({
    id: "q5",
    question: `Representa el número binario ${randomValue} usando peones`,
    correctAnswer: binaryAnswer,
    notInput: true
  });

  const randomByte = Math.floor(Math.random() * 256); // Número aleatorio entre 0 y 255
  const binaryByte = randomByte.toString(2).padStart(8, '0'); // Conversión a binario (8 bits)
  levels[5].push({
    id: "q6",
    question: `Escribe en el tablero el número ${randomByte}`,
    correctAnswer: binaryByte,
    notInput: true
  });

  let quizNavigator;

  // --- Configuración de la interfaz gráfica ---
  let pieceImages = {}; // Imágenes de las piezas de ajedrez
  let gui = {
    "background": "#ffffff",
    "cellColor1": "#7689a0",
    "cellColor2": "#e7e8f3",
    "cellLength": 50,
  }

  // Creación de tableros para cada nivel
  const tableroVacio = Array(8).fill().map(() => Array(8).fill(null));

  const tablero1 = new ChessBoard(p, [gui.cellColor1, gui.cellColor2], [0, 0], gui.cellLength, [8, 8], tableroVacio.map(f => [...f]), pieceImages, { minR: 7, maxR: 7, minC: 7, maxC: 7 });
  const tablero2 = new ChessBoard(p, [gui.cellColor1, gui.cellColor2], [0, 0], gui.cellLength, [8, 8], tableroVacio.map(f => [...f]), pieceImages, { minR: 7, maxR: 7, minC: 6, maxC: 7 });
  const tablero3 = new ChessBoard(p, [gui.cellColor1, gui.cellColor2], [0, 0], gui.cellLength, [8, 8], tableroVacio.map(f => [...f]), pieceImages, { minR: 7, maxR: 7, minC: 5, maxC: 7 });
  const tablero4 = new ChessBoard(p, [gui.cellColor1, gui.cellColor2], [0, 0], gui.cellLength, [8, 8], tableroVacio.map(f => [...f]), pieceImages, { minR: 7, maxR: 7, minC: 4, maxC: 7 });
  const tablero5 = new ChessBoard(p, [gui.cellColor1, gui.cellColor2], [0, 0], gui.cellLength, [8, 8], tableroVacio.map(f => [...f]), pieceImages, { minR: 7, maxR: 7, minC: 0, maxC: 7 }); // Todas las columnas de la última fila
  const tablero6 = new ChessBoard(p, [gui.cellColor1, gui.cellColor2], [0, 0], gui.cellLength, [8, 8], tableroVacio.map(f => [...f]), pieceImages, { minR: 0, maxR: 7, minC: 0, maxC: 7 });
  const tablero7 = new ChessBoard(p, [gui.cellColor1, gui.cellColor2], [0, 0], gui.cellLength, [8, 8], tableroVacio.map(f => [...f]), pieceImages, { minR: 4, maxR: 7, minC: 0, maxC: 7 }); // 32 bits (int)
  const tablero8 = new ChessBoard(p, [gui.cellColor1, gui.cellColor2], [0, 0], gui.cellLength, [8, 8], tableroVacio.map(f => [...f]), pieceImages, { minR: 0, maxR: 7, minC: 0, maxC: 7 }); // 64 bits (double)

  // Mapeo de tableros a niveles
  const levelCanvasObjects = {
    0: null,
    1: tablero1,
    2: tablero2,
    3: tablero3,
    4: tablero4,
    5: tablero5,
    6: tablero6,
    7: tablero7,
    8: tablero8,
    9: null
  };

  // --- Controlador del canvas ---
  class CanvasController {
    constructor(p, levelCanvasObjects, quizNavigator) {
      this.p = p;
      this.levelCanvasObjects = levelCanvasObjects;
      this.quizNavigator = quizNavigator;
      this.lastLevel = this.quizNavigator.currentLevel;
      this.visualStrategy = this.levelCanvasObjects[this.lastLevel];
    }
    setStrategy(levelIndex) {
      this.visualStrategy = this.levelCanvasObjects[levelIndex];
    }
    drawNoCanvas() {
      this.p.background(255, 255, 255, 0); // Fondo transparente
    }
    draw() {
      // Cambia el tablero si se ha cambiado de nivel
      if (this.quizNavigator.currentLevel !== this.lastLevel) {
        this.setStrategy(this.quizNavigator.currentLevel);
        if (this.visualStrategy && typeof this.visualStrategy.resetBoardAndDisplays === 'function') {
          this.visualStrategy.resetBoardAndDisplays();
        }
        this.lastLevel = this.quizNavigator.currentLevel;
      }
      // Dibuja el tablero actual
      if (this.visualStrategy && typeof this.visualStrategy.draw === 'function') {
        this.visualStrategy.draw();
      } else {
        this.drawNoCanvas();
      }
    }
    mousePressed(mouseX, mouseY) {
      if (this.visualStrategy && typeof this.visualStrategy.mousePressed === 'function') {
        this.visualStrategy.mousePressed(mouseX, mouseY);
      }
    }
  }

  let canvasController;

  // --- Funciones principales del sketch ---
  p.preload = () => {
    try {
      pieceImages.pawnImg = p.loadImage('assets/chess/pawn.png');
    } catch (e) {
      console.error("Error al cargar imágenes: ", e);
      alert("No se pudieron cargar las imágenes de piezas de ajedrez. Revisa las rutas en p.preload().");
    }
  };

  p.setup = function () {
    const canvas = p.createCanvas(400, 400);
    canvas.parent("p5-container");
    p.background(240);

    // Inicializa el controlador del cuestionario
    quizNavigator = new QuizNavigator(p, levels, contentVisibilityMap);
    quizNavigator.init();

    // Inicializa el controlador del canvas
    canvasController = new CanvasController(p, levelCanvasObjects, quizNavigator);
  };

  p.draw = function () {
    canvasController.draw();
  };

  p.mousePressed = function () {
    // Detecta clics dentro del canvas
    if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
      canvasController.mousePressed(p.mouseX, p.mouseY);

      // Envía respuestas gráficas al cuestionario
      const currentLevel = levels[quizNavigator.currentLevel];
      if (Array.isArray(currentLevel)) {
        currentLevel.forEach((question) => {
          if (question.notInput) {
            const numDigits = question.correctAnswer.length;
            let answer = canvasController.visualStrategy.getBinaryString();
            answer = answer.slice(-numDigits);
            quizNavigator.setAnswerForGraphicInteractiveQuestion(question.id, answer);
          }
        });
      }
    }
  }
};
