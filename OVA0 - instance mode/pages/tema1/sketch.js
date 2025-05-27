function sketchTema1(p) {
  let x;

  p.reset = () => {
    x = 0; // Estado inicial
  };

  p.setup = function () {
    p.createCanvas(400, 200);
    p.reset();
  };

  p.draw = function () {
    p.background(220);
    p.fill(255, 0, 0);
    p.ellipse(x, p.height / 2, 50);
    x += 2;
    if (x > p.width) x = p.width; // Vuelve a empezar al pasar el borde
  };
}
