
// ---------- SCORM ----------
function scormInit() {
  try {
    // Asegurar versión correcta
    if (window.pipwerks && pipwerks.SCORM) {
      pipwerks.SCORM.version = "1.2";
      const ok = pipwerks.SCORM.init();
      if (ok) {
        pipwerks.SCORM.set("cmi.core.lesson_status", "incomplete");
        pipwerks.SCORM.save();
      } else {
        console.warn("SCORM.init() devolvió false");
      }
    } else {
      console.warn("pipwerks.SCORM no está disponible (aún).");
    }
  } catch (e) {
    console.error("Error en scormInit:", e);
  }
}

function scormFinish() {
  try {
    if (window.pipwerks && pipwerks.SCORM) {
      pipwerks.SCORM.quit();
    }
  } catch (e) {
    console.error("Error en scormFinish:", e);
  }
}

window.addEventListener("DOMContentLoaded", scormInit);
window.addEventListener("beforeunload", scormFinish);
window.addEventListener("unload", scormFinish);

// app.js — cargador mínimo y estable
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

const scriptsComunes = [
  'scripts/blocks.js',
  'scripts/levelNav.js'
];

const clavesTemas = Object.keys(temas);
let indiceActual = 0;

function cargarScriptsEnOrden(scripts, callback) {
  if (!scripts || scripts.length === 0) { callback(); return; }

  var s1 = scripts[0];
  var resto = scripts.slice(1);

  var el = document.createElement('script');
  el.src = s1;
  el.async = false;
  el.onload = function () { cargarScriptsEnOrden(resto, callback); };
  el.onerror = function (e) {
    console.error('Error cargando', s1, e);
    cargarScriptsEnOrden(resto, callback);
  };
  document.head.appendChild(el);
}

function cargarSketchesDinamicamente(callback) {
  var scriptsTemas = Object.values(temas)
    .filter(function (t) { return t.sketchScript; })
    .map(function (t) { return t.sketchScript; });

  var rutas = scriptsComunes.concat(scriptsTemas);
  cargarScriptsEnOrden(rutas, callback);
}


function cargarTema(indice) {
  if (indice < 0 || indice >= clavesTemas.length) return;
  const clave = clavesTemas[indice];
  const tema = temas[clave];
  const mainContent = document.getElementById('main-content');

  fetch(tema.html, { cache: 'no-cache' })
    .then(r => r.text())
    .then(html => {
      mainContent.innerHTML = html;

      // Limpia cualquier instancia previa de p5
      for (const k of Object.keys(temas)) {
        try {
          if (temas[k].instancia && typeof temas[k].instancia.remove === 'function') {
            temas[k].instancia.remove();
          }
        } catch (e) { console.warn('Error removiendo instancia previa', e); }
        temas[k].instancia = null;
      }

      // Crea la nueva instancia p5 si aplica
      if (tema.sketchName && tema.container) {
        const contenedor = document.getElementById(tema.container);
        const sketchFn = window[tema.sketchName];
        if (contenedor && typeof sketchFn === 'function') {
          tema.instancia = new p5(sketchFn, contenedor);

          // Esperar a que el sketch marque __ready y resetear al nivel 0
          (function waitReady(inst){
            if (inst && inst.__ready && typeof inst.resetAll === 'function') {
              inst.resetAll(0);
            } else {
              requestAnimationFrame(() => waitReady(tema.instancia));
            }
          })(tema.instancia);
        } else {
          console.warn('Contenedor o sketch no listos:', contenedor, sketchFn);
        }
      }

      indiceActual = indice;
      window.scrollTo(0, 0);
    })
    .catch(err => {
      console.error(`Error al cargar ${tema.html}:`, err);
      mainContent.innerHTML = `<p>Error cargando el tema.</p>`;
    });
}

// Inicio
cargarSketchesDinamicamente(() => cargarTema(indiceActual));
