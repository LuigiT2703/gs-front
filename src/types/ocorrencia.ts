// Tipos do domínio, iguais ao contrato da API Java (ver CONTRATO_API.md).
// A API usa códigos em MAIÚSCULAS (enums do Java); a tela mostra os rótulos.

export type Categoria =
  | 'BURACO_NA_VIA'
  | 'ILUMINACAO_PUBLICA'
  | 'LIXO_ENTULHO'
  | 'CALCADA_ACESSIBILIDADE'
  | 'ARVORE_PODA'
  | 'ALAGAMENTO_BUEIRO'
  | 'OUTRO'

export type StatusOcorrencia = 'ABERTA' | 'EM_ANDAMENTO' | 'RESOLVIDA'

export type ClassePrioridade = 'URGENTE' | 'ALTA' | 'MEDIA' | 'BAIXA'

/** Ocorrência como a API devolve em GET /ocorrencias e GET /ocorrencias/{id}. */
export interface Ocorrencia {
  id: number
  categoria: Categoria
  descricao: string
  bairro: string
  gravidade: number
  pessoasAfetadas: number
  pertoServicoEssencial: boolean
  afetaAcessibilidade: boolean
  status: StatusOcorrencia
  /** Data no formato ISO (aaaa-mm-dd). */
  dataAbertura: string
  dataResolucao: string | null
  totalApoios: number
  /** Opcional: se a API já calcular, o front usa este valor. */
  pontos?: number
}

/** Corpo do POST /ocorrencias. */
export interface NovaOcorrencia {
  categoria: Categoria
  descricao: string
  bairro: string
  gravidade: number
  pessoasAfetadas: number
  pertoServicoEssencial: boolean
  afetaAcessibilidade: boolean
  nomeCidadao: string
}

/** Item do histórico (GET /ocorrencias/{id}/atualizacoes). */
export interface Atualizacao {
  id: number
  ocorrenciaId: number
  status: StatusOcorrencia
  comentario: string
  responsavel: string
  /** Data e hora ISO (aaaa-mm-ddThh:mm:ss). */
  dataHora: string
}

/** Corpo do POST /ocorrencias/{id}/atualizacoes. */
export interface NovaAtualizacao {
  status: StatusOcorrencia
  comentario: string
  responsavel: string
}

/** Corpo do POST /ocorrencias/{id}/apoios. */
export interface NovoApoio {
  nome: string
}

/** Resposta do POST /ocorrencias/{id}/apoios. */
export interface RespostaApoio {
  ocorrenciaId: number
  totalApoios: number
}

/** Formato padrão de erro da API: { "status": 400, "mensagem": "..." }. */
export interface ErroApiCorpo {
  status: number
  mensagem: string
}
