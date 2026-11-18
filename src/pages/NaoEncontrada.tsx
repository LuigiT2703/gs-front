import { Link } from 'react-router-dom'
import { Container } from '../components/Container'
import { IlustracaoVazia } from '../components/IlustracaoVazia'

export function NaoEncontrada() {
  return (
    <Container className="flex flex-col items-center py-20 text-center">
      <IlustracaoVazia />
      <p className="mt-6 font-titulo text-6xl font-bold text-petroleo-800">404</p>
      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Essa rua não existe no nosso mapa</h1>
      <p className="mt-3 max-w-md text-tinta-600">O endereço pode estar digitado errado ou a página mudou de lugar.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/" className="rounded-xl bg-petroleo-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-petroleo-800">
          Voltar ao início
        </Link>
        <Link to="/ocorrencias" className="rounded-xl border-2 border-petroleo-700 px-6 py-3 font-semibold text-petroleo-800 transition-colors hover:bg-petroleo-50">
          Ver a fila de ocorrências
        </Link>
      </div>
    </Container>
  )
}
