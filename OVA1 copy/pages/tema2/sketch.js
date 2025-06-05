// chessSketch.js
// const sketchTema2 = (p) => {
function sketchTema2 (p) {
    let board;
    let pawnImg, knightImg, bishopImg, rookImg, queenImg, kingImg;
    let gui = {
    "background":"#ffffff",
    "cellColor1":"#7689a0",
    "cellColor2":"#e7e8f3",
    "cellLength":50,
    "pickedColor":"#3d6b4f",
    "pickedWidth":3
    }

    // Clase ChessBoard
    class ChessBoard {
        constructor(colors, location, cellWidth, dimensions, pickedColor, pickedWidth, pieces) {
            this.colors = colors; // [color1, color2]
            this.location = location; // [x, y] - Top-left corner position
            this.cellWidth = cellWidth;
            this.dimensions = dimensions; // [rows, columns]
            this.pickedPiece = null; // null if no piece is picked, otherwise [row, col]
            this.pickedColor = pickedColor; // e.g., "#FF0000"
            this.pickedWidth = pickedWidth; // stroke weight for the picked piece
            this.pieces = pieces; // 2D array representing the board pieces
            this.initialStatePieces = pieces;
        }

        drawBoard() {
            for (let r = 0; r < this.dimensions[0]; r++) {
                for (let c = 0; c < this.dimensions[1]; c++) {
                    const x = this.location[0] + c * this.cellWidth;
                    const y = this.location[1] + r * this.cellWidth;
                    const colorIndex = (r + c) % 2;
                    p.fill(this.colors[colorIndex]);
                    p.noStroke();
                    p.rect(x, y, this.cellWidth, this.cellWidth);
                }
            }
        }

        drawPieces() {
            for (let r = 0; r < this.dimensions[0]; r++) {
                for (let c = 0; c < this.dimensions[1]; c++) {
                    const pieceChar = this.pieces[r][c];
                    if (pieceChar) { // If there's a piece in this cell
                        const centerX = this.location[0] + c * this.cellWidth + this.cellWidth / 2;
                        const centerY = this.location[1] + r * this.cellWidth + this.cellWidth / 2;

                        let img;
                        switch (pieceChar.toLowerCase()) {
                            case 'p': img = pawnImg; break;
                            // case 'k': img = knightImg; break;
                            // case 'b': img = bishopImg; break;
                            // case 'r': img = rookImg; break;
                            // case 'q': img = queenImg; break;
                            // case 'l': img = kingImg; break; // 'l' for king (rey)
                            // Add more cases for other pieces (e.g., 'B' for black bishop if separate images)
                            default: continue; // Skip if unknown piece character
                        }

                        if (img) {
                            // Calculate image size to fit within the cell
                            let imgWidth, imgHeight;
                            const aspectRatio = img.width / img.height;

                            if (img.width > img.height) {
                                imgWidth = this.cellWidth * 0.8; // 80% of cell width
                                imgHeight = imgWidth / aspectRatio;
                            } else {
                                imgHeight = this.cellWidth * 0.8; // 80% of cell height
                                imgWidth = imgHeight * aspectRatio;
                            }

                            // Ensure it doesn't exceed cell dimensions
                            if (imgWidth > this.cellWidth) {
                                imgWidth = this.cellWidth;
                                imgHeight = imgWidth / aspectRatio;
                            }
                            if (imgHeight > this.cellWidth) {
                                imgHeight = this.cellWidth;
                                imgWidth = imgHeight * aspectRatio;
                            }

                            // Draw image centered in the cell
                            p.image(img, centerX - imgWidth / 2, centerY - imgHeight / 2, imgWidth, imgHeight);
                        }
                    }
                }
            }
        }

        draw() {
            this.drawBoard();

            // If a piece is picked, draw a border around its cell
            if (this.pickedPiece) {
                const [r, c] = this.pickedPiece;
                const x = this.location[0] + c * this.cellWidth;
                const y = this.location[1] + r * this.cellWidth;
                p.noFill();
                p.stroke(this.pickedColor);
                p.strokeWeight(this.pickedWidth);
                p.rect(x, y, this.cellWidth, this.cellWidth);
            }

            this.drawPieces();
        }

        
        // Example method to handle a piece being picked (can be called on mouse click)
        pickPiece(row, col) {
            if (row >= 0 && row < this.dimensions[0] && col >= 0 && col < this.dimensions[1] && this.pieces[row][col] != null) {
                this.pickedPiece = [row, col];
            } else {
                this.clearPickedPiece();
            }
        }

        // Example method to clear the picked piece
        clearPickedPiece() {
            this.pickedPiece = null;
        }

        isInsideBoard(x,y){
            const boardX = this.location[0];
            const boardY = this.location[1];
            const boardWidth = this.dimensions[1] * this.cellWidth;
            const boardHeight = this.dimensions[0] * this.cellWidth;

            return (x >= boardX && x < boardX + boardWidth &&
                    y >= boardY && y < boardY + boardHeight);
        }

        isValidMove(endRow, endCol) {
            // 1. Validaciones básicas:
            let startRow = this.pickedPiece[0];
            let startCol = this.pickedPiece[1];

            const piece = this.pieces[startRow][startCol];
            if (piece === null) { // No hay pieza en la casilla de inicio
                return false;
            }

            // No mover a la misma casilla
            if (startRow === endRow && startCol === endCol) {
                return false;
            }

            let targetPiece = this.pieces[endRow][endCol];

            // Lógica para el PEÓN NEGRO ('p')
            if (piece === 'p') {
                const rowDiff = endRow - startRow; // Diferencia en filas (positivo = avance para negras
                const colDiff = Math.abs(endCol - startCol); // Diferencia absoluta en columnas
                // Avance de una casilla
                if (rowDiff === 1 && colDiff === 0) {
                    // Debe ser una casilla vacía
                    return targetPiece === null;
                }
                

                // Avance de dos casillas (solo desde la fila inicial del peón negro, que asumimos es la fila 1)
                if (startRow === 1 && rowDiff === 2 && colDiff === 0) {
                    // La casilla intermedia (fila 2, misma columna) y la casilla final deben estar vacías
                    const middleCellEmpty = this.pieces[startRow + 1][startCol] === null;
                    const targetCellEmpty = targetPiece === null;
                    return middleCellEmpty && targetCellEmpty;
                }

                // // Captura diagonal
                // if (rowDiff === 1 && colDiff === 1) {
                //     // Debe haber una pieza en la casilla de destino y debe ser una pieza blanca (oponente)
                //     // Aquí asumimos que las piezas blancas son mayúsculas ('P', 'R', etc.)
                //     return targetPiece !== null && targetPiece === targetPiece.toUpperCase() && targetPiece !== targetPiece.toLowerCase();
                // }

                // Si no es ninguno de los movimientos válidos para un peón negro
                return false;
            }

            // --- Lógica para otras piezas (si las tienes implementadas) ---
            // else if (piece === 'P') { // Peón blanco
            //     // Lógica para peón blanco
            // }
            // else if (piece === 'r' || piece === 'R') { // Torre
            //     // Lógica para torre
            // }
            // ... etc.

            // Si la pieza no es un peón negro (y no se ha implementado otra lógica),
            // o si el movimiento no es válido para el peón negro.
            return false;
        }

        movePickedPieceTo(row,col){
            let piece = this.pieces[this.pickedPiece[0]][this.pickedPiece[1]];
            this.pieces[this.pickedPiece[0]][this.pickedPiece[1]] = null;
            this.pieces[row][col] = piece;
            this.clearPickedPiece();
        }

        interact(mouseX, mouseY){
            // 1. Validaciones básicas:
            if (!this.isInsideBoard(mouseX, mouseY)) {
                this.clearPickedPiece()
                return;
            }
            const boardX = board.location[0];
            const boardY = board.location[1];
            const col = p.floor((mouseX - boardX) / board.cellWidth);
            const row = p.floor((mouseY - boardY) / board.cellWidth);
            
            if (this.pickedPiece === null) { // Puede seleccionar una pieza
                // Caso 1: No hay pieza seleccionada actualmente
                // Solo se puede seleccionar una celda si no es nula (contiene una pieza)
                this.pickPiece(row, col);
                return;
            }
            // Caso 2: Hay una pieza seleccionada y la casilla actual no está vacía
            if (this.pieces[row][col] !== null) {
                // Intercambia pieza seleccionada por pieza de la casilla actual
                this.pickPiece(row, col);
                return;
            }
            // Caso 3: Hay una pieza seleccionada y la casilla actual no contiene una pieza
            // Revisar si la pieza puede moverse a la casilla actual
            if(this.isValidMove(row,col)){
                this.movePickedPieceTo(row,col);
            }
            // Caso 4: El movimiento de la pieza no es válido -> deselecciona la pieza actual
            this.clearPickedPiece();
        };
    }

    p.preload = () => {
        // Carga tus imágenes aquí. Asegúrate de que las rutas sean correctas.
        // Asume que tienes las imágenes en una carpeta 'assets' o similar.
        try {
            pawnImg = p.loadImage('assets/chess/pawn.png');
            // knightImg = p.loadImage('assets/chess/knight.png');
            // bishopImg = p.loadImage('assets/chess/bishop.png');
            // rookImg = p.loadImage('assets/chess/rook.png');
            // queenImg = p.loadImage('assets/chess/queen.png');
            // kingImg = p.loadImage('assets/chess/king.png');
        } catch (e) {
            console.error("Error loading images: ", e);
            alert("Could not load one or more chess piece images. Check paths in p.preload().");
        }
    };

    p.setup = () => {
        p.createCanvas(gui.cellLength * 8+20, gui.cellLength * 8+20); // Tamaño del canvas
        // Inicialización de la matriz de piezas (ejemplo de un tablero inicial)
        const initialPieces = [
            [null, null, null, null, null, null, null, null],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null], // Usar mayúsculas para piezas blancas si quieres diferenciar
            [null, null, null, null, null, null, null, null]
        ];
        // Nota: para un juego real, necesitarías cargar imágenes separadas para piezas blancas y negras,
        // o usar una convención para el caracter (ej. 'p' minúscula para negras, 'P' mayúscula para blancas).
        // Para este ejemplo, estamos usando solo 'p' y 'P' para peones, y el resto en minúsculas.
        // Si no tienes imágenes separadas, las piezas 'P' se verán iguales a 'p'.

        // Inicializa la instancia del tablero
        board = new ChessBoard(
            [gui.cellColor1, gui.cellColor2], // Colores del tablero
            [10, 10], // Posición de la esquina superior izquierda [x, y]
            gui.cellLength, // Ancho de celda
            [8, 8], // Dimensiones [filas, columnas]
            gui.pickedColor, // pickedColor (rojo)
            gui.pickedWidth, // pickedWidth (grosor del borde)
            initialPieces
        );

        // Ejemplo: Simular que la pieza en [1, 0] (un peón) está seleccionada
        board.pickPiece(1, 0);
        
        board.interact(p.mouseX, p.mouseY);
    };

    p.draw = () => {
        p.background(220); // Color de fondo del canvas
        board.draw(); // Llama al método draw del tablero
    };

    // Puedes añadir eventos de ratón aquí si quieres interactuar con el tablero
    // p.mouseClicked = () => {
    //     board.interact(p.mouseX, p.mouseY);
    //     console.log("Clicked at (" + p.mouseX + ", " + p.mouseY + ")");
    //     // Lógica para determinar qué celda fue clickeada y actualizar pickedPiece
    // };
    // Añade este método dentro de la constante chessSketch = (p) => { ... }
// Justo después del p.draw = () => { ... }
p.mouseClicked = () => {
    // Calcula la fila y columna de la celda donde se hizo clic
    let mouseX = p.mouseX;
    let mouseY = p.mouseY;
    board.interact(mouseX, mouseY);
    return;
};
p.touchStarted = () => {
    // Calcula la fila y columna de la celda donde se hizo clic
    let mouseX = p.mouseX;
    let mouseY = p.mouseY;
    board.interact(mouseX, mouseY);
    return;
};

//     p.reset = () => {
//         board.pieces = board.initialStatePieces;
//         board.clearPickedPiece();
//   };
};

// Crea una nueva instancia de P5 y asóciala con un elemento HTML (opcional, si quieres un canvas específico)
// Si no especificas un elemento, P5 creará un canvas dentro del <body>
// new p5(sketchTema2);

// Para tener un canvas específico en el HTML, crea un div con un ID:
// <div id="my-chess-container"></div>
// Y luego en JavaScript:
// new p5(chessSketch, 'my-chess-container');