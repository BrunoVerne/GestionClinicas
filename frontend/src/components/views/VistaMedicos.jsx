import CartaDeMedico from '../cards/CartaDeMedico';
import FormularioMedico from '../Docs/forms/FormularioMedico';

export default function VistaMedicos({
  medicos,
  mostrandoFormularioMedico,
  onMostrarFormularioMedico,
  onCancelarFormularioMedico,
  onMedicoCreado,
}) {
  return (
    <section>
      <header className="encabezado-vista">
        <div>
          <span className="etiqueta-vista">
            Profesionales
          </span>

          <h1>Médicos del sistema</h1>

          <p>
            Consultá los profesionales registrados y sus
            respectivas especialidades.
          </p>
        </div>

        {!mostrandoFormularioMedico && (
          <button
            type="button"
            className="btn btn-success"
            onClick={onMostrarFormularioMedico}
          >
            <i className="bi bi-person-plus me-2" />
            Nuevo médico
          </button>
        )}
      </header>

      {mostrandoFormularioMedico && (
        <div className="mb-4">
          <FormularioMedico
            onMedicoCreado={onMedicoCreado}
            onCancelar={onCancelarFormularioMedico}
          />
        </div>
      )}

      {medicos.length === 0 ? (
        <div className="estado-vacio">
          <i className="bi bi-person-x" />

          <h2>No hay médicos registrados</h2>

          <p>
            Los médicos registrados aparecerán en esta
            sección.
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {medicos.map((medico) => (
            <div
              className="col-12 col-md-6 col-xl-4"
              key={medico.legajo}
            >
              <CartaDeMedico medico={medico} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}