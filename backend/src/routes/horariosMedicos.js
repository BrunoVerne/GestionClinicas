const { Router } = require('express');
const { DiaSemana } = require('@prisma/client');

const prisma = require('../lib/prisma');

const router = Router();

function validarLegajo(valor) {
  const legajo = Number(valor);

  if (!Number.isInteger(legajo) || legajo <= 0) {
    return null;
  }

  return legajo;
}

function validarId(valor) {
  const id = Number(valor);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function convertirHoraAFecha(hora) {
  if (
    typeof hora !== 'string' ||
    !/^\d{2}:\d{2}$/.test(hora)
  ) {
    return null;
  }

  const [horas, minutos] = hora
    .split(':')
    .map(Number);

  if (
    horas < 0 ||
    horas > 23 ||
    minutos < 0 ||
    minutos > 59
  ) {
    return null;
  }

  return new Date(
    Date.UTC(
      1970,
      0,
      1,
      horas,
      minutos,
      0,
      0,
    ),
  );
}

function validarDatosHorario({
  diaSemana,
  horaInicio,
  horaFin,
}) {
  const errores = {};

  if (!Object.values(DiaSemana).includes(diaSemana)) {
    errores.diaSemana =
      'El día de la semana no es válido';
  }

  const inicio = convertirHoraAFecha(horaInicio);
  const fin = convertirHoraAFecha(horaFin);

  if (!inicio) {
    errores.horaInicio =
      'La hora de inicio debe tener formato HH:mm';
  }

  if (!fin) {
    errores.horaFin =
      'La hora de fin debe tener formato HH:mm';
  }

  if (
    inicio &&
    fin &&
    fin.getTime() <= inicio.getTime()
  ) {
    errores.horaFin =
      'La hora de fin debe ser posterior a la hora de inicio';
  }

  if (Object.keys(errores).length > 0) {
    return {
      valido: false,
      errores,
    };
  }

  return {
    valido: true,
    datos: {
      diaSemana,
      horaInicio: inicio,
      horaFin: fin,
    },
  };
}

async function existeSolapamiento({
  legajoMedico,
  diaSemana,
  horaInicio,
  horaFin,
  excluirId = null,
}) {
  const horario = await prisma.horarioMedico.findFirst({
    where: {
      legajoMedico,
      diaSemana,
      activo: true,

      ...(excluirId && {
        id: {
          not: excluirId,
        },
      }),

      horaInicio: {
        lt: horaFin,
      },

      horaFin: {
        gt: horaInicio,
      },
    },
  });

  return Boolean(horario);
}

// GET /horarios-medicos/:legajo
router.get('/:legajo', async (req, res) => {
  const legajo = validarLegajo(req.params.legajo);

  if (!legajo) {
    return res.status(400).json({
      error: 'El legajo no es válido',
    });
  }

  try {
    const medico = await prisma.medico.findUnique({
      where: {
        legajo,
      },

      select: {
        legajo: true,
      },
    });

    if (!medico) {
      return res.status(404).json({
        error: 'Médico no encontrado',
      });
    }

    const horarios =
      await prisma.horarioMedico.findMany({
        where: {
          legajoMedico: legajo,
          activo: true,
        },

        orderBy: [
          {
            diaSemana: 'asc',
          },
          {
            horaInicio: 'asc',
          },
        ],
      });

    return res.json(horarios);
  } catch (error) {
    console.error(
      'Error al obtener horarios del médico:',
      error,
    );

    return res.status(500).json({
      error:
        'Error interno al obtener los horarios del médico',
    });
  }
});

// POST /horarios-medicos/:legajo
router.post('/:legajo', async (req, res) => {
  const legajo = validarLegajo(req.params.legajo);

  if (!legajo) {
    return res.status(400).json({
      error: 'El legajo no es válido',
    });
  }

  const validacion = validarDatosHorario(req.body);

  if (!validacion.valido) {
    return res.status(400).json({
      error: 'Horario inválido',
      errores: validacion.errores,
    });
  }

  try {
    const medico = await prisma.medico.findUnique({
      where: {
        legajo,
      },

      select: {
        legajo: true,
        activo: true,
      },
    });

    if (!medico) {
      return res.status(404).json({
        error: 'Médico no encontrado',
      });
    }

    const {
      diaSemana,
      horaInicio,
      horaFin,
    } = validacion.datos;

    const solapado = await existeSolapamiento({
      legajoMedico: legajo,
      diaSemana,
      horaInicio,
      horaFin,
    });

    if (solapado) {
      return res.status(409).json({
        error:
          'El horario se superpone con otro horario existente del médico',
      });
    }

    const horario =
      await prisma.horarioMedico.create({
        data: {
          diaSemana,
          horaInicio,
          horaFin,
          legajoMedico: legajo,
        },
      });

    return res.status(201).json(horario);
  } catch (error) {
    console.error(
      'Error al crear horario del médico:',
      error,
    );

    if (error.code === 'P2002') {
      return res.status(409).json({
        error:
          'Ese horario ya existe para el médico',
      });
    }

    return res.status(500).json({
      error:
        'Error interno al crear el horario del médico',
    });
  }
});

// PATCH /horarios-medicos/:legajo/:id
router.patch('/:legajo/:id', async (req, res) => {
  const legajo = validarLegajo(req.params.legajo);
  const id = validarId(req.params.id);

  if (!legajo || !id) {
    return res.status(400).json({
      error: 'Legajo o id de horario inválido',
    });
  }

  try {
    const horarioActual =
      await prisma.horarioMedico.findFirst({
        where: {
          id,
          legajoMedico: legajo,
        },
      });

    if (!horarioActual) {
      return res.status(404).json({
        error: 'Horario no encontrado',
      });
    }

    const diaSemana =
      req.body.diaSemana ??
      horarioActual.diaSemana;

    const horaInicioTexto =
      req.body.horaInicio ??
      horarioActual.horaInicio
        .toISOString()
        .slice(11, 16);

    const horaFinTexto =
      req.body.horaFin ??
      horarioActual.horaFin
        .toISOString()
        .slice(11, 16);

    const validacion = validarDatosHorario({
      diaSemana,
      horaInicio: horaInicioTexto,
      horaFin: horaFinTexto,
    });

    if (!validacion.valido) {
      return res.status(400).json({
        error: 'Horario inválido',
        errores: validacion.errores,
      });
    }

    const {
      horaInicio,
      horaFin,
    } = validacion.datos;

    const solapado = await existeSolapamiento({
      legajoMedico: legajo,
      diaSemana,
      horaInicio,
      horaFin,
      excluirId: id,
    });

    if (solapado) {
      return res.status(409).json({
        error:
          'El horario se superpone con otro horario existente del médico',
      });
    }

    const horarioActualizado =
      await prisma.horarioMedico.update({
        where: {
          id,
        },

        data: {
          diaSemana,
          horaInicio,
          horaFin,

          ...(typeof req.body.activo === 'boolean' && {
            activo: req.body.activo,
          }),
        },
      });

    return res.json(horarioActualizado);
  } catch (error) {
    console.error(
      'Error al actualizar horario:',
      error,
    );

    return res.status(500).json({
      error:
        'Error interno al actualizar el horario',
    });
  }
});

// DELETE /horarios-medicos/:legajo/:id
router.delete('/:legajo/:id', async (req, res) => {
  const legajo = validarLegajo(req.params.legajo);
  const id = validarId(req.params.id);

  if (!legajo || !id) {
    return res.status(400).json({
      error: 'Legajo o id de horario inválido',
    });
  }

  try {
    const horario =
      await prisma.horarioMedico.findFirst({
        where: {
          id,
          legajoMedico: legajo,
        },
      });

    if (!horario) {
      return res.status(404).json({
        error: 'Horario no encontrado',
      });
    }

    await prisma.horarioMedico.delete({
      where: {
        id,
      },
    });

    return res.status(204).send();
  } catch (error) {
    console.error(
      'Error al eliminar horario:',
      error,
    );

    return res.status(500).json({
      error:
        'Error interno al eliminar el horario',
    });
  }
});

module.exports = router;