import type { ReactNode } from 'react'
import { IlustracaoVazia } from './IlustracaoVazia'

interface EstadoVazioProps {
  titulo: string
  descricao: string
  /** Botões ou links com o próximo passo. */
  children?: ReactNode
}

/** Estado de "ausência de dados": convida para a próxima ação em vez de só dizer que não há nada. */
export function EstadoVazio({ titulo, descricao, children }: EstadoVazioProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <IlustracaoVazia />
      <h2 className="text-lg font-semibold text-tinta-900">{titulo}</h2>
      <p className="max-w-md text-tinta-600">{descricao}</p>
      {children && <div className="mt-2 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  )
}
