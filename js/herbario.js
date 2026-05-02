/**
 * Códice do Jota — Herbário Vivo (versão consolidada)
 * CRUD + UI + filtros + segurança de remoção
 */

import { db, addLog } from './db.js';

/* =========================================================
   🧠 STORE SAFE
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
   🪓 DELETE (com confirmação)
========================================================= */

export function deletePlanta(id) {
  try {
    const confirmBox = document.getElementById(`confirm-delete-${id}`);

    if (!confirmBox || !confirmBox.checked) {
      alert('☠️ Confirma primeiro a remoção da planta');
      return;
    }

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
   🌿 HELPERS
========================================================= */

function getTipoEmoji(tipo) {
  const map = {
    folha: '🌿',
    fruto: '🍅',
    raiz: '🥕',
    aromatica: '🌱',
    leguminosa: '🌾'
  };

  return map[(tipo || '').toLowerCase()] || '🌱';
}

function groupByTipo(plantas) {
  const groups = {};

  plantas.forEach(p => {
    const key = p.tipo || 'outros';
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  });

  return groups;
}

/* =========================================================
   🖼️ RENDER
========================================================= */

export async function renderHerbario() {
  const plantas = await getPlantas();
  const grupos = groupByTipo(plantas);

  return `
    <section class="herbario">

      <h2>🌿 Herbário Vivo</h2>

      <!-- 🌱 FORM COLAPSÁVEL -->
      <details class="herb-group">

        <summary>🌱 Adicionar Planta</summary>

        <form id="plantaForm" class="card herb-form">

          <div class="grid-form">
            <input name="nome" placeholder="Nome" required />
            <input name="latin" placeholder="Latim" />
            <input name="familia" placeholder="Família" />

            <select name="tipo">
              <option value="">Tipo</option>
              <option value="folha">🌿 Folha</option>
              <option value="fruto">🍅 Fruto</option>
              <option value="raiz">🥕 Raiz</option>
              <option value="aromatica">🌱 Aromática</option>
              <option value="leguminosa">🌾 Leguminosa</option>
            </select>

            <input name="ciclo" placeholder="Ciclo" />
            <input name="agua" placeholder="Água" />
          </div>

          <textarea name="notas" placeholder="Segredos do cultivo"></textarea>

          <button type="submit">🌱 Guardar Planta</button>

        </form>

      </details>

      <!-- 🔍 SEARCH -->
      <div class="card">
        <input
          id="herbSearch"
          placeholder="🔍 Procurar planta..."
          style="width:100%; padding:1rem; font-size:1rem;"
        />
      </div>

      <!-- 🌿 GRUPOS -->
      <div class="herb-groups">

        ${Object.entries(grupos).map(([tipo, items]) => `
          <details open class="herb-group">

            <summary>
              ${getTipoEmoji(tipo)} ${tipo.toUpperCase()} (${items.length})
            </summary>

            <div class="herb-group-content">

              ${items.map(p => `
                <div class="card herb-item">

                  <h3>${getTipoEmoji(p.tipo)} ${p.nome}</h3>
                  <p><em>${p.latin || ''}</em></p>

                  <div class="meta">
                    <span>📚 ${p.familia || '—'}</span>
                    <span>💧 ${p.agua || '—'}</span>
                    <span>🌿 ${p.ciclo || '—'}</span>
                  </div>

                  ${p.notas ? `<p class="notes">🪶 ${p.notas}</p>` : ''}

                  <!-- ☑️ CONFIRMAÇÃO -->
                  <label style="display:flex;align-items:center;gap:.5rem;margin:.5rem 0;">
                    <input type="checkbox" id="confirm-delete-${p.id}" />
                    Confirmar remoção
                  </label>

                  <button data-delete="${p.id}">
                    🪓 Remover
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

  /* 🔍 SEARCH */
  if (search) {
    search.addEventListener('input', () => {
      const q = search.value.toLowerCase();

      document.querySelectorAll('.herb-item').forEach(item => {
        item.style.display =
          item.innerText.toLowerCase().includes(q) ? 'block' : 'none';
      });
    });
  }
}