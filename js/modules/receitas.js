import { db } from '../db.js';
import { toast, showModal, formatMoney } from '../ui.js';

export async function init() {
  render();
}

async function render() {
  const receitas = await db.receitas.toArray();
  document.getElementById('receitas').innerHTML = `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <h2>Fichas Técnicas</h2>
        <button class="btn" id="add-receita">+ Nova Receita</button>
      </div>
      <div class="grid">
        ${receitas.map(r => `
          <div class="card">
            <h3>${r.nome}</h3>
            <p>Rende: ${r.rendimento} un</p>
            <p>Custo: ${formatMoney(r.custoTotal)} | Unit: ${formatMoney(r.custoTotal/r.rendimento)}</p>
            <p>Preço Venda: ${formatMoney(r.precoVenda)} <span class="badge badge-success">${r.margem}%</span></p>
            <button class="btn" onclick="editReceita(${r.id})">Ver/Editar</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  document.getElementById('add-receita').onclick = () => formReceita();
}

window.editReceita = async (id) => formReceita(await db.receitas.get(id));

async function formReceita(receita = { itens: [] }) {
  const ingredientes = await db.ingredientes.toArray();
  const margemPadrao = (await db.config.get('margemPadrao'))?.value || 100;

  showModal(`
    <h3>${receita.id? 'Editar' : 'Nova'} Receita</h3>
    <form id="form-receita">
      <div class="form-group"><label>Nome</label><input name="nome" required value="${receita.nome || ''}"></div>
      <div class="form-group"><label>Rendimento (unidades)</label><input name="rendimento" type="number" required value="${receita.rendimento || 1}"></div>
      <h4>Ingredientes</h4>
      <div id="itens-receita">${receita.itens.map((item, idx) => itemRow(item, ingredientes, idx)).join('')}</div>
      <button type="button" class="btn" onclick="addItemRow()">+ Ingrediente</button>
      <hr style="margin:1rem 0">
      <p><strong>Custo Total: <span id="custo-total">€0.00</span></strong></p>
      <div class="form-group"><label>Margem (%)</label><input name="margem" type="number" value="${receita.margem || margemPadrao}"></div>
      <p><strong>Preço Venda: <span id="preco-venda">€0.00</span></strong></p>
      <button class="btn" type="submit">Salvar</button>
    </form>
  `);

  window.addItemRow = () => {
    const div = document.createElement('div');
    div.innerHTML = itemRow({}, ingredientes, document.querySelectorAll('#itens-receita > div').length);
    document.getElementById('itens-receita').appendChild(div);
    calcCusto();
  };

  document.getElementById('form-receita').oninput = calcCusto;
  document.getElementById('form-receita').onsubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const itens = [...document.querySelectorAll('#itens-receita > div')].map(div => ({
      ingredienteId: Number(div.querySelector('[name=ingredienteId]').value),
      quantidade: Number(div.querySelector('[name=quantidade]').value)
    })).filter(i => i.ingredienteId && i.quantidade);

    const data = {
      nome: form.get('nome'),
      rendimento: Number(form.get('rendimento')),
      itens,
      margem: Number(form.get('margem')),
      custoTotal: calcCustoTotal(itens, ingredientes),
    };
    data.precoVenda = data.custoTotal * (1 + data.margem/100);

    if (receita.id) await db.receitas.update(receita.id, data);
    else await db.receitas.add(data);
    document.getElementById('modal').classList.add('hidden');
    render(); toast('Receita salva!');
  };
  calcCusto();

  function itemRow(item, ingredientes, idx) {
    return `<div style="display:grid;grid-template-columns:2fr 1fr auto;gap:0.5rem;margin-bottom:0.5rem">
      <select name="ingredienteId" required>
        <option value="">Selecione</option>
        ${ingredientes.map(i => `<option value="${i.id}" ${item.ingredienteId===i.id?'selected':''}>${i.nome} - ${formatMoney(i.precoCompra)}/${i.unidade}</option>`).join('')}
      </select>
      <input name="quantidade" type="number" step="0.001" placeholder="Qtd" value="${item.quantidade||''}" required>
      <button type="button" class="btn btn-danger" onclick="this.parentElement.remove();calcCusto()">X</button>
    </div>`;
  }

  function calcCustoTotal(itens, ingredientes) {
    return itens.reduce((sum, item) => {
      const ing = ingredientes.find(i => i.id === item.ingredienteId);
      return sum + (ing? ing.precoCompra * item.quantidade : 0);
    }, 0);
  }

  window.calcCusto = function() {
    const itens = [...document.querySelectorAll('#itens-receita > div')].map(div => ({
      ingredienteId: Number(div.querySelector('[name=ingredienteId]').value),
      quantidade: Number(div.querySelector('[name=quantidade]').value)
    }));
    const custo = calcCustoTotal(itens, ingredientes);
    const margem = Number(document.querySelector('[name=margem]').value) || 0;
    document.getElementById('custo-total').textContent = formatMoney(custo);
    document.getElementById('preco-venda').textContent = formatMoney(custo * (1 + margem/100));
  }
}