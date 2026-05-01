// Função simples para mudar de página
function navigate(pageId) {
    // Esconder todas as páginas
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    // Mostrar a página selecionada
    document.getElementById(pageId).classList.add('active');
    
    // Feedback tátil simples (se suportado)
    if (window.navigator.vibrate) window.navigator.vibrate(10);
}

// Inicializar a Lua ao carregar
window.onload = () => {
    const infoLua = getFaseLunar(); // Função que já criámos
    document.getElementById('moon-emoji').innerText = infoLua.emoji;
    document.getElementById('moon-phase').innerText = infoLua.nome;
    document.getElementById('moon-tip').innerText = infoLua.acao;
};
