/**
 * DATABASE ENGINE - js/db.js
 * Configuração da estrutura de dados local.
 */
const db = new Dexie("MinhaHortaDB");

db.version(1).stores({
    // Adicionado campo 'notas' para a Wiki
    especies: '++id, nome, categoria, lua, rega, sol, meses, notas',
    zonas: '++id, nome, icon',
    colheitas: '++id, nome, peso, data',
    notas: '++id, titulo, data'
});

// Dados iniciais para não começar vazio
db.on("populate", () => {
    db.especies.bulkAdd([
        { 
            nome: "Tomate", 
            categoria: "Frutos", 
            lua: "Crescente", 
            rega: "Alta", 
            sol: "Pleno", 
            meses: "Mar-Jun", 
            notas: "Necessita de estacas para suporte." 
        },
        { 
            nome: "Alface", 
            categoria: "Folhas", 
            lua: "Crescente", 
            rega: "Média", 
            sol: "Meia-sombra", 
            meses: "Ano inteiro", 
            notas: "Cuidado com os caracóis em dias de chuva." 
        }
    ]);
});

db.open().catch(err => {
    console.error("Erro Crítico na DB:", err.stack);
});
