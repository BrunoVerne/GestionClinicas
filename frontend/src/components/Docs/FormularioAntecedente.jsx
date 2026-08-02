import { useState } from 'react';

import {
  crearAntecedente,
} from '../../services/antecedenteService';

import {
  validarFormularioAntecedente,
} from '../../utils/validacionAntecedente';

import '../../styles/formularioAntecedente.css';

export default function FormularioAntecedente({
  dniPaciente,
  onAntecedenteCreado,
  onCancelar,
}) {
  const [formulario, setFormulario] = useState({
    tipo: '',
    descripcion: '',
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

    const validacion =
      validarFormularioAntecedente(formulario);

    if (!validacion.valido) {
      setError(
        validacion.errores.tipo ||
          validacion.errores.descripcion ||
          'Los datos ingresados no son válidos',
      );

      return;
    }

    const { tipo, descripcion } = validacion.datos;

    setGuardando(true);

    try {
      const antecedenteCreado =
        await crearAntecedente({
          dniPaciente: Number(dniPaciente),
          tipo,
          descripcion,
        });

      onAntecedenteCreado?.(antecedenteCreado);
    } catch (err) {
      setError(
        err.message ||
          'No se pudo crear el antecedente',
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form
      className="formulario-antecedente"
      onSubmit={enviarFormulario}
    >
      <div className="formulario-antecedente__contenido">
        <header className="formulario-antecedente__encabezado">
          <i className="bi bi-clock-history formulario-antecedente__icono" />

          <h5 className="formulario-antecedente__titulo">
            Nuevo antecedente
          </h5>
        </header>

        {error && (
          <div
            className="formulario-antecedente__error"
            role="alert"
          >
            <i className="bi bi-exclamation-triangle" />
            <span>{error}</span>
          </div>
        )}

        <div className="formulario-antecedente__campos">
          <div className="formulario-antecedente__grupo formulario-antecedente__grupo--tipo">
            <label
              htmlFor="tipoAntecedente"
              className="formulario-antecedente__label"
            >
              Tipo
            </label>

            <input
              id="tipoAntecedente"
              type="text"
              name="tipo"
              className="formulario-antecedente__input"
              value={formulario.tipo}
              maxLength={100}
              disabled={guardando}
              placeholder="Ej.: Alergia, cirugía o antecedente familiar"
              onChange={cambiarCampo}
            />
          </div>

          <div className="formulario-antecedente__grupo formulario-antecedente__grupo--descripcion">
            <label
              htmlFor="descripcionAntecedente"
              className="formulario-antecedente__label"
            >
              Descripción
            </label>

            <textarea
              id="descripcionAntecedente"
              name="descripcion"
              className="formulario-antecedente__textarea"
              rows={3}
              maxLength={1000}
              value={formulario.descripcion}
              disabled={guardando}
              placeholder="Ej.: Alergia conocida a la penicilina"
              onChange={cambiarCampo}
            />
          </div>
        </div>
      </div>

      <footer className="formulario-antecedente__acciones">
        <button
          type="button"
          className="formulario-antecedente__boton formulario-antecedente__boton--cancelar"
          disabled={guardando}
          onClick={onCancelar}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="formulario-antecedente__boton formulario-antecedente__boton--guardar"
          disabled={guardando}
        >
          {guardando ? (
            <>
              <span
                className="formulario-antecedente__spinner"
                aria-hidden="true"
              />
              Guardando...
            </>
          ) : (
            <>
              <i className="bi bi-check-lg" />
              Crear antecedente
            </>
          )}
        </button>
      </footer>
    </form>
  );
}

