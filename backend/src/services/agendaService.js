const {
  EstadoTurno,
} = require('@prisma/client');

const prisma = require('../lib/prisma');

const ZONA_HORARIA =
  process.env.TZ_APP ||
  'America/Argentina/Buenos_Aires';

const ESTADOS_QUE_OCUPAN_AGENDA = [
  EstadoTurno.PENDIENTE,
  EstadoTurno.CONFIRMADO,
];

const MAPA_DIAS = {
  domingo: 'DOMINGO',
  lunes: 'LUNES',
  martes: 'MARTES',
  miércoles: 'MIERCOLES',
  jueves: 'JUEVES',
  viernes: 'VIERNES',
  sábado: 'SABADO',
};

function obtenerPartesFecha(fecha) {
  const formatter = new Intl.DateTimeFormat(
    'es-AR',
    {
      timeZone: ZONA_HORARIA,
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    },
  );

  const partes = formatter.formatToParts(fecha);

  return Object.fromEntries(
    partes.map(({ type, value }) => [
      type,
      value,
    ]),
  );
}

function obtenerDiaSemana(fecha) {
  const partes = obtenerPartesFecha(fecha);

  return MAPA_DIAS[
    partes.weekday.toLowerCase()
  ];
}

function obtenerHoraComoFecha(fecha) {
  const partes = obtenerPartesFecha(fecha);

  return new Date(
    Date.UTC(
      1970,
      0,
      1,
      Number(partes.hour),
      Number(partes.minute),
      Number(partes.second),
      0,
    ),
  );
}

function validarRangoFechas(
  fechaInicio,
  fechaFin,
) {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);

  if (
    Number.isNaN(inicio.getTime()) ||
    Number.isNaN(fin.getTime())
  ) {
    return {
      valido: false,
      error:
        'Las fechas del turno no son válidas',
    };
  }

  if (fin <= inicio) {
    return {
      valido: false,
      error:
        'La fecha de fin debe ser posterior a la fecha de inicio',
    };
  }

  return {
    valido: true,
    fechaInicio: inicio,
    fechaFin: fin,
  };
}

async function obtenerMedicoConAgenda(
  legajoMedico,
) {
  return prisma.medico.findUnique({
    where: {
      legajo: legajoMedico,
    },

    include: {
      especialidades: true,

      horarios: {
        where: {
          activo: true,
        },
      },
    },
  });
}

function medicoTieneEspecialidad(
  medico,
  especialidad,
) {
  return medico.especialidades.some(
    (relacion) =>
      relacion.especialidad === especialidad,
  );
}

function turnoDentroDeHorario(
  medico,
  fechaInicio,
  fechaFin,
) {
  const diaInicio =
    obtenerDiaSemana(fechaInicio);

  const diaFin =
    obtenerDiaSemana(fechaFin);

  /*
   * No permitimos turnos que crucen
   * de un día al siguiente.
   */
  if (diaInicio !== diaFin) {
    return false;
  }

  const horaInicioTurno =
    obtenerHoraComoFecha(fechaInicio);

  const horaFinTurno =
    obtenerHoraComoFecha(fechaFin);

  return medico.horarios.some(
    (horario) => {
      if (
        horario.diaSemana !== diaInicio
      ) {
        return false;
      }

      return (
        horario.horaInicio <=
          horaInicioTurno &&
        horario.horaFin >=
          horaFinTurno
      );
    },
  );
}

async function existeBloqueoAgenda({
  legajoMedico,
  fechaInicio,
  fechaFin,
}) {
  const bloqueo =
    await prisma.bloqueoAgendaMedico.findFirst({
      where: {
        legajoMedico,

        fechaInicio: {
          lt: fechaFin,
        },

        fechaFin: {
          gt: fechaInicio,
        },
      },
    });

  return Boolean(bloqueo);
}

async function existeTurnoSuperpuesto({
  legajoMedico,
  fechaInicio,
  fechaFin,
  excluirNumeroTurno = null,
}) {
  const turno =
    await prisma.turno.findFirst({
      where: {
        legajoMedico,

        estado: {
          in: ESTADOS_QUE_OCUPAN_AGENDA,
        },

        ...(excluirNumeroTurno && {
          numeroTurno: {
            not: excluirNumeroTurno,
          },
        }),

        fechaInicio: {
          lt: fechaFin,
        },

        fechaFin: {
          gt: fechaInicio,
        },
      },
    });

  return Boolean(turno);
}

async function verificarDisponibilidad({
  legajoMedico,
  especialidad,
  fechaInicio,
  fechaFin,
  excluirNumeroTurno = null,
}) {
  const rango = validarRangoFechas(
    fechaInicio,
    fechaFin,
  );

  if (!rango.valido) {
    return {
      disponible: false,
      motivo: rango.error,
    };
  }

  const medico =
    await obtenerMedicoConAgenda(
      legajoMedico,
    );

  if (!medico) {
    return {
      disponible: false,
      motivo: 'Médico no encontrado',
    };
  }

  if (!medico.activo) {
    return {
      disponible: false,
      motivo:
        'El médico se encuentra inactivo',
    };
  }

  if (
    !medicoTieneEspecialidad(
      medico,
      especialidad,
    )
  ) {
    return {
      disponible: false,
      motivo:
        'El médico no atiende la especialidad seleccionada',
    };
  }

  if (
    !turnoDentroDeHorario(
      medico,
      rango.fechaInicio,
      rango.fechaFin,
    )
  ) {
    return {
      disponible: false,
      motivo:
        'El horario solicitado está fuera del horario laboral del médico',
    };
  }

  const bloqueado =
    await existeBloqueoAgenda({
      legajoMedico,
      fechaInicio:
        rango.fechaInicio,
      fechaFin:
        rango.fechaFin,
    });

  if (bloqueado) {
    return {
      disponible: false,
      motivo:
        'El médico no está disponible en ese horario',
    };
  }

  const turnoSuperpuesto =
    await existeTurnoSuperpuesto({
      legajoMedico,
      fechaInicio:
        rango.fechaInicio,
      fechaFin:
        rango.fechaFin,
      excluirNumeroTurno,
    });

  if (turnoSuperpuesto) {
    return {
      disponible: false,
      motivo:
        'El médico ya tiene un turno asignado en ese horario',
    };
  }

  return {
    disponible: true,
    medico,
    fechaInicio:
      rango.fechaInicio,
    fechaFin:
      rango.fechaFin,
  };
}

module.exports = {
  validarRangoFechas,
  obtenerMedicoConAgenda,
  medicoTieneEspecialidad,
  turnoDentroDeHorario,
  existeBloqueoAgenda,
  existeTurnoSuperpuesto,
  verificarDisponibilidad,
};