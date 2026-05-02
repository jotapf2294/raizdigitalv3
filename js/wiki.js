/**
 * Módulo Wiki v2.0 - Engenharia Sénior
 * Refinado: Sem input de emoji, com Notas e UI otimizada.
 */

const WikiModule = {
    // Helper para ícones de categoria automáticos
    getCategoryIcon: (cat) => {
        const icons = {
            'Frutos': '🍅',
            'Folhas': '🥬',
            'Raízes': '🥕',
            'Aromáticas': '🌿',
            'Geral': '🌱'
        };
        return icons[cat] || icons['Geral'];
    },

    render: async (container) => {
        container.innerHTML = `
            <div class="fb-card">
                <div class="search-container">
                    <input type="text" id="wiki-search" placeholder="🔍 Pesquisar na tua enciclopédia..." oninput="WikiModule.handleSearch(this.value)">
                </div>
            </div>
            
            <div id="wiki-list-container"></div>

            <button class="fab" onclick="WikiModule.openAddModal()" title="Adicionar Planta">+</button>
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
                <div class="fb-card" style="text-align:center; padding: 40px;">
                    <span style="font-size: 3rem">🍃</span>
                    <p style="color:var(--text-secondary); margin-top:10px">Nenhuma planta encontrada.</p>
                </div>`;
            return;
        }

        listContainer.innerHTML = especies.map(e => `
            <div class="fb-card wiki-item">
                <div style="display:flex; justify-content:space-between; align-items:start">
                    <div>
                        <h3 style="margin:0; display:flex; align-items:center; gap:8px">
                            ${WikiModule.getCategoryIcon(e.categoria)} ${e.nome}
                        </h3>
                        <small style="background: var(--bg-primary); padding: 2px 8px; border-radius: 10px; color: var(--accent); font-weight: bold;">
                            ${e.categoria}
                        </small>
                    </div>
                    <div class="item-actions">
                        <button onclick="WikiModule.openEditModal(${e.id})" style="font-size:1.2rem">✏️</button>
                        <button onclick="WikiModule.deleteItem(${e.id})" style="font-size:1.2rem; margin-left:8px">🗑️</button>
                    </div>
                </div>

                <div class="grid-details">
                    <div class="detail">🌙 Lua: <strong>${e.lua}</strong></div>
                    <div class="detail">💧 Rega: <strong>${e.rega}</strong></div>
                    <div class="detail">☀️ Sol: <strong>${e.sol || 'Pleno'}</strong></div>
                    <div class="detail">📅 Meses: <strong>${e.meses || 'N/A'}</strong></div>
                </div>

                ${e.notas ? `
                    <div style="margin-top:12px; padding:10px; background:var(--bg-primary); border-radius:8px; font-size:0.85rem; border-left: 3px solid var(--accent)">
                        <strong>📝 Notas:</strong> ${e.notas}
                    </div>
                ` : ''}
            </div>
        `).join('');
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
                <h3 style="margin-top:0; color:var(--accent)">${title}</h3>
                <input type="hidden" id="form-id" value="${data.id || ''}">
                
                <label style="font-size:0.8rem; color:var(--text-secondary)">Nome da Planta</label>
                <input type="text" id="form-nome" placeholder="Ex: Manjericão" value="${data.nome || ''}">
                
                <label style="font-size:0.8rem; color:var(--text-secondary)">Categoria</label>
                <select id="form-cat">
                    <option value="Frutos" ${data.categoria === 'Frutos' ? 'selected' : ''}>🍅 Frutos</option>
                    <option value="Folhas" ${data.categoria === 'Folhas' ? 'selected' : ''}>🥬 Folhas</option>
                    <option value="Raízes" ${data.categoria === 'Raízes' ? 'selected' : ''}>🥕 Raízes</option>
                    <option value="Aromáticas" ${data.categoria === 'Aromáticas' ? 'selected' : ''}>🌿 Aromáticas</option>
                </select>

                <div class="form-row">
                    <div>
                        <label style="font-size:0.8rem; color:var(--text-secondary)">🌙 Lua Ideal</label>
                        <select id="form-lua">
                            <option ${data.lua === 'Crescente' ? 'selected' : ''}>Crescente</option>
                            <option ${data.lua === 'Minguante' ? 'selected' : ''}>Minguante</option>
                            <option ${data.lua === 'Nova' ? 'selected' : ''}>Nova</option>
                            <option ${data.lua === 'Cheia' ? 'selected' : ''}>Cheia</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size:0.8rem; color:var(--text-secondary)">💧 Rega</label>
                        <select id="form-rega">
                            <option ${data.rega === 'Baixa' ? 'selected' : ''}>Baixa</option>
                            <option ${data.rega === 'Média' ? 'selected' : ''}>Média</option>
                            <option ${data.rega === 'Alta' ? 'selected' : ''}>Alta</option>
                        </select>
                    </div>
                </div>

                <label style="font-size:0.8rem; color:var(--text-secondary)">📅 Época de Plantio</label>
                <input type="text" id="form-meses" placeholder="Ex: Março a Junho" value="${data.meses || ''}">

                <label style="font-size:0.8rem; color:var(--text-secondary)">📝 Notas Culturais</label>
                <textarea id="form-notas" rows="3" placeholder="Dicas de adubação, pragas comuns..." style="width:100%; border-radius:8px; padding:10px; border:1px solid var(--border); background:var(--bg-primary); color:var(--text-primary); font-family:inherit;">${data.notas || ''}</textarea>

                <div class="modal-actions">
                    <button class="btn-cancel" onclick="WikiModule.closeModal()">Cancelar</button>
                    <button class="btn-save" onclick="WikiModule.save()">Guardar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalDiv);
    },

    closeModal: () => {
        const overlay = document.getElementById('modal-overlay');
        if(overlay) overlay.remove();
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

        if (!payload.nome) { alert("Dá um nome à planta, amigo!"); return; }

        if (id) {
            await db.especies.update(Number(id), payload);
        } else {
            await db.especies.add(payload);
        }

        WikiModule.closeModal();
        WikiModule.loadList();
    },

    deleteItem: async (id) => {
        if (confirm("Eliminar esta planta da tua Wiki?")) {
            await db.especies.delete(id);
            WikiModule.loadList();
        }
    }
};

window.WikiModule = WikiModule;
