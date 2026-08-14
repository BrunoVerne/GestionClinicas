import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import TurnoCard from '../cards/TurnoCard';
import FiltrosTurnos from '../turnos/FiltrosTurnos';

import {
  cancelarTurno,
  obtenerTurnos,
} from '../../services/turnoService';

import '../../styles/views/vistaTurnos.css';

export default function VistaTurnos({
  onNuevoTurno,
}) {
  const [turnos, setTurnos] = useState([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] = useState('');

  const [ordenFecha, setOrdenFecha] =
    useState('asc');

  const [
    filtroEspecialidad,
    setFiltroEspecialidad,
  ] = useState('');

  const [
    filtroMedico,
    setFiltroMedico,
  ] = useState('');

  const [
    filtroEstado,
    setFiltroEstado,
  ] = useState('');

  useEffect(() => {
    cargarTurnos();
  }, []);

  async function cargarTurnos() {
    try {
      setCargando(true);
      setError('');

      const datos = await obtenerTurnos();

      setTurnos(datos);
    } catch (error) {
      console.error(
        'Error cargando turnos:',
        error,
      );

      setError(
        error.message ||
          'No se pudieron cargar los turnos',
      );
    } finally {
      setCargando(false);
    }
  }

  async function manejarCancelarTurno(
    numeroTurno,
  ) {
    const confirmar = window.confirm(
      '¿Querés cancelar este turno?',
    );

    if (!confirmar) {
      return;
    }

    try {
      setError('');

      const turnoCancelado =
        await cancelarTurno(numeroTurno);

      setTurnos((actuales) =>
        actuales.map((turno) =>
          turno.numeroTurno === numeroTurno
            ? {
                ...turno,
                ...turnoCancelado,
              }
            : turno,
        ),
      );
    } catch (error) {
      console.error(
        'Error cancelando turno:',
        error,
      );

      setError(
        error.message ||
          'No se pudo cancelar el turno',
      );
    }
  }

  const especialidades = useMemo(() => {
    return [
      ...new Set(
        turnos
          .map(
            (turno) =>
              turno.especialidad,
          )
          .filter(Boolean),
      ),
    ].sort();
  }, [turnos]);

  const medicos = useMemo(() => {
    const mapaMedicos = new Map();

    turnos.forEach((turno) => {
      const legajo =
        turno.medico?.legajo ??
        turno.legajoMedico;

      if (!legajo) {
        return;
      }

      mapaMedicos.set(legajo, {
        legajo,
        nombre:
          turno.medico?.nombre ??
          `Legajo ${legajo}`,
      });
    });

    return [...mapaMedicos.values()].sort(
      (a, b) =>
        a.nombre.localeCompare(
          b.nombre,
          'es',
        ),
    );
  }, [turnos]);

  const turnosFiltrados = useMemo(() => {
    let resultado = [...turnos];

    if (filtroEspecialidad) {
      resultado = resultado.filter(
        (turno) =>
          turno.especialidad ===
          filtroEspecialidad,
      );
    }

    if (filtroMedico) {
      resultado = resultado.filter(
        (turno) =>
          String(turno.legajoMedico) ===
          String(filtroMedico),
      );
    }

    if (filtroEstado) {
      resultado = resultado.filter(
        (turno) =>
          turno.estado === filtroEstado,
      );
    }

    resultado.sort((a, b) => {
      const diferencia =
        new Date(a.fechaInicio) -
        new Date(b.fechaInicio);

      return ordenFecha === 'asc'
        ? diferencia
        : -diferencia;
    });

    return resultado;
  }, [
    turnos,
    filtroEspecialidad,
    filtroMedico,
    filtroEstado,
    ordenFecha,
  ]);

  function limpiarFiltros() {
    setOrdenFecha('asc');
    setFiltroEspecialidad('');
    setFiltroMedico('');
    setFiltroEstado('');
  }

  const hayFiltrosActivos =
    filtroEspecialidad !== '' ||
    filtroMedico !== '' ||
    filtroEstado !== '';

  if (cargando) {
    return (
      <div className="vista-turnos__carga">
        <div
          className="spinner-border text-primary"
          role="status"
        >
          <span className="visually-hidden">
            Cargando...
          </span>
        </div>

        <span>Cargando turnos...</span>
      </div>
    );
  }

  return (
    <section className="vista-turnos">
      <header className="encabezado-vista">
        <div>
          <span className="etiqueta-vista">
            Agenda
          </span>

          <h1>Turnos</h1>

          <p>
            Administrá los turnos programados y
            consultá la agenda de los profesionales.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onNuevoTurno}
        >
          <i className="bi bi-calendar-plus me-2" />
          Nuevo turno
        </button>
      </header>

      {error && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          {error}
        </div>
      )}

      {turnos.length > 0 && (
        <FiltrosTurnos
          ordenFecha={ordenFecha}
          onOrdenFechaChange={
            setOrdenFecha
          }
          especialidad={
            filtroEspecialidad
          }
          onEspecialidadChange={
            setFiltroEspecialidad
          }
          especialidades={
            especialidades
          }
          medico={filtroMedico}
          onMedicoChange={
            setFiltroMedico
          }
          medicos={medicos}
          estado={filtroEstado}
          onEstadoChange={
            setFiltroEstado
          }
          onLimpiar={limpiarFiltros}
        />
      )}

      {turnos.length === 0 ? (
        <div className="estado-vacio">
          <i className="bi bi-calendar-x" />

          <h2>No hay turnos registrados</h2>

          <p>
            Los turnos agendados aparecerán en
            esta sección.
          </p>
        </div>
      ) : turnosFiltrados.length === 0 ? (
        <div className="estado-vacio">
          <i className="bi bi-funnel" />

          <h2>
            No hay turnos para estos filtros
          </h2>

          <p>
            Modificá los filtros para consultar
            otros turnos.
          </p>

          {hayFiltrosActivos && (
            <button
              type="button"
              className="btn btn-outline-secondary mt-2"
              onClick={limpiarFiltros}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mb-3 text-muted small">
            {turnosFiltrados.length}{' '}
            {turnosFiltrados.length === 1
              ? 'turno encontrado'
              : 'turnos encontrados'}
          </div>

          <div className="vista-turnos__lista">
            {turnosFiltrados.map(
              (turno) => (
                <TurnoCard
                  key={
                    turno.numeroTurno
                  }
                  turno={turno}
                  onCancelar={
                    manejarCancelarTurno
                  }
                />
              ),
            )}
          </div>
        </>
      )}
    </section>
  );
}