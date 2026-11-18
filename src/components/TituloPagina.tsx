import type { ReactNode } from 'react'
import { Container } from './Container'

interface TituloPaginaProps {
  sobretitulo: string
  titulo: string
  descricao?: string
  children?: ReactNode
}

/** Faixa de título usada no topo de todas as páginas internas. */
export function TituloPagina({ sobretitulo, titulo, descricao, children }: TituloPaginaProps) {
  return (
    <section className="border-b border-petroleo-100 bg-petroleo-50">
      <Container className="py-8 sm:py-12">
        <p className="text-sm font-semibold tracking-wider text-petroleo-700 uppercase">{sobretitulo}</p>
        <h1 className="mt-2 text-3xl font-bold text-tinta-900 sm:text-4xl">{titulo}</h1>
        {descricao && <p className="mt-3 max-w-2xl text-base text-tinta-600 sm:text-lg">{descricao}</p>}
        {children && <div className="mt-5">{children}</div>}
      </Container>
    </section>
  )
}
