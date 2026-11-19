import { ArrowLeft, CalendarDays, Clock, History, MapPin, ThumbsUp, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BadgePrioridade } from '../components/BadgePrioridade'
import { BadgeStatus } from '../components/BadgeStatus'
import { BarraPrioridade } from '../components/BarraPrioridade'
import { Carregando } from '../components/Carregando'
import { Container } from '../components/Container'
import { DialogoConfirmacao } from '../components/DialogoConfirmacao'
import { ErroRequisicao } from '../components/ErroRequisicao'
import { EstadoVazio } from '../components/EstadoVazio'
import { FormApoio } from '../components/FormApoio'
import { FormStatus } from '../components/FormStatus'
import { HistoricoAtualizacoes } from '../components/HistoricoAtualizacoes'
import { IconeCategoria } from '../components/IconeCategoria'
import { Mensagem } from '../components/Mensagem'
import type { TipoMensagem } from '../components/Mensagem'
import { ErroApi, comoErroApi } from '../services/api'
import { buscarOcorrencia, excluirOcorrencia, listarAtualizacoes } from '../services/ocorrenciasService'
import type { Atualizacao, Ocorrencia } from '../types/ocorrencia'
import { formatarData, plural } from '../utils/formatar'
import {
  CATEGORIAS,
  calcularPontuacao,
  classificarPrioridade,
  diasEmAberto,
  parcelasPontos,
  prazoRecomendado,
  setorResponsavel,
} from '../utils/prioridade'

/** Aviso verde (sucesso) ou vermelho (erro) que aparece depois de uma ação. */
interface Aviso {
  tipo: TipoMensagem
  titulo: string
  texto: string
}

/** Página /ocorrencias/:id. O ":id" vem da URL. */
export function OcorrenciaDetalhe() {
  const parametro = useParams().id ?? ''
  const id = Number(parametro)
  const idValido = Number.isInteger(id) && id > 0

  // A ocorrência (carregando / erro / dados)
  const [ocorrencia, setOcorrencia] = useState<Ocorrencia | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<ErroApi | null>(null)

  // O histórico de atualizações (carregando / erro / dados)
  const [historico, setHistorico] = useState<Atualizacao[]>([])
  const [carregandoHistorico, setCarregandoHistorico] = useState(true)
  const [erroHistorico, setErroHistorico] = useState<ErroApi | null>(null)

  // Aviso depois de uma ação e controle da janela "Excluir?"
  const [aviso, setAviso] = useState<Aviso | null>(null)
  const [confirmarExclusao, setConfirmarExclusao] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const navigate = useNavigate()

  async function carregarOcorrencia() {
    setCarregando(true)
    setErro(null)
    try {
      setOcorrencia(await buscarOcorrencia(id))
    } catch (e) {
      setErro(comoErroApi(e))
    } finally {
      setCarregando(false)
    }
  }

  async function carregarHistorico() {
    setCarregandoHistorico(true)
    setErroHistorico(null)
    try {
      setHistorico(await listarAtualizacoes(id))
    } catch (e) {
      setErroHistorico(comoErroApi(e))
    } finally {
      setCarregandoHistorico(false)
    }
  }

  // Busca tudo quando a página abre (e de novo se o id da URL mudar).
  useEffect(() => {
    if (idValido) {
      setOcorrencia(null)
      carregarOcorrencia()
      carregarHistorico()
    }
  }, [id])

  // Depois de apoiar ou mudar o status: mostra o aviso e busca os dados atualizados.
  function depoisDaAcao(titulo: string, texto: string) {
    setAviso({ tipo: 'sucesso', titulo, texto })
    carregarOcorrencia()
    carregarHistorico()
  }

  async function excluir() {
    setExcluindo(true)
    try {
      await excluirOcorrencia(id)
      // Volta para a fila levando o aviso "Ocorrência #7 excluída."
      navigate('/ocorrencias', { state: { aviso: `Ocorrência #${id} excluída.` } })
    } catch (e) {
      setConfirmarExclusao(false)
      setAviso({ tipo: 'erro', titulo: 'Não foi possível excluir', texto: comoErroApi(e).message })
    } finally {
      setExcluindo(false)
    }
  }

  const linkVoltar = (
    <Link to="/ocorrencias" className="inline-flex items-center gap-1.5 rounded font-semibold text-petroleo-800 hover:underline">
      <ArrowLeft size={18} aria-hidden="true" /> Voltar para a fila
    </Link>
  )

  // ---------- 1. Id inválido na URL (ex.: /ocorrencias/abc) ----------
  if (!idValido) {
    return (
      <Container className="py-16">
        <EstadoVazio titulo="Número de ocorrência inválido" descricao={`"${parametro}" não é um número de ocorrência. Os números são inteiros, como 7 ou 152.`}>
          <Link to="/ocorrencias" className="rounded-lg bg-petroleo-700 px-4 py-2 font-semibold text-white hover:bg-petroleo-800">
            Ver a fila de ocorrências
          </Link>
        </EstadoVazio>
      </Container>
    )
  }

  // ---------- 2. Ainda sem a ocorrência: carregando ou erro ----------
  if (!ocorrencia) {
    const naoExiste = erro?.status === 404
    return (
      <Container className="py-10">
        {linkVoltar}
        <div className="mt-6">
          {carregando && <Carregando mensagem={`Carregando a ocorrência #${id}…`} />}
          {!carregando && erro && (
            <ErroRequisicao
              erro={erro}
              titulo={naoExiste ? `Não encontramos a ocorrência #${id}` : 'Não conseguimos carregar a ocorrência'}
              onTentarNovamente={naoExiste ? undefined : carregarOcorrencia}
            >
              {naoExiste && (
                <Link to="/ocorrencias" className="rounded-lg bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800">
                  Ver a fila
                </Link>
              )}
            </ErroRequisicao>
          )}
        </div>
      </Container>
    )
  }

  // ---------- 3. Ocorrência carregada ----------
  const pontos = calcularPontuacao(ocorrencia)
  const classe = classificarPrioridade(pontos)
  const resolvida = ocorrencia.status === 'RESOLVIDA'
  const dias = diasEmAberto(ocorrencia)

  return (
    <Container className="py-8 sm:py-10">
      {linkVoltar}

      {/* Cabeçalho: categoria, descrição, prioridade e dados principais */}
      <header className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <IconeCategoria categoria={ocorrencia.categoria} tamanho={28} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-tinta-600">
              Ocorrência #{ocorrencia.id} · {CATEGORIAS[ocorrencia.categoria]}
            </p>
            <h1 className="mt-1 text-2xl font-bold break-words sm:text-3xl">{ocorrencia.descricao}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {!resolvida && <BadgePrioridade classe={classe} pontos={pontos} grande />}
              <BadgeStatus status={ocorrencia.status} />
            </div>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-tinta-700">
              <li className="flex items-center gap-1.5">
                <MapPin size={18} aria-hidden="true" /> {ocorrencia.bairro}
              </li>
              <li className="flex items-center gap-1.5">
                <CalendarDays size={18} aria-hidden="true" /> Aberta em {formatarData(ocorrencia.dataAbertura)}
              </li>
              <li className="flex items-center gap-1.5">
                <Clock size={18} aria-hidden="true" />
                {resolvida
                  ? `Resolvida em ${formatarData(ocorrencia.dataResolucao)} (${plural(dias, 'dia', 'dias')})`
                  : `${plural(dias, 'dia', 'dias')} em aberto`}
              </li>
              <li className="flex items-center gap-1.5">
                <ThumbsUp size={18} aria-hidden="true" /> {plural(ocorrencia.totalApoios, 'apoio', 'apoios')}
              </li>
            </ul>
          </div>
        </div>
      </header>

      {aviso && (
        <div className="mt-5">
          <Mensagem tipo={aviso.tipo} titulo={aviso.titulo} onFechar={() => setAviso(null)}>
            {aviso.texto}
          </Mensagem>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
        {/* Coluna da esquerda: cálculo dos pontos e histórico */}
        <div className="min-w-0 space-y-6">
          <section aria-labelledby="calculo-titulo" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 id="calculo-titulo" className="text-xl font-bold">
              Por que essa prioridade?
            </h2>
            <p className="mt-1 text-sm text-tinta-600">A mesma regra vale para todas as ocorrências. Veja de onde veio cada ponto.</p>
            <div className="mt-5">
              <BarraPrioridade pontos={pontos} parcelas={parcelasPontos(ocorrencia)} />
            </div>
            <dl className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-tinta-600">Prazo recomendado</dt>
                <dd className="font-semibold">{resolvida ? 'Já resolvida' : prazoRecomendado(classe)}</dd>
              </div>
              <div>
                <dt className="text-sm text-tinta-600">Setor responsável</dt>
                <dd className="font-semibold">{setorResponsavel(ocorrencia.categoria)}</dd>
              </div>
              <div>
                <dt className="text-sm text-tinta-600">Gravidade</dt>
                <dd className="font-semibold">{ocorrencia.gravidade} de 5</dd>
              </div>
              <div>
                <dt className="text-sm text-tinta-600">Pessoas afetadas por dia</dt>
                <dd className="font-semibold">{ocorrencia.pessoasAfetadas.toLocaleString('pt-BR')}</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="historico-titulo" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 id="historico-titulo" className="flex items-center gap-2 text-xl font-bold">
              <History size={22} className="text-petroleo-700" aria-hidden="true" /> Histórico de atualizações
            </h2>
            <div className="mt-5">
              <HistoricoAtualizacoes
                atualizacoes={historico}
                carregando={carregandoHistorico}
                erro={erroHistorico}
                onTentarNovamente={carregarHistorico}
                dataAbertura={ocorrencia.dataAbertura}
              />
            </div>
          </section>
        </div>

        {/* Coluna da direita: apoiar, mudar status e excluir */}
        <div className="space-y-6">
          <FormApoio ocorrencia={ocorrencia} onSucesso={depoisDaAcao} />
          <FormStatus ocorrencia={ocorrencia} onSucesso={depoisDaAcao} />
          <section aria-labelledby="excluir-titulo" className="rounded-2xl border border-red-200 bg-white p-5">
            <h2 id="excluir-titulo" className="text-lg font-bold text-red-900">
              Registro duplicado ou por engano?
            </h2>
            <p className="mt-1 text-sm text-tinta-600">A exclusão é só para esses casos e não pode ser desfeita.</p>
            <button
              type="button"
              onClick={() => setConfirmarExclusao(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border-2 border-red-700 px-4 py-2 font-semibold text-red-800 transition-colors hover:bg-red-50"
            >
              <Trash2 size={18} aria-hidden="true" /> Excluir ocorrência
            </button>
          </section>
        </div>
      </div>

      {/* Janela de confirmação antes de excluir */}
      <DialogoConfirmacao
        aberto={confirmarExclusao}
        titulo={`Excluir a ocorrência #${id}?`}
        rotuloConfirmar={`Sim, excluir a #${id}`}
        rotuloCancelar="Manter a ocorrência"
        ocupado={excluindo}
        onConfirmar={excluir}
        onCancelar={() => setConfirmarExclusao(false)}
      >
        <p>Use a exclusão só para registros duplicados ou feitos por engano.</p>
        <p className="mt-2 font-semibold text-red-800">Essa ação não pode ser desfeita, e o número #{id} não será usado de novo.</p>
      </DialogoConfirmacao>
    </Container>
  )
}
