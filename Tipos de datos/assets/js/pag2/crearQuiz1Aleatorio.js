// --- CONFIGURACIÓN DE RANGOS ---
            const rangoQ1 = { min: 1, max: 200 }; // Para pregunta 1 (en 8 bits)
            const rangoQ3 = { min: 1, max: 15 };  // Para pregunta 3 (en 4 bits)

            // Función para generar un número aleatorio dentro de un rango
            function randomInRange(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
// --- FUNCIÓN PARA GENERAR O RESTAURAR LAS PREGUNTAS Y RESPUESTAS CORRECTAS DEL QUIZ ---
function generarQuiz1() {
    let quizData = localStorage.getItem("complemento_q1_numeros");

    if (quizData) {
        // Restaurar de localStorage
        quizData = JSON.parse(quizData);
    } else {
        // Generar nuevos números aleatorios
        const numQ1 = randomInRange(rangoQ1.min, rangoQ1.max);
        const numQ3 = randomInRange(rangoQ3.min, rangoQ3.max);

        quizData = {
            q1: numQ1,
            q3: numQ3
        };

        // Guardar solo los números en localStorage
        localStorage.setItem("complemento_q1_numeros", JSON.stringify(quizData));
    }

    // Calcular las respuestas a partir de los números actuales
    const respuestas = {
        q1: { valor: String((256 - quizData.q1) % 256) }, // complemento en 8 bits
        q2: { valor: String(16) },                        // fijo en este caso
        q3: { valor: String((16 - quizData.q3) % 16) }    // complemento en 4 bits
    };

    // Rellenar los números en el HTML
    document.getElementById("q1_num").textContent = quizData.q1;
    document.getElementById("q3_num").textContent = quizData.q3;

    // Hacer global las respuestas
    window.respuestasQ1 = respuestas;
}