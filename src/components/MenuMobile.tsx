import { Plus } from 'lucide-react'
import { useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { LINKS_MENU } from '../data/navegacao'

interface MenuMobileProps {
  id: string
  aberto: boolean
  onFechar: () => void
}

/** Menu do celular e tablet. Abre pelo botão hambúrguer do Header e fecha com Esc ou ao escolher um link. */
export function MenuMobile({ id, aberto, onFechar }: MenuMobileProps) {
  useEffect(() => {
    if (!aberto) return
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === 'Escape') onFechar()
    }
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [aberto, onFechar])

  return (
    <div
      id={id}
      className={`overflow-hidden border-t border-petroleo-700 bg-petroleo-800 transition-[max-height] duration-300 lg:hidden ${
        aberto ? 'max-h-[34rem]' : 'max-h-0 border-t-0'
      }`}
      hidden={!aberto}
    >
      <nav aria-label="Menu principal (celular)" className="flex flex-col gap-1 px-4 py-4">
        {LINKS_MENU.map((link) => (
          <NavLink
            key={link.para}
            to={link.para}
            end={link.para === '/'}
            onClick={onFechar}
            className={({ isActive }) =>
              `rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                isActive ? 'bg-white/15 text-white' : 'text-petroleo-100 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {link.rotulo}
          </NavLink>
        ))}
        <Link
          to="/ocorrencias/nova"
          onClick={onFechar}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-ambar-500 px-4 py-3 font-semibold text-tinta-900 transition-colors hover:bg-ambar-400"
        >
          <Plus size={18} aria-hidden="true" /> Relatar um problema
        </Link>
      </nav>
    </div>
  )
}
