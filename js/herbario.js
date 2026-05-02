/**
 * Códice do Jota — Herbário Vivo (Fase IV corrigida)
 */

import { db, addLog } from './db.js';

/* =========================================================
   🧠 SAFE DB CHECK
========================================================= */

function getStore(mode = 'readonly') {
  if (!db) throw new Error('DB ainda não inicializada');

  const tx = db.transaction('plantas', mode);
  return tx.objectStore('plantas');
}

/* =========================================================
   🌿 CREATE
========================================================= */

export function createPlanta(data) {
  try {
    const store = getStore('readwrite');

    const request = store.add({
      nome: data.nome,
      latin: data.latin || '',
      familia: data.familia || '',
      ciclo: data.ciclo || '',
      agua: data.agua || '',
      tipo: data.tipo || '',
      aliados: data.aliados || '',
      inimigos: data.inimigos || '',
      notas: data.notas || '',
      criadoEm: new Date().toISOString()
    });

    request.onsuccess = () => {
      addLog(`🌿 Planta adicionada ao Herbário: ${data.nome}`);
    };

    request.onerror = () => {
      console.error('Erro ao criar planta');
    };

  } catch (err) {
    console.error('DB error:', err);
  }
}

/* =========================================================
   🪓 DELETE
========================================================= */

export function deletePlanta(id) {
  try {
    const store = getStore('readwrite');

    store.delete(id);

    addLog(`🪓 Planta removida: ${id}`);

  } catch (err) {
    console.error(err);
  }
}

/* =========================================================
   📜 READ
========================================================= */

export function getPlantas() {
  return new Promise((resolve, reject) => {
    try {
      const store = getStore('readonly');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);

    } catch (err) {
      reject(err);
    }
  });
}

/* =========================================================
   🖼️ RENDER
========================================================= */

export async function renderHerbario() {
  const plantas = await getPlantas();

  return `
    <section class="herbario">

      <h2>🌿 Herbário Vivo</h2>

      <form id="plantaForm" class="card">
        <h3>Adicionar Planta</h3>

        <input name="nome" placeholder="Nome vulgar" required />
        <input name="latin" placeholder="Nome latino" />
        <input name="familia" placeholder="Família" />
        <input name="ciclo" placeholder="Ciclo" />
        <input name="agua" placeholder="Água" />
        <input name="tipo" placeholder="Tipo" />

        <input name="aliados" placeholder="Aliados" />
        <input name="inimigos" placeholder="Inimigos" />

        <textarea name="notas" placeholder="Segredos do cultivo"></textarea>

        <button type="submit">🌱 Guardar</button>
      </form>

      <div class="lista-herbario">

        ${
          plantas.length === 0
            ? `<p>🌿 Herbário vazio</p>`
            : plantas.map(p => `
                <div class="card">
                  <h3>${p.nome}</h3>
                  <p><em>${p.latin || ''}</em></p>

                  <p>Família: ${p.familia || '—'}</p>
                  <p>Ciclo: ${p.ciclo || '—'}</p>
                  <p>Água: ${p.agua || '—'}</p>

                  <button data-delete="${p.id}">🪓 Remover</button>
                </div>
              `).join('')
        }

      </div>

    </section>
  `;
}

/* =========================================================
   🔗 EVENTS (SEM reload)
========================================================= */

export function bindHerbarioEvents() {
  const form = document.getElementById('plantaForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(form));

      createPlanta(data);
      form.reset();

      // re-render suave (sem reload brutal)
      setTimeout(() => window.dispatchEvent(new Event('navigate-refresh')), 50);
    });
  }

  document.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => {
      deletePlanta(Number(btn.dataset.delete));

      setTimeout(() => window.dispatchEvent(new Event('navigate-refresh')), 50);
    });
  });
}
