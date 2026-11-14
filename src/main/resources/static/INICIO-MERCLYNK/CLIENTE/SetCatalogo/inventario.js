const form = document.getElementById("form-producto");
const tablaBody = document.getElementById("tabla-body");

let inventario = [];

// Agregar producto
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const precio = parseFloat(document.getElementById("precio").value);
  const stock = parseInt(document.getElementById("stock").value);

  inventario.push({ nombre, precio, stock });

  form.reset();
  actualizarTabla();
});

// Mostrar productos en tabla
function actualizarTabla() {
  tablaBody.innerHTML = "";

  inventario.forEach((producto, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${producto.nombre}</td>
      <td>S/. ${producto.precio.toFixed(2)}</td>
      <td>${producto.stock}</td>
      <td>
        <button class="btn-eliminar" onclick="eliminarProducto(${index})">Eliminar</button>
      </td>
    `;

    tablaBody.appendChild(row);
  });
}

// Eliminar producto
function eliminarProducto(i) {
  inventario.splice(i, 1);
  actualizarTabla();
}
