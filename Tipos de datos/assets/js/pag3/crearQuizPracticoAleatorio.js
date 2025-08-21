function generarQuiz1() {
    // --- CONFIGURACIÓN DE RANGOS ---
    const rangoQ2 = { min: -64, max: -2 };  // Para pregunta 2 (byte)
    const rangoQ4 = { min: 64, max: 126 }; // Para pregunta 4 (byte)

    let quizData = localStorage.getItem("enteros_q1_numeros");

    if (quizData) {
        // Restaurar de localStorage
        quizData = JSON.parse(quizData);
    } else {
        // Generar nuevos números aleatorios
        const numQ2 = randomInRange(rangoQ2.min, rangoQ2.max);
        const numQ4 = randomInRange(rangoQ4.min, rangoQ4.max);

        quizData = {
            q2: numQ2,
            q4: numQ4
        };

        localStorage.setItem("enteros_q1_numeros", JSON.stringify(quizData));
    }

    // Calcular las respuestas dinámicas a partir de los números actuales
    const respuestas = {
        q1: { valor: enteroAComplementoA2(-32768, 16), filas: [8, 7] },
        q2: { valor: enteroAComplementoA2(quizData.q2, 8), filas: [6] },
        q3: { valor: enteroAComplementoA2(quizData.q2, 16), filas: [5, 4] }, // Mismo número del punto anterior, pero en short
        q4: { valor: enteroAComplementoA2(quizData.q4, 8), filas: [3] },
        q5: { valor: enteroAComplementoA2(quizData.q4, 16), filas: [2, 1] }  // Mismo número del punto anterior, pero en short
    };

    // Rellenar los números en el HTML
    document.getElementById("quiz1_q2_num").textContent = enteroAComplementoA2(quizData.q2, 8);
    document.getElementById("quiz1_q4_num").textContent = enteroAComplementoA2(quizData.q4, 8);

    // Hacer global las respuestas
    window.respuestasQ1 = respuestas;

    // Iniciar el sketch de p5
    new p5(sketchQuiz1, 'chessboardQuiz1');

}


// Función del canvas
function sketchQuiz1(p) {
    // -------- Creacion del canvas ---------
    let gui = {
        "background": "#ffffff",
        "cellColor1": "#b58863",
        "cellColor2": "#f0d9b5",
        "cellLength": 50,
    }

    const tableroVacio = Array(8).fill().map(() => Array(8).fill(null))

    // Colores disponibles de piezas y sus códigos
    const pawnCodes = ['pw', 'pg', 'pr', 'pb', 'pk'];
    const pieceImages = {};

    // Crear tablero
    const rows = 8, cols = 8;
    const pieces = Array.from({ length: rows }, () => Array(cols).fill(null));
    const assignedMap = [
        ['pg', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw'],
        ['pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw'],
        ['pr', 'pk', 'pk', 'pk', 'pk', 'pk', 'pk', 'pk'],
        ['pg', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw'],
        ['pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw'],
        ['pr', 'pk', 'pk', 'pk', 'pk', 'pk', 'pk', 'pk'],
        ['pg', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw'],
        ['pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw']
    ];

    // Al cargar, restaurar pieces desde localStorage si existe y no está validado
    const piecesGuardadas = localStorage.getItem("enteros_q1_pieces");
    const validado = localStorage.getItem("enteros_q1_validado") === "true";
    if (piecesGuardadas && !validado) {
        try {
            const restored = JSON.parse(piecesGuardadas);
            if (Array.isArray(restored) && restored.length === rows) {
                pieces = restored;
            }
        } catch (e) {
            // Si falla, ignora y usa el tablero vacío
        }
    }


    tablero1 = new ChessBoard(
        p,
        [gui.cellColor1, gui.cellColor2],
        [20, 20],
        gui.cellLength,
        [rows, cols],
        pieces,
        pieceImages // sin imágenes por ahora
    );

    tablero1.assignedCodeMap = assignedMap;

    p.preload = () => {
        try {
            // pieceImages.pawnImg = p.loadImage('assets/chess/pawn.png');
            for (let code of pawnCodes) {
                let color = code[1];
                let name = code[0] === 'p' ? 'pawn' : 'unknown';
                pieceImages[code] = p.loadImage(`../assets/img/chess/${name}-${color}.png`);
            }
        } catch (e) {
            console.error("Error loading images: ", e);
            alert("Could not load one or more chess piece images. Check paths in p.preload().");
        }
    };

    // --------- Lógica de interacción ---------
    p.setup = function () {
        const canvas = p.createCanvas(gui.cellLength * 8 + 50, gui.cellLength * 8 + 40);

        // Restaurar pieces desde localStorage si existe
        const piecesGuardadas = localStorage.getItem("enteros_q1_pieces");
        const validado = localStorage.getItem("enteros_q1_validado") === "true";
        if (piecesGuardadas) {
            try {
                const restored = JSON.parse(piecesGuardadas);
                if (Array.isArray(restored) && restored.length === rows) {
                    tablero1.pieces = restored;
                }
            } catch (e) {
                // Si falla, ignora
            }
        }
    }
    p.draw = function () {
        tablero1.draw();
    };


    p.mousePressed = function () {
        const validado = localStorage.getItem("enteros_q1_validado") === "true";
        if (validado) {
            return;
        }

        clicked = tablero1.mousePressed();
        if (!clicked) {
            return;
        }

        // Guardar el estado actual de pieces en localStorage
        localStorage.setItem("enteros_q1_pieces", JSON.stringify(tablero1.pieces));

        // Diccionario para guardar respuestas
        let respuestasGuardadas = JSON.parse(localStorage.getItem("enteros_q1_respuestas") || "{}");

        let decimalesGuardados = JSON.parse(localStorage.getItem("enteros_q1_decimales") || "{}");

        // Recorrer todas las preguntas y actualizar el input y el decimal si tiene filas
        for (let key in respuestasQ1) {
            const obj = respuestasQ1[key];
            if (Array.isArray(obj.filas) && obj.filas.length > 0) {
                const input = document.querySelector(`input[name="${key}"]`);
                if (input) {
                    const binStr = tablero1.getBinaryString(obj.filas);
                    input.value = binStr;
                    respuestasGuardadas[key] = binStr;

                    // Actualiza el decimal debajo del input si existe
                    const decimalDiv = document.getElementById("decimal-" + key);
                    if (decimalDiv) {
                        let decimalText;
                        try {
                            decimalText = "Decimal: " + binarioAEntero(binStr);
                        } catch {
                            decimalText = "Decimal: (inválido)";
                        }
                        decimalDiv.textContent = decimalText;
                        decimalesGuardados[key] = decimalText;
                    }
                }
            }
        }

        // Guardar todas las respuestas en localStorage bajo el prefijo
        localStorage.setItem("enteros_q1_respuestas", JSON.stringify(respuestasGuardadas));
        localStorage.setItem("enteros_q1_decimales", JSON.stringify(decimalesGuardados));
    };

};
