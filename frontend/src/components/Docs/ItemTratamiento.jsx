import { useState } from 'react';

import {
  actualizarFechaFinTratamiento,
  eliminarTratamiento,
} from '../../services/tratamientoService';

import '../../styles/itemTratamiento.css';

export default function ItemTratamiento({
  tratamiento,
  onTratamientoActualizado,
  onTratamientoEliminado,
}) {
  const fechaInicioDate = new Date(tratamiento.fechaInicio);
  const fechaFinDate = new Date(tratamiento.fechaFin);
  const ahora = new Date();

  const fechaInicioFormateada =
    fechaInicioDate.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  const fechaFinFormateada =
    fechaFinDate.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  const fechaInicioParaInput = fechaInicioDate
    .toISOString()
    .slice(0, 10);

  const fechaFinParaInput = fechaFinDate
    .toISOString()
    .slice(0, 10);

  const nombreMedico =
    tratamiento.medico?.nombre || 'Médico no disponible';

  const estaActivo =
    ahora >= fechaInicioDate &&
    ahora <= fechaFinDate;

  const [editandoFecha, setEditandoFecha] = useState(false);

  const [nuevaFechaFin, setNuevaFechaFin] = useState(
    fechaFinParaInput,
  );

  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');

  const guardarFechaFin = async () => {
    if (!nuevaFechaFin) {
      setError(
        'La fecha de finalización es obligatoria',
      );
      return;
    }

    if (nuevaFechaFin < fechaInicioParaInput) {
      setError(
        'La fecha de finalización no puede ser anterior a la fecha de inicio',
      );
      return;
    }

    setProcesando(true);
    setError('');

    try {
      const tratamientoActualizado =
        await actualizarFechaFinTratamiento(
          tratamiento.numeroTratamiento,
          nuevaFechaFin,
        );

      onTratamientoActualizado?.(
        tratamientoActualizado,
      );

      setEditandoFecha(false);
    } catch (err) {
      setError(
        err.message ||
          'No se pudo actualizar la fecha del tratamiento',
      );
    } finally {
      setProcesando(false);
    }
  };

  const cancelarEdicion = () => {
    setNuevaFechaFin(fechaFinParaInput);
    setEditandoFecha(false);
    setError('');
  };

  const borrarTratamiento = async () => {
    const confirmado = window.confirm(
      '¿Seguro que querés eliminar este tratamiento?',
    );

    if (!confirmado) {
      return;
    }

    setProcesando(true);
    setError('');

    try {
      await eliminarTratamiento(
        tratamiento.numeroTratamiento,
      );

      onTratamientoEliminado?.(
        tratamiento.numeroTratamiento,
      );
    } catch (err) {
      setError(
        err.message ||
          'No se pudo eliminar el tratamiento',
      );
    } finally {
      setProcesando(false);
    }
  };

  return (
    <article
      className={`item-tratamiento ${
        estaActivo
          ? 'item-tratamiento-activo'
          : 'item-tratamiento-finalizado'
      }`}
    >
      <header className="item-tratamiento-encabezado">
        <div className="item-tratamiento-titulo">
          <i className="bi bi-capsule" />

          <h3>{tratamiento.descripcion}</h3>
        </div>

        <span
          className={`item-tratamiento-estado ${
            estaActivo
              ? 'estado-activo'
              : 'estado-finalizado'
          }`}
        >
          {estaActivo ? 'Activo' : 'Finalizado'}
        </span>
      </header>

      <div className="item-tratamiento-informacion">
        <div className="item-tratamiento-dato">
          <i className="bi bi-calendar-event" />

          <div>
            <span>Fecha de inicio</span>
            <strong>{fechaInicioFormateada}</strong>
          </div>
        </div>

        <div className="item-tratamiento-dato">
          <i className="bi bi-calendar-check" />

          <div>
            <span>Fecha de finalización</span>
            <strong>{fechaFinFormateada}</strong>
          </div>
        </div>

        <div className="item-tratamiento-dato">
          <i className="bi bi-person-badge" />

          <div>
            <span>Profesional responsable</span>
            <strong>{nombreMedico}</strong>
          </div>
        </div>
      </div>

      {editandoFecha && (
        <div className="p-3 border-top">
          <label
            htmlFor={`fecha-fin-${tratamiento.numeroTratamiento}`}
            className="form-label"
          >
            Nueva fecha de finalización
          </label>

          <input
            id={`fecha-fin-${tratamiento.numeroTratamiento}`}
            type="date"
            className="form-control"
            value={nuevaFechaFin}
            min={fechaInicioParaInput}
            disabled={procesando}
            onChange={(event) =>
              setNuevaFechaFin(event.target.value)
            }
          />

          <div className="d-flex gap-2 mt-3">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={procesando}
              onClick={guardarFechaFin}
            >
              {procesando ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  />
                  Guardando...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg me-1" />
                  Guardar fecha
                </>
              )}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              disabled={procesando}
              onClick={cancelarEdicion}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {error && (
        <div
          className="alert alert-danger mx-3 mt-3 mb-0"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle me-2" />
          {error}
        </div>
      )}

      <footer className="d-flex justify-content-end gap-2 p-3 border-top">
        {!editandoFecha && (
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            disabled={procesando}
            onClick={() => {
              setError('');
              setEditandoFecha(true);
            }}
          >
            <i className="bi bi-calendar-event me-1" />
            Cambiar fecha
          </button>
        )}

        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          disabled={procesando}
          onClick={borrarTratamiento}
        >
          {procesando && !editandoFecha ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                aria-hidden="true"
              />
              Eliminando...
            </>
          ) : (
            <>
              <i className="bi bi-trash me-1" />
              Eliminar
            </>
          )}
        </button>
      </footer>
    </article>
  );
}
