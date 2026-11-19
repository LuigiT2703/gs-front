import { TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

interface CampoProps {
  id: string
  rotulo: string
  obrigatorio?: boolean
  ajuda?: string
  erro?: string
  children: ReactNode
}
