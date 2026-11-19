import { ThumbsUp } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { comoErroApi } from '../services/api'
import { apoiarOcorrencia } from '../services/ocorrenciasService'
import type { Ocorrencia } from '../types/ocorrencia'
import { plural } from '../utils/formatar'
import { classeCampo, descricaoCampo } from '../utils/formulario'
import { calcularPontuacao } from '../utils/prioridade'
import { Campo } from './Campo'
import { Mensagem } from './Mensagem'

interface FormApoioProps {
  ocorrencia: Ocorrencia
  /** Chamado quando o apoio dá certo, com o título e o texto do aviso verde. */
  onSucesso: (titulo: string, texto: string) => void
}

interface CamposApoio {
  nome: string
}

/** Formulário "Também vi isso": um vizinho apoia a ocorrência em vez de registrar de novo. */
export function FormApoio({ ocorrencia, onSucesso }: FormApoioProps) {
  const [erroApi, setErroApi] = useState('')

  // React Hook Form: cuida dos valores, das validações e do "enviando…" do formulário.
  const { register, handleSubmit, reset, formState } = useForm<CamposApoio>({ mode: 'onTouched', defaultValues: { nome: '' } })
  const erros = formState.errors

  // Ocorrência resolvida não recebe apoio: mostra só um aviso no lugar do formulário.
  if (ocorrencia.status === 'RESOLVIDA') {
    return (
      <section className="rounded-2xl border border-petroleo-200 bg-petroleo-50 p-5">
        <h2 className="text-lg font-bold">Problema resolvido</h2>
        <p className="mt-1 text-sm text-tinta-700">Ocorrências resolvidas não recebem novos apoios.</p>
      </section>
    )
  }

  async function apoiar(campos: CamposApoio) {
    setErroApi('')
    const pontosAntes = calcularPontuacao(ocorrencia)
    try {
      const resposta = await apoiarOcorrencia(ocorrencia.id, { nome: campos.nome.trim() })
      // Recalcula com o novo total de apoios para mostrar "foi de 85 para 88".
      const pontosDepois = calcularPontuacao({ ...ocorrencia, totalApoios: resposta.totalApoios, pontos: undefined })
      reset()
      onSucesso(
        'Obrigado pelo apoio!',
        `Agora são ${plural(resposta.totalApoios, 'apoio', 'apoios')}. A pontuação foi de ${pontosAntes} para ${pontosDepois}.`,
      )
    } catch (e) {
      setErroApi(comoErroApi(e).message)
    }
  }

  return (
    <section aria-labelledby="apoio-titulo" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 id="apoio-titulo" className="text-lg font-bold">
        Também viu esse problema?
      </h2>
      <p className="mt-1 text-sm text-tinta-600">Apoie em vez de registrar de novo. Cada apoio soma 3 pontos (até 15).</p>

      <form onSubmit={handleSubmit(apoiar)} noValidate className="mt-4 space-y-3">
        {erroApi && <Mensagem tipo="erro" titulo={erroApi} onFechar={() => setErroApi('')} />}

        <Campo id="apoio-nome" rotulo="Seu nome" obrigatorio ajuda="Cada pessoa apoia uma vez só. Seu nome não aparece para ninguém." erro={erros.nome?.message}>
          <input
            id="apoio-nome"
            type="text"
            autoComplete="name"
            placeholder="João Lima"
            aria-invalid={!!erros.nome}
            aria-describedby={descricaoCampo('apoio-nome', !!erros.nome, true)}
            className={classeCampo(!!erros.nome)}
            {...register('nome', {
              required: 'Digite seu nome para apoiar.',
              validate: (valor) => valor.trim().length >= 2 || 'O nome precisa ter pelo menos 2 letras.',
            })}
          />
