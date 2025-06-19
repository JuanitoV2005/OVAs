// La función quiz1 ahora se enfoca en la inicialización de P5.js y la gestión del canvas
function sketchTema2(p) {
  // Datos del quiz
  const levels = [
    // Nivel 1 (índice 0)
    null,
    [
      { id: "q1", question: "Si ubicas un peón. ¿Qué número se forma?", correctAnswer: "1" },
      { id: "q2", question: "Si retiras el peón. ¿Qé número se forma?", correctAnswer: "0" },
      { id: "q3", question: "Si necesitaras guardar la respuesta a una pregunta 'sí o no', ¿cómo usarías esta casilla para representar un 'sí'?", isStatement: true}    
    ],
    null,
    // Nivel 2 (índice 1) - Mostrar 'explicacion-intermedia'
    null, // Este nivel no tiene preguntas
    // Nivel 3 (índice 2) - Mostrar 'intro' (por defecto)
    [
      { id: "q5", question: "¿En qué año cayó el Muro de Berlín?", correctAnswer: "1989" },
      { id: "q6", question: "¿Cuál es el país más grande del mundo?", correctAnswer: "Rusia" , notInput:true}
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
    0: ['intro'],
    1: ['enunciado1','decimal-label'],
    2: ['chessBoardInfo','','explicacion-intermedia', 'hex-label','binary-label',"data-type-label"],
    3: ['intro'],
    4: ['intro'],
    5: ['conclusion']
  };

  let quizNavigator = new QuizNavigator(p, levels, contentVisibilityMap); // Variable para la instancia del QuizNavigator

  // Define los niveles que NO deben dibujar nada en el canvas de P5.js.
  // Los niveles 1 y 4 no tienen preguntas, se asocian a contenido de texto DOM.
  const noCanvasDrawingLevels = new Set([1, 4]);

  
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
    tableroVacio,
    pieceImages,
    {minR:7,maxR:7,minC:7,maxC:7}
  );
  

  const levelCanvasObjects = {
    0: null,
    1: tablero1,  
    2: null,
    3: null,
    4: null,
    5: null 
  };

  class CanvasController{
    constructor(p, levelCanvasObjects, quizNavigator){
      this.p = p;
      this.levelCanvasObjects = levelCanvasObjects;
      this.quizNavigator = quizNavigator;
      this.visualStrategy = levelCanvasObjects[quizNavigator.currentLevel];
      this.lastLevel = quizNavigator.currentLevel;
    }
    setStrategy(levelIndex) {
        this.visualStrategy = this.levelCanvasObjects[levelIndex];
    }

    drawNoCanvas() {
        this.p.background(255, 255, 255, 0); // Fondo transparente
    }
    draw(){
        if(this.visualStrategy && typeof this.visualStrategy.draw === 'function'){
            this.visualStrategy.draw();
        }
        else{
            this.drawNoCanvas();
        }
    }
    mousePressed(mouseX, mouseY){
        if(this.visualStrategy && typeof this.visualStrategy.mousePressed === 'function'){
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
    console.log(`Iniciando sketchTema3.`);

    // Configuración inicial del canvas P5.js
    const canvas = p.createCanvas(400, 400);
    canvas.parent("p5-container"); // Asocia el canvas al div HTML con id "p5-container"
    p.background(240); // Establece el color de fondo inicial del canvas

    // Crea una instancia de QuizNavigator, pasando 'p' y los datos del quiz.
    // Esta instancia gestionará la lógica de la interfaz de usuario y la navegación.
    quizNavigator.init(); // Inicializa el QuizNavigator para configurar los elementos DOM y eventos.
    
    // Crea una instancia de canvasController
    canvasController = new CanvasController(p, levelCanvasObjects, quizNavigator);
    
    
    // // establecer respuesta para q2
    quizNavigator.setAnswerForGraphicInteractiveQuestion("q2", "Pacífico")
  };

  p.draw = function () {
    // En cada fotograma, se llama a esta función para dibujar el canvas.
    // Utiliza el patrón Strategy: la función `drawCanvasForLevel` decide
    // qué "estrategia" de dibujo aplicar basándose en el `currentLevel` del quiz.
    // drawCanvasForLevel(quizNavigator.currentLevel);
    if(quizNavigator.currentLevel !== canvasController.lastLevel){
        canvasController.setStrategy(quizNavigator.currentLevel);
    }
    
    canvasController.draw();
  };

  // Esta función se ejecuta cada vez que se presiona el mouse en la ventana.
  // Aquí la usamos para detectar clics en el canvas y cambiar el color de la figura.
  p.mousePressed = function() {
    // Verifica si el clic ocurrió dentro de los límites del canvas
    if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
    //   const currentLevel = quizNavigator.currentLevel;
      // Solo cambia el color si el nivel actual tiene un dibujo de canvas definido en `levelCanvasStates`
    //   if (levelCanvasStates[currentLevel]) {
    //     // Genera un color aleatorio (RGB)
    //     levelCanvasStates[currentLevel].color = p.color(p.random(255), p.random(255), p.random(255));
    //   }
    //   canvasController.visualStrategy.color = p.color(p.random(255), p.random(255), p.random(255));
      canvasController.mousePressed(p.mouseX, p.mouseY);
    }
  };
}