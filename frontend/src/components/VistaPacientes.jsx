import CartaDePaciente from './CartaDePaciente';

export default function VistaPacientes({
  pacientes,
  onVerHistoria,
  onVerCondicionFisica,
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
            Consultá la información general, historia clínica y
            condición física de cada paciente.
          </p>
        </div>

        <div className="contador-registros">
          <i className="bi bi-people" />
          <span>{pacientes.length}</span>
        </div>
      </header>

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
                onVerCondicionFisica={onVerCondicionFisica}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}