export interface LinkNavegacao {
  rotulo: string
  para: string
}

/** Links do menu principal (desktop e mobile usam a mesma lista). */
export const LINKS_MENU: LinkNavegacao[] = [
  { rotulo: 'Início', para: '/' },
  { rotulo: 'Ocorrências', para: '/ocorrencias' },
  { rotulo: 'Painel', para: '/painel' },
  { rotulo: 'Sobre', para: '/sobre' },
  { rotulo: 'Integrantes', para: '/integrantes' },
  { rotulo: 'FAQ', para: '/faq' },
  { rotulo: 'Contato', para: '/contato' },
]
