
class ChessBoard {
    constructor(p,colors, location, cellWidth, dimensions, pieces, pieceImages, playableRange) {
        this.p = p;
        this.colors = colors; // [color1, color2]
        this.location = location; // [x, y] - Top-left corner position
        this.cellWidth = cellWidth;
        this.dimensions = dimensions; // [rows, columns]
        this.pickedPiece = null; // null if no piece is picked, otherwise [row, col]
        this.pieces = pieces;// 2D array representing the board pieces
        this.pieceImages = pieceImages;
        this.playableRange = { ...playableRange }; // minR, maxR, minC, maxC

        // Variables para mostrar displays:
        this.binaryDisplay = this.p.select('#binary-value');
        this.decimalDisplay = this.p.select('#decimal-value'); 
        this.hexDisplay = this.p.select('#hex-value');
        this.dataTypeDisplay = this.p.select('#data-type'); 

    }

    drawBoard() {
        for (let r = 0; r < this.dimensions[0]; r++) {
            for (let c = 0; c < this.dimensions[1]; c++) {
                const x = this.location[0] + c * this.cellWidth;
                const y = this.location[1] + r * this.cellWidth;

                // Cambia el color de relleno basado en si la celda es jugable
                if (this.isInPlayableRange(r, c)) {
                    const colorIndex = (r + c) % 2;
                    this.p.fill(this.colors[colorIndex]);
                    
                } else {
                    // Colores alternos para celdas no jugables (como un tablero de ajedrez)
                    if ((r + c) % 2 === 0) {
                        this.p.fill(200, 200, 200); // Gris oscuro
                    } else {
                        this.p.fill(240, 240, 240); // Gris claro
                    }
                }
                this.p.noStroke();
                this.p.rect(x, y, this.cellWidth, this.cellWidth);
            }
        }

        // Adicionalmente, dibujar rectángulo que encierra el área jugable
        const playableX = this.location[0] + this.playableRange.minC * this.cellWidth;
        const playableY = this.location[1] + this.playableRange.minR * this.cellWidth;

        const playableWidth = (this.playableRange.maxC - this.playableRange.minC + 1) * this.cellWidth;
        const playableHeight = (this.playableRange.maxR - this.playableRange.minR + 1) * this.cellWidth;

        // Configura el color y grosor del borde
        this.p.stroke(255);      // Color blanco para el borde
        this.p.strokeWeight(3);  // Grosor de 3 píxeles

        this.p.noFill();         // Asegúrate de que el rectángulo no tenga relleno

        // Dibuja el rectángulo que encierra el área jugable
        this.p.rect(playableX, playableY, playableWidth, playableHeight);
    }

    drawPieces() {
        for (let r = 0; r < this.dimensions[0]; r++) {
            for (let c = 0; c < this.dimensions[1]; c++) {
                if (this.pieces[r][c]) {
                    const centerX = this.location[0] + c * this.cellWidth + this.cellWidth / 2;
                    const centerY = this.location[1] + r * this.cellWidth + this.cellWidth / 2;
                    
                    if (this.pieceImages.pawnImg) {
                        const imgSize = this.cellWidth * 0.8;
                        this.p.image(this.pieceImages.pawnImg, centerX - imgSize/2, centerY - imgSize/2, imgSize, imgSize);
                    } else {
                        this.p.fill(0);
                        this.p.textAlign(this.p.CENTER, this.p.CENTER);
                        this.p.textSize(this.cellWidth * 0.6);
                        this.p.text('P', centerX, centerY);
                    }
                }
            }
        }
    }

    draw() {
        this.drawBoard();
        this.drawPieces();
    }

    isInPlayableRange(r, c) {
        return (
            r >= this.playableRange.minR &&
            r <= this.playableRange.maxR &&
            c >= this.playableRange.minC &&
            c <= this.playableRange.maxC
        );
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
    // -------- Inicio funciones para updateDisplay con separación de cifras ---------
    /**
     * Formatea una cadena binaria para insertar espacios cada 8 bits (1 byte).
     * @param {string} binaryString - La cadena binaria sin formato.
     * @returns {string} La cadena binaria formateada con espacios.
     */
    _formatBinary(binaryString) {
        return binaryString.replace(/(.{8})/g, '$1 ').trim();
    }

    /**
     * Formatea una cadena hexadecimal para insertar espacios cada 2 dígitos.
     * @param {string} hexString - La cadena hexadecimal (incluyendo el "0x").
     * @returns {string} La cadena hexadecimal formateada con espacios.
     */
    _formatHex(hexString) {
        const hexWithoutPrefix = hexString.startsWith('0x') ? hexString.substring(2) : hexString;
        const formatted = hexWithoutPrefix.replace(/(.{2})/g, '$1 ').trim();
        return '0x' + formatted;
    }

    /**
     * Formatea un número decimal para insertar espacios cada 3 dígitos.
     * @param {BigInt} decimalValue - El valor decimal (puede ser BigInt).
     * @returns {string} La cadena decimal formateada con espacios.
     */
    _formatDecimal(decimalValue) {
        let formatted = decimalValue.toLocaleString('en-US'); // Usa comas como separador de miles
        formatted = formatted.replace(/,/g, ' '); // Reemplaza comas por espacios
        return formatted;
    }

    // --- MÉTODO updateDisplays() ahora usa los métodos auxiliares ---
    updateDisplays() {
        const binaryString = this.getBinaryString();
        const decimalValue = this.getDecimalValue();
        const hexValue = this.getHexValue();
        const dataType = this.getDataType();

        // Aplicamos el formato usando los métodos auxiliares de la clase
        const formattedBinary = this._formatBinary(binaryString);
        const formattedDecimal = this._formatDecimal(decimalValue);
        const formattedHex = this._formatHex(hexValue);

        if (this.binaryDisplay && this.decimalDisplay && this.hexDisplay && this.dataTypeDisplay) {
            this.binaryDisplay.html(formattedBinary);
            this.decimalDisplay.html(formattedDecimal);
            this.hexDisplay.html(formattedHex);
            this.dataTypeDisplay.html(dataType);
        } else {
            console.warn("One or more display elements for ChessBoard not found in DOM for updateDisplays.");
        }
    }

    // -------- Fin funciones para updateDisplay con separación de cifras ---------

    mousePressed(mouseX, mouseY) {
        if (this.isInsideBoard(this.p.mouseX, this.p.mouseY)) {
            const col = this.p.floor((this.p.mouseX - this.location[0]) / this.cellWidth);
            const row = this.p.floor((this.p.mouseY - this.location[1]) / this.cellWidth);
            if(this.isInPlayableRange(row, col)){
                this.togglePiece(row, col);
                this.updateDisplays();
            }
            
        }
    }
}