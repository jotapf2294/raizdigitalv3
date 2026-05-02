const db = new Dexie("MinhaHortaDB");

db.version(1).stores({
    especies: '++id, nome, categoria',
    zonas: '++id, nome',
    colheitas: '++id, nome, data',
    notas: '++id, titulo'
});

// Função para alternar Dark Mode
function toggleDarkMode() {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('horta-theme', theme);
}

// Carregar tema salvo
const savedTheme = localStorage.getItem('horta-theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
