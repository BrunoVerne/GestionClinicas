import { useMemo, useState } from 'react';

import CartaDePaciente from '../cards/CartaDePaciente';
import FormularioPaciente from '../Docs/forms/FormularioPaciente';
import Buscador from '../panel/Buscador';

export default function VistaPacientes({
  pacientes,
  mostrandoFormularioPaciente,
  onMostrarFormularioPaciente,
  onCancelarFormularioPaciente,
  onPacienteCreado,
  onVerHistoria,
}) {
  const [busqueda, setBusqueda] = useState('');

  const pacientesFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    if (!termino) {
      return pacientes;
    }

    return pacientes.filter((paciente) => {
      const nombre =
        paciente.nombre?.toLowerCase() ?? '';

      const dni = String(paciente.dni ?? '');

      const email =
        paciente.email?.toLowerCase() ?? '';

      return (
        nombre.includes(termino) ||
        dni.includes(termino) ||
        email.includes(termino)
      );
    });
  }, [pacientes, busqueda]);

  return (
    <section>
      <header className="encabezado-vista">
        <div>
          <span className="etiqueta-vista">
            Gestión de pacientes
          </span>

          <h1>Pacientes registrados</h1>

          <p>
            Consultá la información general y la historia
            clínica de cada paciente.
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
        <div className="mb-4">
          <FormularioPaciente
            onPacienteCreado={onPacienteCreado}
            onCancelar={onCancelarFormularioPaciente}
          />
        </div>
      )}

      {pacientes.length > 0 && (
        <div className="mb-4">
          <Buscador
            valor={busqueda}
            onChange={setBusqueda}
            placeholder="Buscar por nombre, DNI o email"
            cantidadResultados={
              pacientesFiltrados.length
            }
          />
        </div>
      )}

      {pacientes.length === 0 ? (
        <div className="estado-vacio">
          <i className="bi bi-person-x" />

          <h2>No hay pacientes registrados</h2>

          <p>
            Los pacientes registrados aparecerán en esta
            sección.
          </p>
        </div>
      ) : pacientesFiltrados.length === 0 ? (
        <div className="estado-vacio">
          <i className="bi bi-search" />

          <h2>No se encontraron pacientes</h2>

          <p>
            No hay coincidencias para “{busqueda}”.
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {pacientesFiltrados.map((paciente) => (
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