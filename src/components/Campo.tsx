import { TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

interface CampoProps {
  id: string
  rotulo: string
  obrigatorio?: boolean
  ajuda?: string
  erro?: string
  children: ReactNode
}

/** Rótulo + campo + dica + mensagem de erro, sempre ligados por id (acessível para leitor de tela). */
export function Campo({ id, rotulo, obrigatorio = false, ajuda, erro, children }: CampoProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-medium text-tinta-900">
        {rotulo}
        {obrigatorio && (
          <span className="text-red-700" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children}
      {ajuda && !erro && (
        <p id={`${id}-ajuda`} className="text-sm text-tinta-600">
          {ajuda}
        </p>
      )}
      {erro && (
        <p id={`${id}-erro`} className="flex items-start gap-1.5 text-sm font-medium text-red-700">
          <TriangleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          {erro}
        </p>
      )}
    </div>
  )
}
