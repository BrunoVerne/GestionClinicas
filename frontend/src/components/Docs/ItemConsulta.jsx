import { useState } from 'react';

import { eliminarConsulta } from '../../services/consultaService';

import '../../styles/itemConsulta.css';

export default function ItemConsulta({
  consulta,
  onConsultaEliminada,
}) {
  const [mostrandoConfirmacion, setMostrandoConfirmacion] =
    useState(false);

  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState('');

  const fecha = new Date(consulta.fecha).toLocaleDateString(
    'es-AR',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    },
  );

  const nombreMedico =
    consulta.medico?.nombre || 'Médico no disponible';

  const confirmarEliminacion = async () => {
    setEliminando(true);
    setError('');

    try {
      await eliminarConsulta(consulta.numeroConsulta);

      onConsultaEliminada(consulta.numeroConsulta);
    } catch (error) {
      console.error('Error eliminando consulta:', error);

      setError(
        error.message || 'No se pudo eliminar la consulta',
      );
    } finally {
      setEliminando(false);
    }
  };

  return (
    <article className="item-consulta">
      <header className="item-consulta-encabezado">
        <div className="item-consulta-titulo">
          <i className="bi bi-calendar2-check" />

          <h3>{consulta.motivo}</h3>
        </div>

        <time
          className="item-consulta-fecha"
          dateTime={consulta.fecha}
        >
          {fecha}
        </time>
      </header>

      <div className="item-consulta-contenido">
        <section className="item-consulta-seccion">
          <span className="item-consulta-etiqueta">
            Diagnóstico
          </span>

          <p>{consulta.diagnostico}</p>
        </section>

        {consulta.observaciones && (
          <section className="item-consulta-observaciones">
            <span className="item-consulta-etiqueta">
              Observaciones
            </span>

            <p>{consulta.observaciones}</p>
          </section>
        )}

        {error && (
          <div className="item-consulta-error">
            {error}
          </div>
        )}

        {mostrandoConfirmacion && (
          <div className="item-consulta-confirmacion">
            <div>
              <strong>¿Estás seguro?</strong>

              <p>
                Esta consulta será eliminada permanentemente
                de la historia clínica.
              </p>
            </div>

            <div className="item-consulta-confirmacion-acciones">
              <button
                type="button"
                className="boton-cancelar-eliminacion"
                onClick={() =>
                  setMostrandoConfirmacion(false)
                }
                disabled={eliminando}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="boton-confirmar-eliminacion"
                onClick={confirmarEliminacion}
                disabled={eliminando}
              >
                {eliminando
                  ? 'Eliminando...'
                  : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="item-consulta-pie">
        <div className="item-consulta-medico">
          <div className="item-consulta-medico-icono">
            <i className="bi bi-person-badge" />
          </div>

          <div>
            <span>Profesional responsable</span>
            <strong>{nombreMedico}</strong>
          </div>
        </div>

        {!mostrandoConfirmacion && (
          <button
            type="button"
            className="boton-eliminar-consulta"
            onClick={() =>
              setMostrandoConfirmacion(true)
            }
          >
            <i className="bi bi-trash" />
            Eliminar
          </button>
        )}
      </footer>
    </article>
  );
}