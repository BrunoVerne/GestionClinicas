import FormularioPaciente from '../docs/forms/FormularioPaciente';

export default function VistaCrearPaciente({
  onPacienteCreado,
  onVolver,
}) {
  return (
    <section>
      <button
        type="button"
        className="btn btn-outline-secondary mb-4"
        onClick={onVolver}
      >
        <i className="bi bi-arrow-left me-2" />
        Volver a pacientes
      </button>

      <FormularioPaciente
        onPacienteCreado={onPacienteCreado}
        onCancelar={onVolver}
      />
    </section>
  );
}