// Bloquear inputs y botón si el quiz ya fue validado
function bloquearFormulario(formId, botonId) {
    const form = document.getElementById(formId);
    for (let input of form.elements) {
        if (input.tagName === "INPUT") {
            input.disabled = true;
        }
    }
    const botonValidar = document.getElementById(botonId);
    if (botonValidar) {
        botonValidar.disabled = true;
    }
}
// Validar si las respuestas de un quiz fueron correctas o no
function validarFormulario(respuestasDict, formId, resultadoId, botonId, storagePrefix = "", usandoGuardadas = false) {
    const form = document.getElementById(formId);

    let puntaje = 0;
    let respuestasUsuario = {};

    // Si usandoGuardadas, cargar valores guardados en los inputs
    if (usandoGuardadas) {
        const guardadas = JSON.parse(localStorage.getItem(storagePrefix + "respuestas") || "{}");
        for (let key in guardadas) {
            if (form.elements[key]) {
                form.elements[key].value = guardadas[key];
            }
        }
    }

    for (let [key, obj] of Object.entries(respuestasDict)) {
        const inputs = form.elements[key];
        let respuestaUsuario = "";

        if (!inputs) continue;

        if (inputs.length && inputs[0].type === "radio") {
            // Es un grupo de radios
            const checked = form.querySelector(`input[name="${key}"]:checked`);
            respuestaUsuario = checked ? checked.value : "";
        } else {
            // Input normal
            const input = inputs;
            respuestaUsuario = input.value.trim();
        }


        respuestasUsuario[key] = respuestaUsuario;

        if (respuestaUsuario === obj.valor) {
            if (inputs.length && inputs[0].type === "radio") {
                // grupo de radios: marcar todos en gris y el correcto en verde
                inputs.forEach(r => {
                    r.parentElement.classList.remove("correcto", "incorrecto");
                    if (r.value === obj.valor) {
                        r.parentElement.classList.add("correcto");
                    }
                });
            } else {
                inputs.classList.add("correcto");
            }
            puntaje++;
        } else {
            if (inputs.length && inputs[0].type === "radio") {
                inputs.forEach(r => {
                    r.parentElement.classList.remove("correcto", "incorrecto");
                    if (r.checked) {
                        r.parentElement.classList.add("incorrecto");
                    }
                });
            } else {
                inputs.classList.add("incorrecto");
            }
        }

    }


    localStorage.setItem(storagePrefix + "respuestas", JSON.stringify(respuestasUsuario));
    localStorage.setItem(storagePrefix + "puntaje", puntaje);
    localStorage.setItem(storagePrefix + "validado", "true");

    document.getElementById(resultadoId).innerText =
        `Respuestas correctas: ${puntaje} / ${Object.keys(respuestasDict).length}`;

    // Bloquear inputs y botón después de validar
    bloquearFormulario(formId, botonId);
}




// Restaurar progreso de un quiz (Qué preguntas tienen respuesta correcta)
function restaurarQuiz(formId, respuestasDict, resultadoId, botonId, storagePrefix = "") {
    const validado = localStorage.getItem(storagePrefix + "validado") === "true";
    if (validado) {
        validarFormulario(respuestasDict, formId, resultadoId, botonId, storagePrefix, true);
    } else {
        const form = document.getElementById(formId);
        const respuestasGuardadas = JSON.parse(localStorage.getItem(storagePrefix + "respuestas") || "{}");
        const decimalesGuardados = JSON.parse(localStorage.getItem(storagePrefix + "decimales") || "{}");

        for (let key in respuestasGuardadas) {
            if (form.elements[key]) {
                const el = form.elements[key];
                if (el.type === "radio") {
                    const radios = form.querySelectorAll(`input[name="${key}"]`);
                    radios.forEach(r => {
                        r.checked = (r.value === respuestasGuardadas[key]);
                    });
                } else {
                    el.value = respuestasGuardadas[key];
                }
            }
        }

        // Habilitar inputs y botón, limpiar estilos y resultado
        for (let input of form.elements) {
            if (input.tagName === "INPUT") {
                input.disabled = false;
                input.classList.remove("correcto", "incorrecto");
            }
        }
        const botonValidar = document.getElementById(botonId);
        if (botonValidar) {
            botonValidar.disabled = false;
        }
        document.getElementById(resultadoId).innerText = "";
    }
}



// Guardar progreso en local storage delas respuestas ingresadas en los input de un quiz, incluso si no se ha dado click en validar
function inicializarQuizInputs(formId, storagePrefix = "") {
    const form = document.getElementById(formId);
    const validado = localStorage.getItem(storagePrefix + "validado") === "true";
    const respuestasGuardadas = JSON.parse(localStorage.getItem(storagePrefix + "respuestas") || "{}");

    // Restaurar valores guardados si no está validado
    if (!validado) {
        for (let key in respuestasGuardadas) {
            if (form.elements[key]) {
                form.elements[key].value = respuestasGuardadas[key];
            }
        }
    }

    // Guardar automáticamente cada vez que se edita un input (si no está validado)
    for (let input of form.elements) {
        if (input.tagName === "INPUT" && !validado) {
            if (input.type === "radio") {
                input.addEventListener("change", () => {
                    let respuestasGuardadas = JSON.parse(localStorage.getItem(storagePrefix + "respuestas") || "{}");
                    respuestasGuardadas[input.name] = input.value;
                    localStorage.setItem(storagePrefix + "respuestas", JSON.stringify(respuestasGuardadas));
                });
            } else {
                input.addEventListener("input", () => {
                    let respuestasGuardadas = JSON.parse(localStorage.getItem(storagePrefix + "respuestas") || "{}");
                    respuestasGuardadas[input.name] = input.value;
                    localStorage.setItem(storagePrefix + "respuestas", JSON.stringify(respuestasGuardadas));
                });
            }
        }
    }

}