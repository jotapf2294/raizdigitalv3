import { renderDashboard } from './ui.js';
import { renderTalhoes, bindTalhoesEvents } from './talhoes.js';
import { renderHerbario, bindHerbarioEvents } from './herbario.js';
import { renderNotas, bindNotasEvents } from './notas.js';
import { renderInstrumentos } from './instrumentos.js';

const routes = {
  '/': async () => renderDashboard(),

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

  '/instrumentos': async () => renderInstrumentos()
};

export async function navigate(path) {
  const view = document.getElementById('view');

  const render = routes[path] || (() => `
    <section>
      <h2>⚠️ Página não encontrada</h2>
    </section>
  `);

  try {
    view.innerHTML = await render();
    window.scrollTo(0, 0);
  } catch (err) {
    console.error('Router error:', err);
    view.innerHTML = `<section><h2>❌ Erro a carregar página</h2></section>`;
  }
}