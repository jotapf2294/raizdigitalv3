/**
 * Códice do Jota — Sementes Iniciais (robusto)
 */

import { db } from './db.js';

/* =========================================================
   🧠 SAFE COUNT
========================================================= */

function countStore(storeName) {
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.count();

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);

    } catch (err) {
      reject(err);
    }
  });
}

/* =========================================================
   🌱 SEED TALHÕES
========================================================= */

function seedTalhoes() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('talhoes', 'readwrite');
    const store = tx.objectStore('talhoes');

    const req = store.add({
      nome: 'Canteiro Zero',
      cultura: 'Solo experimental',
      criadoEm: new Date().toISOString(),
      notas: 'Origem do Códice'
    });

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/* =========================================================
   🌿 SEED PLANTAS
========================================================= */

function seedPlantas() {
  const plants = [
    { nome: 'Tomate Coração de Boi', latin: 'Solanum lycopersicum', ciclo: 'Verão', agua: 'Média', tipo: 'Fruto' },
    { nome: 'Couve Galega', latin: 'Brassica oleracea', ciclo: 'Inverno', agua: 'Média', tipo: 'Folha' },
    { nome: 'Alecrim', latin: 'Salvia rosmarinus', ciclo: 'Perene', agua: 'Baixa', tipo: 'Aromática' },
    { nome: 'Salsa', latin: 'Petroselinum crispum', ciclo: 'Bianual', agua: 'Média', tipo: 'Folha' },
    { nome: 'Feijão Verde', latin: 'Phaseolus vulgaris', ciclo: 'Verão', agua: 'Alta', tipo: 'Leguminosa' }
  ];

  return new Promise((resolve, reject) => {
    const tx = db.transaction('plantas', 'readwrite');
    const store = tx.objectStore('plantas');

    let count = 0;

    plants.forEach(p => {
      const req = store.add(p);

      req.onsuccess = () => {
        count++;
        if (count === plants.length) resolve();
      };

      req.onerror = () => reject(req.error);
    });
  });
}

/* =========================================================
   🌱 SEED PRINCIPAL
========================================================= */

async function seedIfNeeded() {
  const talhoesCount = await countStore('talhoes');
  const plantasCount = await countStore('plantas');

  // já tem dados
  if (talhoesCount > 0 || plantasCount > 0) {
    console.log('🌿 Códice já inicializado');
    return;
  }

  console.log('🌱 A semear o Códice...');

  await seedTalhoes();
  await seedPlantas();

  console.log('🌿 Sementes plantadas com sucesso');
}

/* =========================================================
   🚀 API PÚBLICA (IMPORTANTE: retorna Promise)
========================================================= */

export async function seedData() {
  if (!db) {
    console.warn('⚠️ DB não pronta para seed');
    return;
  }

  try {
    await seedIfNeeded();
  } catch (err) {
    console.error('Seed error:', err);
  }
}
