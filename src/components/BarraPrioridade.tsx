import type { ParcelaPontos } from '../utils/prioridade'
import { PONTUACAO_MAXIMA } from '../utils/prioridade'

interface BarraPrioridadeProps {
  pontos: number
  /** Se vier, mostra cada parte do cálculo (versão detalhada). */
  parcelas?: ParcelaPontos[]
}

/** Barra que mostra a pontuação (de 0 a 130) e, na versão detalhada, de onde veio cada ponto. */
export function BarraPrioridade({ pontos, parcelas }: BarraPrioridadeProps) {
  const porcentagem = Math.min(100, Math.round((pontos / PONTUACAO_MAXIMA) * 100))

  return (
    <div>
      <div className="flex items-center gap-3">
        <div
          className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200"
          role="meter"
          aria-valuemin={0}
          aria-valuemax={PONTUACAO_MAXIMA}
          aria-valuenow={pontos}
          aria-label="Pontuação de prioridade"
        >
          <div className="h-full rounded-full bg-petroleo-700 transition-[width] duration-500" style={{ width: `${porcentagem}%` }} />
        </div>
        <span className="text-sm font-semibold text-tinta-700 tabular-nums">
          {pontos}/{PONTUACAO_MAXIMA}
        </span>
      </div>

      {parcelas && (
        <ul className="mt-4 space-y-3">
          {parcelas.map((parcela) => (
            <li key={parcela.rotulo}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="text-tinta-700">
                  <span className="font-medium text-tinta-900">{parcela.rotulo}</span> · {parcela.detalhe}
                </span>
                <span className={`font-semibold tabular-nums ${parcela.pontos > 0 ? 'text-petroleo-800' : 'text-slate-400'}`}>
                  +{parcela.pontos}
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                <div
                  className="h-full rounded-full bg-ambar-500"
                  style={{ width: `${Math.round((parcela.pontos / parcela.maximo) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}