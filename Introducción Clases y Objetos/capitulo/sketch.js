// La función quiz1 ahora se enfoca en la inicialización de P5.js y la gestión del canvas
function sketchTema3(p) {

  // Datos del quiz
  const levels = [
    // Introducción (indice 0)
    null, // --> este nivel no tiene preguntas
    // Reto 1 (indice 1)
    [
    { id: "q1", question: "¿Cuál sería el equivalente del tipo primitivo int en clase Wrapper en Java?", correctAnswer: "Integer" },
    { id: "q2", question: "¿Qué tipo de dato usarías para representar verdadero o falso como objeto?", correctAnswer: "Boolean" },
    { id: "q4", question: "¿Float en Java es un tipo primitivo? (Si/No)", correctAnswer: "No" }
    ],
    // Reto 2 (indice 2)
    [
    { id: "q1", question: "En la clase 'Espada', ¿cuántos atributos se han definido?", correctAnswer: "2" },
    { id: "q2", question: "¿Cómo se llama el método definido en la clase del ejemplo?", correctAnswer: "atacar" },
    { id: "q3", question: "En Java, ¿una clase puede contener métodos y atributos al mismo tiempo? (Si/No)", correctAnswer: "Si" }

    ],
    // Reto 3 (indice 3)
    [
    { id: "q1", question: "¿Qué palabra clave se usa para crear un nuevo objeto en Java?", correctAnswer: "new" },
    { id: "q2", question: "Si creas dos objetos a partir de la misma clase, ¿comparten los mismos valores de atributos? (Si/No)", correctAnswer: "No" },
    { id: "q3", question: "¿El operador 'new' crea una nueva instancia de una clase? (Si/No)", correctAnswer: "Si" }

    ],
    // Reto 4 (indice 4)
    [
    { id: "q1", question: "Si asignas a 'miEspada.daño' el valor 15, ¿qué atributo de la espada has modificado?", correctAnswer: "daño" },
    { id: "q2", question: "¿Un atributo es lo mismo que un método? (Si/No)", correctAnswer: "No" }

    ],
    // Reto 5 (indice 5)
    [
    { id: "q1", question: "¿La durabilidad aumenta o disminuye cuando llamas al método atacar()?", correctAnswer: "disminuye" },
    { id: "q2", question: "¿Un método puede modificar el valor de un atributo? (Si/No)", correctAnswer: "Si" }

    ],
    // Reto 6 (indice 6)
    [
    { id: "q1", question: "¿Dos instancias distintas de 'Espada' pueden tener valores diferentes para daño? (Si/No)", correctAnswer: "Si" },
    { id: "q2", question: "¿Todas las instancias de una clase comparten los mismos valores de atributos por defecto? (Si/No)", correctAnswer: "No" }

    ],
    // Reto 7 (indice 7) - Enteros (int)
    null
  ];

  p.preload = function () {
    herramientas.forEach((h) => {
      imagenes[h.nombre] = p.loadImage("assets/" + h.imagen);
    });
    imgEnun1 = p.loadImage("assets/enun1.png");
    imgEnun2 = p.loadImage("assets/enun2.png");
    imgEnun3 = p.loadImage("assets/enun3.png");
  };


  // Mapeo de niveles a los IDs de los divs de contenido a mostrar
  const contentVisibilityMap = {
    0: ['intro'],
    1: ['enunciado1', 'decimal-label'],
    2: ['enunciado2', 'explicacion-intermedia', 'decimal-label'],
    3: ['enunciado3', 'decimal-label'],
    4: ['enunciado4', 'hex-label', 'binary-label', 'decimal-label'],
    5: ['enunciado5', 'hex-label', 'binary-label', 'decimal-label'],
    6: ['enunciado6', 'hex-label', 'decimal-label'],
    7: ['conclusion']
  };



  let quizNavigator;
  let objetoActual;
  let botones = [];
  let resultado = "";
  let imagenes = {};

  const herramientas = [
    {
      nombre: "Espada de Madera",
      atributos: { danio: 4, durabilidad: 60 },
      metodo: function () {
        this.atributos.durabilidad -= 8;
        return "⚡ Ataque realizado con " + this.nombre;
      },
      imagen: "espada_madera.png",
    },
    {
      nombre: "Espada de Hierro",
      atributos: { danio: 6, durabilidad: 250 },
      metodo: function () {
        this.atributos.durabilidad -= 6;
        return "⚔ Golpe contundente con " + this.nombre;
      },
      imagen: "espada_hierro.png",
    },
    {
      nombre: "Espada de Diamante",
      atributos: { danio: 8, durabilidad: 1561 },
      metodo: function () {
        this.atributos.durabilidad -= 3;
        return "🔥 Corte preciso con " + this.nombre;
      },
      imagen: "espada_diamante.png",
    }
  ];

  p.setup = function () {
    const canvas = p.createCanvas(600, 400);
    canvas.parent("p5-container");
    p.background(240);

    quizNavigator = new QuizNavigator(p, levels, contentVisibilityMap);
    quizNavigator.init();

    objetoActual = herramientas[0];
  };


  p.draw = function () {
    p.background("#f0f4ff");

    // Detectar el nivel actual
    const nivelActual = quizNavigator.currentLevel;
    // Nivel 1: mostrar imagen 1
    if (nivelActual === 1) {
      if (imgEnun1) p.image(imgEnun1, 50, 10, 500, 380);
      return;
    }

    // Nivel 2: mostrar imagen 2
    if (nivelActual === 2) { 
      if (imgEnun2) p.image(imgEnun2, 50, 10, 500, 380);
      return;
    }

    // Nivel 3: mostrar imagen 3
    if (nivelActual === 3) { 
      if (imgEnun3) p.image(imgEnun3, 50, 10, 500, 380);
      return;
    }


    p.fill(30);
    p.noStroke();
    p.rect(50, 20, 500, 250); // Área de visualización
    p.fill(255);

    

    // Mostrar imagen
    const img = imagenes[objetoActual.nombre];
    if (img) {
      p.image(img, 250, 50, 100, 100);
    }

    // Mostrar opciones como mini íconos
    herramientas.forEach((h, i) => {
      const x = 80 + i * 150;
      const y = 200;
      p.image(imagenes[h.nombre], x, y, 50, 50);
      if (p.mouseIsPressed &&
          p.mouseX >= x && p.mouseX <= x + 50 &&
          p.mouseY >= y && p.mouseY <= y + 50) {
        objetoActual = h;
        resultado = "";
      }
    });
    // Botón de ataque como ícono
    p.fill("#d33");
    p.rect(250, 160, 100, 30, 5);
    p.fill(255);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Atacar", 300, 175);
    if (p.mouseIsPressed && p.mouseX >= 250 && p.mouseX <= 350 && p.mouseY >= 160 && p.mouseY <= 190) {
      resultado = objetoActual.metodo();
    }

    // Texto de atributos abajo
    p.fill(30);
    p.textSize(14);
    p.textAlign(p.LEFT);
    p.text("Atributos del objeto:", 60, 290);
    p.text("- Nombre: " + objetoActual.nombre, 60, 310);
    p.text("- Daño: " + objetoActual.atributos.danio, 60, 330);
    p.text("- Durabilidad: " + objetoActual.atributos.durabilidad, 60, 350);

    if (resultado !== "") {
      p.fill("#007700");
      p.textAlign(p.CENTER);
      p.text(resultado, p.width / 2, 380);
    }
  }

    // Esta función se ejecuta cada vez que se presiona el mouse en la ventana.
    // Aquí la usamos para detectar clics en el canvas y cambiar el color de la figura.
  p.mousePressed = function () {
    const currentLevel = levels[quizNavigator.currentLevel];
      if (Array.isArray(currentLevel)) {
        currentLevel.forEach((question) => {
          if (question.notInput) {
            // En el futuro puedes agregar lógica de respuesta gráfica
          }
        });
      }
    };

};
