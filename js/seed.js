/**
 * Códice do Jota — Sementes Iniciais
 * O momento em que a horta nasce com memória viva
 */

import { db } from './db.js';

/**
 * Verifica se uma store está vazia
 */
function isStoreEmpty(storeName) {
  return new Promise((resolve) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.count();

    request.onsuccess = () => {
      resolve(request.result === 0);
    };
  });
}

/**
 * Planta sementes iniciais no Códice
 */
async function seedIfNeeded() {

  const talhoesEmpty = await isStoreEmpty('talhoes');
  const plantasEmpty = await isStoreEmpty('plantas');

  // Se já existe vida, não replantar (regra sagrada)
  if (!talhoesEmpty || !plantasEmpty) {
    console.log('🌿 Códice já contém vida. Sementes não replantadas.');
    return;
  }

  console.log('🌱 A semear o Códice pela primeira vez...');

  // 🌱 TALHÃO INICIAL
  const talhoesTx = db.transaction('talhoes', 'readwrite');
  const talhoesStore = talhoesTx.objectStore('talhoes');

  talhoesStore.add({
    nome: 'Canteiro Zero',
    cultura: 'Solo experimental',
    criadoEm: new Date().toISOString(),
    notas: 'Origem do Códice'
  });

  // 🌿 PLANTAS INICIAIS (flora portuguesa base)
  const plantasTx = db.transaction('plantas', 'readwrite');
  const plantasStore = plantasTx.objectStore('plantas');

  const seeds = [
    {
      nome: 'Tomate Coração de Boi',
      latin: 'Solanum lycopersicum',
      ciclo: 'Verão',
      agua: 'Média',
      tipo: 'Fruto'
    },
    {
      nome: 'Couve Galega',
      latin: 'Brassica oleracea',
      ciclo: 'Inverno',
      agua: 'Média',
      tipo: 'Folha'
    },
    {
      nome: 'Alecrim',
      latin: 'Salvia rosmarinus',
      ciclo: 'Perene',
      agua: 'Baixa',
      tipo: 'Aromática'
    },
    {
      nome: 'Salsa',
      latin: 'Petroselinum crispum',
      ciclo: 'Bianual',
      agua: 'Média',
      tipo: 'Folha'
    },
    {
      nome: 'Feijão Verde',
      latin: 'Phaseolus vulgaris',
      ciclo: 'Primavera-Verão',
      agua: 'Alta',
      tipo: 'Leguminosa'
    }
  ];

  seeds.forEach(plant => plantasStore.add(plant));

  console.log('🌿 Sementes plantadas com sucesso.');
}

/**
 * Função pública chamada pela app
 */
export function seedData() {
  if (!db) {
    console.warn('⚠️ DB ainda não inicializada');
    return;
  }

  seedIfNeeded();
                 }
