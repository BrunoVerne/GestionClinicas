// ConsultaItem.jsx
export default function ConsultaItem({ consulta }) {
  const fecha = new Date(consulta.fecha).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'long', year: 'numeric'
  })

  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 className="fw-semibold mb-0">
              <i className="bi bi-calendar2-check text-primary me-2" />
              {consulta.motivo}
            </h6>
            <small className="text-muted">Consulta #{consulta.numeroConsulta}</small>
          </div>
          <span className="badge bg-primary-subtle text-primary">{fecha}</span>
        </div>

        <div className="mb-2">
          <span className="text-muted small fw-semibold text-uppercase">Diagnóstico</span>
          <p className="mb-1">{consulta.diagnostico}</p>
        </div>

        {consulta.observaciones && (
          <div className="bg-light rounded p-2">
            <span className="text-muted small fw-semibold text-uppercase">Observaciones</span>
            <p className="mb-0 small">{consulta.observaciones}</p>
          </div>
        )}

        <div className="mt-2 pt-2 border-top d-flex align-items-center gap-1">
          <i className="bi bi-person-badge text-success" />
          <small className="text-muted">
            Dr/a. {consulta.medico?.nombre} — Legajo #{consulta.legajoMedico}
          </small>
        </div>
      </div>
    </div>
  )
}