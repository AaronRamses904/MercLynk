const tabla = document.getElementById("tabla-ventas");
const totalGeneral = document.getElementById("totalGeneral");

document.getElementById("agregar").addEventListener("click", () => {
    let producto = document.getElementById("producto").value;
    let precio = parseFloat(document.getElementById("precio").value);
    let cantidad = parseInt(document.getElementById("cantidad").value);

    if (!producto || !precio || !cantidad) {
        alert("Completa todos los campos.");
        return;
    }

    let total = precio * cantidad;

    let fila = document.createElement("tr");
    fila.innerHTML = `
        <td>${producto}</td>
        <td>S/ ${precio.toFixed(2)}</td>
        <td>${cantidad}</td>
        <td>S/ ${total.toFixed(2)}</td>
        <td><button class="btn-eliminar">X</button></td>
    `;

    tabla.appendChild(fila);

    actualizarTotal();

    fila.querySelector(".btn-eliminar").addEventListener("click", () => {
        fila.remove();
        actualizarTotal();
    });
});

function actualizarTotal() {
    let suma = 0;

    document.querySelectorAll("#tabla-ventas tr").forEach(row => {
        let total = parseFloat(row.children[3].textContent.replace("S/",""));
        suma += total;
    });

    totalGeneral.textContent = suma.toFixed(2);
}

function guardarVenta(mes, monto) {
  let ventas = JSON.parse(localStorage.getItem("ventas")) || [];

  ventas.push({ mes, total: monto });
  localStorage.setItem("ventas", JSON.stringify(ventas));
}
