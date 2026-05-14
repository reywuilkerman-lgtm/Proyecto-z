// Cargar historial al iniciar
document.addEventListener('DOMContentLoaded', () => {
    mostrarHistorial();
    document.getElementById('date-now').innerText = new Date().toLocaleDateString();
});

function registrarMovimiento() {
    const tasa = parseFloat(document.getElementById('tasaBCV').value);
    const monto = parseFloat(document.getElementById('montoInput').value);
    const moneda = document.getElementById('monedaInput').value;
    const concepto = document.getElementById('concepto').value || "Sin concepto";

    if (!monto) return alert("Ingresa un monto");

    let bs, usd;
    if (moneda === "USD") {
        usd = monto;
        bs = monto * tasa;
    } else {
        bs = monto;
        usd = monto / tasa;
    }

    // Actualizar Pantalla Principal
    document.getElementById('displayBS').innerText = bs.toLocaleString('es-VE') + " Bs.";
    document.getElementById('displayUSD').innerText = "$ " + usd.toLocaleString('en-US');

    // Guardar en Historial
    const movimiento = {
        id: Date.now(),
        concepto,
        bs,
        usd,
        fecha: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };

    let historial = JSON.parse(localStorage.getItem('finanzas')) || [];
    historial.unshift(movimiento); // Agregar al inicio
    localStorage.setItem('finanzas', JSON.stringify(historial));

    mostrarHistorial();
    limpiarCampos();
}

function mostrarHistorial() {
    const lista = document.getElementById('listaHistorial');
    const historial = JSON.parse(localStorage.getItem('finanzas')) || [];
    
    lista.innerHTML = historial.map(m => `
        <div class="history-item">
            <div>
                <strong>${m.concepto}</strong>
                <small>${m.fecha}</small>
            </div>
            <div style="text-align: right">
                <div>${m.bs.toFixed(2)} Bs.</div>
                <small style="color: #00e676">$ ${m.usd.toFixed(2)}</small>
            </div>
        </div>
    `).join('');
}

function limpiarCampos() {
    document.getElementById('montoInput').value = "";
    document.getElementById('concepto').value = "";
}

function limpiarHistorial() {
    if(confirm("¿Borrar todos los registros?")) {
        localStorage.removeItem('finanzas');
        mostrarHistorial();
    }
}
