/**
 * Códice do Jota — Instrumentos do Cultivo (Fase VI)
 * Ferramentas agrícolas digitais offline
 * Astrolábio + Hidrómetro + Balança NPK + Diário de Campo
 */

import { addLog } from './db.js';

/* =========================================================
   🌙 ASTROLÁBIO LUNAR (reforçado)
   Decide tipo de plantio baseado no dia
========================================================= */

export function getPlantingAdvice(date = new Date()) {
  const lunarCycle = 29.53058867;
  const newMoonRef = new Date('2000-01-06T18:14:00Z');

  const days = (date - newMoonRef) / (1000 * 60 * 60 * 24);
  const phase = (days % lunarCycle) / lunarCycle;

  let advice = '';

  if (phase < 0.125) advice = '🌑 Descanso do solo';
  else if (phase < 0.25) advice = '🌿 Folhas — crescimento aéreo';
  else if (phase < 0.5) advice = '🍅 Frutos — produção';
  else if (phase < 0.75) advice = '🥕 Raízes — força subterrânea';
  else advice = '🌑 Regeneração';

  return advice;
}

/* =========================================================
   💧 HIDRÓMETRO AGRÍCOLA
   Estima necessidade de água
========================================================= */

export function calculateWaterNeeds(areaM2, cropType = 'misto', season = 'verão') {
  let base = areaM2 * 2.5; // litros base por m²

  const cropFactor = {
    'folha': 1.2,
    'fruto': 1.5,
    'raiz': 0.9,
    'misto': 1.0
  };

  const seasonFactor = {
    'verão': 1.6,
    'primavera': 1.2,
    'outono': 1.0,
    'inverno': 0.7
  };

  const total =
    base *
    (cropFactor[cropType] || 1) *
    (seasonFactor[season] || 1);

  return Math.round(total);
}

/* =========================================================
   ⚗️ BALANÇA NPK SIMPLIFICADA
   Sugestão de adubo baseada em input de solo
========================================================= */

export function suggestFertilizer(n, p, k) {
  const deficiencies = [];

  if (n < 50) deficiencies.push('Azoto (N) — crescimento');
  if (p < 50) deficiencies.push('Fósforo (P) — raízes');
  if (k < 50) deficiencies.push('Potássio (K) — resistência');

  if (deficiencies.length === 0) {
    return '🌱 Solo equilibrado — não necessita intervenção';
  }

  return `⚗️ Reforçar: ${deficiencies.join(', ')}`;
}

/* =========================================================
   📜 DIÁRIO DE CAMPO
   Registo rápido de operações agrícolas
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

  addLog(`📍 Diário de campo: ${entry.texto}`);
}

/* =========================================================
   📜 LISTAR DIÁRIO
========================================================= */

export function getFieldLogs() {
  return JSON.parse(localStorage.getItem('campo-logs') || '[]');
}

/* =========================================================
   🖼️ MINI DASHBOARD DOS INSTRUMENTOS
========================================================= */

export function renderInstrumentos() {
  return `
    <section class="instrumentos">

      <h2>🧪 Instrumentos do Cultivo</h2>

      <!-- ASTROLÁBIO -->
      <div class="card">
        <h3>🌙 Astrolábio Lunar</h3>
        <p>${getPlantingAdvice()}</p>
      </div>

      <!-- HIDRÓMETRO -->
      <div class="card">
        <h3>💧 Hidrómetro</h3>
        <p>Exemplo: 50m² tomate → ${calculateWaterNeeds(50, 'fruto', 'verão')} L/dia</p>
      </div>

      <!-- BALANÇA NPK -->
      <div class="card">
        <h3>⚗️ Balança NPK</h3>
        <p>${suggestFertilizer(40, 70, 30)}</p>
      </div>

      <!-- DIÁRIO -->
      <div class="card">
        <h3>📜 Diário de Campo</h3>

        <button onclick="window.codexLogExample()">
          + Registo rápido (demo)
        </button>

      </div>

    </section>
  `;
}

/* =========================================================
   🔗 DEMO GLOBAL (temporário UI)
========================================================= */

window.codexLogExample = function () {
  addFieldLog({
    texto: 'Regado Canteiro Zero',
    tipo: 'rega',
    custo: 0
  });

  alert('📍 Registo guardado no Diário de Campo');
};
