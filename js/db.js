/**
 * DATABASE ENGINE - js/db.js
 * Versão 3.0 - Gestão Inteligente de Cultivos (Alertas, Origem e Notas)
 */
const db = new Dexie("MinhaHortaDB");

// Definimos o schema atualizado para a Versão 3
db.version(3).stores({
    especies: '++id, nome, categoria, lua, rega, sol, meses, notas',
    zonas: '++id, nome, icon',
    // Tabela de cultivos expandida para rastreio técnico
    cultivos: '++id, zonaId, especieId, dataPlantio, origem, ultimaRega, statusNutrientes, notasDesenvolvimento',
    colheitas: '++id, nome, peso, data',
    notas: '++id, titulo, texto, data'
});

// População inicial (Executada apenas na primeira vez que a DB é criada)
db.on("populate", () => {
    console.log("A popular base de dados inicial (V3)...");
    db.especies.bulkAdd([
        { 
            nome: "Tomate", 
            categoria: "Frutos", 
            lua: "Crescente", 
            rega: "Alta", 
            sol: "Pleno", 
            meses: "Março - Junho", 
            notas: "Necessita de estacas para suporte e podas regulares." 
        },
        { 
            nome: "Alface", 
            categoria: "Folhas", 
            lua: "Crescente", 
            rega: "Média", 
            sol: "Meia-sombra", 
            meses: "Ano inteiro", 
            notas: "Ideal para rotação de culturas rápida." 
        },
        { 
            nome: "Cenoura", 
            categoria: "Raízes", 
            lua: "Minguante", 
            rega: "Média", 
            sol: "Pleno", 
            meses: "Fevereiro - Outubro", 
            notas: "Evitar excesso de azoto para não bifurcar as raízes." 
        }
    ]);

    // Criar uma zona padrão para teste imediato
    db.zonas.add({ nome: "Canteiro Principal", icon: "🌿" });
});

// Abrir a ligação à IndexedDB
db.open().then(() => {
    console.log("MinhaHortaDB (V3) ligada com sucesso.");
}).catch(err => {
    console.error("Erro Crítico na IndexedDB:", err.stack);
    
    /* DICA TÉCNICA: Se tiveres problemas de versão durante o desenvolvimento, 
       podes descomentar a linha abaixo, fazer refresh e comentar de novo. 
       Isso limpa tudo para recomeçares do zero.
    */
    // Dexie.delete("MinhaHortaDB"); 
});

// Exportar globalmente para que o main.js e os módulos a consigam usar
window.db = db;
