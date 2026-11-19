import type { ErroApi } from '../services/api'
import type { Atualizacao } from '../types/ocorrencia'
import { formatarData, formatarDataHora } from '../utils/formatar'
import { BadgeStatus } from './BadgeStatus'
import { Carregando } from './Carregando'
import { ErroRequisicao } from './ErroRequisicao'

interface HistoricoAtualizacoesProps {
  atualizacoes: Atualizacao[]
  carregando: boolean
  erro: ErroApi | null
  onTentarNovamente: () => void
  /** Data em que a ocorrência foi registrada (último item da linha do tempo). */
  dataAbertura: string
}

/** Linha do tempo com o histórico de status de uma ocorrência (o lado "N" do 1:N na API). */
export function HistoricoAtualizacoes({ atualizacoes, carregando, erro, onTentarNovamente, dataAbertura }: HistoricoAtualizacoesProps) {
  if (carregando) {
    return <Carregando mensagem="Carregando o histórico…" />
  }
  if (erro) {
    return <ErroRequisicao erro={erro} titulo="Não conseguimos carregar o histórico" onTentarNovamente={onTentarNovamente} />
  }

  // Mais recente primeiro.
  const itens = [...atualizacoes].sort((a, b) => b.dataHora.localeCompare(a.dataHora))

  return (
    <ol className="relative space-y-6 border-l-2 border-petroleo-100 pl-6">
      {itens.length === 0 && (
        <li className="text-tinta-600">
          Ainda não há atualizações da prefeitura. Quando a equipe começar o atendimento, o andamento aparece aqui.
        </li>
      )}

      {itens.map((item) => (
        <li key={item.id} className="relative">
          <span className="absolute top-1 -left-[1.95rem] size-3.5 rounded-full border-2 border-white bg-petroleo-700 ring-2 ring-petroleo-200" aria-hidden="true" />
          <div className="flex flex-wrap items-center gap-2">
            <BadgeStatus status={item.status} />
            <span className="text-sm text-tinta-600">{formatarDataHora(item.dataHora)}</span>
          </div>
          <p className="mt-2 text-tinta-900">{item.comentario}</p>
          <p className="mt-1 text-sm text-tinta-600">Por {item.responsavel}</p>
        </li>
      ))}

      {/* Primeiro evento de toda ocorrência: o registro feito pelo cidadão */}
      <li className="relative">
        <span className="absolute top-1 -left-[1.95rem] size-3.5 rounded-full border-2 border-white bg-ambar-500 ring-2 ring-ambar-100" aria-hidden="true" />
        <p className="font-medium">Ocorrência registrada pelo cidadão</p>
        <p className="text-sm text-tinta-600">{formatarData(dataAbertura)}</p>
      </li>
    </ol>
  )
}