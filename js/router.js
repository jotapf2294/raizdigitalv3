/**
 * Códice do Jota — Router (Fase Final)
 * Navegação SPA verdadeira, sem reloads nem hacks
 */

import { renderPortico } from './portico.js';

import { renderTalhoes, bindTalhoesEvents } from './talhoes.js';
import { renderHerbario, bindHerbarioEvents } from './herbario.js';
import { renderNotas, bindNotasEvents } from './notas.js';
import { renderInstrumentos } from './instrumentos.js';

/* =========================================================
   🧠 ESTADO INTERNO DO ROUTER
========================================================= */

let currentPath = '/';

/* =========================================================
   🧭 ROTAS
========================================================= */

const routes = {
  '/': {
    render: renderPortico,
    bind: null
  },

  '/talhoes': {
    render: renderTalhoes,
    bind: bindTalhoesEvents
  },

  '/herbario': {
    render: renderHerbario,
    bind: bindHerbarioEvents
  },

  '/notas': {
    render: renderNotas,
    bind: bindNotasEvents
  },

  '/instrumentos': {
    render: renderInstrumentos,
    bind: null
  }
};

/* =========================================================
   🌙 RENDER CENTRAL (CORE DO SPA)
========================================================= */

async function renderRoute(path) {
  const view = document.getElementById('view');

  const route = routes[path];

  if (!route) {
    view.innerHTML = `
      <section class="card">
        <h2>⚠️ Página não encontrada</h2>
        <p>O caminho perdeu-se no Códice.</p>
      </section>
    `;
    return;
  }

  try {
    currentPath = path;

    // 🖼️ render
    view.innerHTML = await route.render();

    // 🔗 bind events (após DOM existir)
    if (typeof route.bind === 'function') {
      setTimeout(() => route.bind(), 0);
    }

    window.scrollTo(0, 0);

  } catch (err) {
    console.error('Router error:', err);

    view.innerHTML = `
      <section class="card">
        <h2>❌ Erro no Códice</h2>
        <p>Falha ao renderizar a página.</p>
      </section>
    `;
  }
}

/* =========================================================
   🚀 API PRINCIPAL — NAVEGAÇÃO
========================================================= */

export function navigate(path) {
  renderRoute(path);
}

/* =========================================================
   🧭 NAVEGAÇÃO POR BOTÕES (SIDEBAR)
========================================================= */

export function setupRouterLinks() {
  document.querySelectorAll('[data-route]').forEach(btn => {
    btn.addEventListener('click', () => {
      const path = btn.dataset.route;
      navigate(path);
    });
  });
}

/* =========================================================
   🔄 RE-RENDER CONTROLADO (SEM RELOAD)
   usado pelos módulos após CRUD
========================================================= */

function refresh() {
  renderRoute(currentPath);
}

/**
 * Permite aos módulos pedir refresh sem reload
 */
window.addEventListener('navigate-refresh', refresh);

/* =========================================================
   🌐 BACK/FORWARD (histórico real)
========================================================= */

window.addEventListener('popstate', (event) => {
  const path = event.state?.path || '/';
  renderRoute(path);
});

/* =========================================================
   🧭 NAVEGAÇÃO COM HISTÓRICO
========================================================= */

export function pushNavigate(path) {
  history.pushState({ path }, '', path);
  renderRoute(path);
}

/* =========================================================
   🧪 DEBUG (opcional)
========================================================= */

window.codexRouter = {
  navigate,
  pushNavigate,
  refresh,
  getCurrent: () => currentPath
};
