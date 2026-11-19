import { ArrowRight, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { BadgePrioridade } from '../components/BadgePrioridade'
import { BarraPrioridade } from '../components/BarraPrioridade'
import { Campo } from '../components/Campo'
import { Container } from '../components/Container'
import { IconeCategoria } from '../components/IconeCategoria'
import { Mensagem } from '../components/Mensagem'
import { TituloPagina } from '../components/TituloPagina'
import { ErroApi, comoErroApi } from '../services/api'
import { cadastrarOcorrencia } from '../services/ocorrenciasService'
import type { Categoria, NovaOcorrencia, Ocorrencia } from '../types/ocorrencia'
import { classeCampo, descricaoCampo } from '../utils/formulario'
import {
  CATEGORIAS,
  LISTA_CATEGORIAS,
  calcularPontuacao,
  classificarPrioridade,
  parcelasPontos,
  prazoRecomendado,
  setorResponsavel,
} from '../utils/prioridade'

/** Os campos do formulário. Tudo é texto porque é assim que vem dos inputs e radios. */
interface FormOcorrencia {
  categoria: string
  descricao: string
  bairro: string
  gravidade: string
  pessoasAfetadas: string
  perto: string // 'sim' ou 'nao'
  acessibilidade: string // 'sim' ou 'nao'
  nome: string
}

const VALORES_INICIAIS: FormOcorrencia = {
  categoria: '',
  descricao: '',
  bairro: '',
  gravidade: '',
  pessoasAfetadas: '',
  perto: '',
  acessibilidade: '',
  nome: '',
}

const ROTULOS_GRAVIDADE: Record<string, string> = {
  '1': 'Incômodo leve',
  '2': 'Incomoda',
  '3': 'Atrapalha a rotina',
  '4': 'Grave',
  '5': 'Risco de acidente ou à saúde',
}

/** Data de hoje no formato da API (aaaa-mm-dd), usada na prévia dos pontos. */
function hojeIso(): string {
  const agora = new Date()
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const dia = String(agora.getDate()).padStart(2, '0')
  return `${agora.getFullYear()}-${mes}-${dia}`
}

export function RegistrarOcorrencia() {
  const [enviando, setEnviando] = useState(false)
  const [criada, setCriada] = useState<Ocorrencia | null>(null) // deu certo: a ocorrência que a API criou
  const [erroEnvio, setErroEnvio] = useState<ErroApi | null>(null) // deu erro: a mensagem da API
  const avisoRef = useRef<HTMLDivElement>(null)

  // React Hook Form: cuida dos valores e das validações. "errors" tem a mensagem de cada campo com problema.
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormOcorrencia>({ mode: 'onTouched', defaultValues: VALORES_INICIAIS })
  
    // watch() devolve o que está digitado agora: usado na prévia e no contador de letras.
  const valores = watch()
  // Calçada sempre conta como acessibilidade (regra do sistema).
  const ehCalcada = valores.categoria === 'CALCADA_ACESSIBILIDADE'

  // Quando a pessoa escolhe "Calçada", já marca "Sim" na pergunta de acessibilidade.
  useEffect(() => {
    if (ehCalcada) {
      setValue('acessibilidade', 'sim')
    }
  }, [ehCalcada])

  // Prévia da prioridade com os dados preenchidos até agora (mesma regra do motor Python).
  const previa = {
    gravidade: Number(valores.gravidade) || 0,
    pessoasAfetadas: Number(valores.pessoasAfetadas) || 0,
    pertoServicoEssencial: valores.perto === 'sim',
    afetaAcessibilidade: ehCalcada || valores.acessibilidade === 'sim',
    dataAbertura: hojeIso(),
    dataResolucao: null,
    totalApoios: 0,
  }
  const pontosPrevia = calcularPontuacao(previa)
  const classePrevia = classificarPrioridade(pontosPrevia)
  const previaPronta = valores.categoria !== '' && previa.gravidade > 0

  // Rola a tela até o aviso verde/vermelho, para a pessoa ver o resultado.
  function rolarAteAviso() {
    setTimeout(() => avisoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
  }

  async function enviar(dados: FormOcorrencia) {
    const corpo: NovaOcorrencia = {
      categoria: dados.categoria as Categoria,
      descricao: dados.descricao.trim(),
      bairro: dados.bairro.trim(),
      gravidade: Number(dados.gravidade),
      pessoasAfetadas: Number(dados.pessoasAfetadas),
      pertoServicoEssencial: dados.perto === 'sim',
      afetaAcessibilidade: dados.categoria === 'CALCADA_ACESSIBILIDADE' || dados.acessibilidade === 'sim',
      nomeCidadao: dados.nome.trim(),
    }
    setEnviando(true)
    setCriada(null)
    setErroEnvio(null)
    try {
      setCriada(await cadastrarOcorrencia(corpo))
      reset(VALORES_INICIAIS) // limpa o formulário
    } catch (e) {
      setErroEnvio(comoErroApi(e))
    } finally {
      setEnviando(false)
      rolarAteAviso()
    }
  }

  return (
    <>
<TituloPagina
        sobretitulo="Registrar ocorrência"
        titulo="Relatar um problema"
        descricao="Conte o que você viu. Antes de enviar, você confere a prioridade, o prazo e o setor que vai receber."
      />
    <Container className="grid gap-8 py-10 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0 space-y-6">
          <div ref={avisoRef}>
            {criada && (
              <Mensagem tipo="sucesso" titulo={`Ocorrência #${criada.id} registrada!`} onFechar={() => setCriada(null)}>
                <p>Guarde este número para acompanhar o andamento. Ela já está na fila de prioridade.</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <Link to={`/ocorrencias/${criada.id}`} className="inline-flex items-center gap-1.5 font-semibold text-green-900 underline">
                    Acompanhar a #{criada.id} <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                  <Link to="/ocorrencias" className="font-semibold text-green-900 underline">
                    Ver a fila
                  </Link>
                </div>
              </Mensagem>
            )}
            {erroEnvio && (
              <Mensagem tipo="erro" titulo="Não foi possível registrar" onFechar={() => setErroEnvio(null)}>
                <p>{erroEnvio.message}</p>
                {/* 409 = já existe uma igual: sugere apoiar a que já existe */}
                {erroEnvio.status === 409 && (
                  <p className="mt-2">
                    Talvez um vizinho já tenha registrado esse problema.{' '}
                    <Link to="/ocorrencias" className="font-semibold underline">
                      Procure na fila e apoie
                    </Link>
                    .
                  </p>
                )}
              </Mensagem>
            )}
          </div>

          <form onSubmit={handleSubmit(enviar)} noValidate className="space-y-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <p className="text-sm text-tinta-600">
              Campos com <span className="text-red-700">*</span> são obrigatórios.
            </p>

            <fieldset aria-describedby={errors.categoria ? 'categoria-erro' : undefined}>
              <legend className="font-medium">
                Qual é o tipo do problema? <span className="text-red-700" aria-hidden="true">*</span>
              </legend>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {LISTA_CATEGORIAS.map((categoria) => (
                  <label
                    key={categoria}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-slate-200 p-2.5 transition-colors hover:border-petroleo-200 has-checked:border-petroleo-700 has-checked:bg-petroleo-50 has-focus-visible:outline-3 has-focus-visible:outline-ambar-500">
