import { useEffect, useState } from 'react';

import {
  crearMedico,
  obtenerCatalogosMedico,
} from '../../../services/medicoService';

import {
  validarFormularioMedico,
} from '../../../utils/validacionMedico';

import '../../../styles/forms/formularioMedico.css';

const FORMULARIO_INICIAL = {
  nombre: '',
  matricula: '',
  telefono: '',
  telefonoDeEmergencia: '',
  email: '',
  fechaDeNacimiento: '',
  genero: '',
  domicilio: '',
  especialidades: [],
};

function formatearEtiqueta(valor) {
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

export default function FormularioMedico({
  onMedicoCreado,
  onCancelar,
}) {
  const [formulario, setFormulario] = useState(
    FORMULARIO_INICIAL,
  );

  const [generos, setGeneros] = useState([]);
  const [especialidades, setEspecialidades] =
    useState([]);

  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] =
    useState('');

  const [cargandoCatalogos, setCargandoCatalogos] =
    useState(true);

  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    async function cargarCatalogos() {
      try {
        setCargandoCatalogos(true);
        setErrorGeneral('');

        const catalogos =
          await obtenerCatalogosMedico();

        setGeneros(catalogos.generos);
        setEspecialidades(
          catalogos.especialidades,
        );
      } catch (error) {
        console.error(
          'Error al cargar catálogos del médico:',
          error,
        );

        setErrorGeneral(
          error.message ||
            'No se pudieron cargar los catálogos',
        );
      } finally {
        setCargandoCatalogos(false);
      }
    }

    cargarCatalogos();
  }, []);

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    setErrores((anteriores) => ({
      ...anteriores,
      [name]: undefined,
    }));

    setErrorGeneral('');
  }

  function manejarCambioEspecialidad(especialidad) {
    setFormulario((anterior) => {
      const yaSeleccionada =
        anterior.especialidades.includes(
          especialidad,
        );

      return {
        ...anterior,

        especialidades: yaSeleccionada
          ? anterior.especialidades.filter(
              (actual) =>
                actual !== especialidad,
            )
          : [
              ...anterior.especialidades,
              especialidad,
            ],
      };
    });

    setErrores((anteriores) => ({
      ...anteriores,
      especialidades: undefined,
    }));

    setErrorGeneral('');
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    setErrorGeneral('');

    const validacion =
      validarFormularioMedico(formulario, {
        generos,
        especialidades,
      });

    if (!validacion.valido) {
      setErrores(validacion.errores);
      return;
    }

    try {
      setGuardando(true);
      setErrores({});

      const medicoCreado = await crearMedico(
        validacion.datos,
      );

      setFormulario(FORMULARIO_INICIAL);
      onMedicoCreado?.(medicoCreado);
    } catch (error) {
      console.error(
        'Error al crear médico:',
        error,
      );

      if (error.errores) {
        setErrores(error.errores);
      }

      setErrorGeneral(
        error.message ||
          'No se pudo crear el médico',
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form
      className="formulario-medico"
      onSubmit={manejarEnvio}
      noValidate
    >
      <header className="formulario-medico__encabezado">
        <div>
          <span className="formulario-medico__etiqueta">
            Nuevo profesional
          </span>

          <h2 className="formulario-medico__titulo">
            Registrar médico
          </h2>

          <p className="formulario-medico__descripcion">
            Completá los datos personales y profesionales
            del médico.
          </p>
        </div>

        <button
          type="button"
          className="btn-close"
          aria-label="Cerrar formulario"
          onClick={onCancelar}
          disabled={guardando}
        />
      </header>

      <div className="formulario-medico__contenido">
        {errorGeneral && (
          <div
            className="alert alert-danger"
            role="alert"
          >
            {errorGeneral}
          </div>
        )}

        <section className="formulario-medico__seccion">
          <div className="formulario-medico__seccion-titulo">
            <i className="bi bi-person" />

            <div>
              <h3>Datos personales</h3>
              <p>
                Información básica y de contacto.
              </p>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label
                className="form-label"
                htmlFor="nombre-medico"
              >
                Nombre completo *
              </label>

              <input
                id="nombre-medico"
                name="nombre"
                type="text"
                className={`form-control ${
                  errores.nombre
                    ? 'is-invalid'
                    : ''
                }`}
                value={formulario.nombre}
                onChange={manejarCambio}
                placeholder="Ej. Laura Gómez"
                disabled={guardando}
              />

              {errores.nombre && (
                <div className="invalid-feedback">
                  {errores.nombre}
                </div>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label
                className="form-label"
                htmlFor="fecha-nacimiento-medico"
              >
                Fecha de nacimiento
              </label>

              <input
                id="fecha-nacimiento-medico"
                name="fechaDeNacimiento"
                type="date"
                className={`form-control ${
                  errores.fechaDeNacimiento
                    ? 'is-invalid'
                    : ''
                }`}
                value={
                  formulario.fechaDeNacimiento
                }
                onChange={manejarCambio}
                disabled={guardando}
              />

              {errores.fechaDeNacimiento && (
                <div className="invalid-feedback">
                  {errores.fechaDeNacimiento}
                </div>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label
                className="form-label"
                htmlFor="genero-medico"
              >
                Género
              </label>

              <select
                id="genero-medico"
                name="genero"
                className={`form-select ${
                  errores.genero
                    ? 'is-invalid'
                    : ''
                }`}
                value={formulario.genero}
                onChange={manejarCambio}
                disabled={
                  cargandoCatalogos || guardando
                }
              >
                <option value="">
                  No especificado
                </option>

                {generos.map((genero) => (
                  <option
                    key={genero}
                    value={genero}
                  >
                    {formatearEtiqueta(genero)}
                  </option>
                ))}
              </select>

              {errores.genero && (
                <div className="invalid-feedback">
                  {errores.genero}
                </div>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label
                className="form-label"
                htmlFor="domicilio-medico"
              >
                Domicilio
              </label>

              <input
                id="domicilio-medico"
                name="domicilio"
                type="text"
                className={`form-control ${
                  errores.domicilio
                    ? 'is-invalid'
                    : ''
                }`}
                value={formulario.domicilio}
                onChange={manejarCambio}
                placeholder="Ej. Av. Corrientes 1500"
                disabled={guardando}
              />

              {errores.domicilio && (
                <div className="invalid-feedback">
                  {errores.domicilio}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="formulario-medico__seccion">
          <div className="formulario-medico__seccion-titulo">
            <i className="bi bi-telephone" />

            <div>
              <h3>Datos de contacto</h3>
              <p>
                Medios de contacto personales y de
                emergencia.
              </p>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label
                className="form-label"
                htmlFor="telefono-medico"
              >
                Teléfono
              </label>

              <input
                id="telefono-medico"
                name="telefono"
                type="tel"
                className={`form-control ${
                  errores.telefono
                    ? 'is-invalid'
                    : ''
                }`}
                value={formulario.telefono}
                onChange={manejarCambio}
                placeholder="Ej. 11 2345-6789"
                disabled={guardando}
              />

              {errores.telefono && (
                <div className="invalid-feedback">
                  {errores.telefono}
                </div>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label
                className="form-label"
                htmlFor="telefono-emergencia-medico"
              >
                Teléfono de emergencia
              </label>

              <input
                id="telefono-emergencia-medico"
                name="telefonoDeEmergencia"
                type="tel"
                className={`form-control ${
                  errores.telefonoDeEmergencia
                    ? 'is-invalid'
                    : ''
                }`}
                value={
                  formulario.telefonoDeEmergencia
                }
                onChange={manejarCambio}
                placeholder="Ej. 11 9876-5432"
                disabled={guardando}
              />

              {errores.telefonoDeEmergencia && (
                <div className="invalid-feedback">
                  {errores.telefonoDeEmergencia}
                </div>
              )}
            </div>

            <div className="col-12">
              <label
                className="form-label"
                htmlFor="email-medico"
              >
                Email
              </label>

              <input
                id="email-medico"
                name="email"
                type="email"
                className={`form-control ${
                  errores.email
                    ? 'is-invalid'
                    : ''
                }`}
                value={formulario.email}
                onChange={manejarCambio}
                placeholder="Ej. medico@email.com"
                disabled={guardando}
              />

              {errores.email && (
                <div className="invalid-feedback">
                  {errores.email}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="formulario-medico__seccion">
          <div className="formulario-medico__seccion-titulo">
            <i className="bi bi-clipboard2-pulse" />

            <div>
              <h3>Datos profesionales</h3>
              <p>
                Matrícula y especialidades habilitadas.
              </p>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label
                className="form-label"
                htmlFor="matricula-medico"
              >
                Matrícula *
              </label>

              <input
                id="matricula-medico"
                name="matricula"
                type="text"
                className={`form-control ${
                  errores.matricula
                    ? 'is-invalid'
                    : ''
                }`}
                value={formulario.matricula}
                onChange={manejarCambio}
                placeholder="Ej. MN 123456"
                disabled={guardando}
              />

              {errores.matricula && (
                <div className="invalid-feedback">
                  {errores.matricula}
                </div>
              )}
            </div>

            <div className="col-12">
              <fieldset
                className="formulario-medico__especialidades"
                disabled={guardando}
              >
                <legend>
                  Especialidades *
                </legend>

                {cargandoCatalogos ? (
                  <div className="text-secondary">
                    Cargando especialidades...
                  </div>
                ) : (
                  <div className="formulario-medico__especialidades-grid">
                    {especialidades.map(
                      (especialidad) => {
                        const seleccionada =
                          formulario.especialidades.includes(
                            especialidad,
                          );

                        return (
                          <label
                            className={`formulario-medico__especialidad ${
                              seleccionada
                                ? 'formulario-medico__especialidad--seleccionada'
                                : ''
                            }`}
                            key={especialidad}
                          >
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={seleccionada}
                              onChange={() =>
                                manejarCambioEspecialidad(
                                  especialidad,
                                )
                              }
                            />

                            <span>
                              {formatearEtiqueta(
                                especialidad,
                              )}
                            </span>
                          </label>
                        );
                      },
                    )}
                  </div>
                )}

                {errores.especialidades && (
                  <div className="text-danger small mt-2">
                    {errores.especialidades}
                  </div>
                )}
              </fieldset>
            </div>
          </div>
        </section>
      </div>

      <footer className="formulario-medico__acciones">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancelar}
          disabled={guardando}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="btn btn-success"
          disabled={
            guardando || cargandoCatalogos
          }
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
              <i className="bi bi-person-plus me-2" />
              Registrar médico
            </>
          )}
        </button>
      </footer>
    </form>
  );
}