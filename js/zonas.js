/**
 * ZONAS MODULE - js/zonas.js
 * Gere os espaços físicos da horta.
 */

const ZonasModule = {
    render: async (container) => {
        container.innerHTML = `
            <div class="fb-card">
                <div style="display:flex; justify-content:space-between; align-items:center">
                    <h2 style="margin:0">🗺️ As Minhas Zonas</h2>
                    <button class="circle-btn" onclick="ZonasModule.openAddModal()">+</button>
                </div>
                <p style="color:var(--text-secondary); font-size:0.9rem">
                    Organiza a tua horta por setores para melhor controlo.
                </p>
            </div>

            <div id="zonas-list" class="grid-container">
                </div>
        `;
        ZonasModule.loadZonas();
    },

    loadZonas: async () => {
        const listContainer = document.getElementById('zonas-list');
        const zonas = await db.zonas.toArray();

        if (zonas.length === 0) {
            listContainer.innerHTML = `
                <div class="fb-card" style="text-align:center; grid-column: 1 / -1;">
                    <p>Ainda não tens zonas criadas.</p>
                    <button class="btn-save" style="width:auto; padding:10px 20px" onclick="ZonasModule.openAddModal()">Criar Primeira Zona</button>
                </div>`;
            return;
        }

        listContainer.innerHTML = zonas.map(z => `
            <div class="fb-card zona-card">
                <div class="zona-icon">${z.icon || '🌿'}</div>
                <div class="zona-info">
                    <h3>${z.nome}</h3>
                    <button class="btn-edit" onclick="ZonasModule.delete(${z.id})">Apagar</button>
                </div>
            </div>
        `).join('');
    },

    openAddModal: () => {
        const modalDiv = document.createElement('div');
        modalDiv.id = 'modal-overlay';
        modalDiv.className = 'modal-overlay';
        modalDiv.innerHTML = `
            <div class="modal-card">
                <h3>Nova Zona</h3>
                <input type="text" id="z-nome" placeholder="Nome (ex: Canteiro de Tomates)">
                <select id="z-icon">
                    <option value="🌿">🌿 Geral</option>
                    <option value="🏠">🏠 Estufa</option>
                    <option value="🌳">🌳 Pomar</option>
                    <option value="🏺">🏺 Vasos</option>
                    <option value="💧">💧 Zona Húmida</option>
                </select>
                <div class="modal-actions">
                    <button class="btn-cancel" onclick="ZonasModule.closeModal()">Cancelar</button>
                    <button class="btn-save" onclick="ZonasModule.save()">Criar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalDiv);
    },

    save: async () => {
        const nome = document.getElementById('z-nome').value;
        const icon = document.getElementById('z-icon').value;

        if (nome) {
            await db.zonas.add({ nome, icon });
            ZonasModule.closeModal();
            ZonasModule.loadZonas();
        }
    },

    delete: async (id) => {
        if (confirm("Tens a certeza que queres eliminar esta zona?")) {
            await db.zonas.delete(id);
            ZonasModule.loadZonas();
        }
    },

    closeModal: () => {
        document.getElementById('modal-overlay').remove();
    }
};

// Tornar disponível para o main.js
window.ZonasModule = ZonasModule;
