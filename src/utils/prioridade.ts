import type { Categoria, ClassePrioridade, Ocorrencia, StatusOcorrencia } from '../types/ocorrencia'

// Regras oficiais do ZelaCidade. São as mesmas do motor em Python e da API Java.

/** Nome de cada categoria para mostrar na tela. */
export const CATEGORIAS: Record<Categoria, string> = {
  BURACO_NA_VIA: 'Buraco na via',
  ILUMINACAO_PUBLICA: 'Iluminação pública',
  LIXO_ENTULHO: 'Lixo / entulho',
  CALCADA_ACESSIBILIDADE: 'Calçada / acessibilidade',
  ARVORE_PODA: 'Árvore / poda',
  ALAGAMENTO_BUEIRO: 'Alagamento / bueiro',
  OUTRO: 'Outro',
}

/** Nome de cada status para mostrar na tela. */
export const STATUS: Record<StatusOcorrencia, string> = {
  ABERTA: 'Aberta',
  EM_ANDAMENTO: 'Em andamento',
  RESOLVIDA: 'Resolvida',
}

/** Nome de cada prioridade para mostrar na tela. */
export const CLASSES: Record<ClassePrioridade, string> = {
  URGENTE: 'URGENTE',
  ALTA: 'ALTA',
  MEDIA: 'MÉDIA',
  BAIXA: 'BAIXA',
}

export const LISTA_CATEGORIAS = Object.keys(CATEGORIAS) as Categoria[]
export const LISTA_STATUS = Object.keys(STATUS) as StatusOcorrencia[]

/** Maior pontuação possível: 50 + 20 + 20 + 15 + 10 + 15 = 130. */
export const PONTUACAO_MAXIMA = 130

/** Uma parte do cálculo (ex.: "Gravidade: +40"). Usada na barra "Por que essa prioridade?". */
export interface ParcelaPontos {
  rotulo: string
  detalhe: string
  pontos: number
  maximo: number
}

/** Os dados que o cálculo usa. "pontos" é opcional: se a API já mandou, usamos o dela. */
export interface DadosPontuacao {
  gravidade: number
  pessoasAfetadas: number
  pertoServicoEssencial: boolean
  afetaAcessibilidade: boolean
  dataAbertura: string
  dataResolucao: string | null
  totalApoios: number
  pontos?: number
}

/** Quantos dias a ocorrência está aberta (se foi resolvida, conta até a resolução). */
export function diasEmAberto(dados: DadosPontuacao): number {
  const inicio = new Date(dados.dataAbertura + 'T00:00:00')
  const fim = dados.dataResolucao ? new Date(dados.dataResolucao + 'T00:00:00') : new Date(new Date().toDateString())
  const dias = Math.floor((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))
  return dias > 0 ? dias : 0
}

/** Cada parte da pontuação, já calculada. */
export function parcelasPontos(dados: DadosPontuacao): ParcelaPontos[] {
  const dias = diasEmAberto(dados)
  return [
    {
      rotulo: 'Gravidade',
      detalhe: `${dados.gravidade} de 5 × 10`,
      pontos: dados.gravidade * 10,
      maximo: 50,
    },
    {
      rotulo: 'Pessoas afetadas',
      detalhe: `${dados.pessoasAfetadas} por dia (1 a cada 10)`,
      pontos: Math.min(Math.floor(dados.pessoasAfetadas / 10), 20),
      maximo: 20,
    },
    {
      rotulo: 'Tempo sem solução',
      detalhe: `${dias} dia(s) × 2`,
      pontos: Math.min(dias * 2, 20),
      maximo: 20,
    },
    {
      rotulo: 'Perto de escola ou saúde',
      detalhe: dados.pertoServicoEssencial ? 'sim' : 'não',
      pontos: dados.pertoServicoEssencial ? 15 : 0,
      maximo: 15,
    },
    {
      rotulo: 'Acessibilidade',
      detalhe: dados.afetaAcessibilidade ? 'afeta' : 'não afeta',
      pontos: dados.afetaAcessibilidade ? 10 : 0,
      maximo: 10,
    },
    {
      rotulo: 'Apoios de vizinhos',
      detalhe: `${dados.totalApoios} × 3`,
      pontos: Math.min(dados.totalApoios * 3, 15),
      maximo: 15,
    },
  ]
}

/** Pontuação total. Se a API já mandou "pontos", usa o valor dela; se não, soma as partes. */
export function calcularPontuacao(dados: DadosPontuacao): number {
  if (dados.pontos !== undefined) {
    return dados.pontos
  }
  let total = 0
  for (const parcela of parcelasPontos(dados)) {
    total += parcela.pontos
  }
  return total
}

/** URGENTE (80+), ALTA (55 a 79), MÉDIA (30 a 54) ou BAIXA (até 29). */
export function classificarPrioridade(pontos: number): ClassePrioridade {
  if (pontos >= 80) return 'URGENTE'
  if (pontos >= 55) return 'ALTA'
  if (pontos >= 30) return 'MEDIA'
  return 'BAIXA'
}

const PRAZOS: Record<ClassePrioridade, string> = {
  URGENTE: 'até 48 horas',
  ALTA: 'até 7 dias',
  MEDIA: 'até 15 dias',
  BAIXA: 'até 30 dias',
}

export function prazoRecomendado(classe: ClassePrioridade): string {
  return PRAZOS[classe]
}

const SETORES: Record<Categoria, string> = {
  BURACO_NA_VIA: 'Subprefeitura - manutenção de vias',
  ILUMINACAO_PUBLICA: 'Iluminação pública (Ilume)',
  LIXO_ENTULHO: 'Limpeza urbana',
  CALCADA_ACESSIBILIDADE: 'Subprefeitura - calçadas e acessibilidade',
  ARVORE_PODA: 'Subprefeitura - poda e manejo de árvores',
  ALAGAMENTO_BUEIRO: 'Subprefeitura - drenagem',
  OUTRO: 'Central SP156 (triagem)',
}

export function setorResponsavel(categoria: Categoria): string {
  return SETORES[categoria]
}

/**
 * Fila de prioridade: só as pendentes (não resolvidas), da maior pontuação para a menor.
 * Empate de pontos: a mais antiga (menor número) vem primeiro.
 */
export function ordenarFila(ocorrencias: Ocorrencia[]): Ocorrencia[] {
  const pendentes = ocorrencias.filter((o) => o.status !== 'RESOLVIDA')
  return pendentes.sort((a, b) => {
    const diferenca = calcularPontuacao(b) - calcularPontuacao(a)
    if (diferenca !== 0) return diferenca
    return a.id - b.id
  })
}
