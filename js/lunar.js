/**
 * Códice do Jota — Astrolábio Lunar
 * Tradução do céu para linguagem da horta
 */

/**
 * Calcula fase lunar aproximada
 * (algoritmo simples, mas funcional para agricultura)
 *
 * Base: ciclo médio lunar ~29.53 dias
 */
export function getMoonPhase(date = new Date()) {
  const lunarCycle = 29.53058867; // dias
  const newMoonRef = new Date('2000-01-06T18:14:00Z');

  const daysSince = (date - newMoonRef) / (1000 * 60 * 60 * 24);
  const cyclePosition = daysSince % lunarCycle;

  const phaseIndex = Math.floor((cyclePosition / lunarCycle) * 8);

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

  return phases[phaseIndex] || 'Lua Nova';
}

/**
 * Traduz fase lunar em tipo de energia agrícola
 *
 * Isto não é “mística vazia”:
 * é lógica agrícola tradicional usada em ciclos de plantio.
 */
export function getPlantingType(phase) {
  switch (phase) {
    case 'Lua Crescente':
    case 'Quarto Crescente':
    case 'Gibosa Crescente':
      return 'Folha 🌿'; // crescimento aéreo

    case 'Lua Cheia':
      return 'Fruto 🍅'; // produção máxima

    case 'Gibosa Minguante':
    case 'Quarto Minguante':
    case 'Lua Minguante':
      return 'Raiz 🥕'; // força subterrânea

    case 'Lua Nova':
    default:
      return 'Descanso 🌑'; // regeneração
  }
}
