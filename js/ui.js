import { getMoonPhase, getPlantingType } from './lunar.js';
import { getTalhoes } from './talhoes.js';
import { getPlantas } from './herbario.js';
import { getNotas } from './notas.js';
import { getFieldLogs } from './instrumentos.js';

export async function renderDashboard() {
  const phase = getMoonPhase();
  const energy = getPlantingType(phase);

  const talhoes = await getTalhoes();
  const plantas = await getPlantas();
  const notas = await getNotas();
  const logs = getFieldLogs().slice(-5).reverse();

  return `
    <section class="dashboard">

      <h2>🏛️ Pórtico do Códice</h2>

      <div class="card">
        <h3>🌙 Astrolábio Lunar</h3>
        <p><strong>Fase:</strong> ${phase}</p>
        <p><strong>Energia:</strong> ${energy}</p>
        <div class="moon-symbol" style="font-size:3rem">
          ${renderMoonSymbol(phase)}
        </div>
      </div>

      <div class="card">
        <h3>🌿 Estado da Horta</h3>
        <p>🌱 Talhões: ${talhoes.length}</p>
        <p>🌿 Plantas: ${plantas.length}</p>
        <p>📜 Notas: ${notas.length}</p>
      </div>

      <div class="card">
        <h3>📜 Sussurros da Terra</h3>

        ${
          logs.length
            ? `<ul>${logs.map(l => `<li>${l.texto}</li>`).join('')}</ul>`
            : `<p>Sem registos ainda.</p>`
        }

      </div>

    </section>
  `;
}

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

  return map[phase] || '○';
}