import { RefreshCw, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import type { ErroApi } from '../services/api'

interface ErroRequisicaoProps {
  erro: ErroApi
  titulo?: string
  onTentarNovamente?: () => void
  children?: ReactNode
}

/** Estado de erro de requisição: mostra a mensagem da API e permite tentar de novo. */
export function ErroRequisicao({ erro, titulo = 'Não conseguimos carregar os dados', onTentarNovamente, children }: ErroRequisicaoProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
      <TriangleAlert size={36} className="text-red-700" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-red-900">{titulo}</h2>
      <p className="max-w-md text-red-800">{erro.message}</p>
      {erro.status > 0 && <p className="text-xs text-red-700">Código do erro: {erro.status}</p>}
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        {onTentarNovamente && (
          <button
            type="button"
            onClick={onTentarNovamente}
            className="inline-flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-800"
          >
            <RefreshCw size={18} aria-hidden="true" /> Tentar de novo
          </button>
        )}
        {children}
      </div>
    </div>
  )
}
