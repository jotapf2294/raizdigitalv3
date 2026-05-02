/**
 * Códice do Jota — Memória da Terra (versão estabilizada)
 * IndexedDB: base agrícola persistente offline
 */

export const DB_NAME = 'codiceDB';
export const DB_VERSION = 1;

export let db;

/* =========================================================
   🧠 INICIALIZAÇÃO DA BASE DE DADOS
========================================================= */

export function initDB() {
  return new Promise((resolve, reject) => {

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      // 🌱 TALHÕES
      if (!database.objectStoreNames.contains('talhoes')) {
        const talhoes = database.createObjectStore('talhoes', {
          keyPath: 'id',
          autoIncrement: true
        });

        talhoes.createIndex('nome', 'nome', { unique: false });
      }

      // 🌿 PLANTAS
      if (!database.objectStoreNames.contains('plantas')) {
        const plantas = database.createObjectStore('plantas', {
          keyPath: 'id',
          autoIncrement: true
        });

        plantas.createIndex('nome', 'nome', { unique: false });
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

    request.onsuccess = () => {
      db = request.result;

      console.log('🧠 Códice: memória da terra ativa');

      resolve(db);
    };

    request.onerror = () => {
      console.error('❌ Falha ao abrir o Códice (IndexedDB)');
      reject(request.error);
    };
  });
}

/* =========================================================
   🪵 LOGS — memória operacional
========================================================= */

export function addLog(entry) {
  if (!db) return;

  const tx = db.transaction('logs', 'readwrite');
  const store = tx.objectStore('logs');

  store.add({
    message: entry,
    date: new Date().toISOString()
  });
}
