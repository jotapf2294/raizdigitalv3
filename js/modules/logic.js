export function calcularCustoIngrediente(insumo, pesoBruto) {
  if (!insumo || !pesoBruto) return 0;
  const precoPorUnidade = parseFloat(insumo.preco) / parseFloat(insumo.qtd || 1);
  return precoPorUnidade * parseFloat(pesoBruto);
}

export function calcularTotalGeral(ingredientesReceita, insumos) {
  return ingredientesReceita.reduce((total, ing) => {
    const insumo = insumos.find(i => i.id === ing.idInsumo);
    return total + calcularCustoIngrediente(insumo, ing.pesoBruto);
  }, 0);
}