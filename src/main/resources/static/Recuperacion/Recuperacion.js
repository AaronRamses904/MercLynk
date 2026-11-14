function enviarRecuperacion() {
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();

  if (nombre === "" || correo === "") {
    alert("Por favor completa todos los campos.");
    return;
  }

  alert(`Hola ${nombre}, hemos enviado un enlace de recuperación a: ${correo}`);

  // Redirección automática después del mensaje
  window.location.href = "Validacion.html";  // ← Cambia esto si quieres otra página
}
