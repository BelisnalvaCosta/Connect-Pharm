document.addEventListener("DOMContentLoaded", () => {
    mostrarRelatorio();
});

function cadastrarMedicamento() {
    const nome = document.getElementById('nome').value.trim();
    const quantidadeEstoque = document.getElementById('quantidadeEstoque').value.trim();
    const quantidadeSaida = document.getElementById('quantidadeSaida').value.trim();
    const preco = document.getElementById('preco').value.trim();
    const localidadeFarmacia = document.getElementById('localidadeFarmacia').value.trim();

    if (!nome || !quantidadeEstoque || !quantidadeSaida || !preco || !localidadeFarmacia) {
        alert('Preencha todos os campos!');
        return;
    }

    let medicamentos = JSON.parse(localStorage.getItem('medicamentos')) || [];
    medicamentos.push({ nome, quantidadeEstoque, quantidadeSaida, preco, localidadeFarmacia });
    localStorage.setItem('medicamentos', JSON.stringify(medicamentos));

    alert('Medicamento cadastrado com sucesso!');
    limparCampos();
    mostrarRelatorio();
}

function mostrarRelatorio() {
    let medicamentos = JSON.parse(localStorage.getItem('medicamentos')) || [];
    const lista = document.getElementById('listaMedicamentos');
    lista.innerHTML = '';

    medicamentos.forEach((medicamento, index) => {
        let li = document.createElement('li');
        li.innerHTML = `${medicamento.nome} - ${medicamento.quantidadeEstoque} em estoque - R$${medicamento.preco}
            <button onclick="editarMedicamento(${index})">Editar</button>
            <button onclick="excluirMedicamento(${index})">Excluir</button>`;
        lista.appendChild(li);
    });
}

function excluirMedicamento(index) {
    let medicamentos = JSON.parse(localStorage.getItem('medicamentos')) || [];
    medicamentos.splice(index, 1);
    localStorage.setItem('medicamentos', JSON.stringify(medicamentos));
    mostrarRelatorio();
}

function editarMedicamento(index) {
    let medicamentos = JSON.parse(localStorage.getItem('medicamentos')) || [];
    let medicamento = medicamentos[index];

    document.getElementById('nome').value = medicamento.nome;
    document.getElementById('quantidadeEstoque').value = medicamento.quantidadeEstoque;
    document.getElementById('quantidadeSaida').value = medicamento.quantidadeSaida;
    document.getElementById('preco').value = medicamento.preco;
    document.getElementById('localidadeFarmacia').value = medicamento.localidadeFarmacia;

    excluirMedicamento(index);
}

function buscarMedicamento() {
    let termo = document.getElementById('busca').value.toLowerCase();
    let medicamentos = JSON.parse(localStorage.getItem('medicamentos')) || [];
    const lista = document.getElementById('listaMedicamentos');
    lista.innerHTML = '';

    medicamentos.forEach((medicamento, index) => {
        if (medicamento.nome.toLowerCase().includes(termo)) {
            let li = document.createElement('li');
            li.innerHTML = `${medicamento.nome} - ${medicamento.quantidadeEstoque} em estoque - R$${medicamento.preco}
                <button onclick="editarMedicamento(${index})">Editar</button>
                <button onclick="excluirMedicamento(${index})">Excluir</button>`;
            lista.appendChild(li);
        }
    });
}

function exportarCSV() {
    let medicamentos = JSON.parse(localStorage.getItem('medicamentos')) || [];
    let csvContent = "Nome,QuantidadeEstoque,QuantidadeSaida,Preco,LocalidadeFarmacia\n" + 
        medicamentos.map(m => `${m.nome},${m.quantidadeEstoque},${m.quantidadeSaida},${m.preco},${m.localidadeFarmacia}`).join("\n");

    let blob = new Blob([csvContent], { type: 'text/csv' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'relatorio_medicamentos.csv';
    link.click();
}

function limparCampos() {
    document.getElementById('nome').value = '';
    document.getElementById('quantidadeEstoque').value = '';
    document.getElementById('quantidadeSaida').value = '';
    document.getElementById('preco').value = '';
    document.getElementById('localidadeFarmacia').value = '';
}