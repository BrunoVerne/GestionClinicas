export default function FiltrosTurnos({
  ordenFecha,
  onOrdenFechaChange,

  especialidad,
  onEspecialidadChange,
  especialidades,

  medico,
  onMedicoChange,
  medicos,

  estado,
  onEstadoChange,

  onLimpiar,
}) {
  return (
    <div className="filtros-turnos mb-4">
      <div className="row g-3">
        <div className="col-12 col-md-6 col-xl-3">
          <label className="form-label">
            Fecha
          </label>

          <select
            className="form-select"
            value={ordenFecha}
            onChange={(evento) =>
              onOrdenFechaChange(
                evento.target.value,
              )
            }
          >
            <option value="asc">
              ascendente
            </option>

            <option value="desc">
              descendente
            </option>
          </select>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <label className="form-label">
            Especialidad
          </label>

          <select
            className="form-select"
            value={especialidad}
            onChange={(evento) =>
              onEspecialidadChange(
                evento.target.value,
              )
            }
          >
            <option value="">
              Todas
            </option>

            {especialidades.map(
              (especialidad) => (
                <option
                  key={especialidad}
                  value={especialidad}
                >
                  {formatearEspecialidad(
                    especialidad,
                  )}
                </option>
              ),
            )}
          </select>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <label className="form-label">
            Médico
          </label>

          <select
            className="form-select"
            value={medico}
            onChange={(evento) =>
              onMedicoChange(
                evento.target.value,
              )
            }
          >
            <option value="">
              Todos
            </option>

            {medicos.map((medico) => (
              <option
                key={medico.legajo}
                value={medico.legajo}
              >
                {medico.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <label className="form-label">
            Estado
          </label>

          <select
            className="form-select"
            value={estado}
            onChange={(evento) =>
              onEstadoChange(
                evento.target.value,
              )
            }
          >
            <option value="">
              Todos
            </option>

            <option value="PENDIENTE">
              Pendiente
            </option>

            <option value="CONFIRMADO">
              Confirmado
            </option>

            <option value="ATENDIDO">
              Atendido
            </option>

            <option value="CANCELADO">
              Cancelado
            </option>

            <option value="AUSENTE">
              Ausente
            </option>
          </select>
        </div>

        <div className="col-12 d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={onLimpiar}
          >
            <i className="bi bi-arrow-counterclockwise me-2" />
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
}

function formatearEspecialidad(
  especialidad,
) {
  return especialidad
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (letra) =>
      letra.toUpperCase(),
    );
}