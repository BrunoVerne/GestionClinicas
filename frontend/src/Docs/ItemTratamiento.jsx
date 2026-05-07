// TratamientoItem.jsx
export default function TratamientoItem({ tratamiento }) {
  const fechaInicio = new Date(tratamiento.fechaInicio).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'long', year: 'numeric'
  })

  return (
    <div className={`card border-0 shadow-sm mb-3 border-start border-4 ${tratamiento.activo ? 'border-success' : 'border-secondary'}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="fw-semibold mb-0">
            <i className="bi bi-capsule text-success me-2" />
            Tratamiento #{tratamiento.numeroTratamiento}
          </h6>
          <span className={`badge ${tratamiento.activo ? 'bg-success' : 'bg-secondary'}`}>
            {tratamiento.activo ? 'Activo' : 'Finalizado'}
          </span>
        </div>

        <p className="mb-2">{tratamiento.descripcion}</p>

        <div className="d-flex align-items-center gap-3 text-muted small">
          <span>
            <i className="bi bi-calendar-event me-1" />
            Inicio: {fechaInicio}
          </span>
          <span>
            <i className="bi bi-person-badge me-1" />
            Dr/a. {tratamiento.medico?.nombre}
          </span>
        </div>
      </div>
    </div>
  )
}