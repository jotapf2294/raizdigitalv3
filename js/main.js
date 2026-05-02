/**
 * CORE ENGINE - js/main.js
 */

const App = {
    init: () => {
        console.log("Horta Gestão: A iniciar motor principal...");
        App.loadTheme();
        App.bindEvents();
        // Iniciamos na Wiki por padrão
        App.router('home');
    },

    router: async (view) => {
        const container = document.getElementById('app');
        if (!container) return;

        App.updateNavUI(view);

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
                        throw new Error("Módulo Wiki não encontrado.");
                    }
                    break;

                case 'zonas':
                    // AGORA ATIVADO: Chama o módulo que criámos anteriormente
                    if (typeof ZonasModule !== 'undefined') {
                        await ZonasModule.render(container);
                    } else {
                        throw new Error("Módulo de Zonas não encontrado.");
                    }
                    break;

                case 'notas':
                    container.innerHTML = `
                        <div class="fb-card">
                            <h2>📓 Caderno de Campo</h2>
                            <p style="color: var(--text-secondary)">Próximo passo: Registo de observações.</p>
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

    renderHome: (container) => {
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
                <h3>Resumo da Horta</h3>
                <p style="color:var(--text-secondary)">
                    Sistema 100% local e privado. Os teus dados não saem deste dispositivo.
                </p>
            </div>
        `;
    },

    updateNavUI: (currentView) => {
        document.querySelectorAll('.tab-item').forEach(btn => {
            btn.classList.remove('active');
            // Verifica se o onclick do botão contém a string da view (ex: 'wiki')
            if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${currentView}'`)) {
                btn.classList.add('active');
            }
        });
    },

    bindEvents: () => {
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) themeBtn.onclick = App.toggleTheme;
    },

    toggleTheme: () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    },

    loadTheme: () => {
        const saved = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
    }
};

document.addEventListener('DOMContentLoaded', App.init);
