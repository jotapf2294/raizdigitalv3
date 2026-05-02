/**
 * Códice do Jota — Memória da Terra (núcleo evoluído)
 * IndexedDB robusto + utilitários reutilizáveis
 */

export const DB_NAME = 'codiceDB';
export const DB_VERSION = 1;

export let db;

/* =========================================================
   🧠 STATE INTERNO
========================================================= */

let dbReadyPromise = null;

/* =========================================================
   🚀 INIT DB (singleton + safe)
========================================================= */

export function initDB() {
  if (dbReadyPromise) return dbReadyPromise;

  dbReadyPromise = new Promise((resolve, reject) => {

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    /* =====================================================
       🏗️ MIGRAÇÕES
    ===================================================== */

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      // 🌱 TALHÕES
      if (!database.objectStoreNames.contains('talhoes')) {
        const store = database.createObjectStore('talhoes', {
          keyPath: 'id',
          autoIncrement: true
        });
        store.createIndex('nome', 'nome', { unique: false });
      }

      // 🌿 PLANTAS
      if (!database.objectStoreNames.contains('plantas')) {
        const store = database.createObjectStore('plantas', {
          keyPath: 'id',
          autoIncrement: true
        });
        store.createIndex('nome', 'nome', { unique: false });
      }

      // 📜 NOTAS
      if (!database.objectStoreNames.contains('notas')) {
        database.createObjectStore('notas', {
          keyPath: 'id',
          autoIncrement: true
        });
      }

      // 🪵 LOGS
      if (!database.objectStoreNames.contains('logs')) {
        database.createObjectStore('logs', {
          keyPath: 'id',
          autoIncrement: true
        });
      }
    };

    /* =====================================================
       ✅ SUCCESS
    ===================================================== */

    request.onsuccess = () => {
      db = request.result;

      console.log('🧠 Códice: memória da terra ativa');

      resolve(db);
    };

    /* =====================================================
       ❌ ERROR
    ===================================================== */

    request.onerror = () => {
      console.error('❌ Falha ao abrir o Códice (IndexedDB)');
      reject(request.error);
    };
  });

  return dbReadyPromise;
}

/* =========================================================
   🧪 SAFE DB ACCESSOR
========================================================= */

export function getDB() {
  if (!db) {
    throw new Error('DB ainda não inicializada. Chama initDB() primeiro.');
  }
  return db;
}

/* =========================================================
   🪵 LOG SYSTEM (robusto)
========================================================= */

export function addLog(message, type = 'info') {
  try {
    if (!db) {
      console.warn('🪵 Log ignorado (DB não pronta)');
      return;
    }

    const tx = db.transaction('logs', 'readwrite');
    const store = tx.objectStore('logs');

    const request = store.add({
      message,
      type,
      date: new Date().toISOString()
    });

    request.onerror = () => {
      console.warn('🪵 Falha ao gravar log');
    };

  } catch (err) {
    console.error('Log system error:', err);
  }
}

/* =========================================================
   🧹 UTILITY — future proof
========================================================= */

/**
 * Espera pela DB estar pronta (use em módulos críticos)
 */
export async function whenDBReady() {
  return await initDB();
}
