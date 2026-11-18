import { LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface CarregandoProps {
  mensagem?: string
}

/**
 * Estado "carregando". Depois de 4 segundos explica a demora: o servidor
 * gratuito (Render) "dorme" e a primeira chamada pode levar quase 1 minuto.
 */
export function Carregando({ mensagem = 'Carregando ocorrências…' }: CarregandoProps) {
  const [demorando, setDemorando] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setDemorando(true), 4000)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center">
      <LoaderCircle size={36} className="animate-spin text-petroleo-700" aria-hidden="true" />
      <p className="font-medium text-tinta-900">{mensagem}</p>
      {demorando && (
        <p className="max-w-md animate-surgir text-sm text-tinta-600">
          A primeira consulta do dia pode levar até 1 minuto, porque o servidor gratuito está acordando. Pode esperar,
          os dados já vêm.
        </p>
      )}
    </div>
  )
}
