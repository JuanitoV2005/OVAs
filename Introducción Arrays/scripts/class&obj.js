function sketchTema3(p) {
  let objetoActual;
  let botones = [];

  const herramientas = [
    {
      nombre: "Espada de Madera",
      atributos: { danio: 4, durabilidad: 60 },
      metodo: function () {
        this.atributos.durabilidad -= 10;
        return "⚡ Ataque realizado con " + this.nombre;
      },
    },
    {
      nombre: "Espada de Hierro",
      atributos: { danio: 6, durabilidad: 250 },
      metodo: function () {
        this.atributos.durabilidad -= 8;
        return "⚔ Golpe contundente con " + this.nombre;
      },
    },
    {
      nombre: "Espada de Diamante",
      atributos: { danio: 8, durabilidad: 1561 },
      metodo: function () {
        this.atributos.durabilidad -= 5;
        return "🔥 Corte preciso con " + this.nombre;
      },
    },
  ];

  p.setup = function () {
    p.createCanvas(500, 400);
    p.textFont("Arial");
    p.textAlign(p.CENTER);
    objetoActual = herramientas[0];

    const opciones = ["Espada de Madera", "Espada de Hierro", "Espada de Diamante"];
    opciones.forEach((nombre, index) => {
      const btn = p.createButton(nombre);
      btn.position(20, 20 + index * 35);
      btn.mousePressed(() => {
        objetoActual = herramientas[index];
      });
      botones.push(btn);
    });

    const atacarBtn = p.createButton("Usar método: atacar()");
    atacarBtn.position(20, 140);
    atacarBtn.mousePressed(() => {
      resultado = objetoActual.metodo();
    });
    botones.push(atacarBtn);
  };

  let resultado = "";

  p.draw = function () {
    p.background("#f0f4ff");
    p.fill(30);
    p.textSize(18);
    p.text("Objeto instanciado: " + objetoActual.nombre, 320, 40);

    p.textSize(16);
    p.text("Atributos:", 320, 80);
    p.text("- Daño: " + objetoActual.atributos.danio, 320, 110);
    p.text("- Durabilidad: " + objetoActual.atributos.durabilidad, 320, 140);

    p.textSize(16);
    p.text("Métodos:", 320, 190);
    p.text("- atacar()", 320, 220);

    if (resultado !== "") {
      p.fill("#007700");
      p.textSize(16);
      p.text(resultado, 320, 270);
    }
  };
}
