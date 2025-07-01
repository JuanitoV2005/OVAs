// La función quiz1 ahora se enfoca en la inicialización de P5.js y la gestión del canvas
function sketchTema2(p) {
  // Datos del quiz
  const levels = [
    // Introducción (indice 0)
    null, // --> este nivel no tiene preguntas
    // Reto 1 (indice 1)
    [
      { id: "q1", question: "Si ubicas un peón. ¿Qué número se forma?", correctAnswer: "1" },
      { id: "q2", question: "Ahora, si retiras el peón. ¿Qué número obtienes?", correctAnswer: "0" },
      { id: "q3", question: "Si necesitaras guardar la respuesta a una pregunta 'sí o no', ¿cómo usarías esta casilla para representar un 'sí'?", isStatement: true}    
    ],
    // Reto 2 (indice 2)
    [
      { id: "q1", question: "¿Qué numéro forma un peón sobre la casilla izquierda?", correctAnswer: "2" },
      { id: "q2", question: "Usando solo estas dos casillas, ¿cuántos números distintos puedes formar?", correctAnswer: "4" },
      { id: "q3", question: "¿Cuál es el número más grande que se puede representar?", correctAnswer: "3"}    
    ],
    // Reto 3 (indice 3)
    [
      { id: "q1", question: "Según la fórmula citada, ¿cuántos números diferentes puedes representar con 3 casillas?", correctAnswer: "8" },
      { id: "q2", question: "En esta configuración, ¿cuál es el valor del peón MÁS significativo? (Pista: activa solo esa casilla y observa el número en pantalla)", correctAnswer: "4" },
      { id: "q3", question: "En esta configuración, ¿cuál es el valor del peón MENOS significativo? (Pista: activa solo esa casilla y observa el número en pantalla)", correctAnswer: "1"},
      { id: "q4", question: "Usa el tablero para colocar peones y formar el número 5", correctAnswer: "101", notInput:true}    
    ],
    // Reto 4 (indice 4)
    [
      {
        id: "q1",
        question: "¿Cuál es el número más alto que se puede representar con 4 bits?",
        correctAnswer: "15"
      },
      
      {
        id: "q2",
        question: "¿Cuánto es 9 en hexadecimal? Incluye '0x' al inicio de la respuesta. (Pista: escribe el número en el tablero y revisa la conversión hexadecimal que aparece en pantalla)",
        correctAnswer: "0x9",
      },
      {
        id: "q3",
        question: "¿Qué letra hexadecimal corresponde al número decimal 10? Incluye '0x' al inicio de la respuesta.",
        correctAnswer: "0xA",
      },
      {
        id: "q4",
        question: "¿Cuál es el dígito hexadecimal del número decimal 15? Incluye '0x' al inicio de la respuesta.",
        correctAnswer: "0xF",
      },
      {
        id: "q5",
        question: "Escribe en el tablero el número 11 con peones",
        correctAnswer: "1011", notInput:true
      }
    ],
    // Reto 5 (indice 5)
    [
      {
        id: "q1",
        question: "¿Cuál es el número más alto que se puede representar con 8 bits (1 byte)?",
        correctAnswer: "255"
      },
      {
        id: "q2",
        question: "¿Cuántos dígitos hexadecimales se necesitan para representar un byte completo?",
        correctAnswer: "2"
      },
      {
        id: "q3",
          question: "Intenta crear el número más grande posible usando exactamente 4 peones en las 8 casillas. ¿Qué número decimal lograste?",
          correctAnswer: "240"
      },
      {
        id: "q4",
        question: "¿Qué valor hexadecimal representa el número decimal 255? Incluye '0x' al inicio.",
        correctAnswer: "0xFF"
      },
      {
        id: "q5",
        question: "Escribe en el tablero el número 170",
        correctAnswer: "10101010",
        notInput: true
      }
    ],
    // Reto 6 (indice 6)
    [
      {
        id: "q1",
        question: "Para representar el color rojo puro 0xF800 en las primeras 16 casillas (Bits 0-15) de tu tablero, ¿cuántos peones necesitas colocar?",
        correctAnswer: "5"
      },
      {
        id: "q2",
        question: "Un segmento de memoria ocupa del Bit 16 al Bit 31 en tu tablero. ¿Cuántos dígitos hexadecimales se usan para representar este segmento?",
        correctAnswer: "4"
      },
      {
        id: "q3",
        question: "Si las 64 casillas de tu tablero estuvieran llenas de peones, ¿cuántos dígitos hexadecimales se necesitarían para representar este número completo?",
        correctAnswer: "16"
      },
      {
        id: "q4",
        question: "Un patrón de 16 bits consecutivos activados (1111111111111111) aparece en memoria. ¿Cuántos dígitos hexadecimales mínimos lo representan?",
        correctAnswer: "4"
      },
      {
        id: "q5",
        question: "Para representar el número 0xA5C3 en 16 casillas consecutivas de tu tablero, ¿cuántos peones necesitas colocar? Pista: Convierte 0xA5C3 a binario y cuenta los '1's.",
        correctAnswer: "8"
      }
    ]
  ];

  // Mapeo de niveles a los IDs de los divs de contenido a mostrar
  const contentVisibilityMap = {
    0: ['intro'],
    1: ['enunciado1','decimal-label'],
    2: ['enunciado2','explicacion-intermedia','decimal-label' ],
    3: ['enunciado3','decimal-label'],
    4: ['enunciado4','hex-label','binary-label','decimal-label'],
    5: ['enunciado5','hex-label','binary-label','decimal-label'],
    6: ['enunciado6','hex-label','decimal-label'],
    7: ['conclusion',"data-type-label"]
  };

  let quizNavigator;

  
  // --- Estrategias de dibujo del canvas --- 
  let pieceImages={}; // Inicializado en preload()
  let gui = {
    "background":"#ffffff",
    "cellColor1":"#7689a0",
    "cellColor2":"#e7e8f3",
    "cellLength":50,
    }
  
  const tableroVacio = Array(8).fill().map(() => Array(8).fill(null))
  // Crea tablero del nivel 1:
  const tablero1 = new ChessBoard(
    p,
    [gui.cellColor1, gui.cellColor2],
    [0, 0],
    gui.cellLength,
    [8, 8],
    tableroVacio.map(fila => [...fila]),
    pieceImages,
    {minR:7,maxR:7,minC:7,maxC:7}
  );

  const tablero2 = new ChessBoard(
    p,
    [gui.cellColor1, gui.cellColor2],
    [0, 0],
    gui.cellLength,
    [8, 8],
    tableroVacio.map(fila => [...fila]),
    pieceImages,
    {minR:7,maxR:7,minC:6,maxC:7}
  );

  const tablero3 = new ChessBoard(
    p,
    [gui.cellColor1, gui.cellColor2],
    [0, 0],
    gui.cellLength,
    [8, 8],
    tableroVacio.map(fila => [...fila]),
    pieceImages,
    {minR:7,maxR:7,minC:5,maxC:7}
  );
  const tablero4 = new ChessBoard(
    p,
    [gui.cellColor1, gui.cellColor2],
    [0, 0],
    gui.cellLength,
    [8, 8],
    tableroVacio.map(fila => [...fila]),
    pieceImages,
    {minR:7,maxR:7,minC:4,maxC:7}
  );
  const tablero5 = new ChessBoard(
    p,
    [gui.cellColor1, gui.cellColor2],
    [0, 0],
    gui.cellLength,
    [8, 8],
    tableroVacio.map(fila => [...fila]),
    pieceImages,
    {minR:7,maxR:7,minC:0,maxC:7} // Todas las 8 columnas de la última fila
  );
  // Crear tablero Hexadecimal
  const tablero6 = new ChessBoard(
    p,
    [gui.cellColor1, gui.cellColor2],
    [0, 0],
    gui.cellLength,
    [8, 8],
    tableroVacio.map(fila => [...fila]),
    pieceImages,
    {minR:0,maxR:7,minC:0,maxC:7}
  );
  
  

  const levelCanvasObjects = {
    0: null,
    1: tablero1,  
    2: tablero2,
    3: tablero3,
    4: tablero4,
    5: tablero5,
    6: tablero6, // El que antes era 5 ahora es 6
    7: null // Y agregamos un nuevo índice para el final
  };

  class CanvasController {
    constructor(p, levelCanvasObjects, quizNavigator) {
        this.p = p;
        this.levelCanvasObjects = levelCanvasObjects;
        this.quizNavigator = quizNavigator;
        // Initialize visualStrategy and lastLevel based on the initial currentLevel
        this.lastLevel = this.quizNavigator.currentLevel;
        this.visualStrategy = this.levelCanvasObjects[this.lastLevel]; // Set initial strategy
    }
    setStrategy(levelIndex) {
        this.visualStrategy = this.levelCanvasObjects[levelIndex];
    }

    drawNoCanvas() {
        this.p.background(255, 255, 255, 0); // Fondo transparente
    }
    draw() {
        // Check if the level has changed by comparing currentLevel with lastLevel
        if (this.quizNavigator.currentLevel !== this.lastLevel) {
            // Update the visual strategy to the new level's object
            this.setStrategy(this.quizNavigator.currentLevel);

            // If the new strategy is a ChessBoard instance, reset its state and displays
            // We check for the method to ensure it's a ChessBoard or similar object
            if (this.visualStrategy && typeof this.visualStrategy.resetBoardAndDisplays === 'function') {
                this.visualStrategy.resetBoardAndDisplays();
            }

            // Update lastLevel to the current level after handling the change
            this.lastLevel = this.quizNavigator.currentLevel;
        }

        // Always draw the current visual strategy
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




  // ------ Funciones principales del sketch ------
  
  p.preload = () => {
        try {
            pieceImages.pawnImg = p.loadImage('assets/chess/pawn.png');
        } catch (e) {
            console.error("Error loading images: ", e);
            alert("Could not load one or more chess piece images. Check paths in p.preload().");
        }
    };

  p.setup = function() {

    // Configuración inicial del canvas P5.js
    const canvas = p.createCanvas(400, 400);
    canvas.parent("p5-container"); // Asocia el canvas al div HTML con id "p5-container"
    p.background(240); // Establece el color de fondo inicial del canvas

    // Crea una instancia de QuizNavigator, pasando 'p' y los datos del quiz.
    // Esta instancia gestionará la lógica de la interfaz de usuario y la navegación.
    quizNavigator = new QuizNavigator(p, levels, contentVisibilityMap); // Variable para la instancia del QuizNavigator

    quizNavigator.init(); // Inicializa el QuizNavigator para configurar los elementos DOM y eventos.
    
    
    
    // Crea una instancia de canvasController
    canvasController = new CanvasController(p, levelCanvasObjects, quizNavigator);
    
  };

  p.draw = function () {    
    canvasController.draw();
  };

  // Esta función se ejecuta cada vez que se presiona el mouse en la ventana.
  // Aquí la usamos para detectar clics en el canvas y cambiar el color de la figura.
  p.mousePressed = function() {
    // Verifica si el clic ocurrió dentro de los límites del canvas
    if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
        canvasController.mousePressed(p.mouseX, p.mouseY);

    // Enviar a quiz navigator respuesta de las preguntas que toman la configuración del tablero:
    const currentLevel = levels[quizNavigator.currentLevel];

    if (Array.isArray(currentLevel)) {
      currentLevel.forEach((question) => {
        if (question.notInput) {
          const questionID = question.id;
          const numDigits = question.correctAnswer.length;
          let answer = canvasController.visualStrategy.getBinaryString();
          answer = answer.slice(-numDigits); // Solo los bits necesarios

          quizNavigator.setAnswerForGraphicInteractiveQuestion(questionID, answer);
        }
      });
    }
    }
  }



  };
