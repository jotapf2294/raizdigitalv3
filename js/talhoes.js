/**
 * Códice do Jota — Talhões (Fase III)
 * Sistema completo de gestão de canteiros
 * CRUD + render + eventos UI
 */

import { db, addLog } from './db.js';

/* =========================================================
   🌱 CREATE — Criar talhão
========================================================= */
export function createTalhao(data) {
  const tx = db.transaction('talhoes', 'readwrite');
  const store = tx.objectStore('talhoes');

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
}

/* =========================================================
   🪓 DELETE — Remover talhão
========================================================= */
export function deleteTalhao(id) {
  const tx = db.transaction('talhoes', 'readwrite');
  const store = tx.objectStore('talhoes');

  store.delete(id);
  addLog(`🪓 Talhão removido: ${id}`);
}

/* =========================================================
   📜 READ — Listar talhões
========================================================= */
export function getTalhoes() {
  return new Promise((resolve) => {
    const tx = db.transaction('talhoes', 'readonly');
    const store = tx.objectStore('talhoes');

    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result || []);
    };
  });
}

/* =========================================================
   🖼️ RENDER — Interface dos talhões
========================================================= */
export async function renderTalhoes() {
  const talhoes = await getTalhoes();

  return `
    <section class="talhoes">

      <h2>🌱 Talhões da Horta</h2>

      <!-- FORMULÁRIO -->
      <form id="talhaoForm" class="card">
        <h3>Semear novo talhão</h3>

        <input name="nome" placeholder="Nome do canteiro" required />
        <input name="cultura" placeholder="Cultura (ex: tomate, couve...)" />
        <input name="area" placeholder="Área (m²)" />

        <textarea name="notas" placeholder="Notas do terreno"></textarea>

        <button type="submit">🌱 Semear</button>
      </form>

      <!-- LISTA -->
      <div class="lista-talhoes">

        ${
          talhoes.length === 0
            ? `<p>🌿 Nenhum talhão semeado ainda.</p>`
            : talhoes.map(t => `
                <div class="card">
                  <h3>${t.nome}</h3>

                  <p><strong>Cultura:</strong> ${t.cultura || '—'}</p>
                  <p><strong>Área:</strong> ${t.area || '—'} m²</p>

                  ${t.notas ? `<p><em>${t.notas}</em></p>` : ''}

                  <button data-delete="${t.id}">
                    🪓 Remover
                  </button>
                </div>
              `).join('')
        }

      </div>

    </section>
  `;
}

/* =========================================================
   🔗 EVENTS — Liga UI à lógica
========================================================= */
export function bindTalhoesEvents() {
  const form = document.getElementById('talhaoForm');

  // 🌱 Criar talhão
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(form));

      createTalhao(data);

      form.reset();

      // refresh simples (Fase futura: state-based render)
      setTimeout(() => location.reload(), 100);
    });
  }

  // 🪓 Remover talhão
  document.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => {
      deleteTalhao(Number(btn.dataset.delete));
      setTimeout(() => location.reload(), 100);
    });
  });
}
