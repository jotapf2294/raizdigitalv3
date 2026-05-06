// Dexie já está no window por causa do CDN
const db = new Dexie('BabeBakeryDB');

db.version(1).stores({
  ingredientes: '++id, nome, unidade, precoCompra, quantidade, estoqueMinimo',
  receitas: '++id, nome, rendimento, itens, custoTotal, precoVenda, margem',
  agenda: '++id, data, receitaId, quantidade, status, cliente',
  config: 'key, value'
});

db.on('populate', async () => {
  await db.config.bulkAdd([
    { key: 'margemPadrao', value: 100 },
    { key: 'moeda', value: 'EUR' }
  ]);
});

export { db };

export async function exportDB() {
  const data = {
    ingredientes: await db.ingredientes.toArray(),
    receitas: await db.receitas.toArray(),
    agenda: await db.agenda.toArray(),
    config: await db.config.toArray(),
    exportDate: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `babe-backup-${Date.now()}.json`; a.click();
}

export async function importDB(file) {
  const text = await file.text();
  const data = JSON.parse(text);
  await db.transaction('rw', db.tables, async () => {
    await Promise.all(db.tables.map(t => t.clear()));
    if (data.ingredientes) await db.ingredientes.bulkAdd(data.ingredientes);
    if (data.receitas) await db.receitas.bulkAdd(data.receitas);
    if (data.agenda) await db.agenda.bulkAdd(data.agenda);
    if (data.config) await db.config.bulkAdd(data.config);
  });
}