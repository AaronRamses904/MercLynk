function verificarCodigo() {
  const codigo = document.getElementById("codigo").value.trim();

  if (codigo === "") {
    alert("Por favor ingresa el código.");
    return;
  }

  if (codigo === "RTV736") {
    alert("Código correcto. Redirigiendo...");
    window.location.href = "cambiar.html"; // <-- Redirección automática
  } else {
    alert("Código incorrecto. Inténtalo nuevamente.");
  }
}

