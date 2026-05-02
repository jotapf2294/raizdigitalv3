/**
 * Códice do Jota — UI (Pórtico)
 * Aqui nasce a primeira visão do sistema
 */

import { getMoonPhase, getPlantingType } from './lunar.js';

/**
 * Renderiza o Pórtico (Dashboard principal)
 * Este é o "rosto" do Códice
 */
export function renderDashboard() {
  const phase = getMoonPhase();
  const energy = getPlantingType(phase);

  return `
    <section class="dashboard">

      <h2>🌙 Pórtico do Códice</h2>

      <!-- ASTROLÁBIO LUNAR -->
      <div class="card">
        <h3>🜂 Astrolábio Lunar</h3>
        <p><strong>Fase:</strong> ${phase}</p>
        <p><strong>Energia da Terra:</strong> ${energy}</p>

        <div class="lunar-visual">
          ${renderMoonSymbol(phase)}
        </div>
      </div>

      <!-- SUSSURROS DA TERRA -->
      <div class="card">
        <h3>📜 Sussurros da Terra</h3>
        <ul id="alertsList">
          <li>Escutando a horta...</li>
        </ul>
      </div>

    </section>
  `;
}

/**
 * Símbolos simples da lua (arte ASCII simbólica)
 * mais tarde pode virar canvas/SVG
 */
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
      <span style="font-size:3rem;">${map[phase] || '○'}</span>
    </div>
  `;
}
