import { navigate } from './router.js';
import { initDB } from './db.js';
import { seedData } from './seed.js';

function applySavedTheme() {
  const saved = localStorage.getItem('codex-theme');
  document.body.classList.toggle('dark', saved === 'dark');
}

function setupThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  btn.onclick = () => {
    document.body.classList.toggle('dark');
    localStorage.setItem(
      'codex-theme',
      document.body.classList.contains('dark') ? 'dark' : 'light'
    );
  };
}

function setupNavigation() {
  document.querySelectorAll('[data-route]').forEach(btn => {
    btn.onclick = () => navigate(btn.dataset.route);
  });
}

async function boot() {
  try {
    console.log('📜 Códice a arrancar...');

    applySavedTheme();

    await initDB();
    await seedData();

    setupNavigation();
    setupThemeToggle();

    await navigate('/');

    console.log('🌿 Códice pronto.');

  } catch (err) {
    console.error('❌ Boot error:', err);
    document.getElementById('view').innerHTML =
      `<h2>Erro a iniciar o Códice</h2>`;
  }
}

document.addEventListener('DOMContentLoaded', boot);