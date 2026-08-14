import GrillaHorarioMedico from '../agenda/GrillaHorarioMedico';

export default function VistaDetalleMedico({
  legajo,
  medicos,
  onVolver,
}) {
  const medico = medicos.find(
    (medico) =>
      medico.legajo === legajo,
  );

  if (!medico) {
    return (
      <div className="alert alert-danger">
        Médico no encontrado.
      </div>
    );
  }

  return (
    <section>
      <button
        type="button"
        className="btn btn-outline-secondary mb-4"
        onClick={onVolver}
      >
        <i className="bi bi-arrow-left me-2" />
        Volver a médicos
      </button>

      <header className="encabezado-vista mb-4">
        <div>
          <span className="etiqueta-vista">
            Profesional
          </span>

          <h1>
            Dr/a. {medico.nombre}
          </h1>

          <p>
            Matrícula {medico.matricula}
          </p>
        </div>
      </header>

      <ul
        className="nav nav-tabs mb-4"
        role="tablist"
      >
        <li className="nav-item">
          <button
            className="nav-link active"
            data-bs-toggle="tab"
            data-bs-target="#informacion-medico"
            type="button"
          >
            <i className="bi bi-person me-2" />
            Información
          </button>
        </li>

        <li className="nav-item">
          <button
            className="nav-link"
            data-bs-toggle="tab"
            data-bs-target="#horarios-medico"
            type="button"
          >
            <i className="bi bi-calendar-week me-2" />
            Horarios
          </button>
        </li>

        <li className="nav-item">
          <button
            className="nav-link"
            data-bs-toggle="tab"
            data-bs-target="#bloqueos-medico"
            type="button"
          >
            <i className="bi bi-calendar-x me-2" />
            Bloqueos
          </button>
        </li>
      </ul>

      <div className="tab-content">
        <div
          className="tab-pane fade show active"
          id="informacion-medico"
        >
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p>
                <strong>Nombre:</strong>{' '}
                {medico.nombre}
              </p>

              <p>
                <strong>Matrícula:</strong>{' '}
                {medico.matricula}
              </p>

              <p>
                <strong>Email:</strong>{' '}
                {medico.email ?? '-'}
              </p>

              <p>
                <strong>Teléfono:</strong>{' '}
                {medico.telefono ?? '-'}
              </p>

              <p className="mb-0">
                <strong>Domicilio:</strong>{' '}
                {medico.domicilio ?? '-'}
              </p>
            </div>
          </div>
        </div>

        <div
          className="tab-pane fade"
          id="horarios-medico"
        >
          <GrillaHorarioMedico
            legajoMedico={medico.legajo}
          />
        </div>

        <div
          className="tab-pane fade"
          id="bloqueos-medico"
        >
          <div className="alert alert-light border">
            Gestión de bloqueos próximamente.
          </div>
        </div>
      </div>
    </section>
  );
}