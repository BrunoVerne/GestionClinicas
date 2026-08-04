import HistoriaClinica from '../cards/HistoriaClinica';

export default function VistaHistoriaClinica({
  dni,
  medicos,
  onVolver,
}) {
  if (!dni) {
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

      <HistoriaClinica
        dni={dni}
        medicos={medicos}
      />
    </section>
  );
}