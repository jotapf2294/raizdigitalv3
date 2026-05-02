/**
 * Códice do Jota — Router
 * Controla as páginas do grimório
 */

import { renderDashboard } from './ui.js';

/**
 * Tábua de rotas
 * Cada caminho invoca uma função de render
 */
const routes = {
  '/': renderDashboard,

  '/talhoes': () => `
    <section>
      <h2>🌱 Talhões</h2>
      <p>Aqui nascerão os teus canteiros.</p>
    </section>
  `,

  '/herbario': () => `
    <section>
      <h2>🌿 Herbário Vivo</h2>
      <p>O conhecimento das plantas será guardado aqui.</p>
    </section>
  `,

  '/notas': () => `
    <section>
      <h2>📜 Arquivo do Sábio</h2>
      <p>Notas, experiências e segredos da terra.</p>
    </section>
  `
};

/**
 * Navega para uma rota
 * @param {string} path
 */
export function navigate(path) {
  const view = document.getElementById('view');

  // fallback seguro
  const render = routes[path] || (() => `
    <section>
      <h2>⚠️ Página não encontrada</h2>
    </section>
  `);

  view.innerHTML = render();

  // Pequeno detalhe de UX: scroll ao topo
  window.scrollTo(0, 0);
}
