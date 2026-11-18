import { Accessibility, Building2, Code2, HeartHandshake, School } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '../components/Container'
import { TituloPagina } from '../components/TituloPagina'

const DADOS = [
  {
    numero: '15,2%',
    texto: 'dos brasileiros moram em vias com rampa para cadeirantes.',
    fonte: 'IBGE, Censo 2022 (divulgado em 17/04/2025)',
  },
  {
    numero: '47,2%',
    texto: 'dos hospitais e postos de saúde têm rampa na calçada. Nas escolas, só 31,8%.',
    fonte: 'IBGE, Censo 2022, via Diário do Grande ABC (17/04/2025)',
  },
  {
    numero: '19.175',
    texto: 'pedidos de poda de árvore estavam em aberto na cidade de São Paulo em 30/09/2025.',
    fonte: 'Brasil de Fato (04/12/2025), dados via Lei de Acesso à Informação',
  },
]

const TECNOLOGIAS = [
  ['Front-end', 'React, Vite, TypeScript, Tailwind CSS e React Router'],
  ['API', 'Java (disciplina de Domain Driven Design), consumida com fetch'],
  ['Banco de dados', 'Oracle'],
  ['Motor de prioridade', 'Python (mesmas regras usadas aqui)'],
]

export function Sobre() {
  return (
    <>
      <TituloPagina
        sobretitulo="Sobre o projeto"
        titulo="Uma fila justa para os problemas do bairro"
        descricao="O ZelaCidade é a solução do grupo INOVEX para a Global Solution 2026/2 da FIAP, no tema CitizenTech: tecnologia que parte de uma necessidade real do cidadão."
      />
      <Container className="space-y-14 py-12">
        <section aria-labelledby="problema">
          <h2 id="problema" className="text-2xl font-bold sm:text-3xl">
            O problema
          </h2>
          <p className="mt-3 max-w-3xl text-tinta-700">
            Buraco, poste apagado, lixo acumulado, bueiro entupido e calçada sem rampa ficam dias ou semanas sem solução. O pedido do
            morador entra numa fila sem critério visível, o mesmo problema é registrado várias vezes por vizinhos diferentes e quem mais
            sofre são as pessoas com deficiência, os idosos e quem depende da escola e do posto de saúde do bairro.
          </p>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {DADOS.map((dado) => (
              <li key={dado.numero} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="font-titulo text-4xl font-bold text-petroleo-800">{dado.numero}</p>
                <p className="mt-2 text-tinta-700">{dado.texto}</p>
                <p className="mt-3 text-xs text-tinta-600">Fonte: {dado.fonte}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="solucao" className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 id="solucao" className="text-2xl font-bold sm:text-3xl">
              A solução
            </h2>
            <p className="mt-3 text-tinta-700">
              O cidadão relata o problema e, antes de enviar, já vê a pontuação, o prazo recomendado e o setor responsável. Os vizinhos
              apoiam a mesma ocorrência em vez de duplicar, e cada apoio soma pontos. A subprefeitura atende pela fila de prioridade e
              atualiza o status, que fica registrado no histórico.
            </p>
            <Link to="/faq" className="mt-4 inline-block font-semibold text-petroleo-800 hover:underline">
              Veja como a pontuação é calculada no FAQ
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            <li className="rounded-2xl bg-petroleo-800 p-5 text-white">
              <Accessibility size={26} className="text-ambar-400" aria-hidden="true" />
              <p className="mt-3 font-semibold">Acessibilidade em primeiro lugar</p>
              <p className="mt-1 text-sm text-petroleo-100">+10 pontos quando atrapalha cadeirantes, idosos ou carrinhos.</p>
            </li>
            <li className="rounded-2xl bg-petroleo-800 p-5 text-white">
              <School size={26} className="text-ambar-400" aria-hidden="true" />
              <p className="mt-3 font-semibold">Perto de escola e saúde</p>
              <p className="mt-1 text-sm text-petroleo-100">+15 pontos perto de escola, hospital ou posto de saúde.</p>
            </li>
            <li className="rounded-2xl bg-petroleo-800 p-5 text-white">
              <HeartHandshake size={26} className="text-ambar-400" aria-hidden="true" />
              <p className="mt-3 font-semibold">Apoio dos vizinhos</p>
              <p className="mt-1 text-sm text-petroleo-100">+3 por apoio (até 15) e nada de registro duplicado.</p>
            </li>
            <li className="rounded-2xl bg-petroleo-800 p-5 text-white">
              <Building2 size={26} className="text-ambar-400" aria-hidden="true" />
              <p className="mt-3 font-semibold">Setor e prazo automáticos</p>
              <p className="mt-1 text-sm text-petroleo-100">Cada categoria já vai para o setor certo da prefeitura.</p>
            </li>
          </ul>
        </section>

        <section aria-labelledby="ods" className="rounded-2xl border border-petroleo-200 bg-petroleo-50 p-6 sm:p-8">
          <h2 id="ods" className="text-2xl font-bold sm:text-3xl">
            Objetivos de Desenvolvimento Sustentável
          </h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="flex gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-ambar-500 font-titulo text-xl font-bold text-tinta-900">
                11
              </span>
              <p className="text-tinta-700">
                <strong className="text-tinta-900">Cidades e comunidades sustentáveis.</strong> Meta 11.7: espaços públicos seguros,
                inclusivos e acessíveis.
              </p>
            </div>
            <div className="flex gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-petroleo-800 font-titulo text-xl font-bold text-white">
                10
              </span>
              <p className="text-tinta-700">
                <strong className="text-tinta-900">Redução das desigualdades.</strong> Meta 10.2: inclusão de todas as pessoas, com
                peso extra para a acessibilidade.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="tecnologia">
          <h2 id="tecnologia" className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <Code2 size={28} className="text-petroleo-700" aria-hidden="true" /> Como foi feito
          </h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            {TECNOLOGIAS.map(([parte, descricao]) => (
              <div key={parte} className="rounded-xl border border-slate-200 bg-white p-4">
                <dt className="font-semibold text-tinta-900">{parte}</dt>
                <dd className="mt-1 text-tinta-600">{descricao}</dd>
              </div>
            ))}
          </dl>
        </section>
      </Container>
    </>
  )
}
