function sketchTema2(p) {
    let board;
    let pawnImg;
    let gui = {
        "background": "#ffffff",
        "cellColor1": "#7689a0",
        "cellColor2": "#e7e8f3",
        "cellLength": 50,
        "pickedColor": "#3d6b4f",
        "pickedWidth": 3
    }

    // Variables para mostrar los valores
    let binaryDisplay, decimalDisplay, hexDisplay, dataTypeDisplay;

    class ChessBoard {
        constructor(colors, location, cellWidth, dimensions, pickedColor, pickedWidth, pieces) {
            this.colors = colors;
            this.location = location;
            this.cellWidth = cellWidth;
            this.dimensions = dimensions;
            this.pickedColor = pickedColor;
            this.pickedWidth = pickedWidth;
            this.pieces = pieces;
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
                    if (this.pieces[r][c]) {
                        const centerX = this.location[0] + c * this.cellWidth + this.cellWidth / 2;
                        const centerY = this.location[1] + r * this.cellWidth + this.cellWidth / 2;
                        
                        if (pawnImg) {
                            const imgSize = this.cellWidth * 0.8;
                            p.image(pawnImg, centerX - imgSize/2, centerY - imgSize/2, imgSize, imgSize);
                        } else {
                            p.fill(0);
                            p.textAlign(p.CENTER, p.CENTER);
                            p.textSize(this.cellWidth * 0.6);
                            p.text('P', centerX, centerY);
                        }
                    }
                }
            }
        }

        draw() {
            this.drawBoard();
            this.drawPieces();
        }

        isInsideBoard(x, y) {
            const boardX = this.location[0];
            const boardY = this.location[1];
            const boardWidth = this.dimensions[1] * this.cellWidth;
            const boardHeight = this.dimensions[0] * this.cellWidth;
            return (x >= boardX && x < boardX + boardWidth &&
                    y >= boardY && y < boardY + boardHeight);
        }

        togglePiece(row, col) {
            // Permitimos modificar todas las filas (0 a 7)
            this.pieces[row][col] = this.pieces[row][col] ? null : 'p';
            this.updateDisplays();
        }

        getBinaryString() {
            let binaryString = '';
            // Recorremos todas las filas y columnas en orden MSB (0,0) a LSB (7,7)
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    binaryString += this.pieces[r][c] ? '1' : '0';
                }
            }
            return binaryString;
        }

        getDecimalValue() {
            const binaryString = this.getBinaryString();
            // Usamos BigInt para manejar valores de 64 bits
            return BigInt('0b' + binaryString);
        }

        getHexValue() {
            const decimalValue = this.getDecimalValue();
            return '0x' + decimalValue.toString(16).toUpperCase();
        }

        getDataType() {
            const decimalValue = this.getDecimalValue();
            
            // Convertimos a número para las comparaciones (BigInt no funciona bien con comparaciones directas)
            const numericValue = Number(decimalValue);
            
            // Si no hay bits activos
            if (decimalValue === 0n) return "Ningún bit activo";
            
            // Para valores booleanos (solo el bit 0 activo, que vale 1)
            if (decimalValue === 1n) return "boolean";
            
            // Para valores de byte (8 bits)
            if (decimalValue <= 127n && decimalValue >= -128n) return "byte";
            
            // Para valores de short (16 bits)
            if (decimalValue <= 32767n && decimalValue >= -32768n) return "short";
            
            // Para valores de char (16 bits sin signo)
            //if (decimalValue <= 65535n && decimalValue >= 0n) return "char";
            
            // Para valores de int (32 bits)
            if (decimalValue <= 2147483647n && decimalValue >= -2147483648n) return "int o float";
            
            // Para valores de float (32 bits)
            if (decimalValue <= 340282346638528859811704183484516925440n && 
                decimalValue >= -340282346638528859811704183484516925440n) return "long o double";
            
            // Para valores de long (64 bits)
            if (decimalValue <= 9223372036854775807n && decimalValue >= -9223372036854775808n) return "long";
            
            // Para valores de double (64 bits)
            return "double";
        }

        updateDisplays() {
            const binaryString = this.getBinaryString();
            const decimalValue = this.getDecimalValue();
            const hexValue = this.getHexValue();
            const dataType = this.getDataType();
            
            if (binaryDisplay && decimalDisplay && hexDisplay && dataTypeDisplay) {
                binaryDisplay.html(binaryString);
                decimalDisplay.html(decimalValue.toString());
                hexDisplay.html(hexValue);
                dataTypeDisplay.html(dataType);
            }
        }
    }

    p.preload = () => {
        try {
            pawnImg = p.loadImage('assets/chess/pawn.png');
        } catch (e) {
            console.log("No se pudo cargar la imagen del peón, usando texto en su lugar");
        }
    };

    p.setup = () => {
        let canvas = p.createCanvas(gui.cellLength * 8 + 20, gui.cellLength * 8 + 20);
        canvas.parent('contenedor-sketch2');
        
        // Obtener referencias a los elementos de visualización
        binaryDisplay = p.select('#binary-value');
        decimalDisplay = p.select('#decimal-value');
        hexDisplay = p.select('#hex-value');
        dataTypeDisplay = p.select('#data-type');

        // Inicializar el tablero vacío
        const initialPieces = Array(8).fill().map(() => Array(8).fill(null));

        board = new ChessBoard(
            [gui.cellColor1, gui.cellColor2],
            [10, 10],
            gui.cellLength,
            [8, 8],
            gui.pickedColor,
            gui.pickedWidth,
            initialPieces
        );

        // Actualizar la visualización inicial
        board.updateDisplays();
    };

    p.draw = () => {
        p.background(220);
        board.draw();
    };

    p.mouseClicked = () => {
        if (board.isInsideBoard(p.mouseX, p.mouseY)) {
            const col = p.floor((p.mouseX - board.location[0]) / board.cellWidth);
            const row = p.floor((p.mouseY - board.location[1]) / board.cellWidth);
            board.togglePiece(row, col);
        }
    };
}

new p5(sketchTema2);