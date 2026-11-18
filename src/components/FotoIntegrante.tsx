import { useState } from 'react'

interface FotoIntegranteProps {
  nome: string
  foto: string
}

/** Foto real do integrante. Enquanto o arquivo não existir em /public, mostra as iniciais (sem imagem genérica). */
export function FotoIntegrante({ nome, foto }: FotoIntegranteProps) {
  const [semFoto, setSemFoto] = useState(false)
  const partes = nome.split(' ')
  const iniciais = `${partes[0]?.[0] ?? ''}${partes[partes.length - 1]?.[0] ?? ''}`

  if (semFoto) {
    return (
      <div
        role="img"
        aria-label={`Iniciais de ${nome}`}
        className="flex size-28 items-center justify-center rounded-full bg-petroleo-800 font-titulo text-3xl font-bold text-ambar-400 ring-4 ring-petroleo-100"
      >
        {iniciais}
      </div>
    )
  }

  return (
    <img
      src={foto}
      alt={`Foto de ${nome}`}
      onError={() => setSemFoto(true)}
      className="size-28 rounded-full object-cover ring-4 ring-petroleo-100"
      loading="lazy"
    />
  )
}
