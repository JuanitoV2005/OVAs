let sketch1, sketch2;

function mostrarTema(id) {
  // Ocultar todos los contenedores y pausar loops
  document.getElementById('contenedor-tema1').classList.remove('visible');
  sketch1.noLoop();

  document.getElementById('contenedor-tema2').classList.remove('visible');
  sketch2.noLoop();

  // Mostrar el contenedor seleccionado
  const contenedor = document.getElementById('contenedor-' + id);
  contenedor.classList.add('visible');

  // Resetear estado y activar loop del sketch visible
  if (id === 'tema1') {
    sketch1.reset();
    sketch1.loop();
  } else if (id === 'tema2') {
    sketch2.reset();
    sketch2.loop();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  sketch1 = new p5(sketchTema1, 'contenedor-tema1');
  sketch2 = new p5(sketchTema2, 'contenedor-tema2');

  mostrarTema('tema1'); // Mostrar tema1 por defecto
});
