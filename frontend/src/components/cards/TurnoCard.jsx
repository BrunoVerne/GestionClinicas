export default function TurnoCard({
  turno,
  onCancelar,
}) {
  const fechaInicio = formatearFecha(
    turno.fechaInicio,
  );

  const horaInicio = formatearHora(
    turno.fechaInicio,
  );

  const horaFin = formatearHora(
    turno.fechaFin,
  );

  const LIMITE_CANCELACION_MS =
    60 * 60 * 1000;

  const fechaLimiteCancelacion =
    new Date(
      new Date(turno.fechaFin).getTime() +
        LIMITE_CANCELACION_MS,
    );

  const puedeCancelar =
    new Date() < fechaLimiteCancelacion &&
    !['CANCELADO', 'ATENDIDO'].includes(
      turno.estado,
    );

  return (
    <article
      className={`turno-card turno-card--${turno.estado.toLowerCase()}`}
    >
      <div className="turno-card__fecha">
        <span className="turno-card__dia">
          {fechaInicio}
        </span>

        <strong className="turno-card__hora">
          {horaInicio} – {horaFin}
        </strong>
      </div>

      <div className="turno-card__contenido">
        <div className="turno-card__principal">
          <div>
            <span className="turno-card__etiqueta">
              Paciente
            </span>

            <h2 className="turno-card__paciente">
              {turno.paciente?.nombre ??
                `DNI ${turno.dniPaciente}`}
            </h2>
          </div>

          <EstadoTurno
            estado={turno.estado}
          />
        </div>

        <div className="turno-card__datos">
          <DatoTurno
            icono="bi-person-badge"
            etiqueta="Médico"
            valor={
              turno.medico?.nombre ??
              `Legajo ${turno.legajoMedico}`
            }
          />

          <DatoTurno
            icono="bi-heart-pulse"
            etiqueta="Especialidad"
            valor={formatearEspecialidad(
              turno.especialidad,
            )}
          />

          {turno.motivo && (
            <DatoTurno
              icono="bi-chat-left-text"
              etiqueta="Motivo"
              valor={turno.motivo}
            />
          )}
        </div>

        {turno.observaciones && (
          <div className="turno-card__observaciones">
            {turno.observaciones}
          </div>
        )}

        {puedeCancelar && (
          <div className="turno-card__acciones">
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() =>
                onCancelar(
                  turno.numeroTurno,
                )
              }
            >
              <i className="bi bi-x-circle me-1" />
              Cancelar turno
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function DatoTurno({
  icono,
  etiqueta,
  valor,
}) {
  return (
    <div className="turno-card__dato">
      <i className={`bi ${icono}`} />

      <div>
        <span>{etiqueta}</span>
        <strong>{valor}</strong>
      </div>
    </div>
  );
}

function EstadoTurno({ estado }) {
  return (
    <span
      className={`turno-card__estado turno-card__estado--${estado.toLowerCase()}`}
    >
      {formatearEstado(estado)}
    </span>
  );
}

function formatearFecha(fecha) {
  return new Intl.DateTimeFormat(
    'es-AR',
    {
      timeZone:
        'America/Argentina/Buenos_Aires',
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  ).format(new Date(fecha));
}

function formatearHora(fecha) {
  return new Intl.DateTimeFormat(
    'es-AR',
    {
      timeZone:
        'America/Argentina/Buenos_Aires',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    },
  ).format(new Date(fecha));
}

function formatearEspecialidad(
  especialidad,
) {
  if (!especialidad) {
    return '-';
  }

  return especialidad
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (letra) =>
      letra.toUpperCase(),
    );
}

function formatearEstado(estado) {
  const estados = {
    PENDIENTE: 'Pendiente',
    CONFIRMADO: 'Confirmado',
    ATENDIDO: 'Atendido',
    CANCELADO: 'Cancelado',
    AUSENTE: 'Ausente',
  };

  return estados[estado] ?? estado;
}