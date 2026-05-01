function getFaseLunar() {
    const date = new Date();
    // Cálculo simplificado para precisão aproximada (Ciclo de 29.53 dias)
    const lp = 2551443; 
    const new_moon = new Date("2024-01-11T11:57:00").getTime() / 1000;
    const now = date.getTime() / 1000;
    const phase = ((now - new_moon) % lp) / lp;

    if (phase < 0.05) return { nome: "Lua Nova", emoji: "🌑", acao: "Pausa: Solo a descansar." };
    if (phase < 0.25) return { nome: "Crescente", emoji: "🌒", acao: "Ideal para Folhas e Frutos." };
    if (phase < 0.45) return { nome: "Quarto Crescente", emoji: "🌓", acao: "Semeia acima do solo." };
    if (phase < 0.55) return { nome: "Lua Cheia", emoji: "🌕", acao: "Ideal para Colher e Podar." };
    if (phase < 0.75) return { nome: "Lua Minguante", emoji: "🌖", acao: "Ideal para Raízes e Bolbos." };
    return { nome: "Fim de Ciclo", emoji: "🌘", acao: "Limpeza da horta." };
}
