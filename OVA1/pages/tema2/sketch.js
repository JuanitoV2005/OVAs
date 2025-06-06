function sketchTema2(p) {
  let angle;

  p.reset = () => {
    angle = 0; // Estado inicial
  };

  p.setup = function () {
    p.createCanvas(400, 200);
    p.angleMode(p.DEGREES);
    p.reset();
  };

  p.draw = function () {
    p.background(30);
    p.translate(p.width / 2, p.height / 2);
    p.rotate(angle);
    p.fill(0, 255, 255);
    p.rectMode(p.CENTER);
    p.rect(0, 0, 100, 100);
    angle += 3;
    if (angle >= 360) angle = 0; // Reinciar ángulo
  };
}
