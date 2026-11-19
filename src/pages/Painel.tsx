import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BadgePrioridade } from '../components/BadgePrioridade'
import { Carregando } from '../components/Carregando'
import { Container } from '../components/Container'
import { ErroRequisicao } from '../components/ErroRequisicao'
import { EstadoVazio } from '../components/EstadoVazio'
import { TituloPagina } from '../components/TituloPagina'
import { ErroApi, comoErroApi } from '../services/api'
import { listarOcorrencias } from '../services/ocorrenciasService'
import type { Ocorrencia } from '../types/ocorrencia'
import { CATEGORIAS, LISTA_STATUS, STATUS, calcularPontuacao, classificarPrioridade, diasEmAberto, ordenarFila } from '../utils/prioridade'

interface Contagem {
  nome: string
  quantidade: number
}

/**
 * Conta quantas vezes cada nome aparece e ordena do maior para o menor.
 * Ex.: ["Grajaú", "Sé", "Grajaú"] -> Grajaú: 2, Sé: 1
 */
function contar(nomes: string[]): Contagem[] {
  const contagens: Contagem[] = []
  for (const nome of nomes) {
    const existente = contagens.find((c) => c.nome === nome)
    if (existente) {
      existente.quantidade++
    } else {
      contagens.push({ nome, quantidade: 1 })
    }
  }
  return contagens.sort((a, b) => b.quantidade - a.quantidade || a.nome.localeCompare(b.nome))
}

function porcentagem(parte: number, total: number): string {
  return total === 0 ? '0' : ((parte / total) * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 })
}

function Barras({ titulo, itens, total }: { titulo: string; itens: Contagem[]; total: number }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold">{titulo}</h2>
      <ul className="mt-4 space-y-3">
        {itens.map((item) => (
          <li key={item.nome}>
            <div className="flex justify-between gap-3 text-sm">
              <span className="font-medium text-tinta-900">{item.nome}</span>
              <span className="text-tinta-600 tabular-nums">
                {item.quantidade} ({porcentagem(item.quantidade, total)}%)
              </span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
              <div className="h-full rounded-full bg-petroleo-700" style={{ width: `${(item.quantidade / Math.max(total, 1)) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Painel() {
  // Estados da API: carregando, erro e a lista que veio do servidor.
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

  useEffect(() => {
    carregar()
  }, [])

  return (
    <>
      <TituloPagina
        sobretitulo="Painel da zeladoria"
        titulo="Resumo para a prefeitura"
        descricao="Números calculados na hora a partir das ocorrências da API: andamento, urgências e onde os problemas se concentram."
      />
      <Container className="py-10">
        {carregando && <Carregando mensagem="Calculando os números do painel…" />}
        {!carregando && erro && <ErroRequisicao erro={erro} onTentarNovamente={carregar} />}
        {!carregando && !erro && ocorrencias.length === 0 && (
          <EstadoVazio titulo="O painel ainda está vazio" descricao="Quando a primeira ocorrência for registrada, os números aparecem aqui.">
            <Link to="/ocorrencias/nova" className="rounded-lg bg-petroleo-700 px-4 py-2 font-semibold text-white hover:bg-petroleo-800">
              Relatar um problema
            </Link>
          </EstadoVazio>
        )}
        {!carregando && !erro && ocorrencias.length > 0 && <ConteudoPainel ocorrencias={ocorrencias} />}
      </Container>
    </>
  )
}

function ConteudoPainel({ ocorrencias }: { ocorrencias: Ocorrencia[] }) {
  const total = ocorrencias.length
  const fila = ordenarFila(ocorrencias)
  const resolvidas = ocorrencias.filter((o) => o.status === 'RESOLVIDA')
  const urgentes = fila.filter((o) => classificarPrioridade(calcularPontuacao(o)) === 'URGENTE').length

  let apoios = 0
  for (const o of ocorrencias) {
    apoios += o.totalApoios
  }

  // Quantos bairros diferentes (o Set guarda cada nome uma vez só).
  const bairros = new Set(ocorrencias.map((o) => o.bairro.trim().toLowerCase())).size

  // Tempo médio de resolução (só das resolvidas). null = nenhuma resolvida ainda.
  let tempoMedio: number | null = null
  if (resolvidas.length > 0) {
    let somaDias = 0
    for (const o of resolvidas) {
      somaDias += diasEmAberto(o)
    }
    tempoMedio = somaDias / resolvidas.length
  }

  const indicadores = [
    { rotulo: 'Ocorrências registradas', valor: String(total), detalhe: `${bairros} bairros atendidos` },
    { rotulo: 'Pendentes urgentes', valor: String(urgentes), detalhe: 'prazo de até 48 horas', destaque: true },
    {
      rotulo: 'Tempo médio de resolução',
      valor: tempoMedio === null ? '-' : `${tempoMedio.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} dias`,
      detalhe: tempoMedio === null ? 'nenhuma resolvida ainda' : 'só ocorrências resolvidas',
    },
    { rotulo: 'Apoios de moradores', valor: String(apoios), detalhe: 'registros duplicados evitados' },
  ]

  const porStatus = LISTA_STATUS.map((status) => ({ nome: STATUS[status], quantidade: ocorrencias.filter((o) => o.status === status).length }))

  return (
    <div className="space-y-6">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {indicadores.map((indicador) => (
          <li key={indicador.rotulo} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-tinta-600">{indicador.rotulo}</p>
            <p className={`mt-1 font-titulo text-3xl font-bold ${indicador.destaque ? 'text-red-700' : 'text-tinta-900'}`}>{indicador.valor}</p>
            <p className="mt-1 text-sm text-tinta-600">{indicador.detalhe}</p>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-3">
        <Barras titulo="Andamento" itens={porStatus} total={total} />
        <Barras titulo="Por bairro" itens={contar(ocorrencias.map((o) => o.bairro)).slice(0, 6)} total={total} />
        <Barras titulo="Por categoria" itens={contar(ocorrencias.map((o) => CATEGORIAS[o.categoria])).slice(0, 6)} total={total} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Topo da fila</h2>
          <Link to="/ocorrencias" className="inline-flex items-center gap-1.5 font-semibold text-petroleo-800 hover:underline">
            Abrir a fila completa <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        {fila.length === 0 ? (
          <p className="mt-4 text-tinta-600">Nenhuma ocorrência pendente. Todas foram resolvidas.</p>
        ) : (
          <ol className="mt-4 divide-y divide-slate-100">
            {fila.slice(0, 5).map((ocorrencia, indice) => {
              const pontos = calcularPontuacao(ocorrencia)
              return (
                <li key={ocorrencia.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <Link to={`/ocorrencias/${ocorrencia.id}`} className="min-w-0 flex-1 font-medium hover:underline">
                    <span className="font-bold text-petroleo-800">{indice + 1}º</span> · #{ocorrencia.id} {CATEGORIAS[ocorrencia.categoria]} ·{' '}
                    <span className="text-tinta-600">{ocorrencia.bairro}</span>
                  </Link>
                  <BadgePrioridade classe={classificarPrioridade(pontos)} pontos={pontos} />
                </li>
              )
            })}
          </ol>
        )}
      </section>
    </div>
  )
}