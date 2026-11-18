import type {
  Atualizacao,
  NovaAtualizacao,
  NovaOcorrencia,
  NovoApoio,
  Ocorrencia,
  RespostaApoio,
} from '../types/ocorrencia'
import { requisicao } from './api'

// Todas as chamadas da API Java ficam aqui, só com fetch (via requisicao).

export function listarOcorrencias(): Promise<Ocorrencia[]> {
  return requisicao<Ocorrencia[]>('/ocorrencias')
}

export function buscarOcorrencia(id: number): Promise<Ocorrencia> {
  return requisicao<Ocorrencia>(`/ocorrencias/${id}`)
}

export function cadastrarOcorrencia(dados: NovaOcorrencia): Promise<Ocorrencia> {
  return requisicao<Ocorrencia>('/ocorrencias', { method: 'POST', body: JSON.stringify(dados) })
}

export function excluirOcorrencia(id: number): Promise<void> {
  return requisicao<void>(`/ocorrencias/${id}`, { method: 'DELETE' })
}

export function listarAtualizacoes(id: number): Promise<Atualizacao[]> {
  return requisicao<Atualizacao[]>(`/ocorrencias/${id}/atualizacoes`)
}

export function registrarAtualizacao(id: number, dados: NovaAtualizacao): Promise<Atualizacao> {
  return requisicao<Atualizacao>(`/ocorrencias/${id}/atualizacoes`, {
    method: 'POST',
    body: JSON.stringify(dados),
  })
}

export function apoiarOcorrencia(id: number, dados: NovoApoio): Promise<RespostaApoio> {
  return requisicao<RespostaApoio>(`/ocorrencias/${id}/apoios`, {
    method: 'POST',
    body: JSON.stringify(dados),
  })
}
