// --- FUNCIÓN PARA GENERAR O RESTAURAR LAS PREGUNTAS Y RESPUESTAS CORRECTAS DEL QUIZ ---
function generarQuiz2() {
    // --- CONFIGURACIÓN DE RANGOS ---
    const rangoQ1 = { min: 1, max: 127 }; // Para pregunta 1 (en 8 bits)
    const rangoQ2 = { min: -128, max: -1 }; // Para pregunta 2, ABS del rango negativo (en 8 bits)

    let quizData = localStorage.getItem("complemento_q2_numeros");

    if (quizData) {
        // Restaurar de localStorage
        quizData = JSON.parse(quizData);
    } else {
        // Generar nuevos números aleatorios
        const numQ1 = randomInRange(rangoQ1.min, rangoQ1.max);
        const numQ2 = randomInRange(rangoQ2.min, rangoQ2.max); // Número negativo para hacer resta
        const numQ3 = numQ1 + numQ2; // Suma de los números anteriores

        quizData = {
            q1: numQ1,
            q2: numQ2,
            q3: numQ3
        };

        // Guardar solo los números en localStorage
        localStorage.setItem("complemento_q2_numeros", JSON.stringify(quizData));
    }

    // Calcular las respuestas correctas a partir de los números actuales
    const respuestas = {
        q1: { valor: enteroAComplementoA2(quizData.q1, 8) }, // binario complemento a 2 en 8 bits
        q2: { valor: enteroAComplementoA2(quizData.q2, 8) }, // binario complemento a 2 en 8 bits
        q3: { valor: enteroAComplementoA2(quizData.q3, 8) }  // binario complemento a 2 en 8 bits
    };

    // Rellenar los números en el HTML
    document.getElementById("quiz2_q1_num").textContent = quizData.q1;
    document.getElementById("quiz2_q2_num").textContent = quizData.q2;
    document.getElementById("quiz2_q3_num").textContent = quizData.q3;

    // Hacer global las respuestas
    window.respuestasQ2 = respuestas;
}

// --- CREAR CANVAS INTERACTIVO ---
let canvasSumaQuiz2 = (p) => {
    let colorBackgroud = '#f8f9fa';
    // Variables de color para bits
    let colorZero = '#6c8ca0'; // gris azulado para 0
    let colorOne = '#444444';  // gris oscuro para 1
    let colorResult = '#00aa00'; // verde para el resultado
    let colorSymbols = "#000000";

    let bits1 = [0, 0, 0, 0, 0, 0, 0, 0]; // 0
    let bits2 = [0, 0, 0, 0, 0, 0, 0, 0]; // 0
    let sumBits = [0, 0, 0, 0, 0, 0, 0, 0]; // Resultado inicial de la suma
    let sum = 0; // Valor decimal de la suma
    let cellSize = 50;
    let cols = 8;

    p.setup = function () {
        let cnv = p.createCanvas(12 * cellSize, 4 * cellSize);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(22);
        p.textFont("Consolas");  // Fuente monoespaciada similar a la imagen

        cargarRespuestasGuardadas();
    }

    p.draw = function () {
        p.background(colorBackgroud);

        // Fila 1
        drawBits(bits1, 1.5 * cellSize, 1 * cellSize);
        p.fill(colorSymbols);
        p.text(`(${binToDec(bits1)})`, 10 * cellSize, 1 * cellSize);

        // Fila 2 con +
        p.fill(0, 0, 150);
        p.text("+", 0.75 * cellSize, 2 * cellSize);
        drawBits(bits2, 1.5 * cellSize, 2 * cellSize);
        p.fill(0);
        p.text(`(${binToDec(bits2)})`, 10 * cellSize, 2 * cellSize);

        // Línea divisoria
        p.stroke(0);
        p.line(0.5 * cellSize, 2.7 * cellSize, p.width - 0.5 * cellSize, 2.7 * cellSize);
        p.noStroke();

        // Resultado
        drawBits(sumBits, 1.5 * cellSize, (3 + 0.5) * cellSize, colorResult);
        p.text(`(${sum})`, 10 * cellSize, (3 + 0.5) * cellSize);
    }

    function drawBits(bits, startX, y, col) {
        for (let i = 0; i < bits.length; i++) {
            if (col) {
                p.fill(col);
            } else {
                p.fill(bits[i] === 0 ? colorZero : colorOne);
            }
            p.text(bits[i], startX + i * cellSize, y);
        }
    }

    function listToString(list) {
        return list.join("");
    }

    p.mousePressed = function () {
        // Verificar si el quiz ya fue validado
        const validado = localStorage.getItem("complemento_q2_validado") === "true";
        if (validado) return;

        // Verificar que el mouse está dentro del canvas
        let clickedInside = p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height;
        if (!clickedInside) return;

        // Detectar click en bits1 o bits2
        for (let row = 0; row < 2; row++) {
            for (let i = 0; i < 8; i++) {
                let cx = 1.5 * cellSize + i * cellSize;
                let cy = (row == 0 ? 1 * cellSize : 2 * cellSize);
                if (p.dist(p.mouseX, p.mouseY, cx, cy) < cellSize / 2) {
                    if (row == 0) bits1[i] = 1 - bits1[i];
                    if (row == 1) bits2[i] = 1 - bits2[i];
                }
            }
        }

        // Actualizar el valor de la suma
        sum = (binToDec(bits1) + binToDec(bits2)) | 0;
        sumBits = decToBin(sum);

        // Actualizar respuestas dentro del formulario
        // Obtén todos los inputs del formulario con la clase 'quiz-form'
        const formulario = document.getElementById('quiz2');
        const inputs = formulario.querySelectorAll('input[type="text"]');

        // Asigna valores a cada input
        inputs[0].value = listToString(bits1); // Para el input de la primera pregunta
        inputs[1].value = listToString(bits2); // Para el input de la segunda pregunta
        inputs[2].value = listToString(sumBits); // Para el input de la tercera pregunta

        // Guardar respuestas en localStorage
        guardarRespuestas('quiz2', window.respuestasQ2, 'complemento_q2_');

    }

    function binToDec(bits) {
        let n = parseInt(bits.join(""), 2);
        if (bits[0] == 1) { // negativo
            n = n - 256;
        }
        return n;
    }

    function decToBin(n) {
        let x = (n & 0xFF).toString(2).padStart(8, "0");
        return x.split("").map(b => parseInt(b));
    }

    // --- FUNCIÓN PARA CARGAR LAS RESPUESTAS DEL LOCAL STORAGE ---
    function cargarRespuestasGuardadas() {
        const respuestasGuardadas = localStorage.getItem('complemento_q2_respuestas');
        if (respuestasGuardadas) {
            const respuestas = JSON.parse(respuestasGuardadas);
            // Convertir las cadenas a listas de bits (números)
            if (respuestas.q1) {
                bits1 = respuestas.q1.split('').map(Number);
            }
            if (respuestas.q2) {
                bits2 = respuestas.q2.split('').map(Number);
            }
            if (respuestas.q3) {
                sumBits = respuestas.q3.split('').map(Number);
                // Recalcular la suma decimal para que el canvas la muestre correctamente
                sum = binToDec(sumBits);
            }

        }
    }
}

new p5(canvasSumaQuiz2, 'canvas-quiz2');