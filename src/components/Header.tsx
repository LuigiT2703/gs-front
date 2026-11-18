import { Menu, Plus, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { LINKS_MENU } from '../data/navegacao'
import { Container } from './Container'
import { Logo } from './Logo'
import { MenuMobile } from './MenuMobile'

export function Header() {
  const { pathname } = useLocation()
  // Guarda em qual página o menu foi aberto: se a rota muda, ele fecha sozinho.
  const [abertoEm, setAbertoEm] = useState<string | null>(null)
  const menuAberto = abertoEm === pathname
  const fecharMenu = useCallback(() => setAbertoEm(null), [])

  return (
    <header className="sticky top-0 z-40 bg-petroleo-800 shadow-md shadow-petroleo-950/10">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-ambar-500 focus:px-4 focus:py-2 focus:font-semibold focus:text-tinta-900"
      >
        Pular para o conteúdo
      </a>
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link to="/" aria-label="ZelaCidade, página inicial" className="rounded-md">
          <Logo claro />
        </Link>

        <nav aria-label="Menu principal" className="hidden items-center gap-1 lg:flex">
          {LINKS_MENU.map((link) => (
            <NavLink
              key={link.para}
              to={link.para}
              end={link.para === '/'}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-white/15 text-white' : 'text-petroleo-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {link.rotulo}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/ocorrencias/nova"
            className="hidden items-center gap-2 rounded-lg bg-ambar-500 px-4 py-2 text-sm font-semibold text-tinta-900 transition-colors hover:bg-ambar-400 sm:inline-flex"
          >
            <Plus size={18} aria-hidden="true" /> Relatar problema
          </Link>
          <button
            type="button"
            onClick={() => setAbertoEm(menuAberto ? null : pathname)}
            aria-expanded={menuAberto}
            aria-controls="menu-mobile"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            className="inline-flex size-11 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            {menuAberto ? <X size={26} aria-hidden="true" /> : <Menu size={26} aria-hidden="true" />}
          </button>
        </div>
      </Container>
      <MenuMobile id="menu-mobile" aberto={menuAberto} onFechar={fecharMenu} />
    </header>
  )
}
