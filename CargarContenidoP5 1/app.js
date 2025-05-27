let sketch1 = null;
let sketch2 = null;

function mostrarTema(id) {
  const main = document.getElementById('main-content');

  // Destruir sketches si existen
  if (sketch1) {
    sketch1.remove();
    sketch1 = null;
  }
  if (sketch2) {
    sketch2.remove();
    sketch2 = null;
  }

  fetch(`${id}.html`)
    .then(res => res.text())
    .then(html => {
      main.innerHTML = html;

      // Esperar a que el DOM se actualice antes de crear el sketch
      setTimeout(() => {
        if (id === 'tema1') {
          sketch1 = new p5(sketchTema1, 'contenedor-sketch1');
        } else if (id === 'tema2') {
          sketch2 = new p5(sketchTema2, 'contenedor-sketch2');
        }
      }, 0);
    });
}

// Inicializar con tema1 al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  mostrarTema('tema1');
});
