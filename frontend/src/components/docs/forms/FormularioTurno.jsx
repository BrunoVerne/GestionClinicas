import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import Buscador from '../../panel/Buscador';

import {
  crearTurno,
  obtenerMedicosDisponibles,
} from '../../../services/turnoService';

import {
  obtenerEspecialidades,
} from '../../../services/medicoService';

import '../../../styles/forms/formularioTurno.css';

const FORMULARIO_INICIAL = {
  dniPaciente: '',
  especialidad: '',
  fechaInicio: '',
  fechaFin: '',
  legajoMedico: '',
  motivo: '',
  observaciones: '',
};

export default function FormularioTurno({
  pacientes = [],
  onTurnoCreado,
  onCancelar,
}) {
  const [formulario, setFormulario] =
    useState(FORMULARIO_INICIAL);

  const [busquedaPaciente, setBusquedaPaciente] =
    useState('');

  const [especialidades, setEspecialidades] =
    useState([]);

  const [
    medicosDisponibles,
    setMedicosDisponibles,
  ] = useState([]);

  const [
    cargandoCatalogos,
    setCargandoCatalogos,
  ] = useState(true);

  const [
    buscandoDisponibilidad,
    setBuscandoDisponibilidad,
  ] = useState(false);

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] = useState('');
  const [errores, setErrores] =
    useState({});

  useEffect(() => {
    cargarEspecialidades();
  }, []);

  async function cargarEspecialidades() {
    try {
      setCargandoCatalogos(true);

      const datos =
        await obtenerEspecialidades();

      setEspecialidades(datos);
    } catch (error) {
      console.error(
        'Error cargando especialidades:',
        error,
      );

      setError(
        error.message ||
          'No se pudieron cargar las especialidades',
      );
    } finally {
      setCargandoCatalogos(false);
    }
  }

  const pacienteSeleccionado =
    useMemo(() => {
      if (!formulario.dniPaciente) {
        return null;
      }

      return (
        pacientes.find(
          (paciente) =>
            String(paciente.dni) ===
            String(formulario.dniPaciente),
        ) ?? null
      );
    }, [
      pacientes,
      formulario.dniPaciente,
    ]);

  const pacientesFiltrados =
    useMemo(() => {
      const termino =
        busquedaPaciente
          .trim()
          .toLowerCase();

      if (!termino) {
        return [];
      }

      return pacientes
        .filter((paciente) => {
          const nombre =
            paciente.nombre
              ?.toLowerCase() ?? '';

          const dni = String(
            paciente.dni ?? '',
          );

          return (
            nombre.includes(termino) ||
            dni.includes(termino)
          );
        })
        .slice(0, 8);
    }, [pacientes, busquedaPaciente]);

  function seleccionarPaciente(
    paciente,
  ) {
    setFormulario((actual) => ({
      ...actual,
      dniPaciente: String(
        paciente.dni,
      ),
    }));

    setBusquedaPaciente('');

    setErrores((actual) => ({
      ...actual,
      dniPaciente: undefined,
    }));
  }

  function cambiarPaciente() {
    setFormulario((actual) => ({
      ...actual,
      dniPaciente: '',
    }));

    setBusquedaPaciente('');
  }

  function manejarCambio(evento) {
    const {
      name,
      value,
    } = evento.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }));

    setErrores((actual) => ({
      ...actual,
      [name]: undefined,
    }));

    if (
      [
        'especialidad',
        'fechaInicio',
        'fechaFin',
      ].includes(name)
    ) {
      setFormulario((actual) => ({
        ...actual,
        [name]: value,
        legajoMedico: '',
      }));

      setMedicosDisponibles([]);
    }
  }

  function validarBusquedaDisponibilidad() {
    const nuevosErrores = {};

    if (!formulario.especialidad) {
      nuevosErrores.especialidad =
        'Seleccione una especialidad';
    }

    if (!formulario.fechaInicio) {
      nuevosErrores.fechaInicio =
        'Indique la fecha y hora de inicio';
    }

    if (!formulario.fechaFin) {
      nuevosErrores.fechaFin =
        'Indique la fecha y hora de fin';
    }

    if (
      formulario.fechaInicio &&
      formulario.fechaFin
    ) {
      const inicio = new Date(
        formulario.fechaInicio,
      );

      const fin = new Date(
        formulario.fechaFin,
      );

      if (fin <= inicio) {
        nuevosErrores.fechaFin =
          'La fecha de fin debe ser posterior al inicio';
      }
    }

    setErrores((actuales) => ({
      ...actuales,
      ...nuevosErrores,
    }));

    return (
      Object.keys(nuevosErrores)
        .length === 0
    );
  }

  async function buscarDisponibilidad() {
    if (
      !validarBusquedaDisponibilidad()
    ) {
      return;
    }

    try {
      setBuscandoDisponibilidad(true);
      setError('');
      setMedicosDisponibles([]);

      const medicos =
        await obtenerMedicosDisponibles({
          especialidad:
            formulario.especialidad,

          fechaInicio: new Date(
            formulario.fechaInicio,
          ).toISOString(),

          fechaFin: new Date(
            formulario.fechaFin,
          ).toISOString(),
        });

      setMedicosDisponibles(medicos);

      setFormulario((actual) => ({
        ...actual,
        legajoMedico: '',
      }));
    } catch (error) {
      console.error(
        'Error consultando disponibilidad:',
        error,
      );

      setError(
        error.message ||
          'No se pudo consultar la disponibilidad',
      );
    } finally {
      setBuscandoDisponibilidad(false);
    }
  }

  function validarFormulario() {
    const nuevosErrores = {};

    if (!formulario.dniPaciente) {
      nuevosErrores.dniPaciente =
        'Seleccione un paciente';
    }

    if (!formulario.especialidad) {
      nuevosErrores.especialidad =
        'Seleccione una especialidad';
    }

    if (!formulario.fechaInicio) {
      nuevosErrores.fechaInicio =
        'Indique la fecha y hora de inicio';
    }

    if (!formulario.fechaFin) {
      nuevosErrores.fechaFin =
        'Indique la fecha y hora de fin';
    }

    if (!formulario.legajoMedico) {
      nuevosErrores.legajoMedico =
        'Seleccione un médico disponible';
    }

    if (
      formulario.fechaInicio &&
      formulario.fechaFin &&
      new Date(formulario.fechaFin) <=
        new Date(
          formulario.fechaInicio,
        )
    ) {
      nuevosErrores.fechaFin =
        'La fecha de fin debe ser posterior al inicio';
    }

    setErrores(nuevosErrores);

    return (
      Object.keys(nuevosErrores)
        .length === 0
    );
  }

  async function manejarSubmit(
    evento,
  ) {
    evento.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    try {
      setGuardando(true);
      setError('');

      const turno = await crearTurno({
        dniPaciente: Number(
          formulario.dniPaciente,
        ),

        legajoMedico: Number(
          formulario.legajoMedico,
        ),

        especialidad:
          formulario.especialidad,

        fechaInicio: new Date(
          formulario.fechaInicio,
        ).toISOString(),

        fechaFin: new Date(
          formulario.fechaFin,
        ).toISOString(),

        motivo:
          formulario.motivo.trim() ||
          null,

        observaciones:
          formulario.observaciones.trim() ||
          null,
      });

      onTurnoCreado?.(turno);

      setFormulario(
        FORMULARIO_INICIAL,
      );

      setBusquedaPaciente('');
      setMedicosDisponibles([]);
    } catch (error) {
      console.error(
        'Error creando turno:',
        error,
      );

      if (error.errores) {
        setErrores(error.errores);
      }

      setError(
        error.message ||
          'No se pudo crear el turno',
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form
      className="formulario-turno"
      onSubmit={manejarSubmit}
    >
      <header className="formulario-turno__encabezado">
        <div>
          <span className="formulario-turno__etiqueta">
            Agenda
          </span>

          <h2 className="formulario-turno__titulo">
            Nuevo turno
          </h2>

          <p className="formulario-turno__descripcion">
            Seleccioná el paciente, horario y
            profesional disponible.
          </p>
        </div>
      </header>

      {error && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="formulario-turno__contenido">
        {/* PACIENTE */}

        <section className="formulario-turno__seccion">
          <h3 className="formulario-turno__seccion-titulo">
            Paciente
          </h3>

          {!pacienteSeleccionado ? (
            <>
              <Buscador
                valor={
                  busquedaPaciente
                }
                onChange={
                  setBusquedaPaciente
                }
                placeholder="Buscar paciente por nombre o DNI"
                cantidadResultados={
                  pacientesFiltrados.length
                }
              />

              {busquedaPaciente &&
                pacientesFiltrados.length >
                  0 && (
                  <div className="formulario-turno__pacientes-resultados">
                    {pacientesFiltrados.map(
                      (paciente) => (
                        <button
                          key={
                            paciente.dni
                          }
                          type="button"
                          className="formulario-turno__paciente-resultado"
                          onClick={() =>
                            seleccionarPaciente(
                              paciente,
                            )
                          }
                        >
                          <div className="formulario-turno__paciente-icono">
                            <i className="bi bi-person" />
                          </div>

                          <div className="formulario-turno__paciente-datos">
                            <strong>
                              {
                                paciente.nombre
                              }
                            </strong>

                            <span>
                              DNI{' '}
                              {
                                paciente.dni
                              }
                            </span>
                          </div>

                          <i className="bi bi-chevron-right formulario-turno__paciente-flecha" />
                        </button>
                      ),
                    )}
                  </div>
                )}

              {busquedaPaciente &&
                pacientesFiltrados.length ===
                  0 && (
                  <div className="formulario-turno__sin-resultados">
                    <i className="bi bi-search" />

                    <span>
                      No se encontraron
                      pacientes.
                    </span>
                  </div>
                )}

              {errores.dniPaciente && (
                <div className="text-danger small mt-2">
                  {
                    errores.dniPaciente
                  }
                </div>
              )}
            </>
          ) : (
            <div className="formulario-turno__paciente-seleccionado">
              <div className="formulario-turno__paciente-seleccionado-info">
                <div className="formulario-turno__paciente-icono formulario-turno__paciente-icono--seleccionado">
                  <i className="bi bi-person-check" />
                </div>

                <div>
                  <span className="formulario-turno__paciente-seleccionado-etiqueta">
                    Paciente seleccionado
                  </span>

                  <strong>
                    {
                      pacienteSeleccionado.nombre
                    }
                  </strong>

                  <span>
                    DNI{' '}
                    {
                      pacienteSeleccionado.dni
                    }
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={
                  cambiarPaciente
                }
              >
                Cambiar
              </button>
            </div>
          )}
        </section>

        {/* ESPECIALIDAD Y HORARIO */}

        <section className="formulario-turno__seccion">
          <h3 className="formulario-turno__seccion-titulo">
            Especialidad y horario
          </h3>

          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label
                className="form-label"
                htmlFor="especialidad"
              >
                Especialidad
              </label>

              <select
                id="especialidad"
                name="especialidad"
                value={
                  formulario.especialidad
                }
                onChange={manejarCambio}
                disabled={
                  cargandoCatalogos
                }
                className={`form-select ${
                  errores.especialidad
                    ? 'is-invalid'
                    : ''
                }`}
              >
                <option value="">
                  Seleccionar especialidad
                </option>

                {especialidades.map(
                  (especialidad) => (
                    <option
                      key={
                        especialidad
                      }
                      value={
                        especialidad
                      }
                    >
                      {especialidad.replaceAll(
                        '_',
                        ' ',
                      )}
                    </option>
                  ),
                )}
              </select>

              {errores.especialidad && (
                <div className="invalid-feedback">
                  {
                    errores.especialidad
                  }
                </div>
              )}
            </div>

            <div className="col-12 col-md-4">
              <label
                className="form-label"
                htmlFor="fechaInicio"
              >
                Inicio
              </label>

              <input
                id="fechaInicio"
                name="fechaInicio"
                type="datetime-local"
                value={
                  formulario.fechaInicio
                }
                onChange={manejarCambio}
                className={`form-control ${
                  errores.fechaInicio
                    ? 'is-invalid'
                    : ''
                }`}
              />

              {errores.fechaInicio && (
                <div className="invalid-feedback">
                  {
                    errores.fechaInicio
                  }
                </div>
              )}
            </div>

            <div className="col-12 col-md-4">
              <label
                className="form-label"
                htmlFor="fechaFin"
              >
                Fin
              </label>

              <input
                id="fechaFin"
                name="fechaFin"
                type="datetime-local"
                value={
                  formulario.fechaFin
                }
                onChange={manejarCambio}
                className={`form-control ${
                  errores.fechaFin
                    ? 'is-invalid'
                    : ''
                }`}
              />

              {errores.fechaFin && (
                <div className="invalid-feedback">
                  {
                    errores.fechaFin
                  }
                </div>
              )}
            </div>

            <div className="col-12">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={
                  buscarDisponibilidad
                }
                disabled={
                  buscandoDisponibilidad
                }
              >
                {buscandoDisponibilidad ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      aria-hidden="true"
                    />
                    Buscando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-search me-2" />
                    Buscar médicos disponibles
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* MÉDICO */}

        <section className="formulario-turno__seccion">
          <h3 className="formulario-turno__seccion-titulo">
            Profesional
          </h3>

          <div className="row g-3">
            <div className="col-12">
              <label
                className="form-label"
                htmlFor="legajoMedico"
              >
                Médico disponible
              </label>

              <select
                id="legajoMedico"
                name="legajoMedico"
                value={
                  formulario.legajoMedico
                }
                onChange={manejarCambio}
                disabled={
                  medicosDisponibles.length ===
                  0
                }
                className={`form-select ${
                  errores.legajoMedico
                    ? 'is-invalid'
                    : ''
                }`}
              >
                <option value="">
                  {medicosDisponibles.length ===
                  0
                    ? 'Primero consulte disponibilidad'
                    : 'Seleccionar médico'}
                </option>

                {medicosDisponibles.map(
                  (medico) => (
                    <option
                      key={medico.legajo}
                      value={
                        medico.legajo
                      }
                    >
                      {medico.nombre}
                    </option>
                  ),
                )}
              </select>

              {errores.legajoMedico && (
                <div className="invalid-feedback">
                  {
                    errores.legajoMedico
                  }
                </div>
              )}

              {!buscandoDisponibilidad &&
                formulario.especialidad &&
                formulario.fechaInicio &&
                formulario.fechaFin &&
                medicosDisponibles.length ===
                  0 && (
                  <div className="formulario-turno__sin-disponibilidad">
                    <i className="bi bi-info-circle" />
                    No hay médicos
                    disponibles cargados
                    para este intervalo.
                  </div>
                )}
            </div>
          </div>
        </section>

        {/* INFORMACIÓN */}

        <section className="formulario-turno__seccion">
          <h3 className="formulario-turno__seccion-titulo">
            Información del turno
          </h3>

          <div className="row g-3">
            <div className="col-12">
              <label
                className="form-label"
                htmlFor="motivo"
              >
                Motivo
              </label>

              <input
                id="motivo"
                name="motivo"
                type="text"
                value={
                  formulario.motivo
                }
                onChange={manejarCambio}
                className="form-control"
                placeholder="Ej. Control general"
              />
            </div>

            <div className="col-12">
              <label
                className="form-label"
                htmlFor="observaciones"
              >
                Observaciones
              </label>

              <textarea
                id="observaciones"
                name="observaciones"
                value={
                  formulario.observaciones
                }
                onChange={manejarCambio}
                className="form-control"
                rows="3"
                placeholder="Información adicional del turno"
              />
            </div>
          </div>
        </section>
      </div>

      <footer className="formulario-turno__acciones">
        {onCancelar && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancelar}
            disabled={guardando}
          >
            Cancelar
          </button>
        )}

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
              <i className="bi bi-calendar-plus me-2" />
              Crear turno
            </>
          )}
        </button>
      </footer>
    </form>
  );
}