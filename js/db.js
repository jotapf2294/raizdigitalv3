// js/db.js
const db = new Dexie("HortaDB");

// Definimos as tabelas. O "++id" significa que é um ID auto-incremento.
db.version(1).stores({
    zonas: '++id, nome, tipo, icone',
    especies: '++id, nome, familia',
    cultivos: '++id, zonaId, especieId, dataPlantio',
    colheitas: '++id, cultivoId, data, peso',
    notas: '++id, titulo, categoria'
});

// Função para garantir que temos algumas zonas iniciais se estiver vazio
async function inicializarDados() {
    const count = await db.zonas.count();
    if (count === 0) {
        await db.zonas.bulkAdd([
            { nome: "Canteiro Norte", tipo: "Terra", icone: "🌿" },
            { nome: "Estufa Principal", tipo: "Coberto", icone: "🏠" },
            { nome: "Vasos Varanda", tipo: "Vaso", icone: "🪴" }
        ]);
        console.log("Zonas iniciais criadas!");
    }
}

inicializarDados();
