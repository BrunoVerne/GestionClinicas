// MedicoCard.jsx
const ESPECIALIDAD_LABELS = {
  CLINICA_MEDICA: 'Clínica Médica',
  CARDIOLOGIA: 'Cardiología',
  DERMATOLOGIA: 'Dermatología',
  NEUROLOGIA: 'Neurología',
  PEDIATRIA: 'Pediatría',
  GINECOLOGIA: 'Ginecología',
  TRAUMATOLOGIA: 'Traumatología',
  OFTALMOLOGIA: 'Oftalmología',
  PSIQUIATRIA: 'Psiquiatría',
  OTRA: 'Otra',
}

const ESPECIALIDAD_ICONS = {
  CLINICA_MEDICA: 'bi-heart-pulse',
  CARDIOLOGIA: 'bi-heart',
  DERMATOLOGIA: 'bi-person',
  NEUROLOGIA: 'bi-cpu',
  PEDIATRIA: 'bi-balloon',
  GINECOLOGIA: 'bi-gender-female',
  TRAUMATOLOGIA: 'bi-bandaid',
  OFTALMOLOGIA: 'bi-eye',
  PSIQUIATRIA: 'bi-brain',
  OTRA: 'bi-hospital',
}

export default function MedicoCard({ medico }) {
  const icon = ESPECIALIDAD_ICONS[medico.especialidad] || 'bi-hospital'
  const label = ESPECIALIDAD_LABELS[medico.especialidad] || medico.especialidad

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-success text-white d-flex align-items-center gap-2 py-3">
        <i className={`bi ${icon} fs-4`} />
        <div>
          <h6 className="mb-0 fw-semibold">Dr/a. {medico.nombre}</h6>
          <small className="opacity-75">Legajo #{medico.legajo}</small>
        </div>
      </div>
      <div className="card-body d-flex align-items-center justify-content-center">
        <span className="badge bg-success-subtle text-success fs-6 px-3 py-2">
          <i className={`bi ${icon} me-2`} />
          {label}
        </span>
      </div>
    </div>
  )
}