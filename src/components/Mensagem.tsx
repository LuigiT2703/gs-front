import { CircleCheck, Info, TriangleAlert, X } from 'lucide-react'
import type { ReactNode } from 'react'

export type TipoMensagem = 'sucesso' | 'erro' | 'info'

interface MensagemProps {
  tipo: TipoMensagem
  titulo: string
  children?: ReactNode
  onFechar?: () => void
}

const ESTILOS: Record<TipoMensagem, string> = {
  sucesso: 'border-green-300 bg-green-50 text-green-900',
  erro: 'border-red-300 bg-red-50 text-red-900',
  info: 'border-sky-300 bg-sky-50 text-sky-900',
}

const ICONES: Record<TipoMensagem, ReactNode> = {
  sucesso: <CircleCheck size={22} className="shrink-0 text-green-700" aria-hidden="true" />,
  erro: <TriangleAlert size={22} className="shrink-0 text-red-700" aria-hidden="true" />,
  info: <Info size={22} className="shrink-0 text-sky-700" aria-hidden="true" />,
}

