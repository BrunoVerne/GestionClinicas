export default function BarraPrincipal({
  usuario,
  vista,
  onMostrarPacientes,
  onMostrarMedicos,
  onLogout,
}) {
  const pacientesActivo = [
    'pacientes',
    'historia',
    'condicion',
  ].includes(vista);

  return (
    <nav className="barra-principal">
      <button
        type="button"
        className="marca-clinica"
        onClick={onMostrarPacientes}
      >
        <i className="bi bi-hospital" />
        <span>Gestión Clínica</span>
      </button>

      <div className="barra-acciones">
        <div className="usuario-panel">
          <div className="usuario-avatar">
            <i className="bi bi-person-fill" />
          </div>

          <div className="usuario-informacion">
            <span className="usuario-nombre">
              {usuario.nombreUsuario}
            </span>

            <span className="usuario-rol">
              {usuario.rol}
            </span>
          </div>
        </div>

        <button
          type="button"
          className={
            pacientesActivo
              ? 'boton-navegacion activo'
              : 'boton-navegacion'
          }
          onClick={onMostrarPacientes}
        >
          <i className="bi bi-people" />
          <span>Pacientes</span>
        </button>

        <button
          type="button"
          className={
            vista === 'medicos'
              ? 'boton-navegacion activo'
              : 'boton-navegacion'
          }
          onClick={onMostrarMedicos}
        >
          <i className="bi bi-person-badge" />
          <span>Médicos</span>
        </button>

        <button
          type="button"
          className="boton-salir"
          onClick={onLogout}
        >
          <i className="bi bi-box-arrow-right" />
          <span>Salir</span>
        </button>
      </div>
    </nav>
  );
}