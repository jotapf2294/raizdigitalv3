/**
 * Códice do Jota — Talhões (SPA real)
 */

import { db, addLog } from './db.js';

/* =========================================================
   🧠 SAFE STORE
========================================================= */

function getStore(mode = 'readonly') {
  if (!db) throw new Error('DB não inicializada');
  const tx = db.transaction('talhoes', mode);
  return tx.objectStore('talhoes');
}

/* =========================================================
   🌱 CREATE
========================================================= */

export function createTalhao(data) {
  try {
    const store = getStore('readwrite');

    const request = store.add({
      nome: data.nome,
      cultura: data.cultura || '',
      area: data.area || '',
      notas: data.notas || '',
      criadoEm: new Date().toISOString()
    });

    request.onsuccess = () => {
      addLog(`🌱 Talhão criado: ${data.nome}`);
    };

    request.onerror = () => {
      console.error('Erro ao criar talhão');
    };

  } catch (err) {
    console.error(err);
  }
}

/* =========================================================
   🪓 DELETE
========================================================= */

export function deleteTalhao(id) {
  try {
    const store = getStore('readwrite');

    store.delete(id);

    addLog(`🪓 Talhão removido: ${id}`);

  } catch (err) {
    console.error(err);
  }
}

/* =========================================================
   📜 READ
========================================================= */

export function getTalhoes() {
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

export async function renderTalhoes() {
  const talhoes = await getTalhoes();

  return `
    <section class="talhoes">

      <h2>🌱 Talhões da Horta</h2>

      <form id="talhaoForm" class="card">
        <h3>Semear Talhão</h3>

        <input name="nome" placeholder="Nome" required />
        <input name="cultura" placeholder="Cultura" />
        <input name="area" placeholder="Área (m²)" />
        <textarea name="notas" placeholder="Notas"></textarea>

        <button type="submit">🌱 Guardar</button>
      </form>

      <div class="lista-talhoes">

        ${
          talhoes.length
            ? talhoes.map(t => `
                <div class="card">
                  <h3>${t.nome}</h3>

                  <p>Cultura: ${t.cultura || '—'}</p>
                  <p>Área: ${t.area || '—'} m²</p>

                  ${t.notas ? `<p>${t.notas}</p>` : ''}

                  <button data-delete="${t.id}">
                    🪓 Apagar
                  </button>
                </div>
              `).join('')
            : `<p>🌿 Nenhum talhão semeado ainda.</p>`
        }

      </div>

    </section>
  `;
}

/* =========================================================
   🔗 EVENTS (SPA SAFE)
========================================================= */

export function bindTalhoesEvents() {
  const form = document.getElementById('talhaoForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(form));

      createTalhao(data);
      form.reset();

      // re-render controlado pelo router
      window.dispatchEvent(new Event('navigate-refresh'));
    });
  }

  document.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => {
      deleteTalhao(Number(btn.dataset.delete));

      window.dispatchEvent(new Event('navigate-refresh'));
    });
  });
}
