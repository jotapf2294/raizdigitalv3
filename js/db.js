/**
 * DATABASE ENGINE - js/db.js
 * Versão 2.0 - Suporte para Gestão Profissional de Zonas e Cultivos
 */
const db = new Dexie("MinhaHortaDB");

// Definimos o schema atualizado
// Versão 2 permite a relação entre Zonas e Espécies
db.version(2).stores({
    especies: '++id, nome, categoria, lua, rega, sol, meses, notas',
    zonas: '++id, nome, icon',
    // Tabela de ligação: zonaId e especieId permitem o controlo detalhado
    cultivos: '++id, zonaId, especieId, dataPlantio, statusRega, statusNutrientes',
    colheitas: '++id, nome, peso, data',
    notas: '++id, titulo, texto, data'
});

// População inicial inteligente
db.on("populate", () => {
    console.log("A popular base de dados inicial...");
    db.especies.bulkAdd([
        { 
            nome: "Tomate", 
            categoria: "Frutos", 
            lua: "Crescente", 
            rega: "Alta", 
            sol: "Pleno", 
            meses: "Março - Junho", 
            notas: "Necessita de estacas para suporte e podas regulares dos 'ladrões'." 
        },
        { 
            nome: "Alface", 
            categoria: "Folhas", 
            lua: "Crescente", 
            rega: "Média", 
            sol: "Meia-sombra", 
            meses: "Ano inteiro", 
            notas: "Colher as folhas exteriores para manter a planta a produzir." 
        },
        { 
            nome: "Cenoura", 
            categoria: "Raízes", 
            lua: "Minguante", 
            rega: "Média", 
            sol: "Pleno", 
            meses: "Fevereiro - Outubro", 
            notas: "Solo deve estar bem solto e sem pedras." 
        }
    ]);

    // Criar uma zona padrão para o utilizador começar logo a ver algo
    db.zonas.add({ nome: "Canteiro Principal", icon: "🌿" });
});

// Abertura da ligação com tratamento de erros
db.open().then(() => {
    console.log("Base de dados MinhaHortaDB pronta e ligada.");
}).catch(err => {
    console.error("Erro Crítico ao abrir a IndexedDB:", err.stack);
    // Caso haja erro de versão, podemos forçar o upgrade apagando a versão antiga (CUIDADO em produção)
    // Dexie.delete("MinhaHortaDB"); 
});

// Exportar para uso global
window.db = db;
