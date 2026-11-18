import { TriangleAlert } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

interface DialogoConfirmacaoProps {
  aberto: boolean
  titulo: string
  children: ReactNode
  rotuloConfirmar: string
  rotuloCancelar: string
  ocupado?: boolean
  onConfirmar: () => void
  onCancelar: () => void
}

/** Janela de confirmação para ações que não podem ser desfeitas (usa o <dialog> nativo do navegador). */
export function DialogoConfirmacao({
  aberto,
  titulo,
  children,
  rotuloConfirmar,
  rotuloCancelar,
  ocupado = false,
  onConfirmar,
  onCancelar,
}: DialogoConfirmacaoProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialogo = ref.current
    if (!dialogo) return
    if (aberto && !dialogo.open) dialogo.showModal()
    if (!aberto && dialogo.open) dialogo.close()
  }, [aberto])

  return (
    <dialog
      ref={ref}
      onCancel={(evento) => {
        evento.preventDefault()
        onCancelar()
      }}
      aria-labelledby="dialogo-titulo"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl p-0 shadow-2xl backdrop:bg-tinta-900/60"
    >
      <div className="p-6">
        <div className="flex items-start gap-3">
          <span className="rounded-full bg-red-100 p-2 text-red-700">
            <TriangleAlert size={22} aria-hidden="true" />
          </span>
          <h2 id="dialogo-titulo" className="pt-1 text-xl font-bold text-tinta-900">
            {titulo}
          </h2>
        </div>
        <div className="mt-3 text-tinta-700">{children}</div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-lg border-2 border-petroleo-700 px-4 py-2.5 font-semibold text-petroleo-800 transition-colors hover:bg-petroleo-50"
          >
            {rotuloCancelar}
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            disabled={ocupado}
            className="rounded-lg bg-red-700 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-red-800 disabled:cursor-wait disabled:opacity-70"
          >
            {ocupado ? 'Excluindo…' : rotuloConfirmar}
          </button>
        </div>
      </div>
    </dialog>
  )
}
