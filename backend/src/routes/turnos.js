const { Router } = require('express');
const { EstadoTurno, Especialidad } = require('@prisma/client');

const prisma = require('../lib/prisma');

const {
  verificarDisponibilidad,
  validarRangoFechas,
} = require('../services/agendaService');

const router = Router();

function validarId(valor) {
  const id = Number(valor);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function validarEstado(estado) {
  return Object.values(EstadoTurno).includes(estado);
}

function validarEspecialidad(especialidad) {
  return Object.values(Especialidad).includes(especialidad);
}

function validarDatosTurno(datos, { parcial = false } = {}) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
    return {
      valido: false,
      errores: {
        general: 'Los datos del turno no son válidos',
      },
    };
  }

  const errores = {};
  const datosValidados = {};

  if (
    Object.prototype.hasOwnProperty.call(datos, 'dniPaciente')
  ) {
    const dniPaciente = Number(datos.dniPaciente);

    if (
      !Number.isInteger(dniPaciente) ||
      dniPaciente <= 0
    ) {
      errores.dniPaciente =
        'El DNI del paciente no es válido';
    } else {
      datosValidados.dniPaciente = dniPaciente;
    }
  }

  if (
    Object.prototype.hasOwnProperty.call(datos, 'legajoMedico')
  ) {
    const legajoMedico = Number(datos.legajoMedico);

    if (
      !Number.isInteger(legajoMedico) ||
      legajoMedico <= 0
    ) {
      errores.legajoMedico =
        'El legajo del médico no es válido';
    } else {
      datosValidados.legajoMedico = legajoMedico;
    }
  }

  if (
    Object.prototype.hasOwnProperty.call(datos, 'especialidad')
  ) {
    if (!validarEspecialidad(datos.especialidad)) {
      errores.especialidad =
        'La especialidad no es válida';
    } else {
      datosValidados.especialidad =
        datos.especialidad;
    }
  }

  if (
    Object.prototype.hasOwnProperty.call(datos, 'estado')
  ) {
    if (!validarEstado(datos.estado)) {
      errores.estado =
        'El estado del turno no es válido';
    } else {
      datosValidados.estado = datos.estado;
    }
  }

  if (
    Object.prototype.hasOwnProperty.call(datos, 'fechaInicio')
  ) {
    const fechaInicio = new Date(datos.fechaInicio);

    if (Number.isNaN(fechaInicio.getTime())) {
      errores.fechaInicio =
        'La fecha de inicio no es válida';
    } else {
      datosValidados.fechaInicio = fechaInicio;
    }
  }

  if (
    Object.prototype.hasOwnProperty.call(datos, 'fechaFin')
  ) {
    const fechaFin = new Date(datos.fechaFin);

    if (Number.isNaN(fechaFin.getTime())) {
      errores.fechaFin =
        'La fecha de fin no es válida';
    } else {
      datosValidados.fechaFin = fechaFin;
    }
  }

  if (
    Object.prototype.hasOwnProperty.call(datos, 'motivo')
  ) {
    if (
      datos.motivo !== null &&
      typeof datos.motivo !== 'string'
    ) {
      errores.motivo =
        'El motivo debe ser texto';
    } else {
      datosValidados.motivo =
        typeof datos.motivo === 'string'
          ? datos.motivo.trim() || null
          : null;
    }
  }

  if (
    Object.prototype.hasOwnProperty.call(
      datos,
      'observaciones',
    )
  ) {
    if (
      datos.observaciones !== null &&
      typeof datos.observaciones !== 'string'
    ) {
      errores.observaciones =
        'Las observaciones deben ser texto';
    } else {
      datosValidados.observaciones =
        typeof datos.observaciones === 'string'
          ? datos.observaciones.trim() || null
          : null;
    }
  }

  if (!parcial) {
    if (!datosValidados.dniPaciente) {
      errores.dniPaciente =
        errores.dniPaciente ??
        'Debe seleccionar un paciente';
    }

    if (!datosValidados.legajoMedico) {
      errores.legajoMedico =
        errores.legajoMedico ??
        'Debe seleccionar un médico';
    }

    if (!datosValidados.especialidad) {
      errores.especialidad =
        errores.especialidad ??
        'Debe seleccionar una especialidad';
    }

    if (!datosValidados.fechaInicio) {
      errores.fechaInicio =
        errores.fechaInicio ??
        'Debe indicar la fecha de inicio';
    }

    if (!datosValidados.fechaFin) {
      errores.fechaFin =
        errores.fechaFin ??
        'Debe indicar la fecha de fin';
    }
  }

  if (
    datosValidados.fechaInicio &&
    datosValidados.fechaFin
  ) {
    const rango = validarRangoFechas(
      datosValidados.fechaInicio,
      datosValidados.fechaFin,
    );

    if (!rango.valido) {
      errores.fechaFin = rango.error;
    }
  }

  if (Object.keys(errores).length > 0) {
    return {
      valido: false,
      errores,
    };
  }

  return {
    valido: true,
    datos: datosValidados,
  };
}


// ==========================================
// GET todos los turnos
// ==========================================

router.get('/', async (req, res) => {
  try {
    const turnos = await prisma.turno.findMany({
      include: {
        paciente: {
          select: {
            dni: true,
            nombre: true,
            email: true,
            telefono: true,
          },
        },

        medico: {
          select: {
            legajo: true,
            nombre: true,
            matricula: true,
          },
        },

        consulta: {
          select: {
            numeroConsulta: true,
          },
        },
      },

      orderBy: {
        fechaInicio: 'asc',
      },
    });

    return res.json(turnos);
  } catch (error) {
    console.error(
      'Error al obtener los turnos:',
      error,
    );

    return res.status(500).json({
      error: 'Error interno al obtener los turnos',
    });
  }
});


// ==========================================
// GET un turno
// ==========================================

router.get('/:numeroTurno', async (req, res) => {
  const numeroTurno = validarId(
    req.params.numeroTurno,
  );

  if (!numeroTurno) {
    return res.status(400).json({
      error: 'El número de turno no es válido',
    });
  }

  try {
    const turno = await prisma.turno.findUnique({
      where: {
        numeroTurno,
      },

      include: {
        paciente: true,
        medico: {
          include: {
            especialidades: true,
          },
        },
        consulta: true,
      },
    });

    if (!turno) {
      return res.status(404).json({
        error: 'Turno no encontrado',
      });
    }

    return res.json(turno);
  } catch (error) {
    console.error(
      'Error al obtener el turno:',
      error,
    );

    return res.status(500).json({
      error: 'Error interno al obtener el turno',
    });
  }
});


// ==========================================
// POST crear turno
// ==========================================

router.post('/', async (req, res) => {
  const validacion = validarDatosTurno(req.body);

  if (!validacion.valido) {
    return res.status(400).json({
      error: 'Turno inválido',
      errores: validacion.errores,
    });
  }

  const {
    dniPaciente,
    legajoMedico,
    especialidad,
    fechaInicio,
    fechaFin,
    motivo,
    observaciones,
    estado,
  } = validacion.datos;

  try {
    const paciente = await prisma.paciente.findUnique({
      where: {
        dni: dniPaciente,
      },

      select: {
        dni: true,
      },
    });

    if (!paciente) {
      return res.status(404).json({
        error: 'Paciente no encontrado',
      });
    }

    const disponibilidad =
      await verificarDisponibilidad({
        legajoMedico,
        especialidad,
        fechaInicio,
        fechaFin,
      });

    if (!disponibilidad.disponible) {
      return res.status(409).json({
        error: disponibilidad.motivo,
      });
    }

    const turno = await prisma.turno.create({
      data: {
        dniPaciente,
        legajoMedico,
        especialidad,
        fechaInicio,
        fechaFin,
        motivo,
        observaciones,

        ...(estado && {
          estado,
        }),
      },

      include: {
        paciente: true,

        medico: {
          select: {
            legajo: true,
            nombre: true,
            matricula: true,
          },
        },
      },
    });

    return res.status(201).json(turno);
  } catch (error) {
    console.error(
      'Error al crear el turno:',
      error,
    );

    return res.status(500).json({
      error: 'Error interno al crear el turno',
    });
  }
});


// ==========================================
// PATCH modificar turno
// ==========================================

router.patch(
  '/:numeroTurno',
  async (req, res) => {
    const numeroTurno = validarId(
      req.params.numeroTurno,
    );

    if (!numeroTurno) {
      return res.status(400).json({
        error: 'El número de turno no es válido',
      });
    }

    const validacion = validarDatosTurno(
      req.body,
      {
        parcial: true,
      },
    );

    if (!validacion.valido) {
      return res.status(400).json({
        error: 'Turno inválido',
        errores: validacion.errores,
      });
    }

    try {
      const turnoActual =
        await prisma.turno.findUnique({
          where: {
            numeroTurno,
          },
        });

      if (!turnoActual) {
        return res.status(404).json({
          error: 'Turno no encontrado',
        });
      }

      const datos = validacion.datos;

      const dniPaciente =
        datos.dniPaciente ??
        turnoActual.dniPaciente;

      const legajoMedico =
        datos.legajoMedico ??
        turnoActual.legajoMedico;

      const especialidad =
        datos.especialidad ??
        turnoActual.especialidad;

      const fechaInicio =
        datos.fechaInicio ??
        turnoActual.fechaInicio;

      const fechaFin =
        datos.fechaFin ??
        turnoActual.fechaFin;

      if (
        datos.dniPaciente !== undefined
      ) {
        const paciente =
          await prisma.paciente.findUnique({
            where: {
              dni: dniPaciente,
            },

            select: {
              dni: true,
            },
          });

        if (!paciente) {
          return res.status(404).json({
            error: 'Paciente no encontrado',
          });
        }
      }

      const estadoFinal =
        datos.estado ??
        turnoActual.estado;

      /*
       * Si el turno pasa a CANCELADO,
       * ya no necesitamos verificar
       * disponibilidad.
       */
      if (
        estadoFinal !== EstadoTurno.CANCELADO
      ) {
        const disponibilidad =
          await verificarDisponibilidad({
            legajoMedico,
            especialidad,
            fechaInicio,
            fechaFin,
            excluirNumeroTurno:
              numeroTurno,
          });

        if (!disponibilidad.disponible) {
          return res.status(409).json({
            error: disponibilidad.motivo,
          });
        }
      }

      const turnoActualizado =
        await prisma.turno.update({
          where: {
            numeroTurno,
          },

          data: datos,

          include: {
            paciente: true,

            medico: {
              select: {
                legajo: true,
                nombre: true,
                matricula: true,
              },
            },
          },
        });

      return res.json(turnoActualizado);
    } catch (error) {
      console.error(
        'Error al actualizar turno:',
        error,
      );

      return res.status(500).json({
        error:
          'Error interno al actualizar el turno',
      });
    }
  },
);


// ==========================================
// PATCH cancelar turno
// ==========================================

router.patch(
  '/:numeroTurno/cancelar',
  async (req, res) => {
    const numeroTurno = validarId(
      req.params.numeroTurno,
    );

    if (!numeroTurno) {
      return res.status(400).json({
        error: 'El número de turno no es válido',
      });
    }

    try {
      const turno =
        await prisma.turno.findUnique({
          where: {
            numeroTurno,
          },
        });

      if (!turno) {
        return res.status(404).json({
          error: 'Turno no encontrado',
        });
      }

      if (
        turno.estado === EstadoTurno.CANCELADO
      ) {
        return res.status(409).json({
          error: 'El turno ya está cancelado',
        });
      }

      if (
        turno.estado === EstadoTurno.ATENDIDO
      ) {
        return res.status(409).json({
          error:
            'No se puede cancelar un turno ya atendido',
        });
      }

      const turnoCancelado =
        await prisma.turno.update({
          where: {
            numeroTurno,
          },

          data: {
            estado: EstadoTurno.CANCELADO,
          },
        });

      return res.json(turnoCancelado);
    } catch (error) {
      console.error(
        'Error al cancelar turno:',
        error,
      );

      return res.status(500).json({
        error:
          'Error interno al cancelar el turno',
      });
    }
  },
);

module.exports = router;