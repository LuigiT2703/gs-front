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
