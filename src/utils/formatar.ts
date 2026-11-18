/** "2026-11-10" -> "10/11/2026" */
export function formatarData(iso: string | null): string {
  if (!iso) return '-'
  const [ano, mes, dia] = iso.slice(0, 10).split('-')
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : iso
}

/** "2026-11-10T14:30:00" -> "10/11/2026 às 14:30" */
export function formatarDataHora(iso: string): string {
  const hora = iso.length >= 16 ? iso.slice(11, 16) : ''
  return hora ? `${formatarData(iso)} às ${hora}` : formatarData(iso)
}

export function plural(quantidade: number, singular: string, pluralTexto: string): string {
  return `${quantidade} ${quantidade === 1 ? singular : pluralTexto}`
}

/** Remove acentos e deixa minúsculo, para buscas por bairro. */
export function normalizarTexto(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}
