import { db } from '../db.js';
import { formatMoney } from '../ui.js';

export async function init() {
  render();
}

async function render() {
  const ingredientes = await db.ingredientes.toArray();
  const baixos = ingredientes.filter(i => i.quantidade <= i.estoqueMinimo);
  const agenda = await db.agenda.where('data').aboveOrEqual(new Date().toISOString().split('T')[0]).toArray();
  const hoje = agenda.filter(a => a.data === new Date().toISOString().split('T')[0]);

  document.getElementById('dashboard').innerHTML = `
    <div class="grid">
      <div class="card">
        <h3>📦 Estoque Baixo</h3>
        ${baixos.length? baixos.map(i => `
          <div class="alert" style="margin-bottom:0.5rem">
            ${i.nome}: ${i.quantidade} ${i.unidade} / mín ${i.estoqueMinimo}
          </div>
        `).join('') : '<p class="badge badge-success">Tudo OK!</p>'}
      </div>
      <div class="card">
        <h3>📅 Hoje: ${hoje.length} encomendas</h3>
        ${hoje.map(a => `<p>${a.cliente} - Qtd: ${a.quantidade}</p>`).join('')}
      </div>
      <div class="card">
        <h3>📊 Resumo</h3>
        <p>Total Ingredientes: ${ingredientes.length}</p>
        <p>Encomendas próximas: ${agenda.length}</p>
        <p>Valor estoque: ${formatMoney(ingredientes.reduce((s,i) => s + i.precoCompra*i.quantidade, 0))}</p>
      </div>
    </div>
  `;
}