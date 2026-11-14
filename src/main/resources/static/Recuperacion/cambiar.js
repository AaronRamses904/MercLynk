// Asegúrate de que este archivo se llame exactamente "cambiar.js"
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCambiar");
  const mensaje = document.getElementById("mensajeCambio");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nuevaPass = document.getElementById("nuevaPass").value.trim();
    const confirmarPass = document.getElementById("confirmarPass").value.trim();

    // Validaciones básicas (puedes ampliarlas)
    if (!nuevaPass || !confirmarPass) {
      mensaje.textContent = "Completa ambos campos.";
      mensaje.style.color = "red";
      return;
    }

    if (nuevaPass.length < 6) {
      mensaje.textContent = "La contraseña debe tener al menos 6 caracteres.";
      mensaje.style.color = "red";
      return;
    }

    if (nuevaPass !== confirmarPass) {
      mensaje.textContent = "Las contraseñas no coinciden.";
      mensaje.style.color = "red";
      return;
    }

    // Simulación de cambio exitoso
    mensaje.textContent = "Contraseña cambiada exitosamente. Redirigiendo...";
    mensaje.style.color = "green";

    // Redirige después de 2 segundos (ajusta la ruta si hace falta)
    setTimeout(() => {
      window.location.href = "../index.html"; // <- cambia aquí si quieres otra ruta
    }, 2000);
  });
});


