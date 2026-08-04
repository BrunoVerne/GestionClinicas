import { useEffect, useState } from 'react';

import {
  crearPaciente,
  obtenerCatalogosPaciente,
} from '../../../services/pacienteService';

import {
  validarFormularioPaciente,
} from '../../../utils/validacionPaciente';

import '../../../styles/forms/formularioPaciente.css';

const FORMULARIO_INICIAL = {
  dni: '',
  nombre: '',
  telefono: '',
  telefonoDeEmergencia: '',
  email: '',
  fechaDeNacimiento: '',
  genero: '',
  domicilio: '',

  obraSocial: {
    nombre: '',
    numeroDeAfiliado: '',
    plan: '',
  },
};

function formatearOpcion(valor) {
  return valor
    .toLowerCase()
    .split('_')
    .map(
      (palabra) =>
        palabra.charAt(0).toUpperCase() +
        palabra.slice(1),
    )
    .join(' ');
}

export default function FormularioPaciente({
  onPacienteCreado,
  onCancelar,
}) {
  const [formulario, setFormulario] = useState(
    FORMULARIO_INICIAL,
  );

  const [generos, setGeneros] = useState([]);
  const [obrasSociales, setObrasSociales] =
    useState([]);

  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] =
    useState('');

  const [guardando, setGuardando] =
    useState(false);

  const [cargandoCatalogos, setCargandoCatalogos] =
    useState(true);

  useEffect(() => {
    const cargarCatalogos = async () => {
      setCargandoCatalogos(true);
      setErrorGeneral('');

      try {
        const {
          generos: generosObtenidos,
          obrasSociales: obrasSocialesObtenidas,
        } = await obtenerCatalogosPaciente();

        setGeneros(generosObtenidos);
        setObrasSociales(obrasSocialesObtenidas);
      } catch (error) {
        setErrorGeneral(
          error.message ||
            'No se pudieron cargar los catálogos',
        );
      } finally {
        setCargandoCatalogos(false);
      }
    };

    cargarCatalogos();
  }, []);

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

  const cambiarCampoObraSocial = (event) => {
    const { name, value } = event.target;

    setFormulario((formularioActual) => {
      const obraSocialActualizada = {
        ...formularioActual.obraSocial,
        [name]: value,
      };

      if (
        name === 'nombre' &&
        value === 'SIN_COBERTURA'
      ) {
        obraSocialActualizada.numeroDeAfiliado = '';
        obraSocialActualizada.plan = '';
      }

      return {
        ...formularioActual,
        obraSocial: obraSocialActualizada,
      };
    });

    setErrores((erroresActuales) => ({
      ...erroresActuales,
      obraSocial: {
        ...(erroresActuales.obraSocial || {}),
        [name]: '',
      },
    }));

    setErrorGeneral('');
  };

  const enviarFormulario = async (event) => {
    event.preventDefault();

    setErrores({});
    setErrorGeneral('');

    const validacion =
      validarFormularioPaciente(formulario);

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
          error.message ||
            'No se pudo crear el paciente',
        );
      }
    } finally {
      setGuardando(false);
    }
  };

  const sinCobertura =
    formulario.obraSocial.nombre ===
    'SIN_COBERTURA';

  const formularioDeshabilitado =
    guardando || cargandoCatalogos;

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
              Ingresá los datos personales, de contacto y
              cobertura médica del paciente.
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

        {errores.general && (
          <div
            className="formulario-paciente__error-general"
            role="alert"
          >
            <i className="bi bi-exclamation-triangle" />

            <span>{errores.general}</span>
          </div>
        )}

        {cargandoCatalogos && (
          <div className="formulario-paciente__cargando">
            <span
              className="spinner-border spinner-border-sm"
              aria-hidden="true"
            />

            <span>Cargando opciones...</span>
          </div>
        )}

        <section className="formulario-paciente__seccion">
          <h3>Datos personales</h3>

          <div className="formulario-paciente__campos">
            <div className="formulario-paciente__grupo">
              <label htmlFor="dniPaciente">
                DNI
              </label>

              <input
                id="dniPaciente"
                type="number"
                name="dni"
                min="1000000"
                max="99999999"
                value={formulario.dni}
                disabled={formularioDeshabilitado}
                placeholder="Ej.: 40123456"
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
                maxLength={100}
                value={formulario.nombre}
                disabled={formularioDeshabilitado}
                placeholder="Ej.: Juan Pérez"
                onChange={cambiarCampo}
              />

              {errores.nombre && (
                <span className="formulario-paciente__error-campo">
                  {errores.nombre}
                </span>
              )}
            </div>

            <div className="formulario-paciente__grupo">
              <label htmlFor="fechaDeNacimientoPaciente">
                Fecha de nacimiento
              </label>

              <input
                id="fechaDeNacimientoPaciente"
                type="date"
                name="fechaDeNacimiento"
                value={formulario.fechaDeNacimiento}
                disabled={formularioDeshabilitado}
                onChange={cambiarCampo}
              />

              {errores.fechaDeNacimiento && (
                <span className="formulario-paciente__error-campo">
                  {errores.fechaDeNacimiento}
                </span>
              )}
            </div>

            <div className="formulario-paciente__grupo">
              <label htmlFor="generoPaciente">
                Género
              </label>

              <select
                id="generoPaciente"
                name="genero"
                value={formulario.genero}
                disabled={formularioDeshabilitado}
                onChange={cambiarCampo}
              >
                <option value="">
                  Seleccionar género
                </option>

                {generos.map((genero) => (
                  <option
                    key={genero}
                    value={genero}
                  >
                    {formatearOpcion(genero)}
                  </option>
                ))}
              </select>

              {errores.genero && (
                <span className="formulario-paciente__error-campo">
                  {errores.genero}
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="formulario-paciente__seccion">
          <h3>Datos de contacto</h3>

          <div className="formulario-paciente__campos">
            <div className="formulario-paciente__grupo">
              <label htmlFor="telefonoPaciente">
                Teléfono
              </label>

              <input
                id="telefonoPaciente"
                type="tel"
                name="telefono"
                maxLength={30}
                value={formulario.telefono}
                disabled={formularioDeshabilitado}
                placeholder="Ej.: 11 2345-6789"
                onChange={cambiarCampo}
              />

              {errores.telefono && (
                <span className="formulario-paciente__error-campo">
                  {errores.telefono}
                </span>
              )}
            </div>

            <div className="formulario-paciente__grupo">
              <label htmlFor="telefonoEmergenciaPaciente">
                Teléfono de emergencia
              </label>

              <input
                id="telefonoEmergenciaPaciente"
                type="tel"
                name="telefonoDeEmergencia"
                maxLength={30}
                value={
                  formulario.telefonoDeEmergencia
                }
                disabled={formularioDeshabilitado}
                placeholder="Ej.: 11 9876-5432"
                onChange={cambiarCampo}
              />

              {errores.telefonoDeEmergencia && (
                <span className="formulario-paciente__error-campo">
                  {errores.telefonoDeEmergencia}
                </span>
              )}
            </div>

            <div className="formulario-paciente__grupo formulario-paciente__grupo--nombre">
              <label htmlFor="emailPaciente">
                Email
              </label>

              <input
                id="emailPaciente"
                type="email"
                name="email"
                maxLength={150}
                value={formulario.email}
                disabled={formularioDeshabilitado}
                placeholder="Ej.: paciente@email.com"
                onChange={cambiarCampo}
              />

              {errores.email && (
                <span className="formulario-paciente__error-campo">
                  {errores.email}
                </span>
              )}
            </div>

            <div className="formulario-paciente__grupo formulario-paciente__grupo--nombre">
              <label htmlFor="domicilioPaciente">
                Domicilio
              </label>

              <input
                id="domicilioPaciente"
                type="text"
                name="domicilio"
                maxLength={200}
                value={formulario.domicilio}
                disabled={formularioDeshabilitado}
                placeholder="Ej.: Av. Rivadavia 4500, CABA"
                onChange={cambiarCampo}
              />

              {errores.domicilio && (
                <span className="formulario-paciente__error-campo">
                  {errores.domicilio}
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="formulario-paciente__seccion">
          <h3>Obra social</h3>

          <div className="formulario-paciente__campos">
            <div className="formulario-paciente__grupo formulario-paciente__grupo--nombre">
              <label htmlFor="obraSocialPaciente">
                Cobertura
              </label>

              <select
                id="obraSocialPaciente"
                name="nombre"
                value={formulario.obraSocial.nombre}
                disabled={formularioDeshabilitado}
                onChange={cambiarCampoObraSocial}
              >
                <option value="">
                  Seleccionar cobertura
                </option>

                {obrasSociales.map(
                  (obraSocial) => (
                    <option
                      key={obraSocial}
                      value={obraSocial}
                    >
                      {formatearOpcion(obraSocial)}
                    </option>
                  ),
                )}
              </select>

              {errores.obraSocial?.nombre && (
                <span className="formulario-paciente__error-campo">
                  {errores.obraSocial.nombre}
                </span>
              )}
            </div>

            <div className="formulario-paciente__grupo">
              <label htmlFor="numeroAfiliadoPaciente">
                Número de afiliado
              </label>

              <input
                id="numeroAfiliadoPaciente"
                type="text"
                name="numeroDeAfiliado"
                maxLength={100}
                value={
                  formulario.obraSocial
                    .numeroDeAfiliado
                }
                disabled={
                  formularioDeshabilitado ||
                  sinCobertura
                }
                placeholder={
                  sinCobertura
                    ? 'No corresponde'
                    : 'Ej.: 123456789'
                }
                onChange={cambiarCampoObraSocial}
              />

              {errores.obraSocial
                ?.numeroDeAfiliado && (
                <span className="formulario-paciente__error-campo">
                  {
                    errores.obraSocial
                      .numeroDeAfiliado
                  }
                </span>
              )}
            </div>

            <div className="formulario-paciente__grupo">
              <label htmlFor="planPaciente">
                Plan
              </label>

              <input
                id="planPaciente"
                type="text"
                name="plan"
                maxLength={100}
                value={formulario.obraSocial.plan}
                disabled={
                  formularioDeshabilitado ||
                  sinCobertura
                }
                placeholder={
                  sinCobertura
                    ? 'No corresponde'
                    : 'Ej.: 210'
                }
                onChange={cambiarCampoObraSocial}
              />

              {errores.obraSocial?.plan && (
                <span className="formulario-paciente__error-campo">
                  {errores.obraSocial.plan}
                </span>
              )}
            </div>
          </div>
        </section>
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
          disabled={formularioDeshabilitado}
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

