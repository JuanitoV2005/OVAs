function sketchTema2(p) {
  let angle;

  p.reset = () => {
    angle = 0;
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
    p.reset();
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = function () {
    const backgroundColor = p.windowWidth < 600 ? 255 : 0;
    p.background(backgroundColor);
    
    p.translate(p.width / 2, p.height / 2);
    p.rotate(angle);
    
    p.fill(0, 255, 255);
    p.rectMode(p.CENTER);
    p.rect(0, 0, 100, 100);
    
    angle += 3;
    if (angle >= 360) angle = 0;
  };
}
