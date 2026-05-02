/**
 * Códice do Jota — Router (versão viva)
 * Controla navegação + render + ligação de eventos
 */

import { renderPortico } from './portico.js';

import { renderTalhoes, bindTalhoesEvents } from './talhoes.js';
import { renderHerbario, bindHerbarioEvents } from './herbario.js';
import { renderNotas, bindNotasEvents } from './notas.js';
import { renderInstrumentos } from './instrumentos.js';

/* =========================================================
   🧭 TÁBUA DE ROTAS (vivas)
========================================================= */

const routes = {
  '/': async () => renderPortico(),

  '/talhoes': async () => {
    const html = await renderTalhoes();
    setTimeout(() => bindTalhoesEvents(), 0);
    return html;
  },

  '/herbario': async () => {
    const html = await renderHerbario();
    setTimeout(() => bindHerbarioEvents(), 0);
    return html;
  },

  '/notas': async () => {
    const html = await renderNotas();
    setTimeout(() => bindNotasEvents(), 0);
    return html;
  },

  '/instrumentos': async () => {
    return renderInstrumentos();
  }
};

/* =========================================================
   🌙 NAVEGAÇÃO CENTRAL
========================================================= */

export async function navigate(path) {
  const view = document.getElementById('view');

  const render = routes[path] || (() => `
    <section>
      <h2>⚠️ Página não encontrada</h2>
      <p>O caminho perdeu-se no pergaminho.</p>
    </section>
  `);

  view.innerHTML = await render();

  window.scrollTo(0, 0);
}
