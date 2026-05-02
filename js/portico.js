/**
 * Códice do Jota — Pórtico Final (robusto)
 */

import { getTalhoes } from './talhoes.js';
import { getPlantas } from './herbario.js';
import { getNotas } from './notas.js';
import { getFieldLogs } from './instrumentos.js';
import { getMoonPhase, getPlantingType } from './lunar.js';

/* =========================================================
   🧠 SAFE FETCH HELPERS
========================================================= */

async function safe(fn, fallback = []) {
  try {
    const result = await fn();
    return Array.isArray(result) ? result : fallback;
  } catch (err) {
    console.error('Portico data error:', err);
    return fallback;
  }
}

/* =========================================================
   🌿 ESTADO DA HORTA
========================================================= */

async function getHortaState() {
  const [talhoes, plantas, notas] = await Promise.all([
    safe(getTalhoes),
    safe(getPlantas),
    safe(getNotas)
  ]);

  return { talhoes, plantas, notas };
}

/* =========================================================
   ⚠️ ALERTAS
========================================================= */

function generateAlerts(state) {
  const alerts = [];

  if (!state.talhoes.length) alerts.push('🌱 Ainda não existem talhões definidos.');
  if (state.plantas.length < 3) alerts.push('🌿 Herbário ainda pouco desenvolvido.');
  if (!state.notas.length) alerts.push('📜 Nenhuma nota registada ainda.');

  return alerts;
}

/* =========================================================
   🏛️ RENDER PÓRTICO
========================================================= */

export async function renderPortico() {
  const state = await getHortaState();

  const moon = getMoonPhase();
  const planting = getPlantingType(moon);

  let logs = [];

  try {
    logs = getFieldLogs() || [];
  } catch (err) {
    logs = [];
  }

  logs = logs.slice(-5).reverse();

  const alerts = generateAlerts(state);

  return `
    <section class="portico">

      <h2>🏛️ Pórtico do Códice</h2>

      <div class="card">
        <h3>🌙 Céu Atual</h3>
        <p><strong>Fase:</strong> ${moon}</p>
        <p><strong>Energia:</strong> ${planting}</p>
      </div>

      <div class="card">
        <h3>🌿 Estado da Horta</h3>
        <p>🌱 Talhões: ${state.talhoes.length}</p>
        <p>🌿 Plantas: ${state.plantas.length}</p>
        <p>📜 Notas: ${state.notas.length}</p>
      </div>

      <div class="card">
        <h3>⚠️ Sussurros da Terra</h3>

        ${
          alerts.length
            ? `<ul>${alerts.map(a => `<li>${a}</li>`).join('')}</ul>`
            : `<p>🌾 Tudo em equilíbrio.</p>`
        }

      </div>

      <div class="card">
        <h3>📍 Últimos Registos</h3>

        ${
          logs.length
            ? `<ul>
                ${logs.map(l => `
                  <li>
                    ${l.texto}
                    <small>(${new Date(l.data).toLocaleString()})</small>
                  </li>
                `).join('')}
              </ul>`
            : `<p>Sem registos recentes.</p>`
        }

      </div>

    </section>
  `;
}
