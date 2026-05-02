/**
 * Módulo Wiki - Sistema CRUD e Pesquisa
 * Responsável por gerir o catálogo de espécies
 */

const WikiModule = {
    // Renderiza a vista principal da Wiki
    render: async (container) => {
        container.innerHTML = `
            <div class="fb-card">
                <div class="search-container">
                    <input type="text" id="wiki-search" placeholder="🔍 Pesquisar planta..." oninput="WikiModule.handleSearch(this.value)">
                </div>
            </div>
            
            <div id="wiki-list-container">
                </div>

            <button class="fab" onclick="WikiModule.openAddModal()">+</button>
        `;
        WikiModule.loadList();
    },

    // Carrega e filtra a lista de plantas
    loadList: async (filter = "") => {
        const listContainer = document.getElementById('wiki-list-container');
        let especies = await db.especies.toArray();

        if (filter) {
            especies = especies.filter(e => e.nome.toLowerCase().includes(filter.toLowerCase()));
        }

        if (especies.length === 0) {
            listContainer.innerHTML = `<div class="fb-card"><p style="text-align:center">Nenhuma planta encontrada.</p></div>`;
            return;
        }

        listContainer.innerHTML = especies.map(e => `
            <div class="fb-card wiki-item">
                <div style="display:flex; justify-content:space-between; align-items:start">
                    <div>
                        <h3 style="margin:0">${e.emoji || '🌱'} ${e.nome}</h3>
                        <small style="color:var(--accent)">${e.categoria}</small>
                    </div>
                    <div class="item-actions">
                        <button onclick="WikiModule.openEditModal(${e.id})">✏️</button>
                        <button onclick="WikiModule.deleteItem(${e.id})" style="color:red">🗑️</button>
                    </div>
                </div>
                <div class="grid-details">
                    <div class="detail">🌙 Lua: <b>${e.lua}</b></div>
                    <div class="detail">💧 Rega: <b>${e.rega}</b></div>
                    <div class="detail">☀️ Sol: <b>${e.sol}</b></div>
                    <div class="detail">📅 Meses: <b>${e.meses}</b></div>
                </div>
            </div>
        `).join('');
    },

    handleSearch: (val) => {
        WikiModule.loadList(val);
    },

    // CRUD: Criar (Abrir Modal)
    openAddModal: () => {
        WikiModule.showModal("Adicionar Planta", { nome: '', emoji: '', categoria: 'Frutos', lua: 'Crescente', rega: 'Média', sol: 'Pleno', meses: '' });
    },

    // CRUD: Editar (Abrir Modal com Dados)
    openEditModal: async (id) => {
        const planta = await db.especies.get(id);
        WikiModule.showModal("Editar Planta", planta);
    },

    // Helper: Desenha o Modal de formulário
    showModal: (title, data) => {
        const modalDiv = document.createElement('div');
        modalDiv.id = 'modal-overlay';
        modalDiv.className = 'modal-overlay';
        modalDiv.innerHTML = `
            <div class="modal-card">
                <h3>${title}</h3>
                <input type="hidden" id="form-id" value="${data.id || ''}">
                <input type="text" id="form-nome" placeholder="Nome da planta" value="${data.nome}">
                <input type="text" id="form-emoji" placeholder="Emoji (ex: 🍅)" value="${data.emoji}">
                
                <select id="form-cat">
                    <option ${data.categoria === 'Frutos' ? 'selected' : ''}>Frutos</option>
                    <option ${data.categoria === 'Folhas' ? 'selected' : ''}>Folhas</option>
                    <option ${data.categoria === 'Raízes' ? 'selected' : ''}>Raízes</option>
                    <option ${data.categoria === 'Aromáticas' ? 'selected' : ''}>Aromáticas</option>
                </select>

                <div class="form-row">
                    <select id="form-lua">
                        <option ${data.lua === 'Crescente' ? 'selected' : ''}>Crescente</option>
                        <option ${data.lua === 'Minguante' ? 'selected' : ''}>Minguante</option>
                        <option ${data.lua === 'Nova' ? 'selected' : ''}>Nova</option>
                        <option ${data.lua === 'Cheia' ? 'selected' : ''}>Cheia</option>
                    </select>
                    <select id="form-rega">
                        <option ${data.rega === 'Baixa' ? 'selected' : ''}>Baixa</option>
                        <option ${data.rega === 'Média' ? 'selected' : ''}>Média</option>
                        <option ${data.rega === 'Alta' ? 'selected' : ''}>Alta</option>
                    </select>
                </div>

                <input type="text" id="form-meses" placeholder="Meses de Plantio (ex: Fev - Mai)" value="${data.meses}">

                <div class="modal-actions">
                    <button class="btn-cancel" onclick="WikiModule.closeModal()">Cancelar</button>
                    <button class="btn-save" onclick="WikiModule.save()">Salvar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalDiv);
    },

    closeModal: () => {
        document.getElementById('modal-overlay').remove();
    },

    // CRUD: Salvar (Novo ou Update)
    save: async () => {
        const id = document.getElementById('form-id').value;
        const payload = {
            nome: document.getElementById('form-nome').value,
            emoji: document.getElementById('form-emoji').value,
            categoria: document.getElementById('form-cat').value,
            lua: document.getElementById('form-lua').value,
            rega: document.getElementById('form-rega').value,
            sol: 'Pleno', // Simplificado
            meses: document.getElementById('form-meses').value
        };

        if (id) {
            await db.especies.update(Number(id), payload);
        } else {
            await db.especies.add(payload);
        }

        WikiModule.closeModal();
        WikiModule.loadList();
    },

    // CRUD: Delete
    deleteItem: async (id) => {
        if (confirm("Tens a certeza que queres eliminar esta planta da Wiki?")) {
            await db.especies.delete(id);
            WikiModule.loadList();
        }
    }
};

// Integração com o main.js: exportar função de render
window.renderWiki = WikiModule.render;
              
