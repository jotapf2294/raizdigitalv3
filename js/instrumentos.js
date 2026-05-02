/**
 * Códice do Jota — Instrumentos do Cultivo (Fase VI)
 * versão SPA consistente
 */

import { addLog } from './db.js';

/* =========================================================
   🌙 ASTROLÁBIO LUNAR
========================================================= */

export function getPlantingAdvice(date = new Date()) {
  const lunarCycle = 29.53058867;
  const newMoonRef = new Date('2000-01-06T18:14:00Z');

  const days = (date - newMoonRef) / (1000 * 60 * 60 * 24);
  const phase = (days % lunarCycle) / lunarCycle;

  if (phase < 0.125) return '🌑 Descanso do solo';
  if (phase < 0.25) return '🌿 Folhas — crescimento aéreo';
  if (phase < 0.5) return '🍅 Frutos — produção';
  if (phase < 0.75) return '🥕 Raízes — força subterrânea';
  return '🌑 Regeneração';
}

/* =========================================================
   💧 HIDRÓMETRO
========================================================= */

export function calculateWaterNeeds(areaM2, cropType = 'misto', season = 'verão') {
  const base = areaM2 * 2.5;

  const cropFactor = {
    folha: 1.2,
    fruto: 1.5,
    raiz: 0.9,
    misto: 1
  };

  const seasonFactor = {
    verão: 1.6,
    primavera: 1.2,
    outono: 1,
    inverno: 0.7
  };

  return Math.round(
    base *
    (cropFactor[cropType] || 1) *
    (seasonFactor[season] || 1)
  );
}

/* =========================================================
   ⚗️ NPK
========================================================= */

export function suggestFertilizer(n, p, k) {
  const lacks = [];

  if (n < 50) lacks.push('Azoto (N)');
  if (p < 50) lacks.push('Fósforo (P)');
  if (k < 50) lacks.push('Potássio (K)');

  return lacks.length
    ? `⚗️ Reforçar: ${lacks.join(', ')}`
    : '🌱 Solo equilibrado';
}

/* =========================================================
   📜 DIÁRIO DE CAMPO (IndexedDB consistente)
========================================================= */

export function addFieldLog(entry) {
  const logs = JSON.parse(localStorage.getItem('campo-logs') || '[]');

  const newEntry = {
    id: Date.now(),
    texto: entry.texto,
    tipo: entry.tipo || 'geral',
    custo: entry.custo || 0,
    data: new Date().toISOString()
  };

  logs.push(newEntry);

  localStorage.setItem('campo-logs', JSON.stringify(logs));

  addLog(`📍 ${entry.texto}`);
}

export function getFieldLogs() {
  return JSON.parse(localStorage.getItem('campo-logs') || '[]');
}

/* =========================================================
   🧪 RENDER INSTRUMENTOS
========================================================= */

export function renderInstrumentos() {
  const advice = getPlantingAdvice();
  const water = calculateWaterNeeds(50, 'fruto', 'verão');
  const fertilizer = suggestFertilizer(40, 70, 30);

  return `
    <section class="instrumentos">

      <h2>🧪 Instrumentos do Cultivo</h2>

      <div class="card">
        <h3>🌙 Astrolábio</h3>
        <p>${advice}</p>
      </div>

      <div class="card">
        <h3>💧 Hidrómetro</h3>
        <p>50m² tomate → ${water} L/dia</p>
      </div>

      <div class="card">
        <h3>⚗️ NPK</h3>
        <p>${fertilizer}</p>
      </div>

      <div class="card">
        <h3>📜 Diário de Campo</h3>

        <button id="logDemoBtn">
          + Registo rápido
        </button>

      </div>

    </section>
  `;
}

/* =========================================================
   🔗 EVENTS (SPA safe)
========================================================= */

export function bindInstrumentosEvents() {
  const btn = document.getElementById('logDemoBtn');

  if (btn) {
    btn.addEventListener('click', () => {
      addFieldLog({
        texto: 'Regado Canteiro Zero',
        tipo: 'rega'
      });

      // feedback leve (sem alert)
      btn.textContent = '✔ Registo guardado';
      setTimeout(() => {
        btn.textContent = '+ Registo rápido';
      }, 1200);
    });
  }
}
