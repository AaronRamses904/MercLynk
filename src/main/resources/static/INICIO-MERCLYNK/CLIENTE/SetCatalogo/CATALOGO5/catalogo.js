function abrirModal(imagen, titulo, descripcion) {
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  const modalTitulo = document.getElementById("modal-titulo");
  const modalDesc = document.getElementById("modal-desc");

  modalImg.src = imagen;
  modalTitulo.textContent = titulo;
  modalDesc.textContent = descripcion;

  modal.classList.add("activo");
}

function cerrarModal() {
  document.getElementById("modal").classList.remove("activo");
}

