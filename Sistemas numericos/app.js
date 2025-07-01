const temas = {
  capitulo: {
    html: 'capitulo/index.html',
    sketchScript: 'capitulo/sketch.js',
    sketchName: 'sketchTema2',
    container: 'p5-container',
    instancia: null,
    nombreMenu: 'Sistemas numéricos'
  }
};


// Scripts que contienen lógica para dibujar algunas clases:
// Requisito: la última linea del script, fuera de la clase,
// debe ser algo como: window.MiClase = MiClase;
const scriptsComunes = {
  objeto1: 'scripts/objeto1.js',
  levelNav: 'scripts/levelNav.js',
  chessBoard: 'scripts/chessBoard.js'
};

const mainContent = document.getElementById('main-content');

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
        }
      }

      indiceActual = indice;
      
      // Desplazar la página al inicio
      window.scrollTo(0, 0); // Desplaza al principio de la página (x=0, y=0)


    })
    .catch(err => {
      console.error(`Error al cargar ${tema.html}:`, err);
      mainContent.innerHTML = `<p>Error cargando el tema.</p>`;
    });
}


// Cargar scripts necesarios para el OVA
function cargarScriptsEnOrden(scripts, callback) {
    console.log(`[cargarScriptsEnOrden] Inicia carga en orden. Scripts a cargar:`, scripts);

    if (scripts.length === 0) {
        console.log('[cargarScriptsEnOrden] No hay más scripts para cargar. Llamando callback.');
        callback();
        return;
    }

    const [primerScript, ...restoDeScripts] = scripts;
    console.log(`[cargarScriptsEnOrden] Cargando script: ${primerScript}`);

    const scriptElement = document.createElement('script');
    scriptElement.src = primerScript;
    scriptElement.defer = true;

    scriptElement.onload = () => {
        console.log(`[cargarScriptsEnOrden] Script cargado exitosamente: ${primerScript}`);
        cargarScriptsEnOrden(restoDeScripts, callback);
    };

    scriptElement.onerror = (e) => {
        console.error(`[cargarScriptsEnOrden] ERROR al cargar script: ${primerScript}`, e);
        // Podrías decidir si quieres continuar cargando los demás o detenerte
        cargarScriptsEnOrden(restoDeScripts, callback); // Continuar a pesar del error
    };

    document.head.appendChild(scriptElement);
}


function cargarSketchesDinamicamente(callback) {
    console.log('[cargarSketchesDinamicamente] Iniciando proceso de carga dinámica de sketches.');

    const rutasComunes = Object.values(scriptsComunes);
    console.log('[cargarSketchesDinamicamente] Rutas de scripts comunes:', rutasComunes);

    const scriptsTemas = Object.values(temas)
        .filter(tema => tema.sketchScript)
        .map(tema => tema.sketchScript);
    console.log('[cargarSketchesDinamicamente] Rutas de scripts de temas:', scriptsTemas);

    // Definir el orden de carga: primero comunes, luego temas.
    const rutasTotales = [...rutasComunes, ...scriptsTemas];
    console.log('[cargarSketchesDinamicamente] Orden final de scripts a cargar:', rutasTotales);

    cargarScriptsEnOrden(rutasTotales, callback);
}


// Iniciar app
cargarSketchesDinamicamente(() => {
  cargarTema(indiceActual);
});
