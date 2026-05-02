/**
 * CORE ENGINE - js/main.js
 * Responsável pelo roteamento, tema e gestão de estado global.
 */

const App = {
    // 1. Configurações Iniciais
    init: () => {
        console.log("Horta Gestão: A iniciar motor principal...");
        
        // Aplicar tema guardado imediatamente
        App.loadTheme();

        // Configurar Event Listeners globais
        App.bindEvents();

        // Iniciar na Wiki (Vista principal solicitada)
        App.router('wiki');
    },

    // 2. Gestor de Navegação (Router)
    router: async (view) => {
        const container = document.getElementById('app');
        if (!container) return;

        // Atualizar estado visual da barra de navegação
        App.updateNavUI(view);

        // Feedback visual de carregamento
        container.innerHTML = `
            <div class="fb-card" style="text-align:center; padding: 40px;">
                <p style="color: var(--text-secondary)">A carregar módulo...</p>
            </div>
        `;

        try {
            switch (view) {
                case 'home':
                    App.renderHome(container);
                    break;

                case 'wiki':
                    if (typeof WikiModule !== 'undefined') {
                        await WikiModule.render(container);
                    } else {
                        throw new Error("Módulo Wiki não encontrado. Verifica se o ficheiro js/wiki.js está carregado.");
                    }
                    break;

                case 'zonas':
                    container.innerHTML = `
                        <div class="fb-card">
                            <h2>🗺️ Minhas Zonas</h2>
                            <p style="color: var(--text-secondary)">Em breve: Faz o mapeamento dos teus canteiros e associa plantas da Wiki.</p>
                        </div>
                    `;
                    break;

                case 'notas':
                    container.innerHTML = `
                        <div class="fb-card">
                            <h2>📓 Caderno de Campo</h2>
                            <p style="color: var(--text-secondary)">Em breve: Regista podas, adubações e observações diárias.</p>
                        </div>
                    `;
                    break;

                default:
                    App.renderHome(container);
            }
        } catch (error) {
            console.error("Erro de Roteamento:", error);
            container.innerHTML = `
                <div class="fb-card" style="border-left: 5px solid #ff4444;">
                    <h3 style="color: #ff4444">Erro de Sistema</h3>
                    <p>${error.message}</p>
                </div>
            `;
        }
    },

    // 3. Renderização da Home (Dashboard)
    renderHome: (container) => {
        // Tenta obter dados da Lua, se o motor lunar existir
        const lua = (typeof getFaseLunar === 'function') 
            ? getFaseLunar() 
            : { nome: 'Lua', emoji: '🌙', acao: 'Motor lunar indisponível.' };

        container.innerHTML = `
            <div class="fb-card">
                <div style="display:flex; align-items:center; gap:20px">
                    <span style="font-size:3.5rem">${lua.emoji}</span>
                    <div>
                        <h2 style="margin:0">${lua.nome}</h2>
                        <p style="color:var(--text-secondary); margin:5px 0">${lua.acao}</p>
                    </div>
                </div>
            </div>
            
            <div class="fb-card">
                <h3>Resumo do Dia</h3>
                <p style="color:var(--text-secondary)">
                    Bem-vindo de volta! A tua horta está registada localmente e segura. 
                    Usa o menu inferior para navegar.
                </p>
            </div>
        `;
    },

    // 4. Utilitários de Interface (UI)
    updateNavUI: (currentView) => {
        document.querySelectorAll('.tab-item').forEach(btn => {
            // Remove classe ativa de todos
            btn.classList.remove('active');
            
            // Verifica se o atributo onclick contém o nome da view
            if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(currentView)) {
                btn.classList.add('active');
            }
        });
    },

    bindEvents: () => {
        // Toggle de Dark Mode
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', App.toggleTheme);
        }
    },

    // 5. Gestão de Temas (Dark Mode)
    toggleTheme: () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        console.log(`Tema alterado para: ${next}`);
    },

    loadTheme: () => {
        const saved = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
    }
};

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', App.init);
