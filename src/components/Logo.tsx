interface LogoProps {
  /** true quando o logo fica sobre fundo escuro (header e rodapé). */
  claro?: boolean
  tamanho?: number
}

/** Logo do ZelaCidade desenhado em SVG: um pino de mapa com um "check". */
export function Logo({ claro = false, tamanho = 32 }: LogoProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg width={tamanho} height={tamanho} viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
        <rect width="32" height="32" rx="8" fill={claro ? '#F0FDFA' : '#115E59'} />
        <path d="M16 5c-4.4 0-8 3.3-8 7.6C8 18.4 16 27 16 27s8-8.6 8-14.4C24 8.3 20.4 5 16 5z" fill="#F59E0B" />
        <path
          d="M12.4 12.6l2.4 2.4 4.8-4.8"
          stroke="#0F172A"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={`font-titulo text-xl font-bold tracking-tight ${claro ? 'text-white' : 'text-petroleo-800'}`}>
        Zela<span className={claro ? 'text-ambar-400' : 'text-petroleo-600'}>Cidade</span>
      </span>
    </span>
  )
}
