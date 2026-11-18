import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Contato } from './pages/Contato'
import { Faq } from './pages/Faq'
import { Home } from './pages/Home'
import { Integrantes } from './pages/Integrantes'
import { NaoEncontrada } from './pages/NaoEncontrada'
import { OcorrenciaDetalhe } from './pages/OcorrenciaDetalhe'
import { Ocorrencias } from './pages/Ocorrencias'
import { Painel } from './pages/Painel'
import { RegistrarOcorrencia } from './pages/RegistrarOcorrencia'
import { Sobre } from './pages/Sobre'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'ocorrencias', element: <Ocorrencias /> },
      { path: 'ocorrencias/nova', element: <RegistrarOcorrencia /> },
      { path: 'ocorrencias/:id', element: <OcorrenciaDetalhe /> },
      { path: 'painel', element: <Painel /> },
      { path: 'sobre', element: <Sobre /> },
      { path: 'integrantes', element: <Integrantes /> },
      { path: 'faq', element: <Faq /> },
      { path: 'contato', element: <Contato /> },
      { path: '*', element: <NaoEncontrada /> },
    ],
  },
])
