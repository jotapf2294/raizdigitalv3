const db = new Dexie("HortaMasterDB");

db.version(1).stores({
    zonas: '++id, nome, tipo, icone',
    especies: '++id, nome, luaIdeal, tempoCrescimento',
    cultivos: '++id, zonaId, especieId, dataInicio',
    colheitas: '++id, data, peso, qualidade'
});

// Seed data para a Wiki (Já vem com espécies comuns)
async function popularWiki() {
    const count = await db.especies.count();
    if (count === 0) {
        await db.especies.bulkAdd([
            { nome: "Alface", luaIdeal: "Crescente", icon: "🥬" },
            { nome: "Tomate", luaIdeal: "Crescente", icon: "🍅" },
            { nome: "Cenoura", luaIdeal: "Minguante", icon: "🥕" },
            { nome: "Batata", luaIdeal: "Minguante", icon: "🥔" }
        ]);
    }
}

popularWiki();
