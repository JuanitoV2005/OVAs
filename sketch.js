let variables = [
  {
    nombre: "x",
    valor: 5,
    tipo: "int",
    bits: "0000000000000101"
  },
  {
    nombre: "y",
    valor: 7,
    tipo: "int",
    bits: "0000000000000111"
  }
];

function setup() {
  let canvas = createCanvas(300, 450);
  canvas.parent("canvasContainer");
  noLoop();
}

function draw() {
  background(255);
  textSize(16);
  fill(0);
  text("Visualización de variables:", 10, 30);

  let y = 70;
  variables.forEach(v => {
    fill(70, 130, 180);
    ellipse(40, y, 40);
    fill(255);
    textAlign(CENTER, CENTER);
    text(v.nombre, 40, y);
    fill(0);
    textAlign(LEFT, CENTER);
    text(`= ${v.valor} (${v.bits})`, 80, y);
    y += 80;
  });
}
