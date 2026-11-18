import { Container } from '../components/Container'
import { FotoIntegrante } from '../components/FotoIntegrante'
import { IconeGithub, IconeLinkedin } from '../components/IconesMarca'
import { TituloPagina } from '../components/TituloPagina'
import { INTEGRANTES } from '../data/integrantes'

export function Integrantes() {
  return (
    <>
      <TituloPagina
        sobretitulo="Grupo INOVEX"
        titulo="Quem faz o ZelaCidade"
        descricao="Três alunos do 1º ano de Análise e Desenvolvimento de Sistemas da FIAP."
      />
      <Container className="py-12">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {INTEGRANTES.map((integrante) => (
            <li key={integrante.rm} className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <FotoIntegrante nome={integrante.nome} foto={integrante.foto} />
              <h2 className="mt-5 text-xl font-bold">{integrante.nome}</h2>
              <p className="mt-1 text-tinta-600">
                {integrante.rm} · {integrante.turma}
              </p>
              <p className="mt-3 rounded-full bg-petroleo-50 px-3 py-1 text-sm font-medium text-petroleo-800">{integrante.papel}</p>
              <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
                <a
                  href={integrante.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-tinta-900 px-4 py-2 font-semibold text-white transition-colors hover:bg-tinta-700"
                >
                  <IconeGithub /> GitHub <span className="sr-only">de {integrante.nome} (abre em nova aba)</span>
                </a>
                <a
                  href={integrante.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A66C2] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#004182]"
                >
                  <IconeLinkedin /> LinkedIn <span className="sr-only">de {integrante.nome} (abre em nova aba)</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </>
  )
}
