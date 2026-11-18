/** Ilustração da Home: um mapa de bairro com pinos coloridos pela prioridade. Feita à mão em SVG. */
export function IlustracaoMapa() {
  return (
    <svg viewBox="0 0 360 280" className="h-auto w-full max-w-md" role="img" aria-label="Mapa de um bairro com problemas marcados por cores de prioridade">
      <rect width="360" height="280" rx="24" fill="#134E4A" />
      <g stroke="#0F766E" strokeWidth="14" strokeLinecap="round">
        <path d="M-10 90 H370" />
        <path d="M-10 200 H370" />
        <path d="M110 -10 V290" />
        <path d="M250 -10 V290" />
      </g>
      <g stroke="#CCFBF1" strokeWidth="2" strokeDasharray="8 8" opacity=".5">
        <path d="M0 90 H360" />
        <path d="M110 0 V280" />
      </g>
      <g fill="#115E59">
        <rect x="20" y="20" width="70" height="50" rx="8" />
        <rect x="130" y="20" width="100" height="50" rx="8" />
        <rect x="270" y="20" width="70" height="50" rx="8" />
        <rect x="20" y="112" width="70" height="66" rx="8" />
        <rect x="130" y="112" width="100" height="66" rx="8" />
        <rect x="270" y="112" width="70" height="66" rx="8" />
        <rect x="20" y="222" width="70" height="40" rx="8" />
        <rect x="130" y="222" width="100" height="40" rx="8" />
        <rect x="270" y="222" width="70" height="40" rx="8" />
      </g>
      <g fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700">
        <g transform="translate(96 46)">
          <path d="M14 0C6 0 0 6 0 13c0 10 14 25 14 25s14-15 14-25C28 6 22 0 14 0z" fill="#DC2626" />
          <circle cx="14" cy="13" r="5" fill="#FEE2E2" />
        </g>
        <g transform="translate(236 150)">
          <path d="M14 0C6 0 0 6 0 13c0 10 14 25 14 25s14-15 14-25C28 6 22 0 14 0z" fill="#F97316" />
          <circle cx="14" cy="13" r="5" fill="#FFEDD5" />
        </g>
        <g transform="translate(160 176)">
          <path d="M14 0C6 0 0 6 0 13c0 10 14 25 14 25s14-15 14-25C28 6 22 0 14 0z" fill="#EAB308" />
          <circle cx="14" cy="13" r="5" fill="#FEF9C3" />
        </g>
        <g transform="translate(300 66)">
          <path d="M14 0C6 0 0 6 0 13c0 10 14 25 14 25s14-15 14-25C28 6 22 0 14 0z" fill="#16A34A" />
          <circle cx="14" cy="13" r="5" fill="#DCFCE7" />
        </g>
        <g transform="translate(24 140)">
          <rect width="124" height="52" rx="10" fill="#FFFFFF" />
          <text x="12" y="20" fill="#0F172A">Buraco na via</text>
          <rect x="12" y="28" width="72" height="16" rx="8" fill="#FEE2E2" />
          <text x="20" y="40" fill="#991B1B" fontSize="10">URGENTE</text>
        </g>
      </g>
    </svg>
  )
}
