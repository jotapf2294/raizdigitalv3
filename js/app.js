/**
 * Códice do Jota — Núcleo de Arranque
 * Aqui invocamos todos os sistemas base
 */

import { navigate } from './router.js';
import { initDB } from './db.js';
import { seedData } from './seed.js';

/**
 * Aplica tema guardado (Sol / Noite)
 */
function applySavedTheme() {
  const saved = localStorage.getItem('codex-theme');

  if (saved === 'dark') {
    document.body.classList.add('dark');
  }
}

/**
 * Alterna tema e guarda escolha
 */
function setupThemeToggle() {
  const btn = document.getElementById('themeToggle');

  btn.addEventListener('click', () => {
    document.body.classList.toggle('dark');

    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('codex-theme', isDark ? 'dark' : 'light');
  });
}

/**
 * Liga botões de navegação
 */
function setupNavigation() {
  document.querySelectorAll('[data-route]').forEach(btn => {
    btn.addEventListener('click', () => {
      const path = btn.dataset.route;
      navigate(path);
    });
  });
}

/**
 * Arranque principal do Códice
 */
document.addEventListener('DOMContentLoaded', async () => {

  console.log('📜 A abrir o Códice...');

  // Tema primeiro (para evitar flash visual)
  applySavedTheme();

  // Base de dados
  await initDB();

  // Sementes iniciais
  seedData();

  // Navegação
  setupNavigation();

  // Tema toggle
  setupThemeToggle();

  // Página inicial
  navigate('/');

  console.log('🌱 Códice pronto.');
});
