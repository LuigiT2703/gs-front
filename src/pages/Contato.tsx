import { Send } from 'lucide-react'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Campo } from '../components/Campo'
import { Container } from '../components/Container'
import { IconeGithub, IconeLinkedin } from '../components/IconesMarca'
import { Mensagem } from '../components/Mensagem'
import { TituloPagina } from '../components/TituloPagina'
import { INTEGRANTES } from '../data/integrantes'
import { classeCampo, descricaoCampo } from '../utils/formulario'

interface FormContato {
  nome: string
  email: string
  assunto: string
  mensagem: string
}

const ASSUNTOS = ['Dúvida sobre o ZelaCidade', 'Sugestão', 'Problema no site', 'Quero levar o ZelaCidade para minha cidade']

export function Contato() {
  const [enviadoPor, setEnviadoPor] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormContato>({ mode: 'onTouched', defaultValues: { nome: '', email: '', assunto: '', mensagem: '' } })

  const tamanhoMensagem = useWatch({ control, name: 'mensagem' }).length

  function enviar(dados: FormContato) {
    setEnviadoPor(dados.nome.split(' ')[0] ?? dados.nome)
    reset()
  }

  return (
    <>
      <TituloPagina sobretitulo="Contato" titulo="Fale com a equipe INOVEX" descricao="Dúvidas, sugestões ou interesse em levar o ZelaCidade para a sua cidade." />
      <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_20rem]">
        <form onSubmit={handleSubmit(enviar)} noValidate className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {enviadoPor && (
            <Mensagem tipo="sucesso" titulo={`Mensagem pronta, ${enviadoPor}!`} onFechar={() => setEnviadoPor(null)}>
              Todos os campos foram validados. Nesta versão acadêmica o formulário ainda não está ligado a um servidor de e-mail; para
              uma resposta, fale com a equipe pelo GitHub ou LinkedIn ao lado.
            </Mensagem>
          )}
          <p className="text-sm text-tinta-600">
            Campos com <span className="text-red-700">*</span> são obrigatórios.
          </p>

          <Campo id="nome" rotulo="Seu nome" obrigatorio erro={errors.nome?.message}>
            <input
              id="nome"
              type="text"
              autoComplete="name"
              placeholder="Maria Souza"
              aria-invalid={!!errors.nome}
              aria-describedby={descricaoCampo('nome', !!errors.nome, false)}
              className={classeCampo(!!errors.nome)}
              {...register('nome', {
                required: 'Digite seu nome.',
                minLength: { value: 3, message: 'O nome precisa ter pelo menos 3 letras.' },
              })}
            />
          </Campo>

          <Campo id="email" rotulo="E-mail" obrigatorio ajuda="Usamos só para responder você." erro={errors.email?.message}>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="maria@email.com"
              aria-invalid={!!errors.email}
              aria-describedby={descricaoCampo('email', !!errors.email, true)}
              className={classeCampo(!!errors.email)}
              {...register('email', {
                required: 'Digite seu e-mail.',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, message: 'Esse e-mail parece incompleto. Confira se tem @ e domínio (ex.: maria@email.com).' },
              })}
            />
          </Campo>

          <Campo id="assunto" rotulo="Assunto" obrigatorio erro={errors.assunto?.message}>
            <select
              id="assunto"
              aria-invalid={!!errors.assunto}
              aria-describedby={descricaoCampo('assunto', !!errors.assunto, false)}
              className={classeCampo(!!errors.assunto)}
              {...register('assunto', { required: 'Escolha um assunto.' })}
            >
              <option value="">Escolha uma opção</option>
              {ASSUNTOS.map((assunto) => (
                <option key={assunto} value={assunto}>
                  {assunto}
                </option>
              ))}
            </select>
          </Campo>

          <Campo id="mensagem" rotulo="Mensagem" obrigatorio ajuda={`${tamanhoMensagem}/1000 caracteres (mínimo 20).`} erro={errors.mensagem?.message}>
            <textarea
              id="mensagem"
              rows={5}
              placeholder="Conte como podemos ajudar."
              aria-invalid={!!errors.mensagem}
              aria-describedby={descricaoCampo('mensagem', !!errors.mensagem, true)}
              className={classeCampo(!!errors.mensagem)}
              {...register('mensagem', {
                required: 'Escreva sua mensagem.',
                minLength: { value: 20, message: 'Conte um pouco mais: escreva pelo menos 20 caracteres.' },
                maxLength: { value: 1000, message: 'A mensagem pode ter no máximo 1000 caracteres.' },
              })}
            />
          </Campo>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-petroleo-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-petroleo-800 sm:w-auto"
          >
            <Send size={18} aria-hidden="true" /> Enviar mensagem
          </button>
        </form>

        <aside className="space-y-4">
          <h2 className="text-xl font-bold">Fale direto com a gente</h2>
          <ul className="space-y-3">
            {INTEGRANTES.map((integrante) => (
              <li key={integrante.rm} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="font-semibold">{integrante.nome}</p>
                <div className="mt-2 flex gap-4 text-sm">
                  <a href={integrante.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-tinta-700 hover:text-tinta-900 hover:underline">
                    <IconeGithub tamanho={16} /> GitHub
                  </a>
                  <a href={integrante.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[#0A66C2] hover:underline">
                    <IconeLinkedin tamanho={16} /> LinkedIn
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </Container>
    </>
  )
}
