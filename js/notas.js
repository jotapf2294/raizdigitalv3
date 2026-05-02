/**
 * Códice do Jota — Arquivo do Sábio (versão evoluída)
 * Sistema tipo wiki agrícola offline
 */

import { db, addLog } from './db.js';

/* =========================================================
   🧠 SAFE STORE
========================================================= */

function getStore(mode = 'readonly') {
  if (!db) throw new Error('DB ainda não inicializada');
  return db.transaction('notas', mode).objectStore('notas');
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
      categoria: data.categoria || 'geral',
      criadoEm: new Date().toISOString()
    });

    request.onsuccess = () => {
      addLog(`📜 Nota criada: ${data.titulo}`);
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
   🧠 HELPERS
========================================================= */

function groupByCategoria(notas) {
  const groups = {};

  notas.forEach(n => {
    const key = n.categoria || 'geral';

    if (!groups[key]) groups[key] = [];
    groups[key].push(n);
  });

  return groups;
}

function categoriaEmoji(cat) {
  const map = {
    geral: '📜',
    poda: '✂️',
    rega: '💧',
    solo: '🌱',
    pragas: '🐛',
    dicas: '💡'
  };

  return map[cat] || '📜';
}

/* =========================================================
   🖼️ RENDER
========================================================= */

export async function renderNotas() {
  const notas = await getNotas();
  const grupos = groupByCategoria(notas);

  return `
    <section class="notas">

      <h2>📜 Arquivo do Sábio</h2>

      <!-- 🔍 SEARCH -->
      <div class="card">
        <input
          id="notaSearch"
          placeholder="🔍 Procurar notas..."
          style="width:100%; padding:1rem; font-size:1rem;"
        />
      </div>

      <!-- 🌱 FORM -->
      <form id="notaForm" class="card">

        <h3>Nova Inscrição</h3>

        <input name="titulo" placeholder="Título" required />

        <select name="categoria">
          <option value="geral">📜 Geral</option>
          <option value="poda">✂️ Poda</option>
          <option value="rega">💧 Rega</option>
          <option value="solo">🌱 Solo</option>
          <option value="pragas">🐛 Pragas</option>
          <option value="dicas">💡 Dicas</option>
        </select>

        <input name="tags" placeholder="Tags (tomate, inverno...)" />

        <textarea name="conteudo" placeholder="Escreve o conhecimento da terra..."></textarea>

        <button type="submit">📜 Guardar Nota</button>

      </form>

      <!-- 📂 GRUPOS -->
      <div class="nota-groups">

        ${Object.entries(grupos).map(([cat, items]) => `
          
          <details open class="herb-group">

            <summary>
              ${categoriaEmoji(cat)} ${cat.toUpperCase()} (${items.length})
            </summary>

            <div class="herb-group-content">

              ${items.map(n => `
                <div class="card note-item">

                  <h3>${n.titulo}</h3>

                  ${n.tags ? `<p>🏷️ ${n.tags}</p>` : ''}

                  <p style="white-space: pre-wrap;">
                    ${n.conteudo || ''}
                  </p>

                  <small>🕯️ ${new Date(n.criadoEm).toLocaleString()}</small>

                  <br><br>

                  <button data-delete="${n.id}">
                    🪓 Apagar
                  </button>

                </div>
              `).join('')}

            </div>

          </details>

        `).join('')}

      </div>

    </section>
  `;
}

/* =========================================================
   🔗 EVENTS
========================================================= */

export function bindNotasEvents() {
  const form = document.getElementById('notaForm');
  const search = document.getElementById('notaSearch');

  /* 📜 CREATE */
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(form));

      createNota(data);
      form.reset();

      window.dispatchEvent(new Event('navigate-refresh'));
    });
  }

  /* 🪓 DELETE */
  document.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => {
      deleteNota(Number(btn.dataset.delete));
      window.dispatchEvent(new Event('navigate-refresh'));
    });
  });

  /* 🔍 SEARCH */
  if (search) {
    search.addEventListener('input', () => {
      const q = search.value.toLowerCase();

      document.querySelectorAll('.note-item').forEach(item => {
        item.style.display =
          item.innerText.toLowerCase().includes(q) ? 'block' : 'none';
      });
    });
  }
}