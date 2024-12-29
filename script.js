console.log("password app");
const LETRAS = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "ñ",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
]; //27
const NUMEROS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; //10
const SIMBOLOS = [
  "*",
  "&",
  "%",
  "$",
  "#",
  "@",
  "!",
  "¡",
  ".",
  "?",
  "¿",
  ":",
  "+",
  "-",
  "(",
  ")",
]; //16
//!@#$%^&*(),.?":{}|<>
const FORTALEZA_DEBIL="Débil";
const FORTALEZA_MEDIA="Media";
const FORTALEZA_FUERTE="Fuerte";

const formulario = document.forms[0];
const resultadoInput = document.forms[0].resultado;
const longitudInput = formulario.longitud;
const numerosInput = formulario.numeros;
const simbolosInput = formulario.simbolos;
const mayusculasInput = formulario.mayusculas;
const copyBoton = document.getElementById("copy");
const refreshBoton = document.getElementById("refresh");

//badge
const badgeMayuscula = mayusculasInput.nextElementSibling.nextElementSibling;
const badgeNumero = numerosInput.nextElementSibling.nextElementSibling;
const badgeSimbolo = simbolosInput.nextElementSibling.nextElementSibling;

//estilo
const CLASES_FORTALEZAS = {
  fuerte: ["bg-success", "bg-opacity-50"],
  debil: ["bg-danger", "bg-opacity-50"],
  media: ["bg-warning", "bg-opacity-50"],
};
const CLASES_A_ELIMINAR = [
  "bg-danger",
  "bg-warning",
  "bg-success",
  "bg-opacity-50",
];

// modal
const modal = document.getElementById("modalSheet");
const tituloModal = document.getElementById("tituloModal");
const mensajeModal = document.getElementById("mensajeModal");

copyBoton.addEventListener("click", handlerCopy);

function handlerCopy(event) {
  event.preventDefault();
  if (resultadoInput.value.trim().length > 0) {
    navigator.clipboard
      .writeText(resultadoInput.value)
      .then(() => {
        console.log("Texto copiado al portapapeles");
      })
      .catch((err) => {
        console.error("Error al copiar al portapapeles:", err);
      });
  }
}
refreshBoton.addEventListener("click", (event) => {
  event.preventDefault();
  if (Number(longitudInput.value) > 0) {
    refresh();
  }
});

formulario.addEventListener("input", (evento) => {
  console.log(evento.target.value);
  const input = evento.target;
badgeMayuscula.classList.add("d-none");
badgeSimbolo.classList.add("d-none");
badgeNumero.classList.add("d-none");


  if (!checkTotalValoresInputs(getValoresDeInputs())) {
    console.log("No es valido");
    console.log(input.id);
    switch (input.id) {
      case "mayusculas":
        console.log(mayusculasInput.nextElementSibling.nextElementSibling);

        badgeMayuscula.innerHTML = "No puede superar longitud";
        mayusculasInput.value = 0;
        badgeMayuscula.classList.remove("d-none");
        resultadoInput.value="";

        break;
      case "numeros":
        console.log(numerosInput.nextElementSibling.nextElementSibling);

        badgeNumero.innerHTML = "No puede superar longitud";
        numerosInput.value = 0;

        badgeNumero.classList.remove("d-none");
        resultadoInput.value="";

        break;
      case "simbolos":
        console.log(simbolosInput.nextElementSibling.nextElementSibling);

        badgeSimbolo.innerHTML = "No puede superar longitud";
        simbolosInput.value = 0;
        badgeSimbolo.classList.remove("d-none");
        resultadoInput.value="";

        break;
      default:
        break;
    }
  } else {
    if (input) refresh();
  }
});

function getValoresDeInputs() {
  let longitud = longitudInput ? Number(longitudInput.value) : 0;
  let numeros = numerosInput ? Number(numerosInput.value) : 0;
  let mayusculas = mayusculasInput ? Number(mayusculasInput.value) : 0;
  let simbolos = simbolosInput ? Number(simbolosInput.value) : 0;
  return { longitud, mayusculas, numeros, simbolos };
}

function refresh() {
  console.log("refresh");

  const { longitud, mayusculas, numeros, simbolos } = getValoresDeInputs();

  console.log(longitud, numeros, mayusculas, simbolos);
  if (longitud == 0) {
    resultadoInput.value = "";
    deshabilitar();
    quitarStyleFortalezaPass();
    console.log("RETURN");
    return;
  }

  if (esValido(longitud)) {
    if (longitud > 0) {
      habilitar(); // habilito demas input

      if (
        checkTotalValoresInputs({ longitud, mayusculas, numeros, simbolos })
      ) {
        resultadoInput.value = "";
        let array = construirPassword({
          longitud,
          mayusculas,
          numeros,
          simbolos,
        });
        addPassword(array.join(""));
      } 
    }
  }
}

function addPassword(pass) {
  resultadoInput.value = pass;
  if (resultadoInput.value == "") {
    console.log("paso por vacio");
    quitarStyleFortalezaPass();
    resultadoInput.classList.add("bg-transparent");
  } else {
    let fortaleza = evaluarContraseña(resultadoInput.value);
    addFortaleza(fortaleza);
  }
}
function checkTotalValoresInputs({ longitud, mayusculas, numeros, simbolos }) {
  return (
    longitud >= mayusculas &&
    longitud >= simbolos &&
    longitud >= numeros &&
    longitud >= mayusculas + simbolos + numeros
  );
}
function addFortaleza(fortaleza) {
  console.log("Fortaleza", fortaleza);
  switch (fortaleza) {
    case "Débil":
      console.log("DEBIL");

      estiloPorFortaleza(CLASES_FORTALEZAS.debil, CLASES_A_ELIMINAR);
      // constraseñaDebil();
      break;
    case "Media":
      console.log("MEDIA");
      estiloPorFortaleza(CLASES_FORTALEZAS.media, CLASES_A_ELIMINAR);

      // constraseñaMedia();
      break;
    case "Fuerte":
      console.log("FUERTE");
      estiloPorFortaleza(CLASES_FORTALEZAS.fuerte, CLASES_A_ELIMINAR);

      // constraseñaFuerte();
      break;
    default:
      quitarStyleFortalezaPass();
      break;
  }
}
function quitarStyleFortalezaPass() {
  // Eliminar todas las clases de fondo y opacidad
  resultadoInput.classList.remove(...CLASES_A_ELIMINAR);
}

function estiloPorFortaleza(clasesAgregar, clasesQuitar) {
  //quito todos los estilos
  resultadoInput.classList.remove(...clasesQuitar);

  resultadoInput.classList.add(...clasesAgregar);
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
  quitarStyleFortalezaPass();
}
function construirPassword({ longitud, mayusculas, numeros, simbolos }) {
  console.log(longitud, mayusculas, numeros, simbolos);
  let array = [];

  if (numeros && numeros > 0) array.push(...dameDeArray(numeros, NUMEROS));
  if (simbolos && simbolos > 0) array.push(...dameDeArray(simbolos, SIMBOLOS));
  if (mayusculas && mayusculas > 0)
    array.push(
      ...dameDeArray(
        mayusculas,
        LETRAS.map((l) => l.toUpperCase())
      )
    );

  //completo con lo que falta con letras
  if (array.length != longitud) {
    let aux = dameDeArray(longitud - array.length, LETRAS);
    array.push(...aux);
  }
  mezclar(array);
  console.log(array);
  return array;
}

function dameDeArray(cantidad, array) {
  let arrayAUX = [];
  for (let index = 0; index < cantidad; index++) {
    let indiceArray = random(0, array.length - 1);
    arrayAUX.push(array[indiceArray]);
  }
  return arrayAUX;
}

function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function esValido(valor) {
  let min = 0; //html
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
  if (puntuacion <= 2) return FORTALEZA_DEBIL;
  if (puntuacion <= 4) return FORTALEZA_MEDIA;
  return FORTALEZA_FUERTE;
}

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

