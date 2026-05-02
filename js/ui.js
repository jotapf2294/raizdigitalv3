/**
 * Códice do Jota — UI (Pórtico Vivo)
 * Dashboard central com leitura real da horta
 */

import { getMoonPhase, getPlantingType } from './lunar.js';
import { getFieldLogs } from './instrumentos.js';
import { getTalhoes } from './talhoes.js';
import { getPlantas } from './herbario.js';
import { getNotas } from './notas.js';

/* =========================================================
   🌙 PÓRTICO — RENDER PRINCIPAL
========================================================= */

export async function renderDashboard() {
  const phase = getMoonPhase();
  const energy = getPlantingType(phase);

  const logs = getFieldLogs().slice(-5).reverse();
  const talhoes = await getTalhoes();
  const plantas = await getPlantas();
  const notas = await getNotas();

  return `
    <section class="dashboard">

      <h2>🏛️ Pórtico do Códice</h2>

      <!-- 🌙 ASTROLÁBIO -->
      <div class="card lunar-card">
        <h3>🌙 Astrolábio Lunar</h3>

        <div class="moon-big">
          ${renderMoonSymbol(phase)}
        </div>

        <p><strong>Fase:</strong> ${phase}</p>
        <p><strong>Energia da Terra:</strong> ${energy}</p>
      </div>

      <!-- 🌿 ESTADO DA HORTA -->
      <div class="card">
        <h3>🌿 Horta Viva</h3>

        <p>🌱 Talhões: ${talhoes.length}</p>
        <p>🌿 Plantas: ${plantas.length}</p>
        <p>📜 Notas: ${notas.length}</p>
      </div>

      <!-- 📜 SUSSURROS DA TERRA -->
      <div class="card">
        <h3>📜 Sussurros da Terra</h3>

        ${
          logs.length === 0
            ? `<p>🌱 Ainda não há registos do campo.</p>`
            : `<ul>
                ${logs.map(l => `
                  <li>
                    ${l.texto}
                    <small>(${new Date(l.data).toLocaleString()})</small>
                  </li>
                `).join('')}
              </ul>`
        }

      </div>

    </section>
  `;
}

/* =========================================================
   🌙 LUA — SÍMBOLO
========================================================= */

function renderMoonSymbol(phase) {
  const map = {
    'Lua Nova': '○',
    'Lua Crescente': '☽',
    'Quarto Crescente': '◐',
    'Gibosa Crescente': '◑',
    'Lua Cheia': '●',
    'Gibosa Minguante': '◕',
    'Quarto Minguante': '◓',
    'Lua Minguante': '☾'
  };

  return `
    <div class="moon-symbol">
      <span>${map[phase] || '○'}</span>
    </div>
  `;
}
