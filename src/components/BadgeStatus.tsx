import type { StatusOcorrencia } from '../types/ocorrencia'
import { STATUS } from '../utils/prioridade'

const ESTILOS: Record<StatusOcorrencia, string> = {
  ABERTA: 'bg-slate-100 text-slate-800 ring-slate-300',
  EM_ANDAMENTO: 'bg-sky-100 text-sky-900 ring-sky-300',
  RESOLVIDA: 'bg-petroleo-100 text-petroleo-900 ring-petroleo-200',
}

export function BadgeStatus({ status }: { status: StatusOcorrencia }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold whitespace-nowrap ring-1 ${ESTILOS[status]}`}>
      {STATUS[status]}
    </span>
  )
}
