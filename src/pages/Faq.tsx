import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/Container'
import { TituloPagina } from '../components/TituloPagina'
import { PERGUNTAS_FAQ } from '../data/faq'

export function Faq() {
  const [aberta, setAberta] = useState<number | null>(0)

  return (
    <>
      <TituloPagina
        sobretitulo="Perguntas frequentes"
        titulo="Dúvidas sobre o ZelaCidade"
        descricao="Como funciona a fila, quem vê seus dados e o que fazer quando o problema já foi registrado."
      />
      <Container className="max-w-3xl py-12">
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {PERGUNTAS_FAQ.map((item, indice) => {
            const estaAberta = aberta === indice
            return (
              <li key={item.pergunta}>
                <h2 className="font-sans text-base">
                  <button
                    type="button"
                    id={`faq-botao-${indice}`}
                    aria-expanded={estaAberta}
                    aria-controls={`faq-resposta-${indice}`}
                    onClick={() => setAberta(estaAberta ? null : indice)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-tinta-900 transition-colors hover:bg-petroleo-50"
                  >
                    {item.pergunta}
                    <ChevronDown
                      size={20}
                      aria-hidden="true"
                      className={`shrink-0 text-petroleo-700 transition-transform duration-200 ${estaAberta ? 'rotate-180' : ''}`}
                    />
                  </button>
                </h2>
                <div
                  id={`faq-resposta-${indice}`}
                  role="region"
                  aria-labelledby={`faq-botao-${indice}`}
                  hidden={!estaAberta}
                  className="animate-surgir px-5 pb-5 text-tinta-700"
                >
                  {item.resposta}
                </div>
              </li>
            )
          })}
        </ul>
        <p className="mt-8 text-center text-tinta-600">
          Não achou sua resposta?{' '}
          <Link to="/contato" className="font-semibold text-petroleo-800 hover:underline">
            Fale com a equipe
          </Link>
          .
        </p>
      </Container>
    </>
  )
}
