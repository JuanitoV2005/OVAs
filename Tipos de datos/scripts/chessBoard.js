class ChessBoard {
    constructor(p, colors, location, cellWidth, dimensions, pieces, pieceImages) {
        this.p = p;
        this.colors = colors;
        this.location = location;
        this.cellWidth = cellWidth;
        this.dimensions = dimensions;
        this.pieces = pieces;
        this.pieceImages = pieceImages;

        this.assignedCodeMap = Array.from({ length: dimensions[0] }, () =>
            Array(dimensions[1]).fill(null)
        );

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
                const colorIndex = (r + c) % 2;
                this.p.fill(this.colors[colorIndex]);

                this.p.noStroke();
                this.p.rect(x, y, this.cellWidth, this.cellWidth);
            }

            const y = this.location[1] + r * this.cellWidth + this.cellWidth / 2;
            const rowNumber = this.dimensions[0] - r;
            const leftX = this.location[0] - 10;
            const rightX = this.location[0] + this.dimensions[1] * this.cellWidth + 10;

            this.p.textSize(15);
            this.p.fill(0);
            this.p.noStroke();
            this.p.textAlign(this.p.RIGHT, this.p.CENTER);
            this.p.text(rowNumber, leftX, y);
            this.p.textAlign(this.p.LEFT, this.p.CENTER);
            this.p.text(rowNumber, rightX, y);
        }

        this.p.stroke(255);
        this.p.strokeWeight(3);
    }

    drawPieces() {
        for (let r = 0; r < this.dimensions[0]; r++) {
            for (let c = 0; c < this.dimensions[1]; c++) {
                const pieceCode = this.pieces[r][c];
                if (pieceCode) {
                    const centerX = this.location[0] + c * this.cellWidth + this.cellWidth / 2;
                    const centerY = this.location[1] + r * this.cellWidth + this.cellWidth / 2;
                    const img = this.pieceImages[pieceCode];

                    if (img) {
                        const imgSize = this.cellWidth * 0.8;
                        this.p.image(img, centerX - imgSize / 2, centerY - imgSize / 2, imgSize, imgSize);
                    } else {
                        this.p.fill(0);
                        this.p.textAlign(this.p.CENTER, this.p.CENTER);
                        this.p.textSize(this.cellWidth * 0.4);
                        this.p.text(pieceCode, centerX, centerY);
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
        return (
            x >= boardX && x < boardX + boardWidth &&
            y >= boardY && y < boardY + boardHeight
        );
    }

    togglePiece(row, col) {
        const assignedCode = this.assignedCodeMap[row][col];
        if (!assignedCode) return; // No hace nada si no hay código asignado

        this.pieces[row][col] = this.pieces[row][col] ? null : assignedCode;
        this.updateDisplays?.();
    }

    mousePressed(mouseX, mouseY) {
        if (this.isInsideBoard(this.p.mouseX, this.p.mouseY)) {
            const col = this.p.floor((this.p.mouseX - this.location[0]) / this.cellWidth);
            const row = this.p.floor((this.p.mouseY - this.location[1]) / this.cellWidth);
            this.togglePiece(row, col);
        }
    }

    // Modficada para aceptar filas:

    getBinaryString(boardRows) { // Board Rows es un array de filas
    let binaryString = '';

    // Si no se pasan filas, recorrer todo el tablero
    if (!Array.isArray(boardRows) || boardRows.length === 0) {
        for (let r = 0; r < this.dimensions[0]; r++) {
        for (let c = 0; c < this.dimensions[1]; c++) {
            binaryString += this.pieces[r][c] ? '1' : '0';
        }
        }
        return binaryString;
    }

    // Si se pasan filas específicas (en base 1), ordenarlas de mayor a menor
    const sortedRows = boardRows.slice().sort((a, b) => b - a);

    for (let i = 0; i < sortedRows.length; i++) {
        const row = this.dimensions[0]- sortedRows[i]; // Convertir índice humano (1–8) a base 0 e invertido respecto a la matriz this.pieces
        for (let c = 0; c < this.dimensions[1]; c++) {
        binaryString += this.pieces[row][c] ? '1' : '0';
        }
    }

    return binaryString;
    }

    getDecimalValue() {
        return BigInt('0b' + this.getBinaryString());
    }

    getHexValue() {
        const decimalValue = this.getDecimalValue();
        return '0x' + decimalValue.toString(16).toUpperCase();
    }

    getDataType() {
        const val = this.getDecimalValue();
        if (val === 0n) return "Ningún bit activo";
        if (val === 1n) return "boolean";
        if (val <= 127n && val >= -128n) return "byte";
        if (val <= 32767n && val >= -32768n) return "short";
        if (val <= 2147483647n && val >= -2147483648n) return "int o float";
        if (val <= 340282346638528859811704183484516925440n &&
            val >= -340282346638528859811704183484516925440n) return "long o double";
        if (val <= 9223372036854775807n && val >= -9223372036854775808n) return "long";
        return "double";
    }

    _formatBinary(bin) {
        return bin.replace(/(.{8})/g, '$1 ').trim();
    }

    _formatHex(hex) {
        const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
        return '0x' + clean.replace(/(.{2})/g, '$1 ').trim();
    }

    _formatDecimal(dec) {
        return dec.toLocaleString('en-US').replace(/,/g, ' ');
    }

    resetBoardAndDisplays() {
        for (let r = 0; r < this.dimensions[0]; r++) {
            for (let c = 0; c < this.dimensions[1]; c++) {
                this.pieces[r][c] = null;
            }
        }
    }
}