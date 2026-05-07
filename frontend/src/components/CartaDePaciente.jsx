// PacienteCard.jsx
export default function PacienteCard({ paciente, onVerHistoria }) {
  const imc = (paciente.peso / (paciente.altura * paciente.altura)).toFixed(1)

  const imcEstado = () => {
    if (imc < 18.5) return { label: 'Bajo peso', color: 'text-warning' }
    if (imc < 25) return { label: 'Normal', color: 'text-success' }
    if (imc < 30) return { label: 'Sobrepeso', color: 'text-warning' }
    return { label: 'Obesidad', color: 'text-danger' }
  }

  const { label, color } = imcEstado()

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-primary text-white d-flex align-items-center gap-2 py-3">
        <i className="bi bi-person-fill fs-4" />
        <div>
          <h6 className="mb-0 fw-semibold">{paciente.nombre}</h6>
          <small className="opacity-75">DNI: {paciente.dni}</small>
        </div>
      </div>
      <div className="card-body">
        <div className="row g-2 mb-3">
          <div className="col-6">
            <div className="bg-light rounded p-2 text-center">
              <div className="text-muted small">Peso</div>
              <div className="fw-bold">{paciente.peso} kg</div>
            </div>
          </div>
          <div className="col-6">
            <div className="bg-light rounded p-2 text-center">
              <div className="text-muted small">Altura</div>
              <div className="fw-bold">{paciente.altura} m</div>
            </div>
          </div>
        </div>
        <div className="bg-light rounded p-2 text-center mb-3">
          <div className="text-muted small">IMC</div>
          <div className={`fw-bold ${color}`}>{imc} — {label}</div>
        </div>
      </div>
      <div className="card-footer bg-transparent border-0 pb-3 px-3">
        <button
          className="btn btn-outline-primary w-100 btn-sm"
          onClick={() => onVerHistoria?.(paciente.dni)}
        >
          <i className="bi bi-folder2-open me-1" />
          Ver Historia Clínica
        </button>
      </div>
    </div>
  )
}