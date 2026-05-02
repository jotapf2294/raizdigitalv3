/**
 * Códice do Jota — Arquivo do Sábio (SPA correto)
 */

import { db, addLog } from './db.js';

/* =========================================================
   🧠 SAFE STORE
========================================================= */

function getStore(mode = 'readonly') {
  if (!db) throw new Error('DB ainda não inicializada');
  const tx = db.transaction('notas', mode);
  return tx.objectStore('notas');
}

/* =========================================================
   📜 CREATE
========================================================= */

export function createNota(data) {
  try {
    const store = getStore('readwrite');

    const request = store.add({
      titulo: data.titulo,
      conteudo: data.conteudo || '',
      tags: data.tags || '',
      criadoEm: new Date().toISOString()
    });

    request.onsuccess = () => {
      addLog(`📜 Nota criada: ${data.titulo}`);
    };

    request.onerror = () => {
      console.error('Erro ao criar nota');
    };

  } catch (err) {
    console.error(err);
  }
}

/* =========================================================
   🪓 DELETE
========================================================= */

export function deleteNota(id) {
  try {
    const store = getStore('readwrite');

    store.delete(id);

    addLog(`🪓 Nota removida: ${id}`);

  } catch (err) {
    console.error(err);
  }
}

/* =========================================================
   📚 READ
========================================================= */

export function getNotas() {
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

export async function renderNotas() {
  const notas = await getNotas();

  return `
    <section class="notas">

      <h2>📜 Arquivo do Sábio</h2>

      <form id="notaForm" class="card">
        <h3>Nova Nota</h3>

        <input name="titulo" placeholder="Título" required />
        <input name="tags" placeholder="Tags" />
        <textarea name="conteudo" placeholder="Escreve aqui..."></textarea>

        <button type="submit">📜 Guardar</button>
      </form>

      <div class="lista-notas">

        ${
          notas.length === 0
            ? `<p>Sem notas ainda.</p>`
            : notas.map(n => `
                <div class="card">

                  <h3>${n.titulo}</h3>

                  ${n.tags ? `<p>🏷️ ${n.tags}</p>` : ''}

                  <p style="white-space: pre-wrap;">
                    ${n.conteudo || ''}
                  </p>

                  <small>${new Date(n.criadoEm).toLocaleString()}</small>

                  <br><br>

                  <button data-delete="${n.id}">
                    🪓 Apagar
                  </button>

                </div>
              `).join('')
        }

      </div>

    </section>
  `;
}

/* =========================================================
   🔗 EVENTS (SPA SAFE)
========================================================= */

export function bindNotasEvents() {
  const form = document.getElementById('notaForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(form));

      createNota(data);
      form.reset();

      // re-render suave via router
      window.dispatchEvent(new Event('navigate-refresh'));
    });
  }

  document.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => {
      deleteNota(Number(btn.dataset.delete));

      window.dispatchEvent(new Event('navigate-refresh'));
    });
  });
}
