let torneios = [];

function criarTorneio() {
    const nome = document.getElementById("nomeTorneio").value.trim();
    if (nome === "") {
        alert("Digite um nome para o torneio!");
        return;
    }

    let torneio = {
        nome: nome,
        times: [],
        id: `torneio-${torneios.length}`,
        chaveamento: null
    };

    torneios.push(torneio);
    atualizarTela();
    document.getElementById("nomeTorneio").value = ""; // Limpa o campo
}

function editarTorneio(torneioId) {
    const nomeNovo = prompt("Digite o novo nome do torneio:");
    if (nomeNovo) {
        let torneio = torneios.find(t => t.id === torneioId);
        torneio.nome = nomeNovo;
        atualizarTela();
    }
}

function deletarTorneio(torneioId) {
    torneios = torneios.filter(t => t.id !== torneioId);
    atualizarTela();
}

function adicionarTime(torneioId) {
    const nomeTime = prompt("Digite o nome do time:");
    if (!nomeTime) return;

    let torneio = torneios.find(t => t.id === torneioId);
    torneio.times.push(nomeTime);
    atualizarTela();
}

function editarTime(torneioId, index) {
    const nomeNovo = prompt("Digite o novo nome do time:");
    if (nomeNovo) {
        let torneio = torneios.find(t => t.id === torneioId);
        torneio.times[index] = nomeNovo;
        atualizarTela();
    }
}

function deletarTime(torneioId, index) {
    let torneio = torneios.find(t => t.id === torneioId);
    torneio.times.splice(index, 1);
    atualizarTela();
}

function iniciarChaveamento(torneioId) {
    let torneio = torneios.find(t => t.id === torneioId);

    if (torneio.times.length < 2 || torneio.times.length % 2 !== 0) {
        alert("Adicione um número par de times para iniciar o chaveamento!");
        return;
    }

    torneio.chaveamento = gerarChaveamento(torneio.times);
    atualizarTela();
}

function gerarChaveamento(times) {
    // Embaralha os times de forma aleatória
    times = times.sort(() => Math.random() - 0.5);

    let partidas = [];
    for (let i = 0; i < times.length; i += 2) {
        partidas.push({ time1: times[i], time2: times[i + 1], vencedor: null });
    }
    return partidas;
}

function definirVencedor(torneioId, index, vencedor) {
    let torneio = torneios.find(t => t.id === torneioId);
    let partida = torneio.chaveamento[index];

    // Registra o vencedor da partida
    partida.vencedor = vencedor;

    // Filtra os vencedores de todas as partidas da fase atual
    let vencedores = torneio.chaveamento.filter(jogo => jogo.vencedor).map(jogo => jogo.vencedor);

    // Se todos os jogos da fase tiveram um vencedor
    if (vencedores.length === torneio.chaveamento.length) {
        // Se ainda houver mais de um vencedor, gera a próxima fase
        if (vencedores.length > 1) {
            torneio.chaveamento = gerarChaveamento(vencedores);
        } else {
            // Se só restar um vencedor, ele é o campeão
            alert(`🏆 O campeão do torneio "${torneio.nome}" é ${vencedores[0]}!`);
        }
    }

    // Atualiza apenas o chaveamento do torneio sem recarregar a tela inteira
    atualizarChaveamento(torneio);
}

function atualizarTela() {
    const listaContainer = document.getElementById("torneios-container");
    const chaveamentoContainer = document.getElementById("chaveamento-display");

    listaContainer.innerHTML = "";
    chaveamentoContainer.innerHTML = "";

    torneios.forEach((torneio) => {
        // Adiciona o torneio à lista à esquerda
        let div = document.createElement("div");
        div.classList.add("torneio");
        div.innerHTML = `
            <h2>${torneio.nome}</h2>
            <button onclick="editarTorneio('${torneio.id}')">Editar Torneio</button>
            <button onclick="deletarTorneio('${torneio.id}')">Deletar Torneio</button>
            <button onclick="adicionarTime('${torneio.id}')">Adicionar Time</button>
            <button onclick="iniciarChaveamento('${torneio.id}')">Iniciar Chaveamento</button>
            <button class="minimizar" onclick="minimizarTimes('${torneio.id}')">Minimizar</button>
            <div class="times-container" id="times-${torneio.id}">
                <h3>Times:</h3>
                ${torneio.times.map((time, index) => `
                    <div class="time">
                        ${time}
                        <div class="time-actions">
                            <button class="edit" onclick="editarTime('${torneio.id}', ${index})">Editar</button>
                            <button onclick="deletarTime('${torneio.id}', ${index})">Deletar</button>
                        </div>
                    </div>
                `).join("")}
            </div>
            <button onclick="selecionarTorneio('${torneio.id}')">Selecionar</button>
        `;
        listaContainer.appendChild(div);
    });
}

function minimizarTorneio(torneioId) {
    let conteudo = document.getElementById(`conteudo-${torneioId}`);
    let botao = document.querySelector(`#torneio-${torneioId} .minimizar`);

    if (conteudo.style.display === "none") {
        conteudo.style.display = "block";
        botao.innerHTML = "🔼";
    } else {
        conteudo.style.display = "none";
        botao.innerHTML = "🔽";
    }
}



function atualizarChaveamento(torneio) {
    const chaveamentoDiv = document.getElementById("chaveamento-display");

    chaveamentoDiv.innerHTML = `
        <h3>Chaveamento do Torneio: ${torneio.nome}</h3>
        ${torneio.chaveamento.map((jogo, index) => `
            <div class="fase">
                <div>
                    ${jogo.time1} vs ${jogo.time2}
                </div>
                <button onclick="definirVencedor('${torneio.id}', ${index}, '${jogo.time1}')">Vencer ${jogo.time1}</button>
                <button onclick="definirVencedor('${torneio.id}', ${index}, '${jogo.time2}')">Vencer ${jogo.time2}</button>
                ${jogo.vencedor ? `<div><strong>Vencedor: ${jogo.vencedor}</strong></div>` : ''}
            </div>
        `).join("")}
    `;
}

function selecionarTorneio(torneioId) {
    const torneio = torneios.find(t => t.id === torneioId);
    if (torneio.chaveamento) {
        atualizarChaveamento(torneio);
    }
}

function atualizarTela() {
    const listaContainer = document.getElementById("torneios-container");
    listaContainer.innerHTML = "";

    torneios.forEach((torneio) => {
        let div = document.createElement("div");
        div.classList.add("torneio");
        div.id = `torneio-${torneio.id}`;

        div.innerHTML = `
            <div class="torneio-header">
                <h2>${torneio.nome}</h2>
                <button class="minimizar" onclick="minimizarTorneio('${torneio.id}')">🔼</button>
            </div>
            <div id="conteudo-${torneio.id}">
                <div class="botoes-torneio">
                    <button onclick="adicionarTime('${torneio.id}')">➕ Adicionar Time</button>
                    <button onclick="iniciarChaveamento('${torneio.id}')">🏆 Iniciar Chaveamento</button>
                    <button onclick="selecionarTorneio('${torneio.id}')">👀 Selecionar</button>
                </div>
                <div class="times-container">
                    <h3>Times:</h3>
                    ${torneio.times.map((time, index) => `
                        <div class="time">
                            ${time}
                            <div class="time-actions">
                                <button class="edit" onclick="editarTime('${torneio.id}', ${index})">✏️ Editar</button>
                                <button onclick="deletarTime('${torneio.id}', ${index})">🗑️ Deletar</button>
                            </div>
                        </div>
                    `).join("")}
                </div>
                <div class="acoes-torneio">
                    <div class="botoes-secundarios">
                        <button onclick="editarTorneio('${torneio.id}')">✏️ Editar Torneio</button>
                        <button onclick="deletarTorneio('${torneio.id}')">🗑️ Deletar Torneio</button>
                    </div>
                </div>
            </div>
        `;

        listaContainer.appendChild(div);
    });
}
