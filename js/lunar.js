/**
 * LUNAR ENGINE - js/lunar.js
 */
function getFaseLunar() {
    const agora = new Date();
    
    // Referência: Lua Nova exata em 11 de Janeiro de 2024
    const referenciaNova = new Date("2024-01-11T11:57:00Z");
    
    // Ciclo lunar em milissegundos (29.53059 dias)
    const cicloLongo = 29.530588 * 24 * 60 * 60 * 1000;
    
    const diff = agora - referenciaNova;
    const fasePercent = (diff % cicloLongo) / cicloLongo;

    // Normalizar para que fique entre 0 e 1
    const phase = fasePercent < 0 ? fasePercent + 1 : fasePercent;

    // Determinação precisa das fases para o agricultor
    if (phase < 0.05) 
        return { nome: "Lua Nova", emoji: "🌑", acao: "Pausa: Preparar canteiros e adubar." };
    if (phase < 0.25) 
        return { nome: "Crescente", emoji: "🌒", acao: "Semeia flores, frutos e cereais." };
    if (phase < 0.45) 
        return { nome: "Quarto Crescente", emoji: "🌓", acao: "Ideal para hortaliças de folha." };
    if (phase < 0.55) 
        return { nome: "Lua Cheia", emoji: "🌕", acao: "Colher, podar e combater pragas." };
    if (phase < 0.75) 
        return { nome: "Lua Minguante", emoji: "🌖", acao: "Planta raízes, batatas e bolbos." };
    if (phase < 0.95) 
        return { nome: "Balsâmica", emoji: "🌘", acao: "Limpeza, monda e compostagem." };
        
    return { nome: "Lua Nova", emoji: "🌑", acao: "Pausa: Solo a descansar." };
}

// Tornar a função global para o main.js a encontrar
window.getFaseLunar = getFaseLunar;
