function formatearEnum(valor) {
  if (!valor) {
    return 'No informado';
  }

  return valor
    .toLowerCase()
    .split('_')
    .map(
      (palabra) =>
        palabra.charAt(0).toUpperCase() +
        palabra.slice(1),
    )
    .join(' ');
}

function formatearFecha(fecha) {
  if (!fecha) {
    return 'No informada';
  }

  const fechaFormateada = new Date(fecha);

  if (Number.isNaN(fechaFormateada.getTime())) {
    return 'No informada';
  }

  return fechaFormateada.toLocaleDateString(
    'es-AR',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    },
  );
}

export default function CartaDePaciente({
  paciente,
  onVerHistoria,
}) {
  const obraSocial = paciente.obraSocial;

  return (
    <article className="card border-0 shadow-sm h-100">
      <header className="card-header bg-primary text-white d-flex align-items-center gap-2 py-3">
        <i className="bi bi-person-fill fs-4" />

        <div>
          <h2 className="h6 mb-0 fw-semibold">
            {paciente.nombre}
          </h2>

          <small className="opacity-75">
            DNI: {paciente.dni}
          </small>
        </div>
      </header>

      <div className="card-body">
        <div className="d-flex flex-column gap-3">
          <div>
            <small className="text-muted d-block">
              Fecha de nacimiento
            </small>

            <span>
              {formatearFecha(
                paciente.fechaDeNacimiento,
              )}
            </span>
          </div>

          <div>
            <small className="text-muted d-block">
              Género
            </small>

            <span>
              {formatearEnum(paciente.genero)}
            </span>
          </div>

          <div>
            <small className="text-muted d-block">
              Teléfono
            </small>

            <span>
              {paciente.telefono || 'No informado'}
            </span>
          </div>

          <div>
            <small className="text-muted d-block">
              Teléfono de emergencia
            </small>

            <span>
              {paciente.telefonoDeEmergencia ||
                'No informado'}
            </span>
          </div>

          <div>
            <small className="text-muted d-block">
              Email
            </small>

            <span className="text-break">
              {paciente.email || 'No informado'}
            </span>
          </div>

          <div>
            <small className="text-muted d-block">
              Domicilio
            </small>

            <span>
              {paciente.domicilio || 'No informado'}
            </span>
          </div>

          <hr className="my-0" />

          <div>
            <small className="text-muted d-block">
              Obra social
            </small>

            <span className="fw-semibold">
              {obraSocial
                ? formatearEnum(obraSocial.nombre)
                : 'No informada'}
            </span>
          </div>

          {obraSocial &&
            obraSocial.nombre !==
              'SIN_COBERTURA' && (
              <>
                <div>
                  <small className="text-muted d-block">
                    Número de afiliado
                  </small>

                  <span>
                    {obraSocial.numeroDeAfiliado ||
                      'No informado'}
                  </span>
                </div>

                <div>
                  <small className="text-muted d-block">
                    Plan
                  </small>

                  <span>
                    {obraSocial.plan ||
                      'No informado'}
                  </span>
                </div>
              </>
            )}
        </div>
      </div>

      <footer className="card-footer bg-transparent border-0 pb-3 px-3">
        <button
          type="button"
          className="btn btn-outline-primary w-100 btn-sm"
          onClick={() =>
            onVerHistoria?.(paciente.dni)
          }
        >
          <i className="bi bi-folder2-open me-1" />
          Historia clínica
        </button>
      </footer>
    </article>
  );
}

