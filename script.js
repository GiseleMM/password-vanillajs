const formulario = document.forms[0];
const LETRAS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
    'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];//27
const NUMEROS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; //10
const SIMBOLOS = ['*', '&', '%', '$', '#', '@', '!', '¡', '.', '?', '¿', ':', '+', '-', '(', ')'];//16
//!@#$%^&*(),.?":{}|<>

const resultadoInput = document.forms[0].resultado;
const modal = document.getElementById("modalSheet");
const tituloModal = document.getElementById("tituloModal");
const mensajeModal = document.getElementById("mensajeModal");
const longitudInput = formulario.longitud;
const numerosInput = formulario.numeros;
const simbolosInput = formulario.simbolos;
const mayusculasInput = formulario.mayusculas;
const copyBoton = document.getElementById("copy");
const refreshBoton = document.getElementById("refresh");


copyBoton.addEventListener("click", (event) => {
    event.preventDefault(); // Evita el comportamiento por defecto
    if (resultadoInput.value.trim().length > 0) {
        navigator.clipboard.writeText(resultadoInput.value)
            .then(() => {
                console.log("Texto copiado al portapapeles");
            })
            .catch((err) => {
                console.error("Error al copiar al portapapeles:", err);
            });

    }
});
refreshBoton.addEventListener("click", (event) => {
    event.preventDefault();
    if (Number(longitudInput.value) > 0) {
        refresh();
    }
});





console.log(resultadoInput);
console.log(formulario);

formulario.addEventListener("input", (evento) => {

    console.log(evento.target.value);
    const input = evento.target;
    if (input && input.value.trim() != "") refresh();


})
function refresh() {
    let longitud = longitudInput ? Number(longitudInput.value) : 0;
    let numeros = numerosInput ? Number(numerosInput.value) : 0;
    let mayusculas = mayusculasInput ? Number(mayusculasInput.value) : 0;
    let simbolos = simbolosInput ? Number(simbolosInput.value) : 0;


    console.log(longitud, numeros, mayusculas, simbolos);
    if (longitud == 0) {
        resultadoInput.value = "";
        deshabilitar();
        console.log("RETURN");
        return;
    }

    if (esValido(longitud)) {

        //si no coloco number lo toma com string y falla si pongo long 2 y numeros 10 entra igual al if
        // if (Number(longitud) >= Number(mayusculas) && Number(longitud) >= Number(simbolos) && Number(longitud) >= Number(numeros) && (Number(longitud) >= Number(mayusculas + simbolos + numeros))) {
        if (longitud > 0) {
            habilitar();// habilito demas input 
            if ((longitud >= mayusculas) && (longitud >= simbolos) && (longitud >= numeros) && (longitud) >= (mayusculas + simbolos + numeros)) {

                resultadoInput.value = "";
                let array = construirPassword({ longitud, mayusculas, numeros, simbolos });
                resultadoInput.value = array.join('');
                if (resultadoInput.value == "") {

                    resultadoInput.classList.remove("bg-danger", "bg-gradient");
                    resultadoInput.classList.remove("bg-warning", "bg-gradient");
                    resultadoInput.classList.remove("bg-success", "bg-gradient");
                    resultadoInput.classList.add("bg-transparent");

                } else {
                    let fortaleza = evaluarContraseña(resultadoInput.value);

                    console.log("FOrtaleza", fortaleza);
                    switch (fortaleza) {
                        case 'Débil':
                            console.log("DEBIL");
                            constraseñaDebil();
                            break;
                        case 'Media':
                            console.log("MEDIA");
                            constraseñaMedia();
                            break;
                        case 'Fuerte':
                            console.log("FUERTE");
                            constraseñaFuerte();
                            break;

                        default:

                            break;
                    }
                }

            } else {
                showModal("❌​ Error ​👇​", " Por favor, verifica que la longitud concuerde con las demas cantidad 👀");
                reset();

            }
        }


    }
}

function constraseñaFuerte()
{

    resultadoInput.classList.remove("bg-danger", "bg-gradient");
    resultadoInput.classList.remove("bg-warning", "bg-gradient");
    resultadoInput.classList.add("bg-success", "bg-gradient");
}
function constraseñaDebil()
{
    resultadoInput.classList.add("bg-danger", "bg-gradient");
    resultadoInput.classList.remove("bg-warning", "bg-gradient");
    resultadoInput.classList.remove("bg-success", "bg-gradient");


}
function constraseñaMedia()
{

    resultadoInput.classList.remove("bg-danger", "bg-gradient");
    resultadoInput.classList.add("bg-warning", "bg-gradient");
    resultadoInput.classList.remove("bg-success", "bg-gradient");


}
function habilitar() {
    //elem.removeAttribute(nombre)
    simbolosInput.removeAttribute("disabled");
    mayusculasInput.removeAttribute("disabled");
    numerosInput.removeAttribute("disabled");


}
function deshabilitar() {
    simbolosInput.setAttribute("disabled", true);
    mayusculasInput.setAttribute("disabled", true);
    numerosInput.setAttribute("disabled", true);
}
function reset() {
    formulario.longitud.value = 0;
    formulario.numeros.value = 0;
    formulario.simbolos.value = 0;
    formulario.mayusculas.value = 0;
    resultadoInput.value = "";
    deshabilitar();

}
function construirPassword({ longitud, mayusculas, numeros, simbolos }) {

    console.log(longitud, mayusculas, numeros, simbolos)
    let array = [];
    if (numeros && numeros > 0) array.push(...dameNumeros(numeros));
    if (simbolos && simbolos > 0) array.push(...dameSimbolos(simbolos));
    if (mayusculas && mayusculas > 0) array.push(...dameMayusculas(mayusculas))
    if (array.length != longitud) {
        let aux = dameLetras(longitud - array.length);
        array.push(...aux);
    }

    // MEZCALR

    mezclar(array);
    console.log(array);

    return array;
}
function dameLetras(cantidad) {
    let array = [];
    for (let index = 0; index < cantidad; index++) {
        let indiceArray = random(0, 8);//27 letras
        array.push(...LETRAS[indiceArray]);

    }

    return array;
}
function dameNumeros(cantidad) {

    let array = [];
    for (let index = 0; index < cantidad; index++) {
        let indiceArray = random(0, NUMEROS.length - 1);//10 numeros pero 0 a 9 indice
        array.push(NUMEROS[indiceArray]);

    }
    return array;
}
function dameSimbolos(cantidad) {
    let array = [];
    for (let index = 0; index < cantidad; index++) {
        let indiceArray = random(0, SIMBOLOS.length - 1);//9 simbolos
        array.push(SIMBOLOS[indiceArray]);

    }
    return array;
}
function dameMayusculas(cantidad) {
    let array = [];
    for (let index = 0; index < cantidad; index++) {
        let indiceArray = random(0, LETRAS.length - 1);//27 letras
        array.push(LETRAS[indiceArray].toUpperCase());

    }
    return array;
}

function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function esValido(valor) {
    let min = 0;
    let max = 30;
    return valor && valor >= min && valor <= max;

}
function mezclar(array) {
    array.sort(() => Math.random() - 0.5);
}

function evaluarContraseña(password) {
    let puntuacion = 0;
    if (password.length >= 8) puntuacion++;
    if (/[A-Z]/.test(password)) puntuacion++;
    if (/[a-z]/.test(password)) puntuacion++;
    if (/[0-9]/.test(password)) puntuacion++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) puntuacion++;
    if (puntuacion <= 2) return "Débil";
    if (puntuacion <= 4) return "Media";
    return "Fuerte";
}

// MODAL---------------------

modal.addEventListener("click", (event) => {
    closeModal();
})
function showModal(titulo, mensaje) {
    tituloModal.innerHTML = titulo;
    mensajeModal.innerHTML = mensaje;
    modal.classList.remove("d-none");
}
function closeModal() {
    modal.classList.add("d-none");
    //limpiar modal
    clearModal();
}
function clearModal() {
    tituloModal.innerHTML = "";
    mensajeModal.innerHTML = "";

}