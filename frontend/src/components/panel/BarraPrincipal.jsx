import '../../styles/panel/barraPrincipal.css';

export default function BarraPrincipal({
  usuario,
  vista,
  onMostrarPacientes,
  onMostrarMedicos,
  onMostrarTurnos,
  onLogout,
}) {
  const pacientesActivo = [
    'pacientes',
    'historia',
  ].includes(vista);

  return (
    <nav className="barra-principal">
      <button
        type="button"
        className="barra-principal__marca"
        onClick={onMostrarPacientes}
      >
        <span className="barra-principal__marca-icono">
          <i className="bi bi-hospital" />
        </span>

        <span className="barra-principal__marca-texto">
          Gestión Clínica
        </span>
      </button>

      <div className="barra-principal__acciones">
        <div className="barra-principal__usuario">
          <div className="barra-principal__avatar">
            <i className="bi bi-person-fill" />
          </div>

          <div className="barra-principal__usuario-informacion">
            <span className="barra-principal__usuario-nombre">
              {usuario.nombreUsuario}
            </span>

            <span className="barra-principal__usuario-rol">
              {usuario.rol}
            </span>
          </div>
        </div>

        <div className="barra-principal__navegacion">
          <button
            type="button"
            className={`barra-principal__boton ${
              pacientesActivo
                ? 'barra-principal__boton--activo'
                : ''
            }`}
            onClick={onMostrarPacientes}
          >
            <i className="bi bi-people" />
            <span>Pacientes</span>
          </button>

          <button
            type="button"
            className={`barra-principal__boton ${
              vista === 'medicos'
                ? 'barra-principal__boton--activo'
                : ''
            }`}
            onClick={onMostrarMedicos}
          >
            <i className="bi bi-person-badge" />
            <span>Médicos</span>
          </button>

          <button
            type="button"
            className={`barra-principal__boton ${
              vista === 'turnos'
                ? 'barra-principal__boton--activo'
                : ''
            }`}
            onClick={onMostrarTurnos}
          >
            <i className="bi bi-calendar3" />
            <span>Turnos</span>
          </button>
        </div>

        <button
          type="button"
          className="barra-principal__salir"
          onClick={onLogout}
        >
          <i className="bi bi-box-arrow-right" />
          <span>Salir</span>
        </button>
      </div>
    </nav>
  );
}