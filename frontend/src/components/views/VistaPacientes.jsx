import CartaDePaciente from '../cards/CartaDePaciente';
import FormularioPaciente from '../Docs/forms/FormularioPaciente';

export default function VistaPacientes({
  pacientes,
  mostrandoFormularioPaciente,
  onMostrarFormularioPaciente,
  onCancelarFormularioPaciente,
  onPacienteCreado,
  onVerHistoria,
}) {
  return (
    <section>
      <header className="encabezado-vista">
        <div>
          <span className="etiqueta-vista">
            Gestión de pacientes
          </span>

          <h1>Pacientes registrados</h1>

          <p>
            Consultá la información general, y la historia clínica de cada paciente.
          </p>
        </div>

        {!mostrandoFormularioPaciente && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={onMostrarFormularioPaciente}
          >
            <i className="bi bi-person-plus me-1" />
            Nuevo paciente
          </button>
        )}
      </header>

      {mostrandoFormularioPaciente && (
        <FormularioPaciente
          onPacienteCreado={onPacienteCreado}
          onCancelar={onCancelarFormularioPaciente}
        />
      )}

      {pacientes.length === 0 ? (
        <div className="estado-vacio">
          <i className="bi bi-person-x" />

          <h2>No hay pacientes registrados</h2>

          <p>
            Los pacientes registrados aparecerán en esta sección.
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {pacientes.map((paciente) => (
            <div
              className="col-12 col-md-6 col-xl-4"
              key={paciente.dni}
            >
              <CartaDePaciente
                paciente={paciente}
                onVerHistoria={onVerHistoria}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

