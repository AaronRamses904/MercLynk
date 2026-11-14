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
  document.getElementById("camposCliente").style.display =
    esEmprendedor ? "none" : "block";
  document.getElementById("labelDireccion").textContent =
    esEmprendedor ? "Dirección del negocio" : "Dirección completa";

  // Obligatorios solo para el emprendedor
  ["negocio", "rubro", "whatsapp"].forEach(id => {
    const campo = document.getElementById(id);
    if (campo) campo.required = esEmprendedor;
  });

  // Obligatorio solo para el cliente
  const campoFecha = document.getElementById("fechaNacimiento");
  if (campoFecha) campoFecha.required = !esEmprendedor;
}

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


// ===== ENVÍO DEL FORMULARIO A SPRING BOOT (MYSQL) =====
document.getElementById("formRegistro").addEventListener("submit", async (e) => {
  e.preventDefault();

  const esEmprendedor = tipo === "proveedor";

  // Obtener el texto legible de Departamento, Provincia y Distrito
  const depTexto = selDepartamento.selectedIndex > 0 ? selDepartamento.options[selDepartamento.selectedIndex].text : "";
  const provTexto = selProvincia.selectedIndex > 0 ? selProvincia.options[selProvincia.selectedIndex].text : "";
  const distTexto = selDistrito.selectedIndex > 0 ? selDistrito.options[selDistrito.selectedIndex].text : "";

  // Armar el objeto JSON que recibirá UsuarioController en Spring Boot
  const datosUsuario = {
    tipo: esEmprendedor ? "EMPRENDEDOR" : "CLIENTE",
    nombre: document.getElementById("nombre")?.value || "",
    apellido: document.getElementById("apellido")?.value || "",
    fechaNacimiento: !esEmprendedor ? (document.getElementById("fechaNacimiento")?.value || null) : null,
    correo: document.getElementById("email")?.value || document.getElementById("correo")?.value || "",
    password: document.getElementById("password")?.value || "",
    telefono: document.getElementById("telefono")?.value || "",
    departamento: depTexto,
    provincia: provTexto,
    distrito: distTexto,
    direccion: document.getElementById("direccion")?.value || "",

    // Datos exclusivos si se registra como Emprendedor
    nombreNegocio: esEmprendedor ? (document.getElementById("negocio")?.value || null) : null,
    rubro: esEmprendedor ? (document.getElementById("rubro")?.value || null) : null,
    descripcion: esEmprendedor ? (document.getElementById("descripcion")?.value || null) : null,
    ruc: esEmprendedor ? (document.getElementById("ruc")?.value || null) : null,
    whatsapp: esEmprendedor ? (document.getElementById("whatsapp")?.value || null) : null,
    redesSociales: esEmprendedor ? (document.getElementById("redes")?.value || null) : null
  };

  try {
    const respuesta = await fetch("http://localhost:8080/api/usuarios/registrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datosUsuario)
    });

    if (respuesta.ok) {
      alert(`¡Registro exitoso como ${datosUsuario.tipo}!`);
      window.location.href = "../index.html";
    } else {
      const errorTexto = await respuesta.text();
      console.error("Error del servidor:", errorTexto);
      alert("Hubo un error al guardar los datos en la base de datos.");
    }
  } catch (error) {
    console.error("Error de red:", error);
    alert("No se pudo conectar con el servidor. Asegúrate de que Spring Boot esté ejecutándose.");
  }
});
