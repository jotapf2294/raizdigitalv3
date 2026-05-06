import { db, exportDB, importDB } from './db.js';
import * as UI from './ui.js';
import * as Ingredientes from './modules/ingredientes.js';
import * as Receitas from './modules/receitas.js';
import * as Agenda from './modules/agenda.js';
import * as Dashboard from './modules/dashboard.js';

// Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    e.target.classList.add('active');
    document.getElementById(e.target.dataset.tab).classList.add('active');
  });
});

// Theme
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
themeToggle.textContent = currentTheme === 'dark'? '☀️' : '🌙';
themeToggle.addEventListener('click', () => {
  const theme = document.documentElement.getAttribute('data-theme') === 'dark'? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.textContent = theme === 'dark'? '☀️' : '🌙';
});

// Modal
document.querySelector('.close').addEventListener('click', () => {
  document.getElementById('modal').classList.add('hidden');
});

// Init módulos
Dashboard.init();
Ingredientes.init();
Receitas.init();
Agenda.init();
initConfig();

async function initConfig() {
  const container = document.getElementById('config');
  const margem = (await db.config.get('margemPadrao'))?.value || 100;
  container.innerHTML = `
    <div class="card">
      <h2>Configurações</h2>
      <div class="form-group">
        <label>Margem de Lucro Padrão (%)</label>
        <input type="number" id="margem-padrao" value="${margem}">
      </div>
      <button class="btn" id="save-config">Salvar</button>
      <hr style="margin: 2rem 0">
      <h3>Backup</h3>
      <button class="btn btn-success" id="export-btn">Exportar JSON</button>
      <input type="file" id="import-file" accept=".json" style="margin-top: 1rem">
      <button class="btn" id="import-btn">Importar JSON</button>
    </div>
  `;

  document.getElementById('save-config').onclick = async () => {
    await db.config.put({ key: 'margemPadrao', value: Number(document.getElementById('margem-padrao').value) });
    UI.toast('Configurações salvas!');
  };
  document.getElementById('export-btn').onclick = exportDB;
  document.getElementById('import-btn').onclick = async () => {
    const file = document.getElementById('import-file').files[0];
    if (file) { await importDB(file); location.reload(); }
  };
}