const temas = {
  tema2: {
    html: 'pages/tema2/index.html',
    sketchScript: 'pages/tema2/sketch.js',
    sketchName: 'sketchTema2',
    container: 'contenedor-sketch2',
    instancia: null,
    nombreMenu: 'Clases Wrapper'
  },
  tema0: {
    // La ruta al archivo HTML dentro de su carpeta de tema
    html: 'pages/tema0/index.html',
    // La ruta al archivo JS del sketch dentro de su carpeta de tema
    sketchScript: null,
    // El nombre de la función de sketch definida dentro de ese sketch.js
    // (Asumiendo que dentro de pages/tema1/sketch.js hay una función llamada sketchTema1)
    sketchName: null,
    container: null,
    instancia: null,
    nombreMenu: 'Introducción a los primitivos en Java'
  },
  tema1: {
    // La ruta al archivo HTML dentro de su carpeta de tema
    html: 'pages/tema1/index.html',
    // La ruta al archivo JS del sketch dentro de su carpeta de tema
    sketchScript: 'pages/tema1/sketch.js',
    // El nombre de la función de sketch definida dentro de ese sketch.js
    // (Asumiendo que dentro de pages/tema1/sketch.js hay una función llamada sketchTema1)
    sketchName: 'primitivosBits',
    container: 'canvasContainer',
    instancia: null,
    nombreMenu: 'Cómo los primitivos usan bits'
  },
  
  tema3: {
    html: 'pages/tema3/index.html',
    // Si tema3 no tiene un sketch, estas propiedades son null
    sketchScript: null,
    sketchName: null,
    container: null,
    instancia: null,
    nombreMenu: 'Tipos numéricos: int vs Integer'
  }
};

const mainContent = document.getElementById('main-content');
const btnAnterior = document.getElementById('btn-anterior');
const btnSiguiente = document.getElementById('btn-siguiente');
const btnCapitulos = document.getElementById('btn-capitulos');
const menuCapitulos = document.getElementById('menu-capitulos');

const clavesTemas = Object.keys(temas);
let indiceActual = 0;


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
          // tema.instancia = new p5(sketchFn, contenedor); // Otra idea de responsive, no salió
        }
      }

      indiceActual = indice;
      actualizarBotones();

      // --- ¡NUEVAS LÍNEAS AQUÍ! ---
      // 1. Ocultar el menú de capítulos
      menuCapitulos.classList.remove('visible'); // Asumiendo que 'visible' lo muestra

      // 2. Desplazar la página al inicio
      window.scrollTo(0, 0); // Desplaza al principio de la página (x=0, y=0)
      // --- FIN DE LAS NUEVAS LÍNEAS ---

    })
    .catch(err => {
      console.error(`Error al cargar ${tema.html}:`, err);
      mainContent.innerHTML = `<p>Error cargando el tema.</p>`;
    });
}




// Navegación
btnAnterior.addEventListener('click', () => {
    if (indiceActual > 0) cargarTema(indiceActual - 1); // Use cargarTema, not cargarContenido
});

btnSiguiente.addEventListener('click', () => {
    if (indiceActual < clavesTemas.length - 1) cargarTema(indiceActual + 1); // Use cargarTema, not cargarContenido
});

function actualizarBotones() {
    // Botón Anterior
    btnAnterior.style.pointerEvents = (indiceActual === 0) ? 'none' : 'auto';
    btnAnterior.style.opacity = (indiceActual === 0) ? '0.5' : '1';

    // Botón Siguiente
    btnSiguiente.style.pointerEvents = (indiceActual === clavesTemas.length - 1) ? 'none' : 'auto';
    btnSiguiente.style.opacity = (indiceActual === clavesTemas.length - 1) ? '0.5' : '1';
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



// Menú de capítulos
btnCapitulos.addEventListener('click', e => {
  e.preventDefault();
  menuCapitulos.classList.toggle('visible');
});


function construirMenu() {
  const menuCapitulos = document.getElementById('menu-capitulos');
  if (!menuCapitulos) {
    console.error('No se encontró el elemento con ID "menu-capitulos" para construir el menú.');
    return;
  }

  menuCapitulos.innerHTML = ''; // Limpiar el menú existente antes de construirlo

  // Obtener las claves de los temas para poder encontrar su índice numérico
  const clavesTemasMenu = Object.keys(temas);

  // Iterar sobre los temas en el orden en que aparecen en el objeto 'temas'
  for (const key in temas) {
    if (temas.hasOwnProperty(key)) {
      const tema = temas[key];
      const indiceDelTema = clavesTemasMenu.indexOf(key); // Obtener el índice numérico

      const liTema = document.createElement('li');
      const btn = document.createElement('button');

      // Usar el nuevo campo 'nombreMenu', o la clave del tema como fallback
      btn.textContent = tema.nombreMenu || (key.charAt(0).toUpperCase() + key.slice(1));

      // Pasar el índice numérico a cargarTema
      btn.addEventListener('click', () => cargarTema(indiceDelTema));

      liTema.appendChild(btn);
      menuCapitulos.appendChild(liTema);
    }
  }
}




// Iniciar app
// cargarSketchesDinamicamente();
cargarSketchesDinamicamente(() => {
  cargarTema(indiceActual);
  construirMenu();
});
cargarTema(indiceActual);
// Llamada a funcion del menu
construirMenu();