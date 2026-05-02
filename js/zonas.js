/**
 * ZONAS MODULE v2.0 - Gestão Detalhada
 */

const ZonasModule = {
    render: async (container) => {
        container.innerHTML = `
            <div class="fb-card">
                <div style="display:flex; justify-content:space-between; align-items:center">
                    <h2 style="margin:0">🗺️ Gestão de Zonas</h2>
                    <button class="circle-btn" onclick="ZonasModule.openAddZoneModal()">+</button>
                </div>
            </div>

            <div id="zonas-detalhadas-container"></div>
        `;
        ZonasModule.loadZonas();
    },

    loadZonas: async () => {
        const container = document.getElementById('zonas-detalhadas-container');
        const zonas = await db.zonas.toArray();
        
        if (zonas.length === 0) {
            container.innerHTML = `<div class="fb-card" style="text-align:center">Nenhuma zona criada. Começa por adicionar um canteiro ou estufa!</div>`;
            return;
        }

        let html = '';
        for (const zona of zonas) {
            // Ir buscar as plantas que pertencem a esta zona
            const cultivos = await db.cultivos.where('zonaId').equals(zona.id).toArray();
            
            html += `
                <div class="fb-card zona-premium">
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding-bottom:10px; margin-bottom:10px">
                        <div style="display:flex; align-items:center; gap:10px">
                            <span style="font-size:2rem">${zona.icon}</span>
                            <h3 style="margin:0">${zona.nome}</h3>
                        </div>
                        <button onclick="ZonasModule.openAddPlantToZone(${zona.id})" style="background:var(--accent); color:white; border:none; padding:5px 12px; border-radius:15px; font-size:0.8rem; cursor:pointer">+ Adicionar Planta</button>
                    </div>

                    <div class="cultivos-lista">
                        ${cultivos.length === 0 ? '<p style="font-size:0.8rem; color:var(--text-secondary)">Zona vazia. Adiciona plantas da tua Wiki.</p>' : ''}
                        ${await ZonasModule.renderCultivos(cultivos)}
                    </div>

                    <div style="margin-top:15px; display:flex; justify-content:flex-end">
                        <button onclick="ZonasModule.deleteZona(${zona.id})" style="background:none; border:none; color:red; font-size:0.75rem; cursor:pointer">🗑️ Eliminar Zona</button>
                    </div>
                </div>
            `;
        }
        container.innerHTML = html;
    },

    // Renderiza cada planta dentro da zona
    renderCultivos: async (cultivos) => {
        let itemsHtml = '';
        for (const c of cultivos) {
            const especie = await db.especies.get(c.especieId);
            const icon = WikiModule.getCategoryIcon(especie.categoria);
            
            itemsHtml += `
                <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-primary); padding:10px; border-radius:8px; margin-bottom:8px; border:1px solid var(--border)">
                    <div>
                        <div style="font-weight:bold">${icon} ${especie.nome}</div>
                        <div style="font-size:0.7rem; color:var(--text-secondary)">Plantado em: ${c.dataPlantio}</div>
                    </div>
                    <div style="display:flex; gap:8px">
                        <button onclick="ZonasModule.updateStatus(${c.id}, 'rega')" title="Rega" style="background:none; border:1px solid var(--border); border-radius:5px; padding:3px 6px">
                            ${c.statusRega === 'ok' ? '💧' : '⚠️💧'}
                        </button>
                        <button onclick="ZonasModule.updateStatus(${c.id}, 'nutri')" title="Nutrientes" style="background:none; border:1px solid var(--border); border-radius:5px; padding:3px 6px">
                            ${c.statusNutrientes === 'ok' ? '🧪' : '⚠️🧪'}
                        </button>
                        <button onclick="ZonasModule.removeCultivo(${c.id})" style="background:none; border:none">❌</button>
                    </div>
                </div>
            `;
        }
        return itemsHtml;
    },

    // Modal para escolher planta da Wiki e meter na Zona
    openAddPlantToZone: async (zonaId) => {
        const especies = await db.especies.toArray();
        const modalDiv = document.createElement('div');
        modalDiv.id = 'modal-overlay';
        modalDiv.className = 'modal-overlay';
        modalDiv.innerHTML = `
            <div class="modal-card">
                <h3>Plantar na Zona</h3>
                <label>Escolhe uma planta da tua Wiki:</label>
                <select id="p-especie" style="margin-bottom:15px">
                    ${especies.map(e => `<option value="${e.id}">${WikiModule.getCategoryIcon(e.categoria)} ${e.nome}</option>`).join('')}
                </select>
                
                <label>Data de Plantio:</label>
                <input type="date" id="p-data" value="${new Date().toISOString().split('T')[0]}">

                <div class="modal-actions">
                    <button class="btn-cancel" onclick="ZonasModule.closeModal()">Cancelar</button>
                    <button class="btn-save" onclick="ZonasModule.saveCultivo(${zonaId})">Confirmar Plantio</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalDiv);
    },

    saveCultivo: async (zonaId) => {
        const especieId = Number(document.getElementById('p-especie').value);
        const dataPlantio = document.getElementById('p-data').value;
        
        await db.cultivos.add({
            zonaId,
            especieId,
            dataPlantio,
            statusRega: 'ok',
            statusNutrientes: 'ok'
        });
        
        ZonasModule.closeModal();
        ZonasModule.loadZonas();
    },

    updateStatus: async (id, tipo) => {
        const c = await db.cultivos.get(id);
        if (tipo === 'rega') {
            await db.cultivos.update(id, { statusRega: c.statusRega === 'ok' ? 'alert' : 'ok' });
        } else {
            await db.cultivos.update(id, { statusNutrientes: c.statusNutrientes === 'ok' ? 'alert' : 'ok' });
        }
        ZonasModule.loadZonas();
    },

    removeCultivo: async (id) => {
        if(confirm("Remover esta planta da zona?")) {
            await db.cultivos.delete(id);
            ZonasModule.loadZonas();
        }
    },

    openAddZoneModal: () => {
        const modalDiv = document.createElement('div');
        modalDiv.id = 'modal-overlay';
        modalDiv.className = 'modal-overlay';
        modalDiv.innerHTML = `
            <div class="modal-card">
                <h3>Nova Zona de Cultivo</h3>
                <input type="text" id="z-nome" placeholder="Ex: Canteiro Norte">
                <select id="z-icon">
                    <option value="🌿">🌿 Geral</option>
                    <option value="🏠">🏠 Estufa</option>
                    <option value="🌳">🌳 Pomar</option>
                    <option value="🏺">🏺 Vasos</option>
                </select>
                <div class="modal-actions">
                    <button class="btn-cancel" onclick="ZonasModule.closeModal()">Cancelar</button>
                    <button class="btn-save" onclick="ZonasModule.saveZona()">Criar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalDiv);
    },

    saveZona: async () => {
        const nome = document.getElementById('z-nome').value;
        const icon = document.getElementById('z-icon').value;
        if (nome) {
            await db.zonas.add({ nome, icon });
            ZonasModule.closeModal();
            ZonasModule.loadZonas();
        }
    },

    deleteZona: async (id) => {
        if(confirm("Eliminar esta zona e todos os seus cultivos?")) {
            await db.zonas.delete(id);
            await db.cultivos.where('zonaId').equals(id).delete();
            ZonasModule.loadZonas();
        }
    },

    closeModal: () => document.getElementById('modal-overlay')?.remove()
};

window.ZonasModule = ZonasModule;
