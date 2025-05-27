const temas = {
  tema1: {
    html: 'tema1.html',
    sketch: sketchTema1,
    container: 'contenedor-sketch1',
    instancia: null
  },
  tema2: {
    html: 'tema2.html',
    sketch: sketchTema2,
    container: 'contenedor-sketch2',
    instancia: null
  },
  tema3: {
    html: 'tema3.html',
    sketch: null,
    container: null,
    instancia: null
  }
};


function mostrarTema(id) {
  const main = document.getElementById('main-content');
  const tema = temas[id];

  if (!tema) {
    console.error(`Tema "${id}" no existe.`);
    return;
  }

  // Eliminar sketch activo si existe
  for (let key in temas) {
    const t = temas[key];
    if (t.instancia) {
      t.instancia.remove();
      t.instancia = null;
    }
  }

  // Cargar el HTML correspondiente
  fetch(tema.html)
    .then(res => res.text())
    .then(html => {
      main.innerHTML = html;

      // Esperar a que el contenedor exista en el DOM
      const checkAndCreateSketch = () => {
        const contenedor = document.getElementById(tema.container);
        if (contenedor) {
          tema.instancia = new p5(tema.sketch, tema.container);
        } else {
          // Si no está aún en el DOM, espera un poco y reintenta
          setTimeout(checkAndCreateSketch, 50);
        }
      };

      checkAndCreateSketch();
    })
    .catch(err => console.error(`Error al cargar ${id}.html:`, err));
}

document.addEventListener('DOMContentLoaded', () => {
  mostrarTema('tema1');
});
