function showView(view) {
    // Atualizar botões da barra
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    event.currentTarget?.classList.add('active');

    const app = document.getElementById('app');
    
    switch(view) {
        case 'home':
            renderHome(app);
            break;
        case 'wiki':
            renderWiki(app);
            break;
        case 'zonas':
            app.innerHTML = '<div class="fb-card"><h2>Zonas</h2><p>Em breve...</p></div>';
            break;
        case 'notas':
            app.innerHTML = '<div class="fb-card"><h2>Notas</h2><p>Em breve...</p></div>';
            break;
    }
}

function renderHome(container) {
    const lua = getFaseLunar(); // Vem do lunar.js
    container.innerHTML = `
        <div class="fb-card">
            <div style="display:flex; align-items:center; gap:15px">
                <span style="font-size:3rem">${lua.emoji}</span>
                <div>
                    <h3 style="margin:0">${lua.nome}</h3>
                    <p style="color:var(--text-sec); margin:5px 0">${lua.acao}</p>
                </div>
            </div>
        </div>
        <div class="fb-card">
            <h4>Resumo da Horta</h4>
            <p>Tens 5 plantas a precisar de água.</p>
        </div>
    `;
}

// Iniciar na Home
window.onload = () => showView('home');
