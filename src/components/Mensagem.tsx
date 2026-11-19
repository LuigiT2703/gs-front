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

/** Aviso de resultado (sucesso, erro ou informação), usado nos formulários e depois das ações. */
export function Mensagem({ tipo, titulo, children, onFechar }: MensagemProps) {
  return (
    <div
      role={tipo === 'erro' ? 'alert' : 'status'}
      className={`flex animate-surgir items-start gap-3 rounded-xl border px-4 py-3 ${ESTILOS[tipo]}`}
    >
      {ICONES[tipo]}
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{titulo}</p>
        {children && <div className="mt-1 text-sm">{children}</div>}
      </div>
      {onFechar && (
        <button type="button" onClick={onFechar} aria-label="Fechar aviso" className="rounded p-1 opacity-70 hover:opacity-100">
          <X size={18} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
