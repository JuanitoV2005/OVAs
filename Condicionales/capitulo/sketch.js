function sketchTema2(p) {
  const levels = [
    null, // Nivel 0 (No usado)
    [
      {
        id: "q1",
        type: "text",
        question: "Si la variable 'edad' es 20, ¿la expresión 'edad >= 18' es verdadera o falsa?",
        correctAnswer: "verdadera"
      },
      {
        id: "q2",
        type: "multiple",
        question: "Si la variable 'x' es 5 y 'y' es 10, ¿la expresión '(x > 3) && (y < 12)' es verdadera o falsa?",
        options: ["verdadera", "falsa", "indefinida"],
        correctAnswer: "verdadera"
      },
      {
        id: "q3",
        type: "variable",
        questionTemplate: (a, b) => `Si a=${a} y b=${b}, ¿la expresión '(a < b) || (b < 0)' es verdadera o falsa?`,
        generateVars: () => {
          const a = Math.floor(Math.random() * 10);
          const b = Math.floor(Math.random() * 10);
          return { a, b, correctAnswer: (a < b || b < 0) ? "verdadera" : "falsa" };
        }
      }
    ],
    null, // Nivel 2
    [
      {
        id: "q1",
        type: "multiple",
        question: "Si la variable 'temperatura' es 25, ¿el código dentro del siguiente 'if' se ejecutará? if (temperatura > 30)",
        options: ["sí", "no", "a veces"],
        correctAnswer: "no"
      },
      {
        id: "q2",
        type: "text",
        question: "En un 'if' simple, si la condición es falsa, ¿qué ocurre con el bloque de código?",
        correctAnswer: "se salta"
      },
      {
        id: "q3",
        type: "variable",
        questionTemplate: (n) => `Si n=${n}, ¿la condición 'n % 2 == 0' es verdadera o falsa?`,
        generateVars: () => {
          const n = Math.floor(Math.random() * 20);
          return { n, correctAnswer: (n % 2 === 0) ? "verdadera" : "falsa" };
        }
      }
    ],
    null, // Nivel 4
    [
      {
        id: "q1",
        type: "text",
        question: "Si una persona tiene una puntuación de 85, ¿qué calificación imprimirá el programa del ejemplo 'else if'?",
        correctAnswer: "B"
      },
      {
        id: "q2",
        type: "multiple",
        question: "Si un número es par, ¿qué bloque de código se ejecuta en la sentencia 'if-else'?",
        options: ["if", "else", "ninguno"],
        correctAnswer: "if"
      },
      {
        id: "q3",
        type: "text",
        question: "En una cadena 'else if', si la primera condición es verdadera, ¿se evalúan las siguientes?",
        correctAnswer: "no"
      }
    ],
    null, // Nivel 6
    [
      {
        id: "q1",
        type: "text",
        question: "En un 'switch', ¿qué palabra clave se usa para salir de un 'case' y evitar el 'fall-through'?",
        correctAnswer: "break"
      },
      {
        id: "q2",
        type: "multiple",
        question: "¿Qué bloque de código en un 'switch' se ejecuta si la expresión no coincide con ningún 'case'?",
        options: ["default", "else", "case null"],
        correctAnswer: "default"
      },
      {
        id: "q3",
        type: "text",
        question: "Si la variable 'dia' es 5, ¿qué 'case' se ejecutará en el ejemplo?",
        correctAnswer: "case 5"
      }
    ],
    null, // Nivel 8
    [
      {
        id: "q1",
        type: "multiple",
        question: "En un bucle 'while', ¿cuándo se evalúa la condición?",
        options: ["antes de cada iteracion", "después de cada iteracion", "solo al inicio"],
        correctAnswer: "antes de cada iteracion"
      },
      {
        id: "q2",
        type: "text",
        question: "Si la condición de un bucle 'while' es falsa desde el inicio, ¿cuántas veces se ejecuta el código?",
        correctAnswer: "0"
      },
      {
        id: "q3",
        type: "variable",
        questionTemplate: (n) => `Si empezamos con n=${n}, ¿cuántas veces se ejecutará este bucle? while(n > 0) { n--; }`,
        generateVars: () => {
          const n = Math.floor(Math.random() * 5);
          return { n, correctAnswer: String(n) };
        }
      }
    ],
    null, // Nivel 10
    [
      {
        id: "q1",
        type: "text",
        question: "¿Qué patrón usarías para asegurarte de que un usuario ingrese un número entre 1 y 10?",
        correctAnswer: "validacion"
      },
      {
        id: "q2",
        type: "multiple",
        question: "En el patrón de centinela, ¿la primera lectura de datos ocurre dentro o fuera del bucle?",
        options: ["dentro", "fuera", "depende"],
        correctAnswer: "fuera"
      },
      {
        id: "q3",
        type: "variable",
        questionTemplate: (n) => `Si el acumulador empieza en 0 y sumamos n=${n}, ¿cuál será el valor acumulado?`,
        generateVars: () => {
          const n = Math.floor(Math.random() * 10);
          return { n, correctAnswer: String(n) };
        }
      }
    ],
    null, // Nivel 12
    [
      {
        id: "q1",
        type: "multiple",
        question: "En un bucle 'for', ¿qué parte de la sintaxis se ejecuta solo una vez al inicio?",
        options: ["inicializacion", "condicion", "actualizacion"],
        correctAnswer: "inicializacion"
      },
      {
        id: "q2",
        type: "text",
        question: "En el ejemplo, ¿cuántas veces se ejecutará el bucle?",
        correctAnswer: "5"
      },
      {
        id: "q3",
        type: "variable",
        questionTemplate: (n) => `Si for(i=0; i<${n}; i++), ¿cuántas veces se ejecuta el bucle?`,
        generateVars: () => {
          const n = Math.floor(Math.random() * 10) + 1;
          return { n, correctAnswer: String(n) };
        }
      }
    ],
    null, // Nivel 14
    [
      {
        id: "q1",
        type: "text",
        question: "En un bucle 'for' anidado, ¿cuántas veces se ejecuta el bucle interno por cada iteración del externo?",
        correctAnswer: "todas las veces"
      },
      {
        id: "q2",
        type: "multiple",
        question: "Para crear un cuadrado de 5x5, ¿cuántas iteraciones totales ocurrirán?",
        options: ["10", "25", "50"],
        correctAnswer: "25"
      },
      {
        id: "q3",
        type: "variable",
        questionTemplate: (m, n) => `Si el bucle externo corre ${m} veces y el interno ${n} veces, ¿cuántas iteraciones totales hay?`,
        generateVars: () => {
          const m = Math.floor(Math.random() * 5) + 1;
          const n = Math.floor(Math.random() * 5) + 1;
          return { m, n, correctAnswer: String(m * n) };
        }
      }
    ],
    null // Nivel 16
  ];


  // ===== Mapeo de visibilidad por nivel (se usa en QuizNavigator) =====
  const contentVisibilityMap = {
    0: ['intro'],
    1: ['enunciado1'],
    2: ['enunciado2', 'laberintoUI', 'p5Card'],
    3: ['enunciado3'],
    4: ['enunciado4', 'laberintoUI', 'p5Card'],
    5: ['enunciado5'],
    6: ['enunciado6', 'laberintoUI', 'p5Card'],
    7: ['enunciado7'],
    8: ['enunciado8', 'laberintoUI', 'p5Card'],
    9: ['enunciado9'],
    10: ['enunciado10', 'laberintoUI', 'p5Card'],
    11: ['enunciado11'],
    12: ['enunciado12', 'laberintoUI', 'p5Card'],
    13: ['enunciado13'],
    14: ['enunciado14', 'laberintoUI', 'p5Card'],
    15: ['enunciado15'],
    16: ['enunciado16', 'laberintoUI', 'p5Card']
  };


  // === GESTOR GLOBAL DE SCORM ===
  window.SCORMManager = {
    puntosPreguntas: 0,
    puntosLaberintos: 0,
    totalPreguntas: 24,
    totalLaberintos: 8,

    actualizarSCORM() {
      const totalCorrectos = this.puntosLaberintos + this.puntosPreguntas;
      const totalPosibles = this.totalLaberintos + this.totalPreguntas;
      const score = Math.round((totalCorrectos / totalPosibles) * 100);

      if (typeof doSetValue === "function") {
        doSetValue("cmi.core.score.raw", score.toString());

        // --- Estados SCORM más robustos ---
        if (totalCorrectos >= totalPosibles) {
          doSetValue("cmi.core.lesson_status", "completed");
        }

        //if (score >= 60) {
        //  doSetValue("cmi.core.lesson_status", "passed");
        //} else {
        //  doSetValue("cmi.core.lesson_status", "failed");
        //}

        doCommit();
      } else {
        console.warn("⚠️ SCORM API no disponible (doSetValue no definido).");
      }
    },

    registrarExitoLaberinto() {
      this.puntosLaberintos++;
      this.actualizarSCORM();
    },

    registrarChoque() {
      if (typeof doSetValue === "function") {
        const status = (typeof doGetValue === "function")
          ? doGetValue("cmi.core.lesson_status")
          : null;

        // Evita sobreescribir estados finales correctos
        if (status !== "passed" && status !== "completed") {
          doSetValue("cmi.core.lesson_status", "incomplete");
          doCommit();
        }
      } else {
        console.warn("⚠️ SCORM API no disponible al registrar choque.");
      }
    },

    registrarRespuestaCorrecta() {
      this.puntosPreguntas++;
      this.actualizarSCORM();
    }
  };



  // ===== Mapas =====
  const mapa1 = [
    [1, 0, 1, 0, 0, 1, 0, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 2, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 0, 1, 3, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 0, 1, 0, 0, 1, 0, 1]
  ];

  const mapa2 = [
    [1, 1, 1, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 3, 1],
    [1, 1, 1, 1, 1, 1, 0, 1],
    [1, 2, 0, 0, 1, 1, 0, 1],
    [1, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
  ];

  const mapa3 = [
    [1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 3, 1, 1],
    [1, 1, 1, 0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 2, 1, 0],
    [1, 0, 1, 1, 0, 1, 1, 1]
  ];

  const mapa4 = [
    [1, 1, 1, 1, 1, 1, 0, 1],
    [1, 2, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0],
    [1, 0, 1, 1, 1, 0, 1, 0],
    [1, 3, 0, 0, 0, 0, 0, 1],
    [0, 1, 1, 1, 1, 1, 1, 1]
  ];

  const mapa5 = [
    [1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0],
    [1, 0, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 0, 1],
    [0, 1, 1, 0, 0, 1, 1, 0, 1],
    [0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 2, 0, 0, 0, 1, 1, 3, 1],
    [1, 1, 1, 1, 1, 0, 0, 1, 1]
  ];

  const mapa6 = [
    [1, 1, 1, 1, 0, 1, 0, 1, 1],
    [1, 2, 0, 1, 1, 1, 0, 0, 1],
    [0, 1, 0, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 0, 1, 1, 0, 0],
    [1, 1, 1, 1, 0, 0, 1, 0, 1],
    [0, 1, 0, 1, 1, 0, 0, 1, 1],
    [0, 1, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 3, 1],
    [1, 1, 0, 0, 0, 0, 1, 1, 1]
  ];

  const mapa7 = [
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 1, 3, 1, 0],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [1, 1, 1, 0, 0, 1, 1, 0, 1, 1],
    [1, 0, 1, 1, 0, 0, 1, 0, 1, 0],
    [1, 0, 0, 1, 1, 0, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 1, 2, 0, 0, 0, 0, 0, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

  const mapa8 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 3, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 2, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

  const levelCanvasObjects = {
    0: null,
    1: null,
    2: mapa1,
    3: null,
    4: mapa2,
    5: null,
    6: mapa3,
    7: null,
    8: mapa4,
    9: null,
    10: mapa5,
    11: null,
    12: mapa6,
    13: null,
    14: mapa7,
    15: null,
    16: mapa8
  };

  // ===== Inicio del jugador: usa "2" si existe; si no, fallback =====
  function pickFacing(map, x, y) {
    const dx = [0, 1, 0, -1], dy = [-1, 0, 1, 0];
    for (let d = 0; d < 4; d++) {
      const nx = x + dx[d], ny = y + dy[d];
      if (ny >= 0 && ny < map.length && nx >= 0 && nx < map[0].length) {
        if (map[ny][nx] !== 1) return d; // primera dirección que no sea muro
      }
    }
    return 1; // derecha por defecto
  }

  function computeStartForLevel(level) {
    const map = levelCanvasObjects[level];
    if (!map) return { x: 1, y: 2, dir: 1 };

    // Busca el "2" y orienta mirando a una celda libre
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x++) {
        if (map[y][x] === 2) return { x, y, dir: pickFacing(map, x, y) };
      }
    }
    // Sin "2": fallback fijo
    return { x: 1, y: 2, dir: 1 };
  }

  // ===== Estado =====
  let workspace;
  let jugador;
  let imgJugador; // <--  imagen del jugador
  let ejecutando = false;
  let quizNavigator;
  let canvasController;

  /** === DEFINICIÓN DE TOOLBOXES POR LABERINTO === **/

  // Laberinto 1: Lógica booleana y operadores
  const toolboxLaberinto1 = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="move_forward"></block>
  <block type="turn_left"></block>
  <block type="turn_right"></block>
  <block type="controls_ifelse"></block>
  <block type="sense_ahead"></block>
</xml>`;

  // Laberinto 2: If simple
  const toolboxLaberinto2 = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <category name="Acciones" colour="120">
    <block type="move_forward"></block>
    <block type="turn_left"></block>
    <block type="turn_right"></block>
  </category>
  <category name="Condicionales" colour="210">
    <block type="controls_if"></block>
  </category>
  <category name="Sensores" colour="180">
    <block type="sense_ahead"></block>
  </category>
</xml>`;

  // Laberinto 3: If-Else
  const toolboxLaberinto3 = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <category name="Acciones" colour="120">
    <block type="move_forward"></block>
    <block type="turn_left"></block>
    <block type="turn_right"></block>
  </category>
  <category name="Condicionales" colour="210">
    <block type="controls_ifelse"></block>
  </category>
  <category name="Sensores" colour="180">
    <block type="sense_ahead"></block>
  </category>
</xml>`;

  // Laberinto 4: Switch
  const toolboxLaberinto4 = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <category name="Acciones" colour="120">
    <block type="move_forward"></block>
    <block type="turn_left"></block>
    <block type="turn_right"></block>
  </category>
  <category name="Condicionales" colour="210">
  </category>
  <category name="Sensores" colour="180">
    <block type="sense_ahead"></block>
  </category>
</xml>`;

  // Laberinto 5: While
  const toolboxLaberinto5 = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <category name="Acciones" colour="120">
    <block type="move_forward"></block>
    <block type="turn_left"></block>
    <block type="turn_right"></block>
  </category>
  <category name="Bucles" colour="210">
    <block type="controls_whileUntil"></block>
  </category>
  <category name="Sensores" colour="180">
    <block type="sense_ahead"></block>
  </category>
</xml>`;

  // Laberinto 6: Patrones con while
  const toolboxLaberinto6 = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <category name="Acciones" colour="120">
    <block type="move_forward"></block>
    <block type="turn_left"></block>
    <block type="turn_right"></block>
  </category>
  <category name="Bucles" colour="210">
    <block type="controls_whileUntil"></block>
  </category>
  <category name="Variables" custom="VARIABLE" colour="330"></category>
  <category name="Matemáticas" colour="230">
    <block type="math_arithmetic"></block>
    <block type="math_number"></block>
  </category>
</xml>`;

  // Laberinto 7: For
  const toolboxLaberinto7 = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <category name="Acciones" colour="120">
    <block type="move_forward"></block>
    <block type="turn_left"></block>
    <block type="turn_right"></block>
  </category>
  <category name="Bucles" colour="210">
    <block type="controls_for"></block>
  </category>
  <category name="Variables" custom="VARIABLE" colour="330"></category>
</xml>`;

  // Laberinto 8: For anidados
  const toolboxLaberinto8 = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <category name="Acciones" colour="120">
    <block type="move_forward"></block>
    <block type="turn_left"></block>
    <block type="turn_right"></block>
  </category>
  <category name="Bucles" colour="210">
    <block type="controls_for"></block>
  </category>
  <category name="Variables" custom="VARIABLE" colour="330"></category>
  <category name="Lógica" colour="180">
    <block type="logic_compare"></block>
  </category>
</xml>`;


  // === Helper para convertir XML-string a DOM (compatibilidad versiones Blockly) ===
  function textToDom(xmlText) {
    if (Blockly && Blockly.utils && Blockly.utils.xml && Blockly.utils.xml.textToDom) {
      return Blockly.utils.xml.textToDom(xmlText);
    }
    return Blockly.Xml.textToDom(xmlText); // fallback
  }

  // === Devuelve el toolbox correcto según el nivel actual ===
  function getToolboxForLevel(level) {
    switch (level) {
      case 2: return toolboxLaberinto1; // Lógica booleana y operadores
      case 4: return toolboxLaberinto2; // If simple
      case 6: return toolboxLaberinto3; // If–else
      case 8: return toolboxLaberinto4; // Switch
      case 10: return toolboxLaberinto5; // While
      case 12: return toolboxLaberinto6; // Patrones con while
      case 14: return toolboxLaberinto7; // For
      case 16: return toolboxLaberinto8; // For anidados
      default:
        // Niveles que no son laberinto → toolbox mínimo
        return `<xml xmlns="https://developers.google.com/blockly/xml">
                <category name="Acciones" colour="120">
                  <block type="move_forward"></block>
                  <block type="turn_left"></block>
                  <block type="turn_right"></block>
                </category>
              </xml>`;
    }
  }

  // === Inyecta o actualiza el toolbox del workspace ===

  function initBlockly(level) {
    const toolboxXml = getToolboxForLevel(level);
    const blocklyDiv = document.getElementById('blocklyDiv');

    if (!blocklyDiv || !window.Blockly) return;

    if (window.workspace) {
      window.workspace.dispose();
    }

    window.workspace = Blockly.inject(blocklyDiv, {
      toolbox: toolboxXml,
      trashcan: true,
      scrollbars: true
    });

    // Ajustar tamaño tras la inyección
    setTimeout(() => {
      if (Blockly && Blockly.svgResize && window.workspace) {
        Blockly.svgResize(window.workspace);
      }
    }, 0);
  }

  // Exponer para que levelnav.js pueda llamarlo
  window.getToolboxForLevel = getToolboxForLevel;
  window.initBlockly = initBlockly;


  // ===== Canvas Controller =====
  class CanvasController {
    constructor(p, quizNavigator) {
      this.p = p;
      this.quizNavigator = quizNavigator;
      this.mapa = null;
      this.cellSize = 40;
    }

    updateCellSize() {
      if (!this.mapa) return;
      const cols = this.mapa[0].length;
      const rows = this.mapa.length;
      this.cellSize = Math.floor(Math.min(this.p.width / cols, this.p.height / rows));
    }

    setMapa(mapa) {
      this.mapa = mapa;
    }

    draw() {
      this.updateCellSize();
      if (!this.mapa) return;

      this.p.background(255);

      for (let y = 0; y < this.mapa.length; y++) {
        for (let x = 0; x < this.mapa[y].length; x++) {
          const value = this.mapa[y][x];
          if (value === 1) {
            this.p.fill(59, 59, 59);     // muro
          } else if (value === 2) {
            this.p.fill(255, 180, 180);  // rojo claro
          } else if (value === 3) {
            this.p.fill(46, 139, 87);    // meta
          } else {
            this.p.fill(255);            // camino
          }
          this.p.stroke(0, 0, 0, 15);
          this.p.strokeWeight(1);
          this.p.rect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
        }
      }

      this.drawPlayer();
    }

    drawPlayer() {
      if (!jugador) return;
      const cx = jugador.x * this.cellSize + this.cellSize / 2;
      const cy = jugador.y * this.cellSize + this.cellSize / 2;
      this.p.push();
      this.p.translate(cx, cy);
      // this.p.rotate(jugador.dir * this.p.HALF_PI);

      // Dibuja la imagen del jugador
      if (imgJugador) {
        this.p.imageMode(this.p.CENTER);
        const w = this.cellSize * 0.9;
        const h = this.cellSize * 0.9;
        this.p.image(imgJugador, 0, 0, w, h);
      } else {
        // Fallback simple si no cargó la imagen
        // cuerpo
        this.p.fill(30, 144, 255);
        this.p.triangle(
          0, -this.cellSize * 0.28,
          this.cellSize * 0.22, this.cellSize * 0.2,
          -this.cellSize * 0.22, this.cellSize * 0.2
        );

        // ojo
        this.p.fill(255);
        this.p.circle(-this.cellSize * 0.06, -this.cellSize * 0.08, this.cellSize * 0.1);
        this.p.fill(0);
        this.p.circle(-this.cellSize * 0.06, -this.cellSize * 0.08, this.cellSize * 0.04);

        this.p.pop();
      }
    }

    mover() {
      const dx = [0, 1, 0, -1];
      const dy = [-1, 0, 1, 0];
      const nx = jugador.x + dx[jugador.dir];
      const ny = jugador.y + dy[jugador.dir];
      if (!this.mapa || ny < 0 || ny >= this.mapa.length || nx < 0 || nx >= this.mapa[0].length) {
        throw new Error("¡Fuera del mapa!");
      }
      if (this.mapa[ny][nx] === 1) throw new Error("¡Te estrellaste contra un muro!");
      jugador.x = nx;
      jugador.y = ny;
    }

    girarIzq() { jugador.dir = (jugador.dir + 3) % 4; }
    girarDer() { jugador.dir = (jugador.dir + 1) % 4; }
    enMeta() { return this.mapa && this.mapa[jugador.y][jugador.x] === 3; }

    caminoAdelante() {
      const dx = [0, 1, 0, -1];
      const dy = [-1, 0, 1, 0];
      const nx = jugador.x + dx[jugador.dir];
      const ny = jugador.y + dy[jugador.dir];
      if (!this.mapa || ny < 0 || ny >= this.mapa.length || nx < 0 || nx >= this.mapa[0].length) return false;
      return this.mapa[ny][nx] !== 1;
    }
  }

  // ===== Ejecución Blockly =====
  function ejecutar() {
    if (ejecutando) return;
    ejecutando = true;

    const btn = document.getElementById("runButton");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Ejecutando...";
    }

    document.getElementById('salida').textContent = "";
    jugador = computeStartForLevel(quizNavigator.currentLevel);

    let acciones = [];
    try {
      const code = Blockly.JavaScript.workspaceToCode(workspace);
      new Function('acciones', 'mover', 'girarDer', 'girarIzq', 'caminoAdelante', code)(
        acciones,
        () => canvasController.mover(),
        () => canvasController.girarDer(),
        () => canvasController.girarIzq(),
        () => canvasController.caminoAdelante()
      );
    } catch (e) {
      document.getElementById('salida').textContent = e.message;
      liberarEjecucion();
      return;
    }

    const snapshot = acciones.slice();
    let i = 0;
    const timer = setInterval(() => {
      if (i < snapshot.length) {
        try {
          snapshot[i++]();
          if (canvasController.enMeta()) {
            document.getElementById('salida').textContent = "¡Llegaste a la meta!";
            SCORMManager.registrarExitoLaberinto();
            clearInterval(timer);   // <--- evita múltiple puntuación
            liberarEjecucion();
          }
        } catch (e) {
          document.getElementById('salida').textContent = e.message;
          SCORMManager.registrarChoque();
          clearInterval(timer);
          liberarEjecucion();
        }
      } else {
        clearInterval(timer);
        liberarEjecucion();
      }
    }, 300);
  }

  function liberarEjecucion() {
    ejecutando = false;
    const btn = document.getElementById("runButton");
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Ejecutar";
    }
  }

  // ===== Resize Canvas & Blockly =====
  function resizeCanvasAndBlockly(p) {
    const cont = p.select('#p5-container').elt;
    const side = Math.max(600, Math.min(cont.clientWidth || 600, 900));
    p.resizeCanvas(side, side);

    const blocklyDiv = document.getElementById('blocklyDiv');
    if (blocklyDiv) {
      blocklyDiv.style.width = side + 'px';   // <— ANCHO también
      blocklyDiv.style.height = side + 'px';  // <— ALTURA igual al canvas
      if (window.workspace && Blockly && Blockly.svgResize) {
        Blockly.svgResize(window.workspace);
      }
    }
  }

  // ===== P5 SETUP / DRAW =====

  p.preload = function () {
    // OJO con la ruta: este sketch corre desde /capitulo,
    // y la carpeta assets está en /Condicionales/assets
    imgJugador = p.loadImage('assets/java.png');
  };

  p.setup = function () {
    quizNavigator = new QuizNavigator(p, levels, contentVisibilityMap);
    quizNavigator.init();

    canvasController = new CanvasController(p, quizNavigator);

    // Inyecta con el toolbox correspondiente al nivel actual (ya NO usamos #toolbox del DOM)
    const initialToolbox = getToolboxForLevel(quizNavigator.currentLevel);
    window.workspace = Blockly.inject("blocklyDiv", {
      toolbox: textToDom(initialToolbox),
      trashcan: true,
      scrollbars: true,
      maxBlocks: 8
    });

    document.getElementById("runButton").addEventListener("click", ejecutar);

    jugador = computeStartForLevel(quizNavigator.currentLevel);

    const cont = p.select('#p5-container').elt;
    const side = Math.max(600, Math.min(cont.clientWidth || 600, 900));
    p.createCanvas(side, side);
    resizeCanvasAndBlockly(p);

    p.__ready = true; // mantener por compatibilidad
  };

  // Solo una definición (evita sobrescritura)
  p.windowResized = function () {
    resizeCanvasAndBlockly(p);
    if (window.workspace && typeof Blockly !== 'undefined' && Blockly.svgResize) {
      Blockly.svgResize(window.workspace);
    }
  };

  p.draw = function () {
    const nivelActual = quizNavigator.currentLevel;
    const mapaActual = levelCanvasObjects[nivelActual];
    canvasController.setMapa(mapaActual);
    canvasController.draw();
  };

  // ===== Helpers públicos =====
  p.resetBlockly = function () {
    if (typeof Blockly !== "undefined" && window.workspace) {
      window.workspace.clear();
      if (window.workspace.scrollCenter) window.workspace.scrollCenter();
    }
  };

  p.resetLaberinto = function (level) {
    // si te pasan un nivel, primero fíjalo y luego recalcula el inicio
    if (typeof level === "number" && !Number.isNaN(level) && quizNavigator) {
      quizNavigator.currentLevel = level;
    }
    jugador = computeStartForLevel(quizNavigator.currentLevel);
    if (typeof p.redraw === "function") p.redraw();
  };

  p.resetAll = function (level) {
    p.resetBlockly();
    p.resetLaberinto(level);
  };


}

// Exportar sketch para app.js
window.sketchTema2 = sketchTema2;
