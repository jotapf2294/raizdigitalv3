/**

Códice do Jota — Herbário Vivo (Fase IV)

Sistema de conhecimento botânico offline

CRUD completo de plantas + UI + eventos */


import { db, addLog } from './db.js';

/* ========================================================= 🌿 CREATE — Nova planta ========================================================= */ export function createPlanta(data) { const tx = db.transaction('plantas', 'readwrite'); const store = tx.objectStore('plantas');

const request = store.add({ nome: data.nome, latin: data.latin || '', familia: data.familia || '', ciclo: data.ciclo || '', agua: data.agua || '', tipo: data.tipo || '', aliados: data.aliados || '', inimigos: data.inimigos || '', notas: data.notas || '', criadoEm: new Date().toISOString() });

request.onsuccess = () => { addLog(🌿 Planta adicionada ao Herbário: ${data.nome}); };

request.onerror = () => { console.error('Erro ao criar planta'); }; }

/* ========================================================= 🪓 DELETE — Remover planta ========================================================= */ export function deletePlanta(id) { const tx = db.transaction('plantas', 'readwrite'); const store = tx.objectStore('plantas');

store.delete(id); addLog(🪓 Planta removida: ${id}); }

/* ========================================================= 📜 READ — Listar plantas ========================================================= */ export function getPlantas() { return new Promise((resolve) => { const tx = db.transaction('plantas', 'readonly'); const store = tx.objectStore('plantas');

const request = store.getAll();

request.onsuccess = () => {
  resolve(request.result || []);
};

}); }

/* ========================================================= 🖼️ RENDER — Herbário Vivo ========================================================= */ export async function renderHerbario() { const plantas = await getPlantas();

return ` <section class="herbario">

<h2>🌿 Herbário Vivo</h2>

  <form id="plantaForm" class="card">
    <h3>Adicionar Planta</h3>

    <input name="nome" placeholder="Nome vulgar" required />
    <input name="latin" placeholder="Nome latino" />
    <input name="familia" placeholder="Família" />
    <input name="ciclo" placeholder="Ciclo (anual, perene...)" />
    <input name="agua" placeholder="Necessidade de água" />
    <input name="tipo" placeholder="Tipo (folha, fruto, raiz...)" />

    <input name="aliados" placeholder="Aliados" />
    <input name="inimigos" placeholder="Inimigos / pragas" />

    <textarea name="notas" placeholder="Segredos do cultivo"></textarea>

    <button type="submit">🌱 Guardar no Herbário</button>
  </form>

  <div class="lista-herbario">
    ${plantas.length === 0
      ? `<p>🌿 O Herbário ainda está vazio.</p>`
      : plantas.map(p => `
          <div class="card">
            <h3>${p.nome}</h3>
            <p><em>${p.latin || ''}</em></p>

            <p><strong>Família:</strong> ${p.familia || '—'}</p>
            <p><strong>Ciclo:</strong> ${p.ciclo || '—'}</p>
            <p><strong>Água:</strong> ${p.agua || '—'}</p>
            <p><strong>Tipo:</strong> ${p.tipo || '—'}</p>

            <p><strong>Aliados:</strong> ${p.aliados || '—'}</p>
            <p><strong>Inimigos:</strong> ${p.inimigos || '—'}</p>

            ${p.notas ? `<p><em>${p.notas}</em></p>` : ''}

            <button data-delete="${p.id}">🪓 Remover</button>
          </div>
        `).join('')}
  </div>

</section>

`; }

/* ========================================================= 🔗 EVENTS — Liga UI ao Herbário ========================================================= */ export function bindHerbarioEvents() { const form = document.getElementById('plantaForm');

if (form) { form.addEventListener('submit', (e) => { e.preventDefault();

const data = Object.fromEntries(new FormData(form));

  createPlanta(data);
  form.reset();

  setTimeout(() => location.reload(), 100);
});

}

document.querySelectorAll('[data-delete]').forEach(btn => { btn.addEventListener('click', () => { deletePlanta(Number(btn.dataset.delete)); setTimeout(() => location.reload(), 100); }); }); }
