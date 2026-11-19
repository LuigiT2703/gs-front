import { ArrowRight, Clock, MapPin, ThumbsUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Ocorrencia } from '../types/ocorrencia'
import { plural } from '../utils/formatar'
import { CATEGORIAS, calcularPontuacao, classificarPrioridade, diasEmAberto, prazoRecomendado, setorResponsavel } from '../utils/prioridade'
import { BadgePrioridade } from './BadgePrioridade'
import { BadgeStatus } from './BadgeStatus'
import { BarraPrioridade } from './BarraPrioridade'
import { IconeCategoria } from './IconeCategoria'

interface CardOcorrenciaProps {
  ocorrencia: Ocorrencia
  /** Posição na fila (1º, 2º...). Opcional. */
  posicao?: number
}

/** Card de uma ocorrência. Usado na fila, na Home e no Painel. */
export function CardOcorrencia({ ocorrencia, posicao }: CardOcorrenciaProps) {
  const pontos = calcularPontuacao(ocorrencia)
  const classe = classificarPrioridade(pontos)
  const resolvida = ocorrencia.status === 'RESOLVIDA'
  const dias = diasEmAberto(ocorrencia)

  return (
    <article className="group relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-petroleo-200 hover:shadow-md">
      <div className="flex items-start gap-3">
        <IconeCategoria categoria={ocorrencia.categoria} />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-tinta-600">
            {posicao !== undefined && <span className="mr-1 font-bold text-petroleo-800">{posicao}º ·</span>}#{ocorrencia.id} ·{' '}
            {CATEGORIAS[ocorrencia.categoria]}
          </p>
          <h3 className="mt-1 font-sans text-base leading-snug font-semibold text-tinta-900">
            <Link
              to={`/ocorrencias/${ocorrencia.id}`}
              className="rounded after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none group-focus-within:underline"
            >
              {ocorrencia.descricao}
            </Link>
          </h3>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {resolvida ? <BadgeStatus status="RESOLVIDA" /> : <BadgePrioridade classe={classe} pontos={pontos} />}
        {!resolvida && <BadgeStatus status={ocorrencia.status} />}
      </div>

      {!resolvida && <BarraPrioridade pontos={pontos} />}

      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-tinta-600">
        <li className="flex items-center gap-1.5">
          <MapPin size={16} aria-hidden="true" /> {ocorrencia.bairro}
        </li>
        <li className="flex items-center gap-1.5">
          <ThumbsUp size={16} aria-hidden="true" /> {plural(ocorrencia.totalApoios, 'apoio', 'apoios')}
        </li>
        <li className="flex items-center gap-1.5">
          <Clock size={16} aria-hidden="true" />
          {resolvida ? 'resolvida' : dias === 0 ? 'aberta hoje' : `há ${plural(dias, 'dia', 'dias')}`}
        </li>
      </ul>

      {!resolvida && (
        <p className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3 text-sm text-tinta-700">
          <span>
            <span className="font-semibold text-tinta-900">{prazoRecomendado(classe)}</span> · {setorResponsavel(ocorrencia.categoria)}
          </span>
          <ArrowRight size={18} className="shrink-0 text-petroleo-700 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </p>
      )}
    </article>
  )
}