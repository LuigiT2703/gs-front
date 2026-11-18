// Endereço da API Java. Vem do arquivo .env (VITE_API_URL), nunca fica escrito no código.
// O replace tira a barra do final, se alguém escrever ".../" no .env.
const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

/**
 * Erro de uma chamada à API.
 * Guarda o código HTTP (404, 409...) e uma mensagem pronta para mostrar na tela.
 * Código 0 = nem chegou a falar com o servidor (sem internet, servidor fora do ar...).
 */
export class ErroApi extends Error {
  status: number

  constructor(status: number, mensagem: string) {
    super(mensagem)
    this.status = status
  }
}

// Mensagem usada quando a API dá erro mas não manda o campo "mensagem".
function mensagemPadrao(status: number): string {
  if (status === 400) return 'Alguns dados não foram aceitos. Confira o formulário e tente de novo.'
  if (status === 404) return 'Não encontramos essa ocorrência. Ela pode ter sido excluída.'
  if (status === 409) return 'Essa ação entra em conflito com o estado atual da ocorrência.'
  if (status >= 500) return 'O servidor teve um problema. Tente de novo em alguns instantes.'
  return 'Não foi possível concluir a ação. Tente de novo.'
}

/**
 * Função base de TODAS as chamadas: usa fetch, devolve o JSON da resposta
 * e, se der erro, lança um ErroApi com a mensagem que a API mandou.
 * O <T> é o tipo da resposta (ex.: Ocorrencia[]).
 */
export async function requisicao<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  if (!API_URL) {
    throw new ErroApi(0, 'O endereço da API não foi configurado (VITE_API_URL).')
  }

  // 1. Faz a chamada. Se cair aqui no catch, nem chegou no servidor.
  let resposta: Response
  try {
    resposta = await fetch(API_URL + caminho, {
      ...opcoes,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    throw new ErroApi(0, 'Não conseguimos falar com o servidor. Confira sua internet e tente de novo.')
  }

  // 2. 204 = deu certo, mas não tem corpo (é o caso do DELETE).
  if (resposta.status === 204) {
    return undefined as T
  }

  // 3. Lê o corpo como JSON (se não for JSON, fica null).
  const corpo = await resposta.json().catch(() => null)

  // 4. Erro (400, 404, 409, 500...): a API manda { status, mensagem }.
  if (!resposta.ok) {
    throw new ErroApi(resposta.status, corpo?.mensagem || mensagemPadrao(resposta.status))
  }

  return corpo as T
}

/** Transforma qualquer erro em ErroApi (para mostrar uma mensagem amigável). */
export function comoErroApi(erro: unknown): ErroApi {
  if (erro instanceof ErroApi) return erro
  return new ErroApi(0, 'Não foi possível concluir a ação. Tente de novo.')
}
