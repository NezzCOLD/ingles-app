// Lógica de la sección de Escritura (A1)

const PROGRESS_KEY = "ingles-app-progreso-escritura";

function cargarProgreso() {
  const guardado = localStorage.getItem(PROGRESS_KEY);
  return guardado ? JSON.parse(guardado) : { completar: 0, ordenar: 0, traducir: 0 };
}

function guardarProgreso(progreso) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progreso));
}

let progreso = cargarProgreso();

function normalizar(texto) {
  return texto.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.,!?]/g, "");
}

function mostrarPestaña(nombre) {
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === nombre));
  document.querySelectorAll(".exercise-panel").forEach(p => p.classList.toggle("active", p.id === "panel-" + nombre));
}

/* ---------- 1. Completar la oración ---------- */

let completarIndex = 0;

function iniciarCompletar() {
  completarIndex = Math.floor(Math.random() * completarData.length);
  const actual = completarData[completarIndex];
  const partes = actual.sentence.split("___");

  document.getElementById("completar-prompt").innerHTML =
    partes[0] + '<input type="text" id="completar-input" autocomplete="off">' + partes[1];
  document.getElementById("completar-feedback").textContent = "";
  document.getElementById("completar-feedback").className = "feedback";
  document.getElementById("completar-input").focus();
  actualizarScore("completar", "completar-score");
}

function verificarCompletar() {
  const input = document.getElementById("completar-input");
  const correcto = normalizar(input.value) === normalizar(completarData[completarIndex].answer);
  const feedback = document.getElementById("completar-feedback");

  if (correcto) {
    feedback.textContent = "¡Correcto!";
    feedback.className = "feedback correct";
    progreso.completar++;
    guardarProgreso(progreso);
  } else {
    feedback.textContent = "Casi. La respuesta correcta es: " + completarData[completarIndex].answer;
    feedback.className = "feedback incorrect";
  }
  actualizarScore("completar", "completar-score");
}

/* ---------- 2. Ordenar las palabras ---------- */

let ordenarIndex = 0;
let ordenarSeleccion = [];

function iniciarOrdenar() {
  ordenarIndex = Math.floor(Math.random() * ordenarData.length);
  ordenarSeleccion = [];
  const palabras = [...ordenarData[ordenarIndex].words].sort(() => Math.random() - 0.5);

  const banco = document.getElementById("ordenar-banco");
  banco.innerHTML = "";
  palabras.forEach((palabra, i) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "word-chip";
    chip.textContent = palabra;
    chip.dataset.index = i;
    chip.onclick = () => seleccionarPalabra(palabra, chip);
    banco.appendChild(chip);
  });

  document.getElementById("ordenar-respuesta").innerHTML = "";
  document.getElementById("ordenar-feedback").textContent = "";
  document.getElementById("ordenar-feedback").className = "feedback";
  actualizarScore("ordenar", "ordenar-score");
}

function seleccionarPalabra(palabra, chip) {
  chip.classList.add("used");
  ordenarSeleccion.push(palabra);
  const area = document.getElementById("ordenar-respuesta");
  const span = document.createElement("span");
  span.textContent = palabra;
  area.appendChild(span);
}

function reiniciarOrdenar() {
  iniciarOrdenar();
}

function verificarOrdenar() {
  const construida = ordenarSeleccion.join(" ");
  const correcto = normalizar(construida) === normalizar(ordenarData[ordenarIndex].answer);
  const feedback = document.getElementById("ordenar-feedback");

  if (correcto) {
    feedback.textContent = "¡Correcto!";
    feedback.className = "feedback correct";
    progreso.ordenar++;
    guardarProgreso(progreso);
  } else {
    feedback.textContent = "No es correcto. La oración era: " + ordenarData[ordenarIndex].answer;
    feedback.className = "feedback incorrect";
  }
  actualizarScore("ordenar", "ordenar-score");
}

/* ---------- 3. Traducir la oración ---------- */

let traducirIndex = 0;

function iniciarTraducir() {
  traducirIndex = Math.floor(Math.random() * traducirData.length);
  document.getElementById("traducir-prompt").textContent = traducirData[traducirIndex].spanish;
  document.getElementById("traducir-input").value = "";
  document.getElementById("traducir-modelo").style.display = "none";
  document.getElementById("traducir-modelo").textContent = "";
  document.getElementById("traducir-autoeval").style.display = "none";
  actualizarScore("traducir", "traducir-score");
}

function verRespuestaTraducir() {
  const modelo = document.getElementById("traducir-modelo");
  modelo.textContent = "Respuesta modelo: " + traducirData[traducirIndex].answer;
  modelo.style.display = "block";
  document.getElementById("traducir-autoeval").style.display = "block";
}

function autoevaluarTraducir(fueCorrecta) {
  if (fueCorrecta) {
    progreso.traducir++;
    guardarProgreso(progreso);
  }
  actualizarScore("traducir", "traducir-score");
  document.getElementById("traducir-autoeval").style.display = "none";
}

/* ---------- Utilidades ---------- */

function actualizarScore(tipo, elementoId) {
  document.getElementById(elementoId).textContent = "Correctas acumuladas: " + progreso[tipo];
}

document.addEventListener("DOMContentLoaded", () => {
  iniciarCompletar();
  iniciarOrdenar();
  iniciarTraducir();
});
