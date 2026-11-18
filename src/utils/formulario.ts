// Ajudantes de estilo e acessibilidade dos campos de formulário.

/** Classes dos inputs, com borda vermelha quando há erro. */
export function classeCampo(temErro: boolean): string {
  return `w-full rounded-lg border bg-white px-3 py-2.5 text-base text-tinta-900 transition-colors placeholder:text-slate-400 focus:border-petroleo-700 focus:outline-2 focus:outline-offset-0 focus:outline-petroleo-700/40 ${
    temErro ? 'border-red-500 bg-red-50' : 'border-slate-300 hover:border-slate-400'
  }`
}

/** Liga o campo à dica ou ao erro (aria-describedby). */
export function descricaoCampo(id: string, temErro: boolean, temAjuda: boolean): string | undefined {
  if (temErro) return `${id}-erro`
  if (temAjuda) return `${id}-ajuda`
  return undefined
}
