import { db } from '../db.js';
import { toast, showModal, formatMoney } from '../ui.js';

export async function init() {
  render();
}

async function render() {
  const agenda = await db.agenda.orderBy('data').toArray();
  const receitas = await db.receitas.toArray();

  document.getElementById('agenda').innerHTML = `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <h2>Agenda de Encomendas</h2>
        <button class="btn" id="add-encomenda">+ Nova</button>
      </div>
      <table>
        <thead><tr><th>Data</th><th>Receita</th><th>Qtd</th><th>Cliente</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>
          ${agenda.map(a => {
            const r = receitas.find(r => r.id === a.receitaId);
            return `<tr>
              <td>${new Date(a.data).toLocaleDateString('pt-PT')}</td>
              <td>${r?.nome || 'N/A'}</td>
              <td>${a.quantidade}</td>
              <td>${a.cliente}</td>
              <td><span class="badge ${a.status==='feito'?'badge-success':''}">${a.status}</span></td>
              <td><button class="btn" onclick="toggleStatus(${a.id})">✓</button></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
  document.getElementById('add-encomenda').onclick = () => formAgenda(receitas);
}

window.toggleStatus = async (id) => {
  const item = await db.agenda.get(id);
  await db.agenda.update(id, { status: item.status === 'feito'? 'pendente' : 'feito' });
  render();
}

function formAgenda(receitas) {
  showModal(`
    <h3>Nova Encomenda</h3>
    <form id="form-agenda">
      <div class="form-group"><label>Data</label><input name="data" type="date" required></div>
      <div class="form-group"><label>Receita</label>
        <select name="receitaId" required>
          ${receitas.map(r => `<option value="${r.id}">${r.nome}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label>Quantidade</label><input name="quantidade" type="number" required></div>
      <div class="form-group"><label>Cliente</label><input name="cliente" required></div>
      <button class="btn" type="submit">Agendar</button>
    </form>
  `);
  document.getElementById('form-agenda').onsubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    data.receitaId = Number(data.receitaId);
    data.quantidade = Number(data.quantidade);
    data.status = 'pendente';
    await db.agenda.add(data);
    document.getElementById('modal').classList.add('hidden');
    render(); toast('Encomenda agendada!');
  };
}