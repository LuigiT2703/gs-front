import type { ClassePrioridade } from '../types/ocorrencia'
import { CLASSES } from '../utils/prioridade'

interface BadgePrioridadeProps {
  classe: ClassePrioridade
  pontos?: number
  grande?: boolean
}

// Cores fixas por classe (iguais no app inteiro, no PDF e nos slides). Texto escuro sobre fundo claro = contraste AA.
const ESTILOS: Record<ClassePrioridade, string> = {
  URGENTE: 'bg-red-100 text-red-800 ring-red-300',
  ALTA: 'bg-orange-100 text-orange-800 ring-orange-300',
  MEDIA: 'bg-yellow-100 text-yellow-900 ring-yellow-300',
  BAIXA: 'bg-green-100 text-green-800 ring-green-300',
}

const PONTO: Record<ClassePrioridade, string> = {
  URGENTE: 'bg-red-600',
  ALTA: 'bg-orange-500',
  MEDIA: 'bg-yellow-500',
  BAIXA: 'bg-green-600',
}

export function BadgePrioridade({ classe, pontos, grande = false }: BadgePrioridadeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold whitespace-nowrap ring-1 ${ESTILOS[classe]} ${
        grande ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs'
      }`}
    >
      <span className={`size-2 rounded-full ${PONTO[classe]}`} aria-hidden="true" />
      {CLASSES[classe]}
      {pontos !== undefined && <span className="font-semibold">· {pontos} pts</span>}
    </span>
  )
}
