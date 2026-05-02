/**
 * Códice do Jota — Núcleo de Arranque (versão viva)
 * Orquestra DB, router, UI e sementes iniciais
 */

import { navigate } from './router.js';
import { initDB } from './db.js';
import { seedData } from './seed.js';

/* =========================================================
   🎨 TEMA — persistência solar/lunar
========================================================= */

function applySavedTheme() {
  const saved = localStorage.getItem('codex-theme');

  if (saved === 'dark') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
}

function setupThemeToggle() {
  const btn = document.getElementById('themeToggle');

  if (!btn) return;

  btn.addEventListener('click', () => {
    document.body.classList.toggle('dark');

    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('codex-theme', isDark ? 'dark' : 'light');
  });
}

/* =========================================================
   🧭 NAVEGAÇÃO — liga botões do grimório
========================================================= */

function setupNavigation() {
  document.querySelectorAll('[data-route]').forEach(btn => {
    btn.addEventListener('click', () => {
      const path = btn.dataset.route;
      navigate(path);
    });
  });
}

/* =========================================================
   🌱 BOOT SEGURO — evita corrida de inicialização
========================================================= */

async function boot() {
  console.log('📜 A abrir o Códice...');

  try {
    // 🌙 Tema primeiro (evita flash)
    applySavedTheme();

    // 🧠 Base de dados (memória da terra)
    await initDB();

    // 🌱 Sementes iniciais (apenas 1x)
    await seedData();

    // 🧭 UI interativa
    setupNavigation();
    setupThemeToggle();

    // 🏛️ Pórtico inicial
    navigate('/');

    console.log('🌿 Códice pronto para cultivo.');

  } catch (err) {
    console.error('❌ Erro no arranque do Códice:', err);
  }
}

/* =========================================================
   🚀 ARRANQUE
========================================================= */

document.addEventListener('DOMContentLoaded', boot);
