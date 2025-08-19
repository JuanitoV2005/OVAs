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