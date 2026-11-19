import { Plus, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CardOcorrencia } from '../components/CardOcorrencia'
import { Carregando } from '../components/Carregando'
import { Container } from '../components/Container'
import { ErroRequisicao } from '../components/ErroRequisicao'
import { EstadoVazio } from '../components/EstadoVazio'
import { Mensagem } from '../components/Mensagem'
import { TituloPagina } from '../components/TituloPagina'
import { ErroApi, comoErroApi } from '../services/api'
import { listarOcorrencias } from '../services/ocorrenciasService'
import type { ClassePrioridade, Ocorrencia } from '../types/ocorrencia'
import { normalizarTexto } from '../utils/formatar'
import { CATEGORIAS, CLASSES, LISTA_CATEGORIAS, STATUS, calcularPontuacao, classificarPrioridade, ordenarFila } from '../utils/prioridade'

export function Ocorrencias() {
  // Estados da API: carregando, erro e a lista que veio do servidor.
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<ErroApi | null>(null)

  // Um estado para cada filtro. "PENDENTES" = aberta + em andamento.
  const [bairro, setBairro] = useState('')
  const [categoria, setCategoria] = useState('')
  const [status, setStatus] = useState('PENDENTES')
  const [prioridade, setPrioridade] = useState('')

  // Aviso que a tela de detalhe manda depois de excluir ("Ocorrência #7 excluída.").
  const location = useLocation()
  const navigate = useNavigate()
  const aviso: string | undefined = location.state?.aviso

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

  function limparFiltros() {
    setBairro('')
    setCategoria('')
    setStatus('PENDENTES')
    setPrioridade('')
  }

  // 1. Ordena: pendentes pela fila de prioridade; resolvidas da mais recente para a mais antiga.
  let lista: Ocorrencia[]
  if (status === 'RESOLVIDA') {
    lista = ocorrencias
      .filter((o) => o.status === 'RESOLVIDA')
      .sort((a, b) => (b.dataResolucao ?? '').localeCompare(a.dataResolucao ?? ''))
  } else {
    lista = ordenarFila(ocorrencias)
  }

  // 2. Aplica cada filtro (filtro vazio = não filtra). O bairro ignora acentos e maiúsculas.
  const filtradas = lista.filter((o) => {
    if (status !== 'PENDENTES' && o.status !== status) return false
    if (categoria && o.categoria !== categoria) return false
    if (bairro && !normalizarTexto(o.bairro).includes(normalizarTexto(bairro))) return false
    if (prioridade && classificarPrioridade(calcularPontuacao(o)) !== prioridade) return false
    return true
  })

  const temFiltro = bairro !== '' || categoria !== '' || prioridade !== '' || status !== 'PENDENTES'
  // A posição (1º, 2º...) só aparece na fila completa, sem filtro.
  const mostrarPosicao = status !== 'RESOLVIDA' && !temFiltro

  return (
    <>
      <TituloPagina
        sobretitulo="Fila de prioridade"
        titulo="Ocorrências do ZelaCidade"
        descricao="Da mais urgente para a menos urgente. Em caso de empate de pontos, a mais antiga vem primeiro."
      >
        <Link
          to="/ocorrencias/nova"
          className="inline-flex items-center gap-2 rounded-xl bg-petroleo-700 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-petroleo-800"
        >
          <Plus size={18} aria-hidden="true" /> Relatar um problema
        </Link>
      </TituloPagina>

      <Container className="py-8">
        {aviso && (
          <div className="mb-6">
            <Mensagem tipo="sucesso" titulo={aviso} onFechar={() => navigate('.', { replace: true, state: null })} />
          </div>
        )}

        <form
          role="search"
          aria-label="Filtrar ocorrências"
          onSubmit={(evento) => evento.preventDefault()}
          className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filtro-bairro" className="text-sm font-medium">
              Bairro
            </label>
            <div className="relative">
              <Search size={18} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                id="filtro-bairro"
                type="search"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Capão Redondo"
                className="w-full rounded-lg border border-slate-300 py-2.5 pr-3 pl-10 hover:border-slate-400"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filtro-categoria" className="text-sm font-medium">
              Categoria
            </label>
            <select
              id="filtro-categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 hover:border-slate-400"
            >
              <option value="">Todas as categorias</option>
              {LISTA_CATEGORIAS.map((item) => (
                <option key={item} value={item}>
                  {CATEGORIAS[item]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filtro-status" className="text-sm font-medium">
              Status
            </label>
            <select
              id="filtro-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 hover:border-slate-400"
            >
              <option value="PENDENTES">Pendentes</option>
              <option value="ABERTA">{STATUS.ABERTA}</option>
              <option value="EM_ANDAMENTO">{STATUS.EM_ANDAMENTO}</option>
              <option value="RESOLVIDA">{STATUS.RESOLVIDA}</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filtro-classe" className="text-sm font-medium">
              Prioridade
            </label>
            <select
              id="filtro-classe"
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 hover:border-slate-400"
            >
              <option value="">Todas as prioridades</option>
              {(Object.keys(CLASSES) as ClassePrioridade[]).map((item) => (
                <option key={item} value={item}>
                  {CLASSES[item]}
                </option>
              ))}
            </select>
          </div>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-tinta-600" aria-live="polite">
            {!carregando && !erro ? ${filtradas.length} de ${ocorrencias.length} ocorrências : ' '}
          </p>
          {temFiltro && (
            <button
              type="button"
              onClick={limparFiltros}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold text-petroleo-800 hover:bg-petroleo-50"
            >
              <X size={16} aria-hidden="true" /> Limpar filtros
            </button>
          )}
        </div>

        <div className="mt-4">
          {/* Carregando */}
          {carregando && <Carregando />}

          {/* Erro */}
          {!carregando && erro && <ErroRequisicao erro={erro} onTentarNovamente={carregar} />}

          {/* Sem nenhuma ocorrência no sistema */}
          {!carregando && !erro && ocorrencias.length === 0 && (
            <EstadoVazio titulo="Ainda não há ocorrências" descricao="Nenhum problema foi registrado até agora. Viu algo no seu bairro? Seja a primeira pessoa a relatar.">
              <Link to="/ocorrencias/nova" className="rounded-lg bg-petroleo-700 px-4 py-2 font-semibold text-white hover:bg-petroleo-800">
                Relatar um problema
              </Link>
            </EstadoVazio>
          )}

          {/* Tem ocorrências, mas nenhuma passa nos filtros */}
          {!carregando && !erro && ocorrencias.length > 0 && filtradas.length === 0 && (
            <EstadoVazio titulo="Nada encontrado com esses filtros" descricao="Confira a grafia do bairro ou tire algum filtro para ver mais ocorrências.">
              <button
                type="button"
                onClick={limparFiltros}
                className="rounded-lg border-2 border-petroleo-700 px-4 py-2 font-semibold text-petroleo-800 hover:bg-petroleo-50"
              >
                Limpar filtros
              </button>
            </EstadoVazio>
          )}

          {/* Lista */}
          {!carregando && !erro && filtradas.length > 0 && (
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtradas.map((ocorrencia, indice) => (
                <li key={ocorrencia.id}>
                  <CardOcorrencia ocorrencia={ocorrencia} posicao={mostrarPosicao ? indice + 1 : undefined} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </>
  )
}