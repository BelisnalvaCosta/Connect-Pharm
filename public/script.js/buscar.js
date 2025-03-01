document.addEventListener("DOMContentLoaded", function () {
    const formBuscar = document.getElementById("buscar-form");

    if (formBuscar) {
        formBuscar.addEventListener("submit", async (event) => {
            event.preventDefault();
            const medicamento = document.getElementById("medicamento").value;

            const response = await fetch('/buscar_medicamento', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ medicamento })
            });

            const data = await response.json();
            document.getElementById("resultado").innerText = data.message || 
                `Medicamento: ${data.nome}, Local: ${data.local}, Preço: R$ ${data.preco}`;
        });
    }
});
