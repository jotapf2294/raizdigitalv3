/**
 * Códice do Jota — Arquivo do Sábio (Fase V)
 * Sistema de notas agrícolas tipo grimório
 * Markdown simples + tags + persistência offline
 */

import { db, addLog } from './db.js';

/* =========================================================
   📜 CREATE — Nova nota
========================================================= */
export function createNota(data) {
  const tx = db.transaction('notas', 'readwrite');
  const store = tx.objectStore('notas');

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
}

/* =========================================================
   🪓 DELETE — Remover nota
========================================================= */
export function deleteNota(id) {
  const tx = db.transaction('notas', 'readwrite');
  const store = tx.objectStore('notas');

  store.delete(id);
  addLog(`🪓 Nota removida: ${id}`);
}

/* =========================================================
   📚 READ — Listar notas
========================================================= */
export function getNotas() {
  return new Promise((resolve) => {
    const tx = db.transaction('notas', 'readonly');
    const store = tx.objectStore('notas');

    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result || []);
    };
  });
}

/* =========================================================
   🖼️ RENDER — Arquivo do Sábio
========================================================= */
export async function renderNotas() {
  const notas = await getNotas();

  return `
    <section class="notas">

      <h2>📜 Arquivo do Sábio</h2>

      <!-- FORMULÁRIO -->
      <form id="notaForm" class="card">
        <h3>Nova Inscrição</h3>

        <input name="titulo" placeholder="Título da nota" required />

        <input name="tags" placeholder="Tags (ex: tomate, rega, inverno)" />

        <textarea name="conteudo" placeholder="Escreve o conhecimento da terra..."></textarea>

        <button type="submit">📜 Guardar no Arquivo</button>
      </form>

      <!-- LISTA -->
      <div class="lista-notas">

        ${
          notas.length === 0
            ? `<p>📜 O Arquivo ainda não contém inscrições.</p>`
            : notas.map(n => `
                <div class="card">

                  <h3>${n.titulo}</h3>

                  ${n.tags
                    ? `<p><strong>Tags:</strong> ${n.tags}</p>`
                    : ''}

                  <p style="white-space: pre-wrap;">
                    ${n.conteudo || ''}
                  </p>

                  <small>🕯️ ${new Date(n.criadoEm).toLocaleString()}</small>

                  <br><br>

                  <button data-delete="${n.id}">
                    🪓 Rasurar
                  </button>

                </div>
              `).join('')
        }

      </div>

    </section>
  `;
}

/* =========================================================
   🔗 EVENTS — Liga UI ao Arquivo
========================================================= */
export function bindNotasEvents() {
  const form = document.getElementById('notaForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(form));

      createNota(data);
      form.reset();

      setTimeout(() => location.reload(), 100);
    });
  }

  document.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => {
      deleteNota(Number(btn.dataset.delete));
      setTimeout(() => location.reload(), 100);
    });
  });
}
