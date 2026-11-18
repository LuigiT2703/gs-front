export interface Integrante {
  nome: string
  rm: string
  turma: string
  github: string
  linkedin: string
  /** Caminho da foto em /public. Se ainda não existir, a página mostra as iniciais. */
  foto: string
  papel: string
}

export interface PerguntaFaq {
  pergunta: string
  resposta: string
}
