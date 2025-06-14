// La función quiz1 ahora se enfoca en la inicialización de P5.js y la gestión del canvas
function quiz1(p) {
  // Datos del quiz
  const levels = [
    // Nivel 1 (índice 0)
    [
      { id: "q1", question: "¿Cuál es la capital de Francia?", correctAnswer: "París" },
      { id: "q2", question: "¿Cuál es el océano más grande del mundo?", correctAnswer: "Pacífico" }
    ],
    // Nivel 2 (índice 1) - Mostrar 'explicacion-intermedia'
    null, // Este nivel no tiene preguntas
    // Nivel 3 (índice 2) - Mostrar 'intro' (por defecto)
    [
      { id: "q5", question: "¿En qué año cayó el Muro de Berlín?", correctAnswer: "1989" },
      { id: "q6", question: "¿Cuál es el país más grande del mundo?", correctAnswer: "Rusia" }
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
    0: 'intro',
    1: 'explicacion-intermedia',
    2: 'intro',
    3: 'intro',
    4: 'conclusion'
  };

  let quizNavigator; // Variable para la instancia del QuizNavigator

  // Define los niveles que NO deben dibujar nada en el canvas de P5.js.
  // Los niveles 1 y 4 no tienen preguntas, se asocian a contenido de texto DOM.
  const noCanvasDrawingLevels = new Set([1, 4]);

  // Objeto para almacenar el estado inicial y actual de los dibujos del canvas por nivel.
  // Esto permite que cada nivel con dibujo tenga un color inicial que puede ser modificado.
  const levelCanvasStates = {
    0: { color: p.color(100, 150, 255) }, // Color inicial azul para el nivel 0
    2: { color: p.color(255, 150, 100) }, // Color inicial naranja para el nivel 2
    3: { color: p.color(50, 150, 50) }   // Color inicial verde para el nivel 3
  };

  // --- Estrategias de dibujo del canvas ---

  // Función para dibujar el canvas para el Nivel 0
  function drawLevel0Canvas() {
    p.background(240); // Fondo gris claro
    p.fill(levelCanvasStates[0].color); // Usa el color del estado para el relleno
    p.noStroke(); // Sin borde para la forma
    p.ellipse(p.width / 2, p.height / 2, 100, 100); // Dibuja un círculo en el centro
    p.fill(0); // Color de texto negro
    p.textAlign(p.CENTER, p.CENTER); // Alinea el texto al centro
    p.textSize(24); // Tamaño de la fuente
    p.text("Quiz: Geografía", p.width / 2, p.height / 2); // Muestra el texto "Quiz: Geografía"
  }

  // Función para dibujar el canvas para el Nivel 2
  function drawLevel2Canvas() {
    p.background(220); // Fondo un poco más oscuro
    p.fill(levelCanvasStates[2].color); // Usa el color del estado para el relleno
    p.rectMode(p.CENTER); // Dibuja rectángulos desde su centro
    p.rect(p.width / 2, p.height / 2, 120, 80, 10); // Dibuja un rectángulo redondeado
    p.fill(0); // Color de texto negro
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(20);
    p.text("Quiz: Historia", p.width / 2, p.height / 2); // Muestra el texto "Quiz: Historia"
  }

  // Función para dibujar el canvas para el Nivel 3
  function drawLevel3Canvas() {
    p.background(200, 255, 200); // Fondo verde claro
    p.fill(levelCanvasStates[3].color); // Usa el color del estado para el relleno
    p.noStroke();
    p.triangle(
      p.width / 2, p.height / 2 - 40,
      p.width / 2 - 50, p.height / 2 + 40,
      p.width / 2 + 50, p.height / 2 + 40
    ); // Dibuja un triángulo
    p.fill(0);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(22);
    p.text("Quiz: Ciudades", p.width / 2, p.height / 2); // Muestra el texto "Quiz: Ciudades"
  }

  // Función para niveles que no requieren dibujo en el canvas (solo limpiarlo o hacerlo transparente)
  function drawNoCanvas() {
    p.background(255, 255, 255, 0); // Fondo transparente
  }

  // Función principal para aplicar el patrón Strategy para el dibujo del canvas.
  // Dependiendo del nivel actual del quiz, se selecciona y ejecuta la función de dibujo apropiada.
  function drawCanvasForLevel(levelIndex) {
    if (noCanvasDrawingLevels.has(levelIndex)) {
      drawNoCanvas(); // Si el nivel está en la lista de "no dibujar", se usa esa estrategia
    } else if (levelIndex === 0) {
      drawLevel0Canvas(); // Dibujo específico para el nivel 0
    } else if (levelIndex === 2) {
      drawLevel2Canvas(); // Dibujo específico para el nivel 2
    } else if (levelIndex === 3) {
      drawLevel3Canvas(); // Dibujo específico para el nivel 3
    }
  }

  p.setup = function() {
    console.log(`Iniciando sketchTema3.`);

    // Configuración inicial del canvas P5.js
    const canvas = p.createCanvas(400, 400);
    canvas.parent("p5-container"); // Asocia el canvas al div HTML con id "p5-container"
    p.background(240); // Establece el color de fondo inicial del canvas

    // Crea una instancia de QuizNavigator, pasando 'p' y los datos del quiz.
    // Esta instancia gestionará la lógica de la interfaz de usuario y la navegación.
    quizNavigator = new QuizNavigator(p, levels, contentVisibilityMap);
    quizNavigator.init(); // Inicializa el QuizNavigator para configurar los elementos DOM y eventos.
  };

  p.draw = function () {
    // En cada fotograma, se llama a esta función para dibujar el canvas.
    // Utiliza el patrón Strategy: la función `drawCanvasForLevel` decide
    // qué "estrategia" de dibujo aplicar basándose en el `currentLevel` del quiz.
    drawCanvasForLevel(quizNavigator.currentLevel);
  };

  // Esta función se ejecuta cada vez que se presiona el mouse en la ventana.
  // Aquí la usamos para detectar clics en el canvas y cambiar el color de la figura.
  p.mousePressed = function() {
    // Verifica si el clic ocurrió dentro de los límites del canvas
    if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
      const currentLevel = quizNavigator.currentLevel;
      // Solo cambia el color si el nivel actual tiene un dibujo de canvas definido en `levelCanvasStates`
      if (levelCanvasStates[currentLevel]) {
        // Genera un color aleatorio (RGB)
        levelCanvasStates[currentLevel].color = p.color(p.random(255), p.random(255), p.random(255));
      }
    }
  };
}