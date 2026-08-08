import { useEffect, useMemo, useState } from 'react';

import FormularioTurno from '../Docs/forms/FormularioTurno';

import {
  cancelarTurno,
  obtenerTurnos,
} from '../../services/turnoService';

import '../../styles/views/vistaTurnos.css';

export default function VistaTurnos({
  pacientes = [],
}) {
  const [turnos, setTurnos] = useState([]);
  const [mostrandoFormulario, setMostrandoFormulario] =
    useState(false);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

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

  function agregarTurno(turnoCreado) {
    setTurnos((actuales) => [
      ...actuales,
      turnoCreado,
    ]);

    setMostrandoFormulario(false);
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

  const turnosOrdenados = useMemo(() => {
    return [...turnos].sort(
      (a, b) =>
        new Date(a.fechaInicio) -
        new Date(b.fechaInicio),
    );
  }, [turnos]);

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

        {!mostrandoFormulario && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              setMostrandoFormulario(true)
            }
          >
            <i className="bi bi-calendar-plus me-2" />
            Nuevo turno
          </button>
        )}
      </header>

      {error && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          {error}
        </div>
      )}

      {mostrandoFormulario && (
        <div className="vista-turnos__formulario">
          <FormularioTurno
            pacientes={pacientes}
            onTurnoCreado={agregarTurno}
            onCancelar={() =>
              setMostrandoFormulario(false)
            }
          />
        </div>
      )}

      {turnosOrdenados.length === 0 ? (
        <div className="estado-vacio">
          <i className="bi bi-calendar-x" />

          <h2>No hay turnos registrados</h2>

          <p>
            Los turnos agendados aparecerán en
            esta sección.
          </p>
        </div>
      ) : (
        <div className="vista-turnos__lista">
          {turnosOrdenados.map((turno) => (
            <TurnoCard
              key={turno.numeroTurno}
              turno={turno}
              onCancelar={
                manejarCancelarTurno
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}

function TurnoCard({
  turno,
  onCancelar,
}) {
  const fechaInicio =
    formatearFecha(turno.fechaInicio);

  const horaInicio =
    formatearHora(turno.fechaInicio);

  const horaFin =
    formatearHora(turno.fechaFin);

  const puedeCancelar = ![
    'CANCELADO',
    'ATENDIDO',
  ].includes(turno.estado);

  return (
    <article
      className={`turno-card turno-card--${turno.estado.toLowerCase()}`}
    >
      <div className="turno-card__fecha">
        <span className="turno-card__dia">
          {fechaInicio}
        </span>

        <strong className="turno-card__hora">
          {horaInicio} – {horaFin}
        </strong>
      </div>

      <div className="turno-card__contenido">
        <div className="turno-card__principal">
          <div>
            <span className="turno-card__etiqueta">
              Paciente
            </span>

            <h2 className="turno-card__paciente">
              {turno.paciente?.nombre ??
                `DNI ${turno.dniPaciente}`}
            </h2>
          </div>

          <EstadoTurno estado={turno.estado} />
        </div>

        <div className="turno-card__datos">
          <DatoTurno
            icono="bi-person-badge"
            etiqueta="Médico"
            valor={
              turno.medico?.nombre ??
              `Legajo ${turno.legajoMedico}`
            }
          />

          <DatoTurno
            icono="bi-heart-pulse"
            etiqueta="Especialidad"
            valor={formatearEspecialidad(
              turno.especialidad,
            )}
          />

          {turno.motivo && (
            <DatoTurno
              icono="bi-chat-left-text"
              etiqueta="Motivo"
              valor={turno.motivo}
            />
          )}
        </div>

        {turno.observaciones && (
          <div className="turno-card__observaciones">
            {turno.observaciones}
          </div>
        )}

        {puedeCancelar && (
          <div className="turno-card__acciones">
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() =>
                onCancelar(turno.numeroTurno)
              }
            >
              <i className="bi bi-x-circle me-1" />
              Cancelar turno
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function DatoTurno({
  icono,
  etiqueta,
  valor,
}) {
  return (
    <div className="turno-card__dato">
      <i className={`bi ${icono}`} />

      <div>
        <span>{etiqueta}</span>
        <strong>{valor}</strong>
      </div>
    </div>
  );
}

function EstadoTurno({ estado }) {
  return (
    <span
      className={`turno-card__estado turno-card__estado--${estado.toLowerCase()}`}
    >
      {formatearEstado(estado)}
    </span>
  );
}

function formatearFecha(fecha) {
  return new Intl.DateTimeFormat('es-AR', {
    timeZone:
      'America/Argentina/Buenos_Aires',
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(fecha));
}

function formatearHora(fecha) {
  return new Intl.DateTimeFormat('es-AR', {
    timeZone:
      'America/Argentina/Buenos_Aires',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(fecha));
}

function formatearEspecialidad(
  especialidad,
) {
  if (!especialidad) {
    return '-';
  }

  return especialidad
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (letra) =>
      letra.toUpperCase(),
    );
}

function formatearEstado(estado) {
  const estados = {
    PENDIENTE: 'Pendiente',
    CONFIRMADO: 'Confirmado',
    ATENDIDO: 'Atendido',
    CANCELADO: 'Cancelado',
    AUSENTE: 'Ausente',
  };

  return estados[estado] ?? estado;
}