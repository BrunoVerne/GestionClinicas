// AntecedenteItem.jsx
const TIPO_CONFIG = {
  ALERGIAS:         { label: 'Alergia',            color: 'danger',  icon: 'bi-exclamation-triangle' },
  ENFERMEDAD_CRONICA: { label: 'Enfermedad Crónica', color: 'warning', icon: 'bi-heart-pulse' },
  CIRUGIA:          { label: 'Cirugía',             color: 'info',    icon: 'bi-scissors' },
  MEDICACION:       { label: 'Medicación',          color: 'primary', icon: 'bi-capsule' },
  FAMILIAR:         { label: 'Familiar',            color: 'secondary', icon: 'bi-people' },
  OTRO:             { label: 'Otro',                color: 'dark',    icon: 'bi-three-dots' },
}

export default function AntecedenteItem({ antecedente }) {
  const config = TIPO_CONFIG[antecedente.tipo] || TIPO_CONFIG.OTRO

  return (
    <div className="card border-0 shadow-sm mb-2">
      <div className="card-body d-flex align-items-start gap-3">
        <span className={`badge bg-${config.color} p-2 fs-6`}>
          <i className={`bi ${config.icon}`} />
        </span>
        <div>
          <span className={`badge bg-${config.color}-subtle text-${config.color} mb-1`}>
            {config.label}
          </span>
          <p className="mb-0 text-body">{antecedente.descripcion}</p>
        </div>
      </div>
    </div>
  )
}