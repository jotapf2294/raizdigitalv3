/**
 * Códice do Jota — Memória da Terra
 * IndexedDB: onde nada se perde, tudo se grava
 */

export const DB_NAME = 'codiceDB';
export const DB_VERSION = 1;

export let db;

/**
 * Inicializa a base de dados IndexedDB
 * Cria os “livros” do Códice (object stores)
 */
export function initDB() {
  return new Promise((resolve, reject) => {

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    /**
     * Criação/atualização da estrutura da base de dados
     */
    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      // 🌱 Talhões — zonas de cultivo
      if (!database.objectStoreNames.contains('talhoes')) {
        const talhoes = database.createObjectStore('talhoes', {
          keyPath: 'id',
          autoIncrement: true
        });

        talhoes.createIndex('nome', 'nome', { unique: false });
      }

      // 🌿 Plantas — herbário vivo
      if (!database.objectStoreNames.contains('plantas')) {
        const plantas = database.createObjectStore('plantas', {
          keyPath: 'id',
          autoIncrement: true
        });

        plantas.createIndex('nome', 'nome', { unique: false });
      }

      // 📜 Notas — arquivo do sábio
      if (!database.objectStoreNames.contains('notas')) {
        database.createObjectStore('notas', {
          keyPath: 'id',
          autoIncrement: true
        });
      }

      // 🪵 Logs — histórico de ações
      if (!database.objectStoreNames.contains('logs')) {
        database.createObjectStore('logs', {
          keyPath: 'id',
          autoIncrement: true
        });
      }
    };

    /**
     * Sucesso na abertura da DB
     */
    request.onsuccess = () => {
      db = request.result;
      console.log('🧠 Códice: memória da terra ativa');
      resolve(db);
    };

    /**
     * Erro fatal de abertura
     */
    request.onerror = () => {
      console.error('❌ Falha ao abrir o Códice (IndexedDB)');
      reject(request.error);
    };
  });
}

/**
 * Utilitário: grava log no Códice
 */
export function addLog(entry) {
  if (!db) return;

  const tx = db.transaction('logs', 'readwrite');
  const store = tx.objectStore('logs');

  store.add({
    message: entry,
    date: new Date().toISOString()
  });
}
