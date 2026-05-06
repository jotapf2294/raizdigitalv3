export function toast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = 'position:fixed;bottom:20px;right:20px;background:var(--success);color:white;padding:1rem;border-radius:8px;z-index:2000';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

export function showModal(content) {
  document.getElementById('modal-body').innerHTML = content;
  document.getElementById('modal').classList.remove('hidden');
}

export function formatMoney(val) {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(val);
}