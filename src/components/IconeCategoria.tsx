import { Accessibility, CircleHelp, Construction, Droplets, Lightbulb, Trash2, TreeDeciduous } from 'lucide-react'
import type { Categoria } from '../types/ocorrencia'

const ICONES = {
  BURACO_NA_VIA: Construction,
  ILUMINACAO_PUBLICA: Lightbulb,
  LIXO_ENTULHO: Trash2,
  CALCADA_ACESSIBILIDADE: Accessibility,
  ARVORE_PODA: TreeDeciduous,
  ALAGAMENTO_BUEIRO: Droplets,
  OUTRO: CircleHelp,
} satisfies Record<Categoria, unknown>

interface IconeCategoriaProps {
  categoria: Categoria
  tamanho?: number
}

/** Ícone da categoria dentro de um quadrado verde-claro. */
export function IconeCategoria({ categoria, tamanho = 22 }: IconeCategoriaProps) {
  const Icone = ICONES[categoria]
  return (
    <span className="inline-flex shrink-0 self-start items-center justify-center rounded-xl bg-petroleo-50 p-2.5 text-petroleo-700 ring-1 ring-petroleo-100">
      <Icone size={tamanho} aria-hidden="true" />
    </span>
  )
}
