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
