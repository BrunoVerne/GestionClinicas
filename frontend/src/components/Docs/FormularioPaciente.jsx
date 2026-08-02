import { useState } from 'react';

import { crearPaciente } from '../../services/pacienteService';
import { validarFormularioPaciente } from '../../utils/validacionPaciente';
import '../../styles/formularioPaciente.css';

export default function FormularioPaciente({
  onPacienteCreado,
  onCancelar,
}) {
  const [formulario, setFormulario] = useState({
    dni: '',
    nombre: '',
    peso: '',
    altura: '',
  });

  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cambiarCampo = (event) => {
    const { name, value } = event.target;

    setFormulario((formularioActual) => ({
      ...formularioActual,
      [name]: value,
    }));

    setErrores((erroresActuales) => ({
      ...erroresActuales,
      [name]: '',
    }));

    setErrorGeneral('');
  };

  const enviarFormulario = async (event) => {
    event.preventDefault();

    setErrores({});
    setErrorGeneral('');

    const validacion = validarFormularioPaciente(formulario);

    if (!validacion.valido) {
      setErrores(validacion.errores);
      return;
    }

    setGuardando(true);

    try {
      const pacienteCreado = await crearPaciente(
        validacion.datos,
      );

      onPacienteCreado?.(pacienteCreado);
    } catch (error) {
      if (
        error.errores &&
        Object.keys(error.errores).length > 0
      ) {
        setErrores(error.errores);
      } else {
        setErrorGeneral(
          error.message || 'No se pudo crear el paciente',
        );
      }
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form
      className="formulario-paciente"
      onSubmit={enviarFormulario}
    >
      <div className="formulario-paciente__contenido">
        <header className="formulario-paciente__encabezado">
          <i className="bi bi-person-plus" />

          <div>
            <h2>Nuevo paciente</h2>

            <p>
              Ingresá los datos personales y físicos del paciente.
            </p>
          </div>
        </header>

        {errorGeneral && (
          <div
            className="formulario-paciente__error-general"
            role="alert"
          >
            <i className="bi bi-exclamation-triangle" />
            <span>{errorGeneral}</span>
          </div>
        )}

        <div className="formulario-paciente__campos">
          <div className="formulario-paciente__grupo">
            <label htmlFor="dniPaciente">
              DNI
            </label>

            <input
              id="dniPaciente"
              type="number"
              name="dni"
              value={formulario.dni}
              min="1000000"
              max="99999999"
              disabled={guardando}
              placeholder="Ej.: 12345678"
              onChange={cambiarCampo}
            />

            {errores.dni && (
              <span className="formulario-paciente__error-campo">
                {errores.dni}
              </span>
            )}
          </div>

          <div className="formulario-paciente__grupo formulario-paciente__grupo--nombre">
            <label htmlFor="nombrePaciente">
              Nombre completo
            </label>

            <input
              id="nombrePaciente"
              type="text"
              name="nombre"
              value={formulario.nombre}
              maxLength={100}
              disabled={guardando}
              placeholder="Ej.: Carlos Gómez"
              onChange={cambiarCampo}
            />

            {errores.nombre && (
              <span className="formulario-paciente__error-campo">
                {errores.nombre}
              </span>
            )}
          </div>

          <div className="formulario-paciente__grupo">
            <label htmlFor="pesoPaciente">
              Peso
            </label>

            <div className="formulario-paciente__entrada-medida">
              <input
                id="pesoPaciente"
                type="number"
                name="peso"
                step="0.1"
                min="1"
                max="500"
                value={formulario.peso}
                disabled={guardando}
                placeholder="Ej.: 78.5"
                onChange={cambiarCampo}
              />

              <span>kg</span>
            </div>

            {errores.peso && (
              <span className="formulario-paciente__error-campo">
                {errores.peso}
              </span>
            )}
          </div>

          <div className="formulario-paciente__grupo">
            <label htmlFor="alturaPaciente">
              Altura
            </label>

            <div className="formulario-paciente__entrada-medida">
              <input
                id="alturaPaciente"
                type="number"
                name="altura"
                step="0.01"
                min="0.3"
                max="2.7"
                value={formulario.altura}
                disabled={guardando}
                placeholder="Ej.: 1.76"
                onChange={cambiarCampo}
              />

              <span>m</span>
            </div>

            {errores.altura && (
              <span className="formulario-paciente__error-campo">
                {errores.altura}
              </span>
            )}
          </div>
        </div>
      </div>

      <footer className="formulario-paciente__acciones">
        <button
          type="button"
          className="btn btn-outline-secondary"
          disabled={guardando}
          onClick={onCancelar}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={guardando}
        >
          {guardando ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                aria-hidden="true"
              />
              Guardando...
            </>
          ) : (
            <>
              <i className="bi bi-person-plus me-1" />
              Crear paciente
            </>
          )}
        </button>
      </footer>
    </form>
  );
}
