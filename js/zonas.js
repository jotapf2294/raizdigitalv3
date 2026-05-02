/**
 * ZONAS MODULE v3.0 - Engenharia Inteligente
 */

const ZonasModule = {
    // Helper para calcular se precisa de rega
    precisaRega: (ultimaRega, frequenciaWiki) => {
        if (!ultimaRega) return true;
        const hoje = new Date();
        const ultima = new Date(ultimaRega);
        const diffDias = Math.floor((hoje - ultima) / (1000 * 60 * 60 * 24));
        
        // Lógica de cálculo baseada na Wiki
        let limite = 3; // Padrão Média
        if (frequenciaWiki === 'Alta') limite = 1;
        if (frequenciaWiki === 'Baixa') limite = 5;
        
        return diffDias >= limite;
    },

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
        
        let html = '';
        for (const zona of zonas) {
            const cultivos = await db.cultivos.where('zonaId').equals(zona.id).toArray();
            
            html += `
                <div class="fb-card">
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding-bottom:8px">
                        <h3 style="margin:0">${zona.icon} ${zona.nome}</h3>
                        <button class="btn-save" style="padding:4px 10px; font-size:0.7rem" onclick="ZonasModule.openAddPlantToZone(${zona.id})">+ Plantar</button>
                    </div>

                    <div style="margin-top:10px">
                        ${cultivos.length === 0 ? '<p style="font-size:0.8rem; opacity:0.6">Zona vazia.</p>' : ''}
                        ${await ZonasModule.renderCultivos(cultivos)}
                    </div>
                </div>
            `;
        }
        container.innerHTML = html;
    },

    renderCultivos: async (cultivos) => {
        let itemsHtml = '';
        for (const c of cultivos) {
            const especie = await db.especies.get(c.especieId);
            const alertaRega = ZonasModule.precisaRega(c.ultimaRega, especie.rega);
            
            itemsHtml += `
                <div class="cultivo-item" style="background:var(--bg-secondary); border-radius:12px; padding:12px; margin-bottom:10px; border: 1px solid ${alertaRega ? '#ff444455' : 'var(--border)'}">
                    <div style="display:flex; justify-content:space-between">
                        <div>
                            <span style="font-weight:bold; font-size:1.1rem">${especie.nome}</span>
                            <span style="font-size:0.7rem; background:var(--accent); color:white; padding:2px 6px; border-radius:4px; margin-left:5px">${c.origem}</span>
                        </div>
                        <div class="item-actions">
                            <button onclick="ZonasModule.removeCultivo(${c.id})">❌</button>
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; font-size:0.75rem; margin:8px 0; gap:5px">
                        <div>📅 Plantio: <b>${c.dataPlantio}</b></div>
                        <div>💧 Última Rega: <b>${c.ultimaRega || 'Nunca'}</b></div>
                    </div>

                    <div style="display:flex; gap:10px; align-items:center; margin-top:10px">
                        <button onclick="ZonasModule.registrarRega(${c.id})" 
                                style="flex:1; padding:8px; border-radius:8px; border:none; background:${alertaRega ? '#ff4444' : '#4488ff'}; color:white; font-weight:bold; cursor:pointer">
                            ${alertaRega ? '⚠️ REGAR AGORA' : '💧 Regado'}
                        </button>
                    </div>

                    <div style="margin-top:10px">
                        <textarea onchange="ZonasModule.updateNotas(${c.id}, this.value)" 
                                  placeholder="Notas de crescimento (ex: surgiram as primeiras folhas...)" 
                                  style="width:100%; font-size:0.75rem; padding:8px; border-radius:6px; border:1px solid var(--border); background:var(--bg-primary); color:var(--text-primary)">${c.notasDesenvolvimento || ''}</textarea>
                    </div>
                </div>
            `;
        }
        return itemsHtml;
    },

    openAddPlantToZone: async (zonaId) => {
        const especies = await db.especies.toArray();
        const modalDiv = document.createElement('div');
        modalDiv.id = 'modal-overlay';
        modalDiv.className = 'modal-overlay';
        modalDiv.innerHTML = `
            <div class="modal-card">
                <h3>Novo Cultivo</h3>
                <label>Planta da Wiki</label>
                <select id="p-especie">
                    ${especies.map(e => `<option value="${e.id}">${e.nome}</option>`).join('')}
                </select>
                
                <label>Origem</label>
                <select id="p-origem">
                    <option value="Semente">🌱 Semente</option>
                    <option value="Clone">✂️ Clone / Estaca</option>
                    <option value="Muda">🌿 Muda Comprada</option>
                </select>

                <label>Data de Plantio</label>
                <input type="date" id="p-data" value="${new Date().toISOString().split('T')[0]}">

                <div class="modal-actions">
                    <button class="btn-cancel" onclick="ZonasModule.closeModal()">Cancelar</button>
                    <button class="btn-save" onclick="ZonasModule.saveCultivo(${zonaId})">Confirmar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalDiv);
    },

    saveCultivo: async (zonaId) => {
        const especieId = Number(document.getElementById('p-especie').value);
        const origem = document.getElementById('p-origem').value;
        const dataPlantio = document.getElementById('p-data').value;
        
        await db.cultivos.add({
            zonaId,
            especieId,
            dataPlantio,
            origem,
            ultimaRega: '',
            statusNutrientes: 'ok',
            notasDesenvolvimento: ''
        });
        
        ZonasModule.closeModal();
        ZonasModule.loadZonas();
    },

    registrarRega: async (id) => {
        const hoje = new Date().toISOString().split('T')[0];
        await db.cultivos.update(id, { ultimaRega: hoje });
        ZonasModule.loadZonas();
    },

    updateNotas: async (id, val) => {
        await db.cultivos.update(id, { notasDesenvolvimento: val });
    },

    removeCultivo: async (id) => {
        if(confirm("Remover cultivo?")) {
            await db.cultivos.delete(id);
            ZonasModule.loadZonas();
        }
    },

    closeModal: () => document.getElementById('modal-overlay')?.remove()
};

window.ZonasModule = ZonasModule;
