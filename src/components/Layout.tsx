import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

/** Estrutura comum de todas as páginas: cabeçalho, conteúdo e rodapé. */
export function Layout() {
  const { pathname } = useLocation()

  // Volta ao topo ao trocar de página.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="flex min-h-svh flex-col overflow-x-clip">
      <Header />
      <main id="conteudo" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
