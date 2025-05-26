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
const btnCapitulos = document.getElementById('btn-capitulos');
const menuCapitulos = document.getElementById('menu-capitulos');


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
      menuCapitulos.classList.remove('visible'); // cerrar menú al cargar contenido
    })
    .catch(error => {
      mainContent.innerHTML = `<p>Error cargando contenido.</p>`;
      console.error(error);
    });
}

// Avanzar y retroceder
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




// Menú de capítulos
btnCapitulos.addEventListener('click', e => {
  e.preventDefault();
  menuCapitulos.classList.toggle('visible');
});
function construirMenu() {
  const menuCapitulos = document.getElementById('menu-capitulos');
  const indiceMenu = {};

  contenidos.forEach((path, i) => {
    const partes = path.split('/');
    const capitulo = partes[1]; // cap1, cap2, etc.
    const nombreTema = partes[2].replace('.html', ''); // tema1, tema2, etc.

    if (!indiceMenu[capitulo]) {
      indiceMenu[capitulo] = [];
    }

    indiceMenu[capitulo].push({ nombre: nombreTema, indice: i });
  });

  menuCapitulos.innerHTML = '';

  for (const capitulo in indiceMenu) {
    const liCap = document.createElement('li');
    liCap.innerHTML = `<strong>${capitulo}</strong>`;
    const ulTemas = document.createElement('ul');

    indiceMenu[capitulo].forEach(({ nombre, indice }) => {
      const liTema = document.createElement('li');
      const btn = document.createElement('button');
      btn.textContent = nombre;
      btn.addEventListener('click', () => cargarContenido(indice));
      liTema.appendChild(btn);
      ulTemas.appendChild(liTema);
    });

    liCap.appendChild(ulTemas);
    menuCapitulos.appendChild(liCap);
  }
}




// Carga el primer contenido al iniciar
cargarContenido(indiceActual);

// Llamada a funcion del menu
construirMenu();
