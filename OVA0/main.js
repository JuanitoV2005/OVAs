// Lista de URLs de los contenidos
const contenidos = [
  'pages/cap1/tema1.html',
  'pages/cap2/tema1.html',
  'pages/cap2/tema2.html',
];

let indiceActual = 0;

const mainContent = document.getElementById('main-content');
const btnAnterior = document.getElementById('btn-anterior');
const btnSiguiente = document.getElementById('btn-siguiente');

function cargarContenido(indice) {
  if (indice < 0 || indice >= contenidos.length) {
    return; // Índice fuera de rango, no hacer nada
  }

  fetch(contenidos[indice])
    .then(response => {
      if (!response.ok) throw new Error('No se pudo cargar el contenido');
      return response.text();
    })
    .then(html => {
      mainContent.innerHTML = html;
      indiceActual = indice;
      actualizarBotones();
    })
    .catch(error => {
      mainContent.innerHTML = `<p>Error cargando contenido.</p>`;
      console.error(error);
    });
}

function actualizarBotones() {
  btnAnterior.style.pointerEvents = (indiceActual === 0) ? 'none' : 'auto';
  btnAnterior.style.opacity = (indiceActual === 0) ? '0.5' : '1';

  btnSiguiente.style.pointerEvents = (indiceActual === contenidos.length -1) ? 'none' : 'auto';
  btnSiguiente.style.opacity = (indiceActual === contenidos.length -1) ? '0.5' : '1';
}

btnAnterior.addEventListener('click', e => {
  e.preventDefault();
  if (indiceActual > 0) cargarContenido(indiceActual - 1);
});

btnSiguiente.addEventListener('click', e => {
  e.preventDefault();
  if (indiceActual < contenidos.length -1) cargarContenido(indiceActual + 1);
});

// Carga el primer contenido al iniciar
cargarContenido(indiceActual);
