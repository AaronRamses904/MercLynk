// ===== PERFIL DE CLIENTE Y DE EMPRENDEDOR =====
// Lee los datos guardados por el registro (localStorage) y los muestra.
// Cuando tengas backend, cambia cargarUsuario() y guardarUsuario() por fetch().

const CLAVE = "merclynk_usuario";
const rolPagina = document.body.dataset.rol; // "cliente" o "proveedor"

const etiquetasRubro = {
  ropa: "Ropa y accesorios",
  alimentos: "Alimentos y bebidas",
  tecnologia: "Tecnología",
  hogar: "Hogar y decoración",
  belleza: "Belleza y cuidado personal",
  artesania: "Artesanías",
  otro: "Otro"
};

// ---------- Datos del usuario ----------
function cargarUsuario() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE));
  } catch {
    return null;
  }
}

function guardarUsuario() {
  localStorage.setItem(CLAVE, JSON.stringify(usuario));
}

let usuario = cargarUsuario();

// Si la persona es de otro tipo, la mandamos a su propio perfil
if (usuario && usuario.rol !== rolPagina) {
  location.replace(
    usuario.rol === "proveedor" ? "perfil-emprendedor.html" : "perfil-cliente.html"
  );
} else {
  iniciar();
}

// ---------- Elementos ----------
function iniciar() {
  const titulo = document.getElementById("titulo");
  const subtitulo = document.getElementById("subtitulo");
  const correoPerfil = document.getElementById("correoPerfil");
  const desdePerfil = document.getElementById("desdePerfil");
  const fotoPerfil = document.getElementById("fotoPerfil");
  const inputFoto = document.getElementById("inputFoto");
  const btnFoto = document.getElementById("btnFoto");
  const btnEditar = document.getElementById("btnEditar");
  const btnCancelar = document.getElementById("btnCancelar");
  const btnCerrar = document.getElementById("btnCerrar");
  const avisoSesion = document.getElementById("avisoSesion");
  const toast = document.getElementById("toast");
  const editables = [...document.querySelectorAll("[data-editable]")];

  let editando = false;

  // ---------- Mensaje flotante ----------
  function mostrarMensaje(texto) {
    toast.textContent = texto;
    toast.classList.add("visible");
    setTimeout(() => toast.classList.remove("visible"), 2500);
  }

  // ---------- Llenar campos ----------
  function llenarCampos() {
    document.querySelectorAll("[data-campo]").forEach(el => {
      let valor = usuario ? (usuario[el.dataset.campo] || "") : "";
      if (el.dataset.campo === "rubro") valor = etiquetasRubro[valor] || valor;
      el.value = valor;
    });
  }

  // ---------- Encabezado de la tarjeta ----------
  function actualizarEncabezado() {
    if (!usuario) return;

    if (rolPagina === "cliente") {
      titulo.textContent = `${usuario.nombre || ""} ${usuario.apellido || ""}`.trim() || "Usuario";
    } else {
      titulo.textContent = usuario.negocio || "Mi negocio";
      const rubro = etiquetasRubro[usuario.rubro] || usuario.rubro || "";
      const lugar = [usuario.distritoNombre, usuario.provinciaNombre].filter(Boolean).join(", ");
      subtitulo.textContent = [rubro, lugar].filter(Boolean).join(" · ");
    }

    correoPerfil.textContent = usuario.correo || "";

    const fecha = new Date(usuario.fechaRegistro);
    if (!isNaN(fecha)) {
      const mes = fecha.toLocaleDateString("es-PE", { month: "long", year: "numeric" });
      const tipo = rolPagina === "cliente" ? "Cliente" : "Emprendedor";
      desdePerfil.textContent = `${tipo} desde ${mes}`;
    }

    if (usuario.foto) fotoPerfil.src = usuario.foto;
  }

  // ---------- Modo edición ----------
  function modoEdicion(activo) {
    editando = activo;
    editables.forEach(campo => (campo.disabled = !activo));
    btnEditar.textContent = activo ? "Guardar cambios" : "Editar información";
    btnCancelar.hidden = !activo;
  }

  btnEditar.addEventListener("click", () => {
    // Primer clic: activar edición
    if (!editando) {
      modoEdicion(true);
      if (editables[0]) editables[0].focus();
      return;
    }

    // Segundo clic: validar y guardar
    for (const campo of editables) {
      if (!campo.reportValidity()) return;
    }

    editables.forEach(campo => {
      usuario[campo.dataset.campo] = campo.value.trim();
    });

    guardarUsuario();
    actualizarEncabezado();
    modoEdicion(false);
    mostrarMensaje("Cambios guardados ✔");
  });

  btnCancelar.addEventListener("click", () => {
    llenarCampos(); // vuelve a los valores guardados
    modoEdicion(false);
  });

  // ---------- Cambiar foto o logo ----------
  btnFoto.addEventListener("click", () => inputFoto.click());

  inputFoto.addEventListener("change", () => {
    const archivo = inputFoto.files[0];
    if (!archivo) return;

    if (archivo.size > 1000000) {
      alert("La imagen es muy pesada. Elige una de menos de 1 MB.");
      return;
    }

    const lector = new FileReader();
    lector.onload = () => {
      fotoPerfil.src = lector.result;
      usuario.foto = lector.result;
      guardarUsuario();
      mostrarMensaje("Foto actualizada ✔");
    };
    lector.readAsDataURL(archivo);
  });

  // ---------- Cerrar sesión ----------
  btnCerrar.addEventListener("click", () => {
    localStorage.removeItem(CLAVE);
    window.location.href = "../index.html";
  });

  // ---------- Estado inicial ----------
  llenarCampos();

  if (usuario) {
    actualizarEncabezado();
  } else {
    // Sin datos: se muestra el diseño, pero no se puede editar
    avisoSesion.hidden = false;
    btnEditar.disabled = true;
    btnFoto.disabled = true;
    btnCerrar.hidden = true;
  }
}
