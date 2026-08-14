import FormularioTurno from '../Docs/forms/FormularioTurno';

export default function VistaCrearTurno({
  pacientes,
  onTurnoCreado,
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
        Volver a turnos
      </button>

      <FormularioTurno
        pacientes={pacientes}
        onTurnoCreado={onTurnoCreado}
        onCancelar={onVolver}
      />
    </section>
  );
}