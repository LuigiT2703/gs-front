import { Link } from 'react-router-dom'
import { LINKS_MENU } from '../data/navegacao'
import { Container } from './Container'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="mt-16 bg-petroleo-950 text-petroleo-100">
      <Container className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <Logo claro />
          <p className="mt-3 max-w-xs text-sm text-petroleo-200">
            Zeladoria colaborativa com fila de prioridade transparente. A rua do dia a dia, resolvida na ordem certa.
          </p>
        </div>
        <nav aria-label="Links do rodapé">
          <h2 className="text-sm font-semibold tracking-wider text-white uppercase">Navegue</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {LINKS_MENU.map((link) => (
              <li key={link.para}>
                <Link to={link.para} className="rounded hover:text-white hover:underline">
                  {link.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="text-sm">
          <h2 className="text-sm font-semibold tracking-wider text-white uppercase">Projeto acadêmico</h2>
          <p className="mt-3 text-petroleo-200">
            Global Solution 2026/2 · CitizenTech · FIAP. Grupo <strong className="text-white">INOVEX</strong>: Luigi, Cauã e
            Gabriel.
          </p>
          <p className="mt-2 text-petroleo-200">Objetivos de Desenvolvimento Sustentável 11 e 10.</p>
        </div>
      </Container>
      <div className="border-t border-white/10 py-4 text-center text-xs text-petroleo-200">
        © 2026 INOVEX · Feito por alunos de ADS da FIAP
      </div>
    </footer>
  )
}
