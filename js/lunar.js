/**
 * Códice do Jota — Astrolábio Lunar (versão robusta)
 */

export function getMoonPhase(date = new Date()) {
  const lunarCycle = 29.53058867;
  const newMoonRef = new Date('2000-01-06T18:14:00Z');

  const d = new Date(date);

  if (isNaN(d.getTime())) {
    console.warn('Data inválida no Astrolábio Lunar');
    return 'Lua Nova';
  }

  const daysSince = (d - newMoonRef) / (1000 * 60 * 60 * 24);

  // normalização segura (evita negativos)
  const cyclePosition =
    ((daysSince % lunarCycle) + lunarCycle) % lunarCycle;

  const phaseIndex = Math.floor((cyclePosition / lunarCycle) * 8) % 8;

  const phases = [
    'Lua Nova',
    'Lua Crescente',
    'Quarto Crescente',
    'Gibosa Crescente',
    'Lua Cheia',
    'Gibosa Minguante',
    'Quarto Minguante',
    'Lua Minguante'
  ];

  return phases[phaseIndex];
}

/**
 * Tradução agrícola da lua
 */
export function getPlantingType(phase) {
  const map = {
    'Lua Crescente': 'Folha 🌿',
    'Quarto Crescente': 'Folha 🌿',
    'Gibosa Crescente': 'Folha 🌿',

    'Lua Cheia': 'Fruto 🍅',

    'Gibosa Minguante': 'Raiz 🥕',
    'Quarto Minguante': 'Raiz 🥕',
    'Lua Minguante': 'Raiz 🥕',

    'Lua Nova': 'Descanso 🌑'
  };

  return map[phase] || 'Descanso 🌑';
}
