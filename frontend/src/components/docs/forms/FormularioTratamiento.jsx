import { useState } from 'react';

import {
  crearTratamiento,
} from '../../../services/tratamientoService';

import '../../../styles/forms/formularioTratamiento.css';

export default function FormularioTratamiento({
  dniPaciente,
  medicos = [],
  onTratamientoCreado,
  onCancelar,
}) {
  const fechaActual = new Date()
    .toISOString()
    .slice(0, 10);

  const [formulario, setFormulario] = useState({
    descripcion: '',
    fechaInicio: fechaActual,
    fechaFin: fechaActual,
    legajoMedico: '',
  });

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const cambiarCampo = (event) => {
    const { name, value } = event.target;

    setFormulario((formularioActual) => ({
      ...formularioActual,
      [name]: value,
    }));

    setError('');
  };

  const enviarFormulario = async (event) => {
    event.preventDefault();
    setError('');

    const descripcion = formulario.descripcion.trim();

    if (descripcion.length < 3) {
      setError(
        'La descripción debe tener al menos 3 caracteres',
      );
      return;
    }

    if (!formulario.fechaInicio) {
      setError('La fecha de inicio es obligatoria');
      return;
    }

    if (!formulario.fechaFin) {
      setError(
        'La fecha de finalización es obligatoria',
      );
      return;
    }

    if (formulario.fechaFin < formulario.fechaInicio) {
      setError(
        'La fecha de finalización no puede ser anterior a la fecha de inicio',
      );
      return;
    }

    if (!formulario.legajoMedico) {
      setError('Debe seleccionar un médico');
      return;
    }

    setGuardando(true);

    try {
      const tratamientoCreado =
        await crearTratamiento({
          dniPaciente: Number(dniPaciente),
          descripcion,
          fechaInicio:
            `${formulario.fechaInicio}T12:00:00.000Z`,
          fechaFin:
            `${formulario.fechaFin}T12:00:00.000Z`,
          legajoMedico: Number(
            formulario.legajoMedico,
          ),
        });

      onTratamientoCreado?.(tratamientoCreado);
    } catch (err) {
      setError(
        err.message ||
          'No se pudo crear el tratamiento',
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form
      className="formulario-tratamiento"
      onSubmit={enviarFormulario}
    >
      <div className="formulario-tratamiento__contenido">
        <header className="formulario-tratamiento__encabezado">
          <i className="bi bi-capsule formulario-tratamiento__icono" />

          <h5 className="formulario-tratamiento__titulo">
            Nuevo tratamiento
          </h5>
        </header>

        {error && (
          <div
            className="formulario-tratamiento__error"
            role="alert"
          >
            <i className="bi bi-exclamation-triangle" />
            <span>{error}</span>
          </div>
        )}

        <div className="formulario-tratamiento__grupo formulario-tratamiento__grupo--descripcion">
          <label
            htmlFor="descripcionTratamiento"
            className="formulario-tratamiento__label"
          >
            Descripción
          </label>

          <textarea
            id="descripcionTratamiento"
            name="descripcion"
            className="formulario-tratamiento__textarea"
            rows={3}
            maxLength={1000}
            value={formulario.descripcion}
            disabled={guardando}
            placeholder="Ej.: Ibuprofeno 400 mg cada 8 horas"
            onChange={cambiarCampo}
          />
        </div>

        <div className="formulario-tratamiento__campos">
          <div className="formulario-tratamiento__grupo">
            <label
              htmlFor="fechaInicioTratamiento"
              className="formulario-tratamiento__label"
            >
              Fecha de inicio
            </label>

            <input
              id="fechaInicioTratamiento"
              type="date"
              name="fechaInicio"
              className="formulario-tratamiento__input"
              value={formulario.fechaInicio}
              disabled={guardando}
              onChange={cambiarCampo}
            />
          </div>

          <div className="formulario-tratamiento__grupo">
            <label
              htmlFor="fechaFinTratamiento"
              className="formulario-tratamiento__label"
            >
              Fecha de finalización
            </label>

            <input
              id="fechaFinTratamiento"
              type="date"
              name="fechaFin"
              className="formulario-tratamiento__input"
              min={formulario.fechaInicio}
              value={formulario.fechaFin}
              disabled={guardando}
              onChange={cambiarCampo}
            />
          </div>

          <div className="formulario-tratamiento__grupo">
            <label
              htmlFor="medicoTratamiento"
              className="formulario-tratamiento__label"
            >
              Médico responsable
            </label>

            <select
              id="medicoTratamiento"
              name="legajoMedico"
              className="formulario-tratamiento__select"
              value={formulario.legajoMedico}
              disabled={guardando}
              onChange={cambiarCampo}
            >
              <option value="">
                Seleccionar médico
              </option>

              {medicos
                .filter((medico) => medico.activo)
                .map((medico) => (
                  <option
                    key={medico.legajo}
                    value={medico.legajo}
                  >
                    {medico.nombre}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      <footer className="formulario-tratamiento__acciones">
        <button
          type="button"
          className="formulario-tratamiento__boton formulario-tratamiento__boton--cancelar"
          disabled={guardando}
          onClick={onCancelar}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="formulario-tratamiento__boton formulario-tratamiento__boton--guardar"
          disabled={guardando}
        >
          {guardando ? (
            <>
              <span
                className="formulario-tratamiento__spinner"
                aria-hidden="true"
              />
              Guardando...
            </>
          ) : (
            <>
              <i className="bi bi-check-lg" />
              Crear tratamiento
            </>
          )}
        </button>
      </footer>
    </form>
  );
}
