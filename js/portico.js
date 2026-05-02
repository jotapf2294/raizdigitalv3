/**
 * Códice do Jota — Pórtico Final (Fase VII)
 * Dashboard central da horta
 * Consolida talhões, plantas, notas e instrumentos
 */

import { getTalhoes } from './talhoes.js';
import { getPlantas } from './herbario.js';
import { getNotas } from './notas.js';
import { getFieldLogs } from './instrumentos.js';
import { getMoonPhase, getPlantingType } from './lunar.js';

/* =========================================================
   🌙 UTIL — estado da horta
========================================================= */

async function getHortaState() {
  const [talhoes, plantas, notas] = await Promise.all([
    getTalhoes(),
    getPlantas(),
    getNotas()
  ]);

  return {
    talhoes,
    plantas,
    notas
  };
}

/* =========================================================
   🌿 ALERTAS SIMPLES (regras base)
========================================================= */

function generateAlerts(state) {
  const alerts = [];

  if (state.talhoes.length === 0) {
    alerts.push('🌱 Ainda não existem talhões definidos.');
  }

  if (state.plantas.length < 3) {
    alerts.push('🌿 Herbário ainda pouco desenvolvido.');
  }

  if (state.notas.length === 0) {
    alerts.push('📜 Nenhuma nota registada ainda.');
  }

  return alerts;
}

/* =========================================================
   🌙 PÓRTICO — RENDER PRINCIPAL
========================================================= */

export async function renderPortico() {
  const state = await getHortaState();

  const moon = getMoonPhase();
  const planting = getPlantingType(moon);

  const alerts = generateAlerts(state);
  const logs = getFieldLogs().slice(-5).reverse();

  return `
    <section class="portico">

      <h2>🏛️ Pórtico do Códice</h2>

      <!-- ESTADO LUNAR -->
      <div class="card">
        <h3>🌙 Céu Atual</h3>
        <p><strong>Fase:</strong> ${moon}</p>
        <p><strong>Energia agrícola:</strong> ${planting}</p>
      </div>

      <!-- RESUMO DA HORTA -->
      <div class="card">
        <h3>🌿 Estado da Horta</h3>

        <p>🌱 Talhões: ${state.talhoes.length}</p>
        <p>🌿 Plantas: ${state.plantas.length}</p>
        <p>📜 Notas: ${state.notas.length}</p>
      </div>

      <!-- ALERTAS -->
      <div class="card">
        <h3>⚠️ Sussurros da Terra</h3>

        ${
          alerts.length === 0
            ? `<p>🌾 Tudo em equilíbrio.</p>`
            : `<ul>${alerts.map(a => `<li>${a}</li>`).join('')}</ul>`
        }
      </div>

      <!-- DIÁRIO DE CAMPO -->
      <div class="card">
        <h3>📍 Últimos Registos</h3>

        ${
          logs.length === 0
            ? `<p>Sem registos recentes.</p>`
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
