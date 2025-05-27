const temas = {
  tema1: {
    html: 'tema1.html',
    sketchScript: 'sketch1.js',
    sketchName: 'sketchTema1',
    container: 'contenedor-sketch1',
    instancia: null
  },
  tema2: {
    html: 'tema2.html',
    sketchScript: 'sketch2.js',
    sketchName: 'sketchTema2',
    container: 'contenedor-sketch2',
    instancia: null
  },
  tema3: {
    html: 'tema3.html',
    sketchScript: null,
    sketchName: null,
    container: null,
    instancia: null
  }
};

const mainContent = document.getElementById('main-content');
const btnAnterior = document.getElementById('btn-anterior');
const btnSiguiente = document.getElementById('btn-siguiente');

const clavesTemas = Object.keys(temas);
let indiceActual = 0;

// Navegación
btnAnterior.addEventListener('click', () => cargarTema(indiceActual - 1));
btnSiguiente.addEventListener('click', () => cargarTema(indiceActual + 1));

// Iniciar app
cargarSketchesDinamicamente();
cargarTema(indiceActual);

function cargarTema(indice) {
  if (indice < 0 || indice >= clavesTemas.length) return;

  const clave = clavesTemas[indice];
  const tema = temas[clave];

  fetch(tema.html)
    .then(res => res.text())
    .then(html => {
      mainContent.innerHTML = html;

      // Eliminar instancias previas
      for (const key of clavesTemas) {
        if (temas[key].instancia) {
          temas[key].instancia.remove();
          temas[key].instancia = null;
        }
      }

      // Crear nueva instancia si aplica
      if (tema.sketchName && tema.container) {
        const contenedor = document.getElementById(tema.container);
        const sketchFn = window[tema.sketchName];

        if (contenedor && typeof sketchFn === 'function') {
          tema.instancia = new p5(sketchFn, tema.container);
        }
      }

      indiceActual = indice;
      actualizarBotones();
    })
    .catch(err => {
      console.error(`Error al cargar ${tema.html}:`, err);
      mainContent.innerHTML = `<p>Error cargando el tema.</p>`;
    });
}

function actualizarBotones() {
  btnAnterior.disabled = indiceActual === 0;
  btnSiguiente.disabled = indiceActual === clavesTemas.length - 1;
}

function cargarSketchesDinamicamente(callback) {
  const scripts = Object.values(temas)
    .filter(tema => tema.sketchScript)
    .map(tema => tema.sketchScript);

  let cargados = 0;

  if (scripts.length === 0) {
    callback();
    return;
  }

  scripts.forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.onload = () => {
      cargados++;
      if (cargados === scripts.length) {
        callback();
      }
    };
    document.head.appendChild(script);
  });
}


