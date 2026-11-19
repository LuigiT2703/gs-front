import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { comoErroApi } from '../services/api'
import { registrarAtualizacao } from '../services/ocorrenciasService'
import type { Ocorrencia, StatusOcorrencia } from '../types/ocorrencia'
import { classeCampo, descricaoCampo } from '../utils/formulario'
import { LISTA_STATUS, STATUS } from '../utils/prioridade'
import { Campo } from './Campo'
import { Mensagem } from './Mensagem'

interface FormStatusProps {
  ocorrencia: Ocorrencia
  /** Chamado quando a atualização dá certo, com o título e o texto do aviso verde. */
  onSucesso: (titulo: string, texto: string) => void
}

interface CamposStatus {
  status: string
  comentario: string
  responsavel: string
}

/** Formulário da subprefeitura: muda o status e grava uma linha no histórico (POST /atualizacoes). */
export function FormStatus({ ocorrencia, onSucesso }: FormStatusProps) {
  const [erroApi, setErroApi] = useState('')
  const { register, handleSubmit, reset, formState } = useForm<CamposStatus>({
    mode: 'onTouched',
    defaultValues: { status: '', comentario: '', responsavel: '' },
  })
  const erros = formState.errors

  async function salvar(campos: CamposStatus) {
    setErroApi('')
    const novoStatus = campos.status as StatusOcorrencia
    try {
      await registrarAtualizacao(ocorrencia.id, {
        status: novoStatus,
        comentario: campos.comentario.trim(),
        responsavel: campos.responsavel.trim(),
      })
      reset()
      let texto = 'O cidadão já vê a mudança ao consultar pelo número.'
      if (novoStatus === 'RESOLVIDA') {
        texto = 'A data de resolução foi gravada e a ocorrência saiu da fila.'
      }

            onSucesso(`Status alterado para "${STATUS[novoStatus]}".`, texto)
    } catch (e) {
      setErroApi(comoErroApi(e).message)
    }
  }

  return (
    <section aria-labelledby="status-titulo" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 id="status-titulo" className="text-lg font-bold">
        Atualizar status
      </h2>
      <p className="mt-1 text-sm text-tinta-600">
        Para a equipe da subprefeitura. Status atual: <strong>{STATUS[ocorrencia.status]}</strong>.
      </p>

      <form onSubmit={handleSubmit(salvar)} noValidate className="mt-4 space-y-4">
        {erroApi && <Mensagem tipo="erro" titulo={erroApi} onFechar={() => setErroApi('')} />}

        <Campo id="novo-status" rotulo="Novo status" obrigatorio erro={erros.status?.message}>
          <select
            id="novo-status"
            aria-invalid={!!erros.status}
            aria-describedby={descricaoCampo('novo-status', !!erros.status, false)}
            className={classeCampo(!!erros.status)}
            {...register('status', {
              required: 'Escolha o novo status.',
              // Não deixa escolher o status que a ocorrência já tem.
              validate: (valor) => valor !== ocorrencia.status || `A ocorrência já está como "${STATUS[ocorrencia.status]}". Escolha outro status.`,
            })}
          >
            <option value="">Escolha uma opção</option>
            {LISTA_STATUS.map((status) => (
              <option key={status} value={status}>
                {STATUS[status]}
              </option>
            ))}
          </select>
        </Campo>

        <Campo id="comentario" rotulo="O que foi feito?" obrigatorio ajuda="Ex.: equipe enviada para tapar o buraco." erro={erros.comentario?.message}>
          <textarea
            id="comentario"
            rows={3}
            placeholder="Equipe de drenagem agendada para amanhã de manhã."
            aria-invalid={!!erros.comentario}
            aria-describedby={descricaoCampo('comentario', !!erros.comentario, true)}
            className={classeCampo(!!erros.comentario)}
            {...register('comentario', {
              required: 'Explique o andamento em poucas palavras.',
              validate: (valor) => valor.trim().length >= 10 || 'Escreva pelo menos 10 letras para o cidadão entender o andamento.',
              maxLength: { value: 300, message: 'Use no máximo 300 caracteres.' },
            })}
          />
        </Campo>

        <Campo id="responsavel" rotulo="Responsável" obrigatorio erro={erros.responsavel?.message}>
          <input
            id="responsavel"
            type="text"
            placeholder="Subprefeitura - drenagem"
            aria-invalid={!!erros.responsavel}
            aria-describedby={descricaoCampo('responsavel', !!erros.responsavel, false)}
            className={classeCampo(!!erros.responsavel)}
            {...register('responsavel', {
              required: 'Informe quem está atualizando.',
              validate: (valor) => valor.trim().length >= 3 || 'Use pelo menos 3 letras.',
            })}
          />
        </Campo>

        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="w-full rounded-xl bg-petroleo-700 px-4 py-3 font-semibold text-white transition-colors hover:bg-petroleo-800 disabled:cursor-wait disabled:opacity-70"
        >
          {formState.isSubmitting ? 'Salvando…' : 'Salvar status'}
        </button>
      </form>
    </section>
  )
}
