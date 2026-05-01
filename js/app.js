// Navegação entre secções
function navigate(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    // Carregamento específico de dados por página
    if (pageId === 'zonas') carregarZonas();
    if (pageId === 'wiki') carregarWiki();
}

// Lógica de Zonas
async function carregarZonas() {
    const container = document.getElementById('lista-zonas');
    const zonas = await db.zonas.toArray();
    container.innerHTML = zonas.map(z => `
        <div class="list-item">
            <span style="font-size: 1.5rem">${z.icone}</span>
            <div>
                <strong>${z.nome}</strong><br>
                <small>${z.tipo}</small>
            </div>
        </div>
    `).join('') || '<p style="text-align:center">Nenhuma zona criada.</p>';
}

async function abrirModalZona() {
    const nome = prompt("Nome da Zona:");
    if (!nome) return;
    const tipo = prompt("Tipo (Canteiro, Estufa, Vasos):");
    await db.zonas.add({ nome, tipo, icone: "🌿" });
    carregarZonas();
}

// Lógica da Wiki
async function carregarWiki() {
    const container = document.getElementById('lista-wiki');
    const especies = await db.especies.toArray();
    container.innerHTML = especies.map(e => `
        <div class="list-item">
            <span style="font-size: 1.5rem">${e.icon}</span>
            <div>
                <strong>${e.nome}</strong><br>
                <small>Melhor Lua: ${e.luaIdeal}</small>
            </div>
        </div>
    `).join('');
}

// Inicialização
window.addEventListener('DOMContentLoaded', () => {
    const lua = getFaseLunar();
    document.getElementById('lunar-emoji').innerText = lua.emoji;
    document.getElementById('lunar-name').innerText = lua.nome;
    document.getElementById('lunar-advice').innerText = lua.acao;
});
