const { Router } = require('express');

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

function validarFecha(valor) {
  const fecha = new Date(valor);

  if (Number.isNaN(fecha.getTime())) {
    return null;
  }

  return fecha;
}

function validarDatosBloqueo({
  fechaInicio,
  fechaFin,
  motivo,
}) {
  const errores = {};

  const inicio = validarFecha(fechaInicio);
  const fin = validarFecha(fechaFin);

  if (!inicio) {
    errores.fechaInicio =
      'La fecha de inicio no es válida';
  }

  if (!fin) {
    errores.fechaFin =
      'La fecha de fin no es válida';
  }

  if (
    inicio &&
    fin &&
    fin.getTime() <= inicio.getTime()
  ) {
    errores.fechaFin =
      'La fecha de fin debe ser posterior a la fecha de inicio';
  }

  if (
    motivo !== undefined &&
    motivo !== null &&
    typeof motivo !== 'string'
  ) {
    errores.motivo =
      'El motivo debe ser texto';
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
      fechaInicio: inicio,
      fechaFin: fin,

      motivo:
        typeof motivo === 'string' &&
        motivo.trim() !== ''
          ? motivo.trim()
          : null,
    },
  };
}

async function existeSolapamiento({
  legajoMedico,
  fechaInicio,
  fechaFin,
  excluirId = null,
}) {
  const bloqueo =
    await prisma.bloqueoAgendaMedico.findFirst({
      where: {
        legajoMedico,

        ...(excluirId && {
          id: {
            not: excluirId,
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

  return Boolean(bloqueo);
}


// ==========================================
// GET bloqueos de un médico
// ==========================================

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

    const bloqueos =
      await prisma.bloqueoAgendaMedico.findMany({
        where: {
          legajoMedico: legajo,
        },

        orderBy: {
          fechaInicio: 'asc',
        },
      });

    return res.json(bloqueos);
  } catch (error) {
    console.error(
      'Error al obtener bloqueos de agenda:',
      error,
    );

    return res.status(500).json({
      error:
        'Error interno al obtener los bloqueos de agenda',
    });
  }
});


// ==========================================
// POST crear bloqueo
// ==========================================

router.post('/:legajo', async (req, res) => {
  const legajo = validarLegajo(req.params.legajo);

  if (!legajo) {
    return res.status(400).json({
      error: 'El legajo no es válido',
    });
  }

  const validacion = validarDatosBloqueo(
    req.body,
  );

  if (!validacion.valido) {
    return res.status(400).json({
      error: 'Bloqueo inválido',
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
      },
    });

    if (!medico) {
      return res.status(404).json({
        error: 'Médico no encontrado',
      });
    }

    const {
      fechaInicio,
      fechaFin,
      motivo,
    } = validacion.datos;

    const solapado = await existeSolapamiento({
      legajoMedico: legajo,
      fechaInicio,
      fechaFin,
    });

    if (solapado) {
      return res.status(409).json({
        error:
          'El bloqueo se superpone con otro bloqueo existente del médico',
      });
    }

    const bloqueo =
      await prisma.bloqueoAgendaMedico.create({
        data: {
          fechaInicio,
          fechaFin,
          motivo,
          legajoMedico: legajo,
        },
      });

    return res.status(201).json(bloqueo);
  } catch (error) {
    console.error(
      'Error al crear bloqueo de agenda:',
      error,
    );

    return res.status(500).json({
      error:
        'Error interno al crear el bloqueo de agenda',
    });
  }
});


// ==========================================
// PATCH modificar bloqueo
// ==========================================

router.patch(
  '/:legajo/:id',
  async (req, res) => {
    const legajo = validarLegajo(
      req.params.legajo,
    );

    const id = validarId(req.params.id);

    if (!legajo || !id) {
      return res.status(400).json({
        error:
          'Legajo o id de bloqueo inválido',
      });
    }

    try {
      const bloqueoActual =
        await prisma.bloqueoAgendaMedico.findFirst({
          where: {
            id,
            legajoMedico: legajo,
          },
        });

      if (!bloqueoActual) {
        return res.status(404).json({
          error: 'Bloqueo no encontrado',
        });
      }

      const validacion = validarDatosBloqueo({
        fechaInicio:
          req.body.fechaInicio ??
          bloqueoActual.fechaInicio,

        fechaFin:
          req.body.fechaFin ??
          bloqueoActual.fechaFin,

        motivo:
          Object.prototype.hasOwnProperty.call(
            req.body,
            'motivo',
          )
            ? req.body.motivo
            : bloqueoActual.motivo,
      });

      if (!validacion.valido) {
        return res.status(400).json({
          error: 'Bloqueo inválido',
          errores: validacion.errores,
        });
      }

      const {
        fechaInicio,
        fechaFin,
        motivo,
      } = validacion.datos;

      const solapado =
        await existeSolapamiento({
          legajoMedico: legajo,
          fechaInicio,
          fechaFin,
          excluirId: id,
        });

      if (solapado) {
        return res.status(409).json({
          error:
            'El bloqueo se superpone con otro bloqueo existente del médico',
        });
      }

      const bloqueoActualizado =
        await prisma.bloqueoAgendaMedico.update({
          where: {
            id,
          },

          data: {
            fechaInicio,
            fechaFin,
            motivo,
          },
        });

      return res.json(bloqueoActualizado);
    } catch (error) {
      console.error(
        'Error al actualizar bloqueo:',
        error,
      );

      return res.status(500).json({
        error:
          'Error interno al actualizar el bloqueo de agenda',
      });
    }
  },
);


// ==========================================
// DELETE eliminar bloqueo
// ==========================================

router.delete(
  '/:legajo/:id',
  async (req, res) => {
    const legajo = validarLegajo(
      req.params.legajo,
    );

    const id = validarId(req.params.id);

    if (!legajo || !id) {
      return res.status(400).json({
        error:
          'Legajo o id de bloqueo inválido',
      });
    }

    try {
      const bloqueo =
        await prisma.bloqueoAgendaMedico.findFirst({
          where: {
            id,
            legajoMedico: legajo,
          },
        });

      if (!bloqueo) {
        return res.status(404).json({
          error: 'Bloqueo no encontrado',
        });
      }

      await prisma.bloqueoAgendaMedico.delete({
        where: {
          id,
        },
      });

      return res.status(204).send();
    } catch (error) {
      console.error(
        'Error al eliminar bloqueo:',
        error,
      );

      return res.status(500).json({
        error:
          'Error interno al eliminar el bloqueo de agenda',
      });
    }
  },
);

module.exports = router;