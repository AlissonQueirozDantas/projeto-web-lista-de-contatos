class Contato {
    constructor(nome, email, telefone, endereco) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.endereco = endereco;
    }

    get nome() { return this._nome; }
    set nome(valor) {
        if (!valor.trim()) throw new Error("Nome não pode ser vazio.");
        this._nome = valor.trim();
    }

    get email() { return this._email; }
    set email(valor) {
        if (!/\S+@\S+\.\S+/.test(valor)) throw new Error("E-mail inválido.");
        this._email = valor.trim();
    }

    get telefone() { return this._telefone; }
    set telefone(valor) {
        if (valor.trim().length < 8) throw new Error("Telefone inválido.");
        this._telefone = valor.trim();
    }

    get endereco() { return this._endereco; }
    set endereco(valor) {
        if (!valor.trim()) throw new Error("Endereço não pode ser vazio.");
        this._endereco = valor.trim();
    }
}

const icones = {
    telefone: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M6.62 10.79a15.091 15.091 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21 11.36 11.36 0 003.58.57 1 1 0 011 1v3.5a1 1 0 01-1 1A16 16 0 013 5a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.58 1 1 0 01-.21 1.11l-2.24 2.1z"/></svg>`,
    email: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
    endereco: `<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/></svg>`
};

function carregarContatos() {
    return JSON.parse(localStorage.getItem("contatos")) || [];
}

function salvarContatos(contatos) {
    localStorage.setItem("contatos", JSON.stringify(contatos));
}

function mostrarMensagem(texto, tipo = "sucesso") {
    const msg = document.getElementById("mensagem");
    msg.textContent = texto;
    msg.className = `mensagem ${tipo}`;
    msg.style.display = "block";
    setTimeout(() => msg.style.display = "none", 3500);
}

function renderizarTabela() {
    const tbody = document.querySelector("#tabelaContatos tbody");
    tbody.innerHTML = "";
    contatos.forEach((c, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.nome}</td>
            <td>${c.email}</td>
            <td>${c.telefone}</td>
            <td>${c.endereco}</td>
            <td>
                <button class="btn btn-edit" aria-label="Editar contato ${c.nome}" onclick="abrirModal(${i})">✏️</button>
                <button class="btn btn-delete" aria-label="Remover contato ${c.nome}" onclick="removerContato(${i})">🗑</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderizarCartoes() {
    const container = document.getElementById("cartoesContatos");
    container.innerHTML = "";
    contatos.forEach((c, i) => {
        const card = document.createElement("article");
        card.className = "cartao-contato";
        card.innerHTML = `
            <div class="nome">${c.nome}</div>
            <div class="info-contato" title="E-mail">${icones.email}<span>${c.email}</span></div>
            <div class="info-contato" title="Telefone">${icones.telefone}<span>${c.telefone}</span></div>
            <div class="info-contato" title="Endereço">${icones.endereco}<span>${c.endereco}</span></div>
            <div class="acoes-cartao">
                <button class="btn btn-edit" aria-label="Editar contato ${c.nome}" onclick="abrirModal(${i})">✏️ Editar</button>
                <button class="btn btn-delete" aria-label="Remover contato ${c.nome}" onclick="removerContato(${i})">🗑 Remover</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function atualizarInterface() {
    renderizarTabela();
    renderizarCartoes();
}

function adicionarContato(event) {
    event.preventDefault();
    try {
        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const telefone = document.getElementById("telefone").value;
        const endereco = document.getElementById("endereco").value;

        const novo = new Contato(nome, email, telefone, endereco);
        contatos.push(novo);
        salvarContatos(contatos);
        atualizarInterface();
        mostrarMensagem("Contato adicionado com sucesso!", "sucesso");
        event.target.reset();
    } catch (e) {
        mostrarMensagem(e.message, "erro");
    }
}

function removerContato(index) {
    if(confirm(`Tem certeza que deseja remover o contato "${contatos[index].nome}"?`)) {
        contatos.splice(index, 1);
        salvarContatos(contatos);
        atualizarInterface();
        mostrarMensagem("Contato removido!", "sucesso");
    }
}

let indiceEdicao = null;
function abrirModal(index) {
    indiceEdicao = index;
    const c = contatos[index];
    document.getElementById("editNome").value = c.nome;
    document.getElementById("editEmail").value = c.email;
    document.getElementById("editTelefone").value = c.telefone;
    document.getElementById("editEndereco").value = c.endereco;
    document.getElementById("modalEdicao").style.display = "flex";
    document.getElementById("editNome").focus();
}

function fecharModal() {
    document.getElementById("modalEdicao").style.display = "none";
}

document.getElementById("formContato").addEventListener("submit", adicionarContato);

document.getElementById("formEdicao").addEventListener("submit", function(e) {
    e.preventDefault();
    try {
        const nome = document.getElementById("editNome").value;
        const email = document.getElementById("editEmail").value;
        const telefone = document.getElementById("editTelefone").value;
        const endereco = document.getElementById("editEndereco").value;

        const atualizado = new Contato(nome, email, telefone, endereco);
        contatos[indiceEdicao] = atualizado;
        salvarContatos(contatos);
        atualizarInterface();
        mostrarMensagem("Contato atualizado!", "sucesso");
        fecharModal();
    } catch (e) {
        mostrarMensagem(e.message, "erro");
    }
});

// Fecha modal ao clicar fora do conteúdo
document.getElementById("modalEdicao").addEventListener("click", (e) => {
    if(e.target === e.currentTarget) fecharModal();
});

let contatos = carregarContatos();
atualizarInterface();
