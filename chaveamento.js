let torneios = [];
let chaveamentoAtual = {
    A: { times: [], chaveamento: null },
    B: { times: [], chaveamento: null },
    finalistas: { A: null, B: null }
};

function criarTorneio() {
    const nome = document.getElementById("nomeTorneio").value.trim();
    if (nome === "") {
        alert("Digite um nome para o torneio!");
        return false;
    }

    let torneio = {
        nome: nome,
        times: [],
        id: `torneio-${Date.now()}`,
        chaveamento: null,
        minimizado: false
    };

    torneios.push(torneio);
    document.getElementById("nomeTorneio").value = "";
    
    console.log("Torneio criado:", torneio);
    console.log("Lista de torneios:", torneios);
    
    atualizarTela();
    return false;
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
    
    if (torneio.times.includes(nomeTime)) {
        alert("Este time já está no torneio!");
        return;
    }
    
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
    selecionarTorneio(torneioId);
}

function gerarChaveamento(times) {
    times = [...times].sort(() => Math.random() - 0.5);
    let partidas = [];
    for (let i = 0; i < times.length; i += 2) {
        partidas.push({ 
            time1: times[i], 
            time2: times[i+1] || 'BYE', // Caso número ímpar
            vencedor: null 
        });
    }
    return partidas;
}

function definirVencedor(torneioId, index, vencedor) {
    let torneio = torneios.find(t => t.id === torneioId);
    let partida = torneio.chaveamento[index];

    partida.vencedor = vencedor;
    let vencedores = torneio.chaveamento.filter(jogo => jogo.vencedor).map(jogo => jogo.vencedor);

    if (vencedores.length === torneio.chaveamento.length) {
        if (vencedores.length > 1) {
            torneio.chaveamento = gerarChaveamento(vencedores);
        } else {
            alert(`🏆 O campeão do torneio "${torneio.nome}" é ${vencedores[0]}!`);
        }
    }
    selecionarTorneio(torneioId);
}

function minimizarTorneio(torneioId) {
    let torneio = torneios.find(t => t.id === torneioId);
    torneio.minimizado = !torneio.minimizado;
    atualizarTela();
}

function selecionarTorneio(torneioId) {
    const torneio = torneios.find(t => t.id === torneioId);
    if (!torneio) {
        document.getElementById("chaveamento-display").innerHTML = 
            '<p>Selecione um torneio válido</p>';
        return;
    }

    if (torneio.chaveamento) {
        if (torneio.times.length >= 4) {
            // Chaveamento duplo
            const timesEmbaralhados = [...torneio.times].sort(() => Math.random() - 0.5);
            const metade = Math.ceil(timesEmbaralhados.length / 2);
            
            chaveamentoAtual.A.times = timesEmbaralhados.slice(0, metade);
            chaveamentoAtual.B.times = timesEmbaralhados.slice(metade);
            
            chaveamentoAtual.A.chaveamento = gerarChaveamento(chaveamentoAtual.A.times);
            chaveamentoAtual.B.chaveamento = gerarChaveamento(chaveamentoAtual.B.times);
            
            document.getElementById("chaveamento-display").innerHTML = `
                <div class="chaveamento-duplo">
                    <div class="chave-box" id="chave-A">
                        <h3>Chave A</h3>
                        <div class="bracket"></div>
                    </div>
                    <div class="final-box" id="final-box">
                        <h3>🏆 Final</h3>
                        <div class="match-final"></div>
                    </div>
                    <div class="chave-box" id="chave-B">
                        <h3>Chave B</h3>
                        <div class="bracket"></div>
                    </div>
                </div>
            `;
            atualizarChaveamentoDuplo();
        } else {
            // Chaveamento simples
            document.getElementById("chaveamento-display").innerHTML = `
                <div class="chaveamento-simples">
                    <h2>Chaveamento: ${torneio.nome}</h2>
                    <div class="bracket"></div>
                </div>
            `;
            atualizarChaveamentoSimples(torneio);
        }
    } else {
        document.getElementById("chaveamento-display").innerHTML = 
            `<p>O torneio "${torneio.nome}" não tem chaveamento iniciado.</p>`;
    }
}

function atualizarChaveamentoSimples(torneio) {
    const bracketDiv = document.querySelector('.chaveamento-simples .bracket');
    if (!bracketDiv) return;
    
    bracketDiv.innerHTML = '';
    let faseAtual = torneio.chaveamento;
    let faseNumero = 1;
    
    while (faseAtual && faseAtual.length > 0) {
        const roundDiv = document.createElement('div');
        roundDiv.className = 'round';
        roundDiv.innerHTML = `<h3>${faseAtual.length > 1 ? `Fase ${faseNumero}` : 'Final'}</h3>`;
        
        const showConnectors = faseNumero > 1 ? 'block' : 'none';
        
        faseAtual.forEach((partida, index) => {
            const matchDiv = document.createElement('div');
            matchDiv.className = 'match';
            matchDiv.style.setProperty('--show-connector', showConnectors);
            
            matchDiv.innerHTML = `
                <div class="team ${partida.vencedor === partida.time1 ? 'winner' : ''}">
                    ${partida.time1}
                </div>
                <div class="team ${partida.vencedor === partida.time2 ? 'winner' : ''}">
                    ${partida.time2}
                </div>
                <div class="match-actions">
                    <button onclick="definirVencedor('${torneio.id}', ${index}, '${partida.time1}')">Vencedor ↑</button>
                    <button onclick="definirVencedor('${torneio.id}', ${index}, '${partida.time2}')">Vencedor ↓</button>
                </div>
            `;
            
            roundDiv.appendChild(matchDiv);
        });
        
        bracketDiv.appendChild(roundDiv);
        const vencedores = faseAtual.filter(p => p.vencedor && p.vencedor !== 'BYE').map(p => p.vencedor);
        faseAtual = vencedores.length > 1 ? gerarChaveamento(vencedores) : null;
        faseNumero++;
    }
}

function atualizarChaveamentoDuplo() {
    const chaveADiv = document.querySelector('#chave-A .bracket');
    const chaveBDiv = document.querySelector('#chave-B .bracket');
    const finalDiv = document.querySelector('.match-final');
    
    // Atualiza Chave A
    if (chaveADiv) {
        chaveADiv.innerHTML = '';
        if (chaveamentoAtual.A.chaveamento) {
            chaveamentoAtual.A.chaveamento.forEach((partida, index) => {
                const partidaDiv = document.createElement('div');
                partidaDiv.className = 'match';
                partidaDiv.innerHTML = `
                    <div class="team ${partida.vencedor === partida.time1 ? 'winner' : ''}">
                        ${partida.time1}
                    </div>
                    <div class="team ${partida.vencedor === partida.time2 ? 'winner' : ''}">
                        ${partida.time2}
                    </div>
                    <div class="match-actions">
                        <button onclick="definirVencedorDuplo('A', ${index}, '${partida.time1}')">Vencedor</button>
                        <button onclick="definirVencedorDuplo('A', ${index}, '${partida.time2}')">Vencedor</button>
                    </div>
                `;
                chaveADiv.appendChild(partidaDiv);
            });
        }
    }
    
    // Atualiza Chave B
    if (chaveBDiv) {
        chaveBDiv.innerHTML = '';
        if (chaveamentoAtual.B.chaveamento) {
            chaveamentoAtual.B.chaveamento.forEach((partida, index) => {
                const partidaDiv = document.createElement('div');
                partidaDiv.className = 'match';
                partidaDiv.innerHTML = `
                    <div class="team ${partida.vencedor === partida.time1 ? 'winner' : ''}">
                        ${partida.time1}
                    </div>
                    <div class="team ${partida.vencedor === partida.time2 ? 'winner' : ''}">
                        ${partida.time2}
                    </div>
                    <div class="match-actions">
                        <button onclick="definirVencedorDuplo('B', ${index}, '${partida.time1}')">Vencedor</button>
                        <button onclick="definirVencedorDuplo('B', ${index}, '${partida.time2}')">Vencedor</button>
                    </div>
                `;
                chaveBDiv.appendChild(partidaDiv);
            });
        }
    }
    
    // Atualiza Final
    if (finalDiv) {
        finalDiv.innerHTML = '';
        if (chaveamentoAtual.finalistas.A && chaveamentoAtual.finalistas.B) {
            finalDiv.innerHTML = `
                <div class="team">${chaveamentoAtual.finalistas.A}</div>
                <div class="vs">vs</div>
                <div class="team">${chaveamentoAtual.finalistas.B}</div>
                <div class="match-actions">
                    <button onclick="definirCampeao('${chaveamentoAtual.finalistas.A}')">Campeão</button>
                    <button onclick="definirCampeao('${chaveamentoAtual.finalistas.B}')">Campeão</button>
                </div>
            `;
        }
    }
}

function definirVencedorDuplo(chave, index, vencedor) {
    const chaveAtual = chaveamentoAtual[chave];
    chaveAtual.chaveamento[index].vencedor = vencedor;
    
    const vencedores = chaveAtual.chaveamento.filter(p => p.vencedor && p.vencedor !== 'BYE').map(p => p.vencedor);
    
    if (vencedores.length === chaveAtual.chaveamento.length) {
        if (vencedores.length > 1) {
            chaveAtual.chaveamento = gerarChaveamento(vencedores);
        } else {
            chaveamentoAtual.finalistas[chave] = vencedores[0];
        }
    }
    
    atualizarChaveamentoDuplo();
}

function definirCampeao(campeao) {
    alert(`🏆 ${campeao} é o campeão do torneio!`);
    chaveamentoAtual = {
        A: { times: [], chaveamento: null },
        B: { times: [], chaveamento: null },
        finalistas: { A: null, B: null }
    };
    document.getElementById("chaveamento-display").innerHTML = '<p>Selecione um torneio para ver o chaveamento</p>';
}

function atualizarTela() {
    const listaContainer = document.getElementById("torneios-container");
    if (!listaContainer) return;
    
    listaContainer.innerHTML = "";

    torneios.slice().reverse().forEach((torneio) => {
        let div = document.createElement("div");
        div.className = "torneio";
        div.id = `torneio-${torneio.id}`;

        div.innerHTML = `
            <div class="torneio-header">
                <h2>${torneio.nome}</h2>
                <button class="minimizar" onclick="minimizarTorneio('${torneio.id}')">
                    ${torneio.minimizado ? "🔽" : "🔼"}
                </button>
            </div>
            <div id="conteudo-${torneio.id}" style="display: ${torneio.minimizado ? "none" : "block"}">
                <div class="botoes-torneio">
                    <button onclick="adicionarTime('${torneio.id}')">➕ Adicionar Time</button>
                    <button onclick="iniciarChaveamento('${torneio.id}')">🏆 Iniciar Chaveamento</button>
                    <button onclick="selecionarTorneio('${torneio.id}')">👀 Selecionar</button>
                </div>
                <div class="times-container">
                    <h3>Times: ${torneio.times.length}</h3>
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

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    atualizarTela();
});