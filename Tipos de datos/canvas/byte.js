// Colores disponibles y sus códigos
const pawnCodes = ['pw', 'pg', 'pr', 'pb','pk']; // w: white, g: green, etc.

const sketch1 = (p) => {
  let board;
  const rows = 8;
  const cols = 8;
  const cellWidth = 60;
  const location = [25, 25];
  const colors = ['#f0d9b5', '#b58863'];

  const pieceImages = {};
  const pieces = Array.from({ length: rows }, () => Array(cols).fill(null));
  const playableRange = { minR: 0, maxR: 7, minC: 0, maxC: 7 };

  p.preload = () => {
    for (let code of pawnCodes) {
      let color = code[1];
      let name = code[0] === 'p' ? 'pawn' : 'unknown';
      pieceImages[code] = p.loadImage(`assets/chess/${name}-${color}.png`);
    }
  };

  p.setup = () => {
    const canvas = p.createCanvas(cols * cellWidth+100, rows * cellWidth+100);
    canvas.parent('byte-canvas');

    // Coloca 10 peones aleatoriamente en el tablero
    let count = 0;
    while (count < 10) {
      let r = p.floor(p.random(rows));
      let c = p.floor(p.random(cols));
      if (!pieces[r][c]) {
        let code = p.random(pawnCodes);
        pieces[r][c] = code;
        count++;
      }
    }

    board = new ChessBoard(p, colors, location, cellWidth, [rows, cols], pieces, pieceImages, playableRange);
    p.noLoop();
  };

  p.draw = () => {
    p.background(255);
    board.drawBoard();
    board.drawPieces();
  };

//   function drawBoard() {
//     for (let r = 0; r < rows; r++) {
//       for (let c = 0; c < cols; c++) {
//         const x = location[0] + c * cellWidth;
//         const y = location[1] + r * cellWidth;
//         const isLight = (r + c) % 2 === 0;
//         p.fill(isLight ? colors[0] : colors[1]);
//         p.noStroke();
//         p.rect(x, y, cellWidth, cellWidth);
//       }
//     }
//   }
};

// Instancia de p5
new p5(sketch1);
