/**
 * Códice do Jota — Herbário Vivo (versão evoluída)
 * CRUD + categorias + pesquisa viva
 */

import { db, addLog } from './db.js';

/* =========================================================
   🧠 SAFE STORE
========================================================= */

function getStore(mode = 'readonly') {
  if (!db) throw new Error('DB não inicializada');
  return db.transaction('plantas', mode).objectStore('plantas');
}

/* =========================================================
   🌱 CREATE
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
      addLog(`🌿 Planta adicionada: ${data.nome}`);
    };

  } catch (err) {
    console.error(err);
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
   🧠 FILTRO / PESQUISA
========================================================= */

function filterPlantas(plantas, query) {
  if (!query) return plantas;

  const q = query.toLowerCase();

  return plantas.filter(p =>
    (p.nome || '').toLowerCase().includes(q) ||
    (p.familia || '').toLowerCase().includes(q) ||
    (p.tipo || '').toLowerCase().includes(q) ||
    (p.latin || '').toLowerCase().includes(q)
  );
}

/* =========================================================
   🌿 EMOJI POR TIPO
========================================================= */

function getTipoEmoji(tipo) {
  const map = {
    'folha': '🌿',
    'fruto': '🍅',
    'raiz': '🥕',
    'aromatica': '🌱',
    'leguminosa': '🌾'
  };

  return map[(tipo || '').toLowerCase()] || '🌱';
}

/* =========================================================
   🖼️ RENDER
========================================================= */

export async function renderHerbario() {
  const plantas = await getPlantas();

  return `
    <section class="herbario">

      <h2>🌿 Herbário Vivo</h2>

      <!-- 🔍 SEARCH -->
      <div class="card">
        <input id="herbSearch" placeholder="🔍 Procurar planta..." />
      </div>

      <!-- FORM -->
      <form id="plantaForm" class="card">
        <h3>Adicionar Planta</h3>

        <input name="nome" placeholder="Nome" required />
        <input name="latin" placeholder="Latim" />
        <input name="familia" placeholder="Família" />

        <select name="tipo">
          <option value="">Tipo</option>
          <option value="folha">Folha 🌿</option>
          <option value="fruto">Fruto 🍅</option>
          <option value="raiz">Raiz 🥕</option>
          <option value="aromatica">Aromática 🌱</option>
          <option value="leguminosa">Leguminosa 🌾</option>
        </select>

        <input name="ciclo" placeholder="Ciclo" />
        <input name="agua" placeholder="Água" />

        <textarea name="notas" placeholder="Segredos"></textarea>

        <button type="submit">🌱 Guardar</button>
      </form>

      <!-- LISTA -->
      <div id="herbList" class="lista-herbario">

        ${plantas.map(p => `
          <div class="card herb-item" data-name="${p.nome}" data-family="${p.familia}" data-type="${p.tipo}">

            <h3>
              ${getTipoEmoji(p.tipo)} ${p.nome}
            </h3>

            <p><em>${p.latin || ''}</em></p>

            <p>📚 Família: ${p.familia || '—'}</p>
            <p>🌿 Tipo: ${p.tipo || '—'}</p>
            <p>💧 Água: ${p.agua || '—'}</p>

            ${p.notas ? `<p>🪶 ${p.notas}</p>` : ''}

            <button data-delete="${p.id}">🪓 Remover</button>

          </div>
        `).join('')}

      </div>

    </section>
  `;
}

/* =========================================================
   🔗 EVENTS
========================================================= */

export function bindHerbarioEvents() {
  const form = document.getElementById('plantaForm');
  const search = document.getElementById('herbSearch');

  /* 🌱 CREATE */
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(form));

      createPlanta(data);
      form.reset();

      window.dispatchEvent(new Event('navigate-refresh'));
    });
  }

  /* 🪓 DELETE */
  document.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => {
      deletePlanta(Number(btn.dataset.delete));
      window.dispatchEvent(new Event('navigate-refresh'));
    });
  });

  /* 🔍 SEARCH LIVE */
  if (search) {
    search.addEventListener('input', () => {
      const q = search.value.toLowerCase();

      document.querySelectorAll('.herb-item').forEach(item => {
        const text = (
          item.dataset.name +
          item.dataset.family +
          item.dataset.type
        ).toLowerCase();

        item.style.display = text.includes(q) ? 'block' : 'none';
      });
    });
  }
}
