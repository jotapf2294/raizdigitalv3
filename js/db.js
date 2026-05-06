// js/db.js
const db = new Dexie('BabeBakeryDB');

db.version(2).stores({
  ingredientes: '++id, nome, unidade, precoCompra, quantidade, estoqueMinimo',
  insumos: '++id, nome, preco, qtd, unidade', // <- NOVO: separa insumos de estoque bruto
  receitas: '++id, codigo, nome, categoria, rendTotal, rendPorcoes, tempo, tempArm, pcc, preparo, embalagem, validade, alergenos, ingredientes, dataAtual',
  agenda: '++id, data, receitaId, quantidade, status, cliente',
  config: 'key, value'
}).upgrade(tx => {
  // Migração: copia ingredientes pra insumos se vazio
  return tx.insumos.count().then(count => {
    if (count === 0) {
      return tx.ingredientes.toArray().then(ings => {
        const insumos = ings.map(i => ({
          id: i.id.toString(),
          nome: i.nome,
          preco: i.precoCompra,
          qtd: i.quantidade,
          unidade: i.unidade
        }));
        return tx.insumos.bulkAdd(insumos);
      });
    }
  });
});

export { db };