import CondicionFisicaPaciente from './CondicionFisicaPaciente';

export default function VistaCondicionFisica({
  paciente,
  onVolver,
  onPacienteActualizado,
}) {
  if (!paciente) {
    return (
      <div className="alert alert-warning">
        No se seleccionó ningún paciente.
      </div>
    );
  }

  return (
    <section>
      <button
        type="button"
        className="boton-volver"
        onClick={onVolver}
      >
        <i className="bi bi-arrow-left" />
        Volver a pacientes
      </button>

      <CondicionFisicaPaciente
        paciente={paciente}
        onPacienteActualizado={onPacienteActualizado}
      />
    </section>
  );
}