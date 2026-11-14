// Leer ventas desde localStorage
const ventas = JSON.parse(localStorage.getItem("ventas")) || [];

// Leer inventario desde localStorage
const inventario = JSON.parse(localStorage.getItem("inventario")) || [];

// ----------- GRAFICO VENTAS (Barras + Línea) ----------
const meses = ventas.map(v => v.mes);
const totales = ventas.map(v => v.total);

new Chart(document.getElementById("graficoVentas"), {
    type: "bar",
    data: {
        labels: meses,
        datasets: [
            {
                label: "Ventas (S/.)",
                data: totales,
                backgroundColor: "rgba(0, 200, 255, 0.7)"
            },
            {
                label: "Tendencia",
                data: totales,
                borderWidth: 2,
                type: "line",
                fill: false
            }
        ]
    }
});

// ----------- GRAFICO INVENTARIO (Pie) ----------
const productos = inventario.map(p => p.producto);
const cantidades = inventario.map(p => p.cantidad);

new Chart(document.getElementById("graficoInventario"), {
    type: "pie",
    data: {
        labels: productos,
        datasets: [{
            data: cantidades
        }]
    }
});
