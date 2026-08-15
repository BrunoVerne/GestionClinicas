import { useMemo, useState } from 'react';

import CartaDeMedico from '../cards/CartaDeMedico';
import Buscador from '../panel/Buscador';

export default function VistaMedicos({
  medicos,
  onNuevoMedico,
  onVerMedico
}) {
  const [busqueda, setBusqueda] = useState('');

 

  const medicosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    if (!termino) {
      return medicos;
    }

    return medicos.filter((medico) => {
      const nombre =
        medico.nombre?.toLowerCase() ?? '';

      const legajo = String(
        medico.legajo ?? '',
      );

      const matricula =
        medico.matricula?.toLowerCase() ?? '';

      const email =
        medico.email?.toLowerCase() ?? '';

      return (
        nombre.includes(termino) ||
        legajo.includes(termino) ||
        matricula.includes(termino) ||
        email.includes(termino)
      );
    });
  }, [medicos, busqueda]);

  return (
    <section>
      <header className="encabezado-vista">


        <div>
          <span className="etiqueta-vista">
            Médicos
          </span>

          <h1>Médicos registrados</h1>

          
        </div>

        <button
            type="button"
            className="btn btn-success"
            onClick={onNuevoMedico}
          >
            <i className="bi bi-person-plus me-2" />
            Nuevo médico
        </button>
      </header>

      

      {medicos.length > 0 && (
        <div className="mb-4">
          <Buscador
            valor={busqueda}
            onChange={setBusqueda}
            placeholder="Buscar por nombre, legajo, matrícula o email"
            cantidadResultados={medicosFiltrados.length}
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
      ) : medicosFiltrados.length === 0 ? (
        <div className="estado-vacio">
          <i className="bi bi-search" />

          <h2>No se encontraron médicos</h2>

          <p>
            No hay coincidencias para “{busqueda}”.
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {medicosFiltrados.map((medico) => (
            <div
              className="col-12 col-md-6 col-xl-4"
              key={medico.legajo}
            >
              <CartaDeMedico
                medico={medico}
                onVerMedico={() =>
                  onVerMedico(medico.legajo)
                }
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}