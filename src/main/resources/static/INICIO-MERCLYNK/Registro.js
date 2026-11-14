// Mostrar / ocultar contraseña
function togglePass() {
  const pass = document.getElementById("password");
  pass.type = pass.type === "password" ? "text" : "password";
}

let tipo = "cliente";

// Cambiar entre Cliente / Proveedor
function setTipo(seleccion) {
  tipo = seleccion;
  const esEmprendedor = tipo === "proveedor";

  document.querySelectorAll(".btn-select").forEach(b => b.classList.remove("activo"));
  event.target.classList.add("activo");

  document.getElementById("tituloRegistro").textContent =
    esEmprendedor ? "Registro de Emprendedor" : "Registro de Cliente";
  document.getElementById("camposProveedor").style.display =
    esEmprendedor ? "block" : "none";
  document.getElementById("camposCliente").style.display =        // NUEVO
    esEmprendedor ? "none" : "block";                              // NUEVO
  document.getElementById("labelDireccion").textContent =
    esEmprendedor ? "Dirección del negocio" : "Dirección completa";

  // Obligatorios solo para el emprendedor
  ["negocio", "rubro", "whatsapp"].forEach(id => {
    document.getElementById(id).required = esEmprendedor;
  });

  // Obligatorio solo para el cliente
  document.getElementById("fechaNacimiento").required = !esEmprendedor;  // NUEVO
}

// Envío del formulario
document.getElementById("formRegistro").addEventListener("submit", (e) => {
  e.preventDefault();
  alert(`¡Registro enviado como ${tipo.toUpperCase()}!`);

  // 🔥 REDIRECCIÓN DESPUÉS DE REGISTRAR
  window.location.href = "../index.html";
  // ⬆️ Cambia esto si tu archivo está en otra ruta
});

// ===== UBICACIÓN: Departamento → Provincia → Distrito =====
// Requiere cargar data/ubigeo.js ANTES de este archivo en el HTML

const selDepartamento = document.getElementById("departamento");
const selProvincia = document.getElementById("ciudad");
const selDistrito = document.getElementById("distrito");

let departamentos = [];
let provincias = [];
let distritos = [];

// "SAN MARTIN" → "San Martin" (deja "de", "la", "del"... en minúscula)
const conectores = ["de", "del", "la", "las", "los", "y"];
function formatear(txt) {
  return txt.toLowerCase().split(" ").map((p, i) =>
    i > 0 && conectores.includes(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)
  ).join(" ");
}

// Los datos no traen tildes; se las ponemos a los departamentos que las llevan
const tildes = {
  "ANCASH": "Áncash", "APURIMAC": "Apurímac", "HUANUCO": "Huánuco",
  "JUNIN": "Junín", "SAN MARTIN": "San Martín"
};
const nombreDepartamento = txt => tildes[txt] || formatear(txt);

const porTexto = (a, b) => a.texto.localeCompare(b.texto, "es");

// Llena un select con objetos { valor, texto }
function llenarSelect(select, items, textoInicial) {
  select.innerHTML = `<option value="">${textoInicial}</option>`;
  items.forEach(({ valor, texto }) => {
    const option = document.createElement("option");
    option.value = valor;
    option.textContent = texto;
    select.appendChild(option);
  });
  select.disabled = items.length === 0;
}

// Carga los datos desde ubigeo.js al abrir la página
function cargarUbigeo() {
  if (typeof UBIGEO === "undefined") {
    selDepartamento.innerHTML = '<option value="">Error: no se cargó data/ubigeo.js</option>';
    console.error("UBIGEO no está definido. Revisa la ruta del <script> en Registro.html");
    return;
  }

  departamentos = UBIGEO.departamentos;
  provincias = UBIGEO.provincias;
  distritos = UBIGEO.distritos;

  const lista = departamentos
    .map(d => ({ valor: d.id, texto: nombreDepartamento(d.departamento) }))
    .sort(porTexto);

  llenarSelect(selDepartamento, lista, "Seleccione un departamento");
}

// Departamento → Provincias
selDepartamento.addEventListener("change", () => {
  const idDepartamento = Number(selDepartamento.value);

  const lista = provincias
    .filter(p => p.departamento_id === idDepartamento)
    .map(p => ({ valor: p.id, texto: formatear(p.provincia) }))
    .sort(porTexto);

  llenarSelect(selProvincia, lista, "Seleccione una provincia");
  llenarSelect(selDistrito, [], "Seleccione un distrito");
});

// Provincia → Distritos
selProvincia.addEventListener("change", () => {
  const idProvincia = Number(selProvincia.value);

  const lista = distritos
    .filter(d => d.provincia_id === idProvincia)
    .map(d => ({ valor: d.id, texto: formatear(d.distrito) }))
    .sort(porTexto);

  llenarSelect(selDistrito, lista, "Seleccione un distrito");
});


// ===== FECHA DE NACIMIENTO: mayor de 18 años =====
const fechaNacimiento = document.getElementById("fechaNacimiento");

// Convierte una fecha a "AAAA-MM-DD" usando la hora local
function aTexto(fecha) {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const hoy = new Date();
// Fecha máxima: hoy hace 18 años. Fecha mínima: hoy hace 100 años
fechaNacimiento.max = aTexto(new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate()));
fechaNacimiento.min = aTexto(new Date(hoy.getFullYear() - 100, hoy.getMonth(), hoy.getDate()));

fechaNacimiento.addEventListener("input", () => {
  const valor = fechaNacimiento.value;

  if (valor && valor > fechaNacimiento.max) {
    fechaNacimiento.setCustomValidity("Debes ser mayor de 18 años");
  } else if (valor && valor < fechaNacimiento.min) {
    fechaNacimiento.setCustomValidity("Ingresa una fecha de nacimiento válida");
  } else {
    fechaNacimiento.setCustomValidity("");
  }
});
cargarUbigeo();