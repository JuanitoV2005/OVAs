// La función quiz1 ahora se enfoca en la inicialización de P5.js y la gestión del canvas
function sketchTema3(p) {

  // Datos del quiz
  const levels = [
    // Intro (índice 0)
    null,

    // Nivel 1: longitud del array
    [
      { id: "q1", question: "¿Qué propiedad se usa en Java para conocer la cantidad de elementos de un array?", correctAnswer: "length" },
      { id: "q2", question: "Si arr = {10, 20, 30, 40}, ¿qué imprime System.out.println(arr.length)?", correctAnswer: "4" },
      { id: "q3", question: "¿Los índices de un array en Java empiezan desde 1? (si/no)", correctAnswer: "no" }
    ],

    // Nivel 2: acceder al primer elemento
    [
      { id: "q4", question: "¿Qué índice se utiliza para acceder al primer elemento de un array en Java?", correctAnswer: "0" },
      { id: "q5", question: "Si arr = {14, 24, 44}, ¿qué imprime System.out.println(arr[2])?", correctAnswer: "44" },
      { id: "q6", question: "Si arr = {100, 200, 300}, ¿qué imprime System.out.println(arr[1])?", correctAnswer: "200" }
    ],

    // Nivel 3: modificar un elemento
    [
      { id: "q7", question: "Si ingresamos la instrucción arr[1] = 64; ¿qué valor tendrá arr[1] después de esta instrucción?", correctAnswer: "64" },
      { id: "q8", question: "Si arr = {57, 28, 63} y luego ejecutamos arr[0] = 99; ¿Qué valor imprime System.out.println(arr[1])?", correctAnswer: "28" },
      { id: "q9", question: "¿Es posible cambiar el tamaño de un array después de crearlo en Java? (si/no)", correctAnswer: "no" }
    ],
    // Reto 7 (indice 7) - Enteros (int)
    null
  ];

  const contentVisibilityMap = {
      0: ['intro'],
      1: ['enunciado1', 'decimal-label'],
      2: ['enunciado2', 'explicacion-intermedia', 'decimal-label'],
      3: ['enunciado3', 'decimal-label'],
      4: ['conclusion']
    };

  let arrayValues = [0, 0, 0, 0, 0];
  let selectedIndex = -1;

  p.setup = function () {
    let canvas = p.createCanvas(600, 400);
    canvas.parent("p5-container");
    p.textAlign(p.CENTER, p.CENTER);
    p.pixelDensity(1);
    p.noSmooth();
    p.textFont("Consolas");

    quizNavigator = new QuizNavigator(p, levels, contentVisibilityMap);
    quizNavigator.init();
  };

  p.draw = function () {
    p.background("#f0f4ff");
    const nivelActual = quizNavigator.currentLevel;

    if (nivelActual === 1) {
      dibujarArrayInteractivo();
      p.fill(0);
      p.textSize(16);
      p.text("System.out.println(arr.length);", p.width/2, 320);
      p.text("Output: 5", p.width/2, 350);

    } else if (nivelActual === 2) {
      dibujarArrayInteractivo();
      p.fill(0);
      p.textSize(16);
      p.text("System.out.println(arr[0]);", p.width/2, 320);
      p.text(arrayValues[0], p.width/2, 350);

    } else if (nivelActual === 3) {
      dibujarArrayInteractivo();
      p.fill(0);
      p.textSize(16);
      p.text("arr[0] = 9;  System.out.println(arr[0]);", p.width/2, 320);
      p.text("Output: 9", p.width/2, 350);
    }
  };

  // --- Función para dibujar el array ---
  function dibujarArrayInteractivo() {
    p.textSize(22);
    p.fill(50);
    p.text("Haz clic en una casilla y escribe un número:", p.width/2, 40);

    let boxWidth = 80;
    for (let i = 0; i < arrayValues.length; i++) {
      let x = 60 + i * (boxWidth + 10);
      let y = 120;

      // Caja
      p.stroke(0);
      p.strokeWeight(2);
      p.fill(i === selectedIndex ? "#d1e7ff" : "#ffffff");
      p.rect(x, y, boxWidth, 80);

      // Índice
      p.fill(100);
      p.textSize(14);
      p.text("[" + i + "]", x + boxWidth/2, y - 20);

      // Valor
      p.textSize(20);
      p.fill(0);
      p.text(arrayValues[i], x + boxWidth/2, y + 40);
    }

    // Mostrar el array en formato Java
    p.textSize(18);
    p.fill(30);
    let arrayStr = "int[] arr = { " + arrayValues.join(", ") + " };";
    p.text(arrayStr, p.width/2, 300);
  }

  // --- Mouse ---
  p.mousePressed = function () {
  const nivelActual = quizNavigator.currentLevel;
    let boxWidth = 80;
    selectedIndex = -1;
    for (let i = 0; i < arrayValues.length; i++) {
      let x = 60 + i * (boxWidth + 10);
      let y = 120;
      if (p.mouseX > x && p.mouseX < x + boxWidth &&
          p.mouseY > y && p.mouseY < y + 80) {
        selectedIndex = i;
        break;
      }
    }


    // mantiene la lógica de otros niveles si la tienes
  };

  // --- Teclado ---
  p.keyPressed = function () {
    const nivelActual = quizNavigator.currentLevel;


    if (p.key >= '0' && p.key <= '9') {
      arrayValues[selectedIndex] = parseInt(p.key);
    }


    // mantiene la lógica de otros niveles si la tienes
  };

};
