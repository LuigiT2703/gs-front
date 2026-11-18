import { ArrowRight, ListOrdered, Megaphone, Plus, ShieldCheck, ThumbsUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BadgePrioridade } from '../components/BadgePrioridade'
import { CardOcorrencia } from '../components/CardOcorrencia'
import { Carregando } from '../components/Carregando'
import { Container } from '../components/Container'
import { ErroRequisicao } from '../components/ErroRequisicao'
import { EstadoVazio } from '../components/EstadoVazio'
import { IlustracaoMapa } from '../components/IlustracaoMapa'
import { ErroApi, comoErroApi } from '../services/api'
import { listarOcorrencias } from '../services/ocorrenciasService'
import type { Ocorrencia } from '../types/ocorrencia'
import { ordenarFila } from '../utils/prioridade'

const PASSOS = [
  { icone: Megaphone, titulo: 'Relate', texto: 'Conte o que viu, onde fica e quão grave é. Leva uns 2 minutos.' },
  { icone: ShieldCheck, titulo: 'Veja a prioridade', texto: 'Antes de enviar, você já vê os pontos, o prazo e o setor que vai receber.' },
  { icone: ThumbsUp, titulo: 'Apoie', texto: 'Vizinhos que viram o mesmo problema apoiam em vez de duplicar. A ocorrência sobe na fila.' },
  { icone: ListOrdered, titulo: 'Acompanhe', texto: 'A subprefeitura atende pela fila e atualiza o status. Você acompanha pelo número.' },
]

const REGRAS = [
  ['Gravidade de 1 a 5', '× 10'],
  ['Pessoas afetadas por dia', '1 a cada 10 (máx. 20)'],
  ['Cada dia sem solução', '+2 (máx. 20)'],
  ['Perto de escola, hospital ou posto', '+15'],
  ['Atrapalha a acessibilidade', '+10'],
  ['Cada apoio de vizinho', '+3 (máx. 15)'],
]

export function Home() {
  // Os 3 estados de uma tela que usa a API: carregando, erro e os dados.
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<ErroApi | null>(null)

  async function carregar() {
    setCarregando(true)
    setErro(null)
    try {
      setOcorrencias(await listarOcorrencias())
    } catch (e) {
      setErro(comoErroApi(e))
    } finally {
      setCarregando(false)
    }
  }

  // Busca uma vez, quando a página abre.
  useEffect(() => {
    carregar()
  }, [])

  // As 3 pendentes com mais pontos.
  const destaques = ordenarFila(ocorrencias).slice(0, 3)

  return (
    <>
      <section className="bg-petroleo-800 text-white">
        <Container className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-petroleo-100">
              <span className="size-2 rounded-full bg-ambar-400" aria-hidden="true" /> Zeladoria colaborativa · ODS 11 e 10
            </p>
            <h1 className="mt-5 text-4xl leading-tight font-bold sm:text-5xl">
              Viu um problema na rua? <span className="text-ambar-400">Relate, apoie e acompanhe.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-petroleo-100">
              Buraco, poste apagado, lixo ou calçada sem rampa: no ZelaCidade a fila de atendimento segue uma regra pública, e a
              acessibilidade vem primeiro.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/ocorrencias/nova"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-ambar-500 px-6 py-3 text-lg font-semibold text-tinta-900 transition-colors hover:bg-ambar-400"
              >
                <Plus size={20} aria-hidden="true" /> Relatar um problema
              </Link>
              <Link
                to="/ocorrencias"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-petroleo-200 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-white/10"
              >
                Ver a fila de prioridade <ArrowRight size={20} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <IlustracaoMapa />
          </div>
        </Container>
      </section>

      <section aria-labelledby="dado-titulo" className="border-b border-slate-200 bg-white">
        <Container className="flex flex-col items-start gap-2 py-8 sm:flex-row sm:items-center sm:gap-6">
          <p id="dado-titulo" className="font-titulo text-5xl font-bold text-red-700">
            15,2%
          </p>
          <p className="max-w-2xl text-tinta-700">
            dos brasileiros moram em ruas <strong>com rampa</strong> para cadeirantes. Por isso, no ZelaCidade, problemas que
            atrapalham a acessibilidade ganham pontos extras.{' '}
            <span className="text-sm text-tinta-600">Fonte: IBGE, Censo 2022 (divulgado em 17/04/2025).</span>
          </p>
        </Container>
      </section>

      <Container className="py-14">
        <h2 className="text-3xl font-bold">Como funciona</h2>
        <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PASSOS.map(({ icone: Icone, titulo, texto }, indice) => (
            <li key={titulo} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-ambar-100 text-ambar-700">
                  <Icone size={22} aria-hidden="true" />
                </span>
                <span className="font-titulo text-3xl font-bold text-petroleo-200" aria-hidden="true">
                  {indice + 1}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{titulo}</h3>
              <p className="mt-2 text-tinta-600">{texto}</p>
            </li>
          ))}
        </ol>
      </Container>

      <section className="bg-petroleo-50 py-14" aria-labelledby="fila-titulo">
        <Container>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="fila-titulo" className="text-3xl font-bold">
                Agora no topo da fila
              </h2>
              <p className="mt-2 text-tinta-600">As três ocorrências pendentes com mais pontos, direto da API.</p>
            </div>
            <Link to="/ocorrencias" className="inline-flex items-center gap-2 font-semibold text-petroleo-800 hover:underline">
              Ver fila completa <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8">
            {carregando && <Carregando mensagem="Buscando a fila de prioridade…" />}
            {!carregando && erro && <ErroRequisicao erro={erro} onTentarNovamente={carregar} />}
            {!carregando && !erro && destaques.length === 0 && (
              <EstadoVazio titulo="Nenhuma ocorrência pendente" descricao="Que bom! Se você viu algum problema no seu bairro, seja a primeira pessoa a relatar.">
                <Link to="/ocorrencias/nova" className="rounded-lg bg-petroleo-700 px-4 py-2 font-semibold text-white hover:bg-petroleo-800">
                  Relatar um problema
                </Link>
              </EstadoVazio>
            )}
            {!carregando && !erro && destaques.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {destaques.map((ocorrencia, indice) => (
                  <CardOcorrencia key={ocorrencia.id} ocorrencia={ocorrencia} posicao={indice + 1} />
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>

      <Container className="grid gap-10 py-14 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold">A regra é pública</h2>
          <p className="mt-3 text-tinta-600">
            Ninguém fura a fila. A pontuação é a mesma para todo mundo e aparece em cada ocorrência, parte por parte.
          </p>
          <table className="mt-6 w-full overflow-hidden rounded-xl text-left text-sm">
            <caption className="sr-only">Pontos de cada critério</caption>
            <tbody>
              {REGRAS.map(([criterio, pontos]) => (
                <tr key={criterio} className="border-b border-slate-200 bg-white">
                  <th scope="row" className="px-4 py-3 font-medium text-tinta-900">
                    {criterio}
                  </th>
                  <td className="px-4 py-3 text-right font-semibold text-petroleo-800">{pontos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h3 className="text-xl font-semibold">O que a pontuação significa</h3>
          <ul className="mt-5 space-y-4">
            <li className="flex flex-wrap items-center justify-between gap-2">
              <BadgePrioridade classe="URGENTE" grande /> <span className="text-tinta-700">80 pontos ou mais · até 48 horas</span>
            </li>
            <li className="flex flex-wrap items-center justify-between gap-2">
              <BadgePrioridade classe="ALTA" grande /> <span className="text-tinta-700">55 a 79 · até 7 dias</span>
            </li>
            <li className="flex flex-wrap items-center justify-between gap-2">
              <BadgePrioridade classe="MEDIA" grande /> <span className="text-tinta-700">30 a 54 · até 15 dias</span>
            </li>
            <li className="flex flex-wrap items-center justify-between gap-2">
              <BadgePrioridade classe="BAIXA" grande /> <span className="text-tinta-700">até 29 · até 30 dias</span>
            </li>
          </ul>
          <Link to="/sobre" className="mt-6 inline-flex items-center gap-2 font-semibold text-petroleo-800 hover:underline">
            Entenda o projeto <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </>
  )
}
