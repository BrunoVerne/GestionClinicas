import FormularioMedico from '../docs/forms/FormularioMedico';

export default function VistaCrearMedico({
  onMedicoCreado,
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
        Volver a médicos
      </button>

      <FormularioMedico
        onMedicoCreado={onMedicoCreado}
        onCancelar={onVolver}
      />
    </section>
  );
}