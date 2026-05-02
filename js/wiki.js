/**
 * WIKI MODULE - js/wiki.js
 * Sistema de Enciclopédia com Notas e Design Premium.
 */

const WikiModule = {
    // Sistema Automático de Emojis por Categoria
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
                    <input type="text" id="wiki-search" placeholder="🔍 Pesquisar na tua horta..." oninput="WikiModule.handleSearch(this.value)">
                </div>
            </div>
            
            <div id="wiki-list-container"></div>

            <button class="fab" onclick="WikiModule.openAddModal()" title="Nova Planta">+</button>
        `;
        WikiModule.loadList();
    },

    loadList: async (filter = "") => {
        const listContainer = document.getElementById('wiki-list-container');
        let especies = await db.especies.toArray();

        if (filter) {
            especies = especies.filter(e => e.nome.toLowerCase().includes(filter.toLowerCase()));
        }

        if (especies.length === 0) {
            listContainer.innerHTML = `
                <div class="fb-card" style="text-align:center; padding: 40px; color: var(--text-secondary)">
                    <p style="font-size: 2rem; margin:0">🍃</p>
                    <p>Nenhuma espécie registada.</p>
                </div>`;
            return;
        }

        listContainer.innerHTML = especies.map(e => `
            <div class="fb-card">
                <div style="display:flex; justify-content:space-between; align-items:start">
                    <div>
                        <h3 style="margin:0; font-size:1.3rem">
                            ${WikiModule.getCategoryIcon(e.categoria)} ${e.nome}
                        </h3>
                        <span style="font-size:0.75rem; color:var(--accent); font-weight:bold; text-transform:uppercase">
                            ${e.categoria}
                        </span>
                    </div>
                    <div class="item-actions">
                        <button onclick="WikiModule.openEditModal(${e.id})" style="background:none; border:none; cursor:pointer">✏️</button>
                        <button onclick="WikiModule.deleteItem(${e.id})" style="background:none; border:none; cursor:pointer; margin-left:10px">🗑️</button>
                    </div>
                </div>

                <div class="grid-details" style="margin-top:15px; display:grid; grid-template-columns: 1fr 1fr; gap:10px; border-top:1px solid var(--border); padding-top:10px">
                    <div style="font-size:0.85rem">🌙 Lua: <strong>${e.lua}</strong></div>
                    <div style="font-size:0.85rem">💧 Rega: <strong>${e.rega}</strong></div>
                    <div style="font-size:0.85rem">☀️ Sol: <strong>${e.sol || 'Pleno'}</strong></div>
                    <div style="font-size:0.85rem">📅 Meses: <strong>${e.meses || '-'}</strong></div>
                </div>

                ${e.notas ? `
                    <div style="margin-top:12px; padding:12px; background:var(--bg-primary); border-radius:8px; font-size:0.85rem; border-left: 4px solid var(--accent); color: var(--text-primary)">
                        <strong>📝 Observações:</strong><br>${e.notas}
                    </div>
                ` : ''}
            </div>
        `).join('');
    },

    handleSearch: (val) => WikiModule.loadList(val),

    openAddModal: () => {
        WikiModule.showModal("Adicionar à Wiki", { nome: '', categoria: 'Frutos', lua: 'Crescente', rega: 'Média', sol: 'Pleno', meses: '', notas: '' });
    },

    openEditModal: async (id) => {
        const planta = await db.especies.get(id);
        WikiModule.showModal("Editar Espécie", planta);
    },

    showModal: (title, data) => {
        const modalDiv = document.createElement('div');
        modalDiv.id = 'modal-overlay';
        modalDiv.className = 'modal-overlay';
        modalDiv.innerHTML = `
            <div class="modal-card">
                <h2 style="margin-top:0; font-size:1.2rem; color:var(--accent)">${title}</h2>
                <input type="hidden" id="form-id" value="${data.id || ''}">
                
                <div style="margin-bottom:10px">
                    <label style="display:block; font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px">Nome da Planta</label>
                    <input type="text" id="form-nome" placeholder="Ex: Manjericão" value="${data.nome || ''}">
                </div>

                <div style="margin-bottom:10px">
                    <label style="display:block; font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px">Categoria</label>
                    <select id="form-cat">
                        <option value="Frutos" ${data.categoria === 'Frutos' ? 'selected' : ''}>🍅 Frutos</option>
                        <option value="Folhas" ${data.categoria === 'Folhas' ? 'selected' : ''}>🥬 Folhas</option>
                        <option value="Raízes" ${data.categoria === 'Raízes' ? 'selected' : ''}>🥕 Raízes</option>
                        <option value="Aromáticas" ${data.categoria === 'Aromáticas' ? 'selected' : ''}>🌿 Aromáticas</option>
                    </select>
                </div>

                <div class="form-row" style="display:flex; gap:10px; margin-bottom:10px">
                    <div style="flex:1">
                        <label style="display:block; font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px">🌙 Lua Ideal</label>
                        <select id="form-lua">
                            <option ${data.lua === 'Crescente' ? 'selected' : ''}>Crescente</option>
                            <option ${data.lua === 'Minguante' ? 'selected' : ''}>Minguante</option>
                            <option ${data.lua === 'Nova' ? 'selected' : ''}>Nova</option>
                            <option ${data.lua === 'Cheia' ? 'selected' : ''}>Cheia</option>
                        </select>
                    </div>
                    <div style="flex:1">
                        <label style="display:block; font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px">💧 Rega</label>
                        <select id="form-rega">
                            <option ${data.rega === 'Baixa' ? 'selected' : ''}>Baixa</option>
                            <option ${data.rega === 'Média' ? 'selected' : ''}>Média</option>
                            <option ${data.rega === 'Alta' ? 'selected' : ''}>Alta</option>
                        </select>
                    </div>
                </div>

                <div style="margin-bottom:10px">
                    <label style="display:block; font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px">📅 Meses de Plantio</label>
                    <input type="text" id="form-meses" placeholder="Ex: Fevereiro - Maio" value="${data.meses || ''}">
                </div>

                <div style="margin-bottom:15px">
                    <label style="display:block; font-size:0.75rem; color:var(--text-secondary); margin-bottom:4px">📝 Notas do Agricultor</label>
                    <textarea id="form-notas" rows="3" placeholder="Dicas extra...">${data.notas || ''}</textarea>
                </div>

                <div class="modal-actions" style="display:flex; gap:10px">
                    <button class="btn-cancel" style="flex:1" onclick="WikiModule.closeModal()">Cancelar</button>
                    <button class="btn-save" style="flex:2" onclick="WikiModule.save()">Guardar Planta</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalDiv);
    },

    closeModal: () => {
        const overlay = document.getElementById('modal-overlay');
        if (overlay) overlay.remove();
    },

    save: async () => {
        const id = document.getElementById('form-id').value;
        const payload = {
            nome: document.getElementById('form-nome').value.trim(),
            categoria: document.getElementById('form-cat').value,
            lua: document.getElementById('form-lua').value,
            rega: document.getElementById('form-rega').value,
            sol: 'Pleno',
            meses: document.getElementById('form-meses').value.trim(),
            notas: document.getElementById('form-notas').value.trim()
        };

        if (!payload.nome) {
            alert("Amigo, a planta precisa de um nome!");
            return;
        }

        try {
            if (id) {
                await db.especies.update(Number(id), payload);
            } else {
                await db.especies.add(payload);
            }
            WikiModule.closeModal();
            WikiModule.loadList();
        } catch (err) {
            console.error("Erro ao guardar:", err);
            alert("Houve um erro ao guardar os dados.");
        }
    },

    deleteItem: async (id) => {
        if (confirm("Queres mesmo remover esta espécie da tua Wiki?")) {
            await db.especies.delete(id);
            WikiModule.loadList();
        }
    }
};

window.WikiModule = WikiModule;
