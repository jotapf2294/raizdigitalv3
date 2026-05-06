import { db } from '../db.js';
import { toast, showModal, formatMoney } from '../ui.js';

export async function init() {
  render();
}

async function render() {
  const ingredientes = await db.ingredientes.toArray();
  document.getElementById('ingredientes').innerHTML = `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <h2>Ingredientes</h2>
        <button class="btn" id="add-ingrediente">+ Novo</button>
      </div>
      <table>
        <thead><tr><th>Nome</th><th>Estoque</th><th>Preço/Un</th><th>Ações</th></tr></thead>
        <tbody>
          ${ingredientes.map(i => `
            <tr>
              <td>${i.nome}</td>
              <td>${i.quantidade} ${i.unidade} ${i.quantidade <= i.estoqueMinimo? '<span class="badge badge-danger">Baixo</span>' : ''}</td>
              <td>${formatMoney(i.precoCompra)}</td>
              <td>
                <button class="btn" onclick="editIngrediente(${i.id})">Editar</button>
                <button class="btn btn-danger" onclick="deleteIngrediente(${i.id})">X</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  document.getElementById('add-ingrediente').onclick = () => formIngrediente();
}

window.editIngrediente = async (id) => formIngrediente(await db.ingredientes.get(id));
window.deleteIngrediente = async (id) => {
  if (confirm('Apagar?')) { await db.ingredientes.delete(id); render(); toast('Apagado'); }
}

function formIngrediente(item = {}) {
  showModal(`
    <h3>${item.id? 'Editar' : 'Novo'} Ingrediente</h3>
    <form id="form-ingrediente">
      <div class="form-group"><label>Nome</label><input name="nome" required value="${item.nome || ''}"></div>
      <div class="grid" style="grid-template-columns:1fr 1fr">
        <div class="form-group"><label>Unidade</label>
          <select name="unidade" required>
            ${['kg','g','L','ml','un'].map(u => `<option ${item.unidade===u?'selected':''}>${u}</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label>Preço Compra</label><input name="precoCompra" type="number" step="0.01" required value="${item.precoCompra || ''}"></div>
        <div class="form-group"><label>Qtd em Estoque</label><input name="quantidade" type="number" step="0.01" required value="${item.quantidade || ''}"></div>
        <div class="form-group"><label>Estoque Mínimo</label><input name="estoqueMinimo" type="number" step="0.01" required value="${item.estoqueMinimo || 0}"></div>
      </div>
      <button class="btn" type="submit">Salvar</button>
    </form>
  `);
  document.getElementById('form-ingrediente').onsubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    ['precoCompra','quantidade','estoqueMinimo'].forEach(k => data[k] = Number(data[k]));
    if (item.id) await db.ingredientes.update(item.id, data);
    else await db.ingredientes.add(data);
    document.getElementById('modal').classList.add('hidden');
    render(); toast('Salvo!');
  };
}
