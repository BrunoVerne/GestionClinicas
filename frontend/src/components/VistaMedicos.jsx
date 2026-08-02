import CartaDeMedico from './CartaDeMedico';

export default function VistaMedicos({ medicos }) {
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

        
      </header>

      {medicos.length === 0 ? (
        <div className="estado-vacio">
          <i className="bi bi-person-x" />

          <h2>No hay médicos registrados</h2>

          <p>
            Los médicos registrados aparecerán en esta sección.
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