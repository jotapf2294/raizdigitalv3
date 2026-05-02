/**
 * DATABASE ENGINE - js/db.js
 */
const db = new Dexie("MinhaHortaDB");

// Definimos o schema com os campos que a tua Wiki precisa
db.version(1).stores({
    especies: '++id, nome, categoria, emoji, lua, rega, sol, meses',
    zonas: '++id, nome, icon',
    colheitas: '++id, nome, peso, data',
    notas: '++id, titulo, data'
});

// Seed data opcional: Para a Wiki não aparecer vazia na primeira vez
db.on("populate", () => {
    db.especies.bulkAdd([
        { nome: "Tomate", categoria: "Frutos", emoji: "🍅", lua: "Crescente", rega: "Alta", sol: "Pleno", meses: "Mar-Jun" },
        { nome: "Alface", categoria: "Folhas", emoji: "🥬", lua: "Crescente", rega: "Média", sol: "Meia-sombra", meses: "Ano inteiro" }
    ]);
});

db.open().catch(err => {
    console.error("Erro ao abrir base de dados:", err.stack);
});
