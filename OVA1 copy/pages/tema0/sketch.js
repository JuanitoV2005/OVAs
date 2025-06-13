function sketchTema0(p, CirculoAnimadoClass) {
  let miCirculo;

  p.setup = () => {
    console.log(`[sketchTema0 - p.setup] Iniciando setup para sketchTema0.`);
    console.log(`[sketchTema0 - p.setup] typeof CirculoAnimado: ${typeof CirculoAnimado}`);

    p.createCanvas(400, 200);
    miCirculo = new CirculoAnimado(p, 50, 100, 20, 2);
  };

  p.draw = () => {
    p.background(240);
    miCirculo.mover();
    miCirculo.dibujar();
  };
};

// // Iniciar el sketch en su contenedor
// temas.tema0.instancia = new p5(sketchTema0, temas.tema0.container);
