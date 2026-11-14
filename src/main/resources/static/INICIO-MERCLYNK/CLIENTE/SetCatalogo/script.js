const carrusel = document.getElementById("carrusel");
const btnIzquierda = document.getElementById("btnIzquierda");
const btnDerecha = document.getElementById("btnDerecha");

btnDerecha.addEventListener("click", () => {
  carrusel.scrollBy({ left: 330, behavior: "smooth" });
});

btnIzquierda.addEventListener("click", () => {
  carrusel.scrollBy({ left: -330, behavior: "smooth" });
});
