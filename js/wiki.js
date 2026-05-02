/**
 * WIKI MODULE v3.0 - Engenharia Sénior
 * - Agrupamento por categorias com Expand/Collapse
 * - Textarea de notas expandida
 * - UI estilo Facebook Groups
 */

const WikiModule = {
    // Estado interno para controlar quais categorias estão abertas
    expandedCategories: {
        'Frutos': true,
        'Folhas': true,
        'Raízes': true,
        'Aromáticas': true
    },

    getCategoryIcon: (cat) => {
        const icons = {
            'Frutos': '🍅',
            'Folhas': '🥬',
            'Raízes': '🥕',
            'Aromáticas': '🌿'
        };
        return icons[cat] || '🌱';
    },

    render: async (container) => {
        container.innerHTML = `
            <div class="fb-card">
                <div class="search-container">
                    <input type="text" id="wiki-search" placeholder="🔍 Procurar espécie..." oninput="WikiModule.handleSearch(this.value)">
                </div>
            </div>
            
            <div id="wiki-list-container"></div>

            <button class="fab" onclick="WikiModule.openAddModal()">+</button>
        `;
        WikiModule.loadList();
    },

    toggleCategory: (cat) => {
        WikiModule.expandedCategories[cat] = !WikiModule.expandedCategories[cat];
        WikiModule.loadList(document.getElementById('wiki-search').value);
    },

    loadList: async (filter = "") => {
        const listContainer = document.getElementById('wiki-list-container');
        let especies = await db.especies.toArray();

        if (filter) {
            especies = especies.filter(e => e.nome.toLowerCase().includes(filter.toLowerCase()));
        }

        // Agrupar por categorias
        const categorias = ['Frutos', 'Folhas', 'Raízes', 'Aromáticas'];
        
        if (especies.length === 0) {
            listContainer.innerHTML = `<div class="fb-card"><p style="text-align:center">Nenhuma planta encontrada.</p></div>`;
            return;
        }

        let html = '';

        categorias.forEach(cat => {
            const itensDaCat = especies.filter(e => e.categoria === cat);
            if (itensDaCat.length === 0 && !filter) return; // Se não houver nada e não houver filtro, pula

            const isExpanded = WikiModule.expandedCategories[cat];

            html += `
                <div class="category-group" style="margin-bottom: 10px;">
                    <div class="category-header" onclick="WikiModule.toggleCategory('${cat}')" 
                         style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:var(--bg-secondary); border-radius:8px; cursor:pointer; font-weight:bold; border-bottom: 1px solid var(--border)">
                        <span>${WikiModule.getCategoryIcon(cat)} ${cat} (${itensDaCat.length})</span>
                        <span>${isExpanded ? '▼' : '▶'}</span>
                    </div>
                    
                    <div class="category-content" style="display: ${isExpanded ? 'block' : 'none'}">
                        ${itensDaCat.map(e => `
                            <div class="fb-card wiki-item" style="margin: 5px 10px; border-left: 4px solid var(--accent)">
                                <div style="display:flex; justify-content:space-between; align-items:start">
                                    <h3 style="margin:0">${WikiModule.getCategoryIcon(e.categoria)} ${e.nome}</h3>
                                    <div class="item-actions">
                                        <button onclick="WikiModule.openEditModal(${e.id})">✏️</button>
                                        <button onclick="WikiModule.deleteItem(${e.id})" style="color:red">🗑️</button>
                                    </div>
                                </div>
                                
                                <div class="grid-details" style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:10px; font-size:0.85rem">
                                    <div>🌙 Lua: <b>${e.lua}</b></div>
                                    <div>💧 Rega: <b>${e.rega}</b></div>
                                    <div>☀️ Sol: <b>${e.sol}</b></div>
                                    <div>📅 Meses: <b>${e.meses}</b></div>
                                </div>

                                ${e.notas ? `
                                    <div style="margin-top:10px; padding:10px; background:var(--bg-primary); border-radius:8px; font-size:0.85rem; border:1px solid var(--border)">
                                        <div style="margin-bottom:4px; opacity:0.7">📝 <b>Observações:</b></div>
                                        ${e.notas}
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        listContainer.innerHTML = html;
    },

    handleSearch: (val) => WikiModule.loadList(val),

    openAddModal: () => {
        WikiModule.showModal("Adicionar Planta", { nome: '', categoria: 'Frutos', lua: 'Crescente', rega: 'Média', sol: 'Pleno', meses: '', notas: '' });
    },

    openEditModal: async (id) => {
        const planta = await db.especies.get(id);
        WikiModule.showModal("Editar Planta", planta);
    },

    showModal: (title, data) => {
        const modalDiv = document.createElement('div');
        modalDiv.id = 'modal-overlay';
        modalDiv.className = 'modal-overlay';
        modalDiv.innerHTML = `
            <div class="modal-card">
                <h3 style="margin-top:0">${title}</h3>
                <input type="hidden" id="form-id" value="${data.id || ''}">
                
                <label>Nome</label>
                <input type="text" id="form-nome" placeholder="Nome da planta" value="${data.nome}">
                
                <label>Categoria</label>
                <select id="form-cat">
                    <option value="Frutos" ${data.categoria === 'Frutos' ? 'selected' : ''}>🍅 Frutos</option>
                    <option value="Folhas" ${data.categoria === 'Folhas' ? 'selected' : ''}>🥬 Folhas</option>
                    <option value="Raízes" ${data.categoria === 'Raízes' ? 'selected' : ''}>🥕 Raízes</option>
                    <option value="Aromáticas" ${data.categoria === 'Aromáticas' ? 'selected' : ''}>🌿 Aromáticas</option>
                </select>

                <div class="form-row" style="display:flex; gap:10px">
                    <div style="flex:1">
                        <label>🌙 Lua</label>
                        <select id="form-lua">
                            <option ${data.lua === 'Crescente' ? 'selected' : ''}>Crescente</option>
                            <option ${data.lua === 'Minguante' ? 'selected' : ''}>Minguante</option>
                            <option ${data.lua === 'Nova' ? 'selected' : ''}>Nova</option>
                            <option ${data.lua === 'Cheia' ? 'selected' : ''}>Cheia</option>
                        </select>
                    </div>
                    <div style="flex:1">
                        <label>💧 Rega</label>
                        <select id="form-rega">
                            <option ${data.rega === 'Baixa' ? 'selected' : ''}>Baixa</option>
                            <option ${data.rega === 'Média' ? 'selected' : ''}>Média</option>
                            <option ${data.rega === 'Alta' ? 'selected' : ''}>Alta</option>
                        </select>
                    </div>
                </div>

                <label>📅 Meses de Plantio</label>
                <input type="text" id="form-meses" placeholder="Fev - Mai" value="${data.meses}">

                <label>📝 Observações Culturais</label>
                <textarea id="form-notas" placeholder="Escreve aqui dicas importantes..." 
                          style="width:100%; min-height:120px; padding:10px; border-radius:8px; border:1px solid var(--border); background:var(--bg-primary); color:var(--text-primary); font-family:inherit; resize:vertical;">${data.notas || ''}</textarea>

                <div class="modal-actions" style="margin-top:15px; display:flex; gap:10px">
                    <button class="btn-cancel" onclick="WikiModule.closeModal()">Cancelar</button>
                    <button class="btn-save" onclick="WikiModule.save()">Salvar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalDiv);
    },

    closeModal: () => {
        const m = document.getElementById('modal-overlay');
        if(m) m.remove();
    },

    save: async () => {
        const id = document.getElementById('form-id').value;
        const payload = {
            nome: document.getElementById('form-nome').value,
            categoria: document.getElementById('form-cat').value,
            lua: document.getElementById('form-lua').value,
            rega: document.getElementById('form-rega').value,
            sol: 'Pleno',
            meses: document.getElementById('form-meses').value,
            notas: document.getElementById('form-notas').value
        };

        if (id) await db.especies.update(Number(id), payload);
        else await db.especies.add(payload);

        WikiModule.closeModal();
        WikiModule.loadList();
    },

    deleteItem: async (id) => {
        if (confirm("Apagar planta?")) {
            await db.especies.delete(id);
            WikiModule.loadList();
        }
    }
};

window.WikiModule = WikiModule;