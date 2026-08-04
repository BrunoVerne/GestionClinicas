const { Router } = require('express');

const prisma = require('../lib/prisma');

const {
  validarLegajo,
  validarDatosMedico,
} = require('../utils/validacionMedico');

const router = Router();

const incluirDatosMedico = {
  especialidades: {
    orderBy: {
      especialidad: 'asc',
    },
  },
};

function construirEspecialidadesParaCrear(
  especialidades,
) {
  if (!especialidades) {
    return undefined;
  }

  return {
    create: especialidades.map((especialidad) => ({
      especialidad,
    })),
  };
}

function manejarErrorPrisma(error, res) {
  if (error.name === 'PrismaClientValidationError') {
    return res.status(400).json({
      error:
        'Los datos enviados no coinciden con el modelo Médico',
    });
  }

  if (error.code === 'P2002') {
    const campos = error.meta?.target || [];

    if (
      Array.isArray(campos) &&
      campos.includes('matricula')
    ) {
      return res.status(409).json({
        error:
          'Ya existe un médico con esa matrícula',
      });
    }

    return res.status(409).json({
      error:
        'Ya existe un registro médico con esos datos',
    });
  }

  return res.status(500).json({
    error:
      'Ocurrió un error interno al procesar el médico',
  });
}

// GET TODOS LOS MÉDICOS
router.get('/', async (req, res) => {
  try {
    const medicos = await prisma.medico.findMany({
      include: incluirDatosMedico,
      orderBy: {
        nombre: 'asc',
      },
    });

    return res.json(medicos);
  } catch (error) {
    console.error(
      'Error al obtener médicos:',
      error,
    );

    return res.status(500).json({
      error:
        'Error interno del servidor al obtener los médicos',
    });
  }
});

// GET MÉDICO POR LEGAJO
router.get('/:legajo', async (req, res) => {
  const validacionLegajo = validarLegajo(
    req.params.legajo,
  );

  if (!validacionLegajo.valido) {
    return res.status(400).json({
      error: validacionLegajo.error,
    });
  }

  try {
    const medico = await prisma.medico.findUnique({
      where: {
        legajo: validacionLegajo.valor,
      },

      include: {
        especialidades: {
          orderBy: {
            especialidad: 'asc',
          },
        },

        consultas: true,
        tratamientos: true,
      },
    });

    if (!medico) {
      return res.status(404).json({
        error: `Médico con legajo ${validacionLegajo.valor} no encontrado`,
      });
    }

    return res.json(medico);
  } catch (error) {
    console.error(
      'Error al obtener médico:',
      error,
    );

    return res.status(500).json({
      error:
        'Error interno del servidor al obtener el médico',
    });
  }
});

// POST CREAR MÉDICO
router.post('/', async (req, res) => {
  const validacion = validarDatosMedico(req.body);

  if (!validacion.valido) {
    return res.status(400).json({
      error: 'Datos del médico inválidos',
      errores: validacion.errores,
    });
  }

  try {
    const {
      especialidades,
      ...datosMedico
    } = validacion.datos;

    const medico = await prisma.medico.create({
      data: {
        ...datosMedico,

        especialidades:
          construirEspecialidadesParaCrear(
            especialidades,
          ),
      },

      include: incluirDatosMedico,
    });

    return res.status(201).json(medico);
  } catch (error) {
    console.error(
      'Error al crear médico:',
      error,
    );

    return manejarErrorPrisma(error, res);
  }
});

// PATCH ACTUALIZAR MÉDICO
router.patch('/:legajo', async (req, res) => {
  const validacionLegajo = validarLegajo(
    req.params.legajo,
  );

  if (!validacionLegajo.valido) {
    return res.status(400).json({
      error: validacionLegajo.error,
    });
  }

  const validacion = validarDatosMedico(
    req.body,
    {
      parcial: true,
    },
  );

  if (!validacion.valido) {
    return res.status(400).json({
      error:
        'Datos de actualización del médico inválidos',
      errores: validacion.errores,
    });
  }

  try {
    const medicoExistente =
      await prisma.medico.findUnique({
        where: {
          legajo: validacionLegajo.valor,
        },
        select: {
          legajo: true,
        },
      });

    if (!medicoExistente) {
      return res.status(404).json({
        error: 'Médico no encontrado',
      });
    }

    const {
      especialidades,
      ...datosMedico
    } = validacion.datos;

    const datosActualizacion = {
      ...datosMedico,
    };

    if (
      Object.prototype.hasOwnProperty.call(
        validacion.datos,
        'especialidades',
      )
    ) {
      datosActualizacion.especialidades = {
        deleteMany: {},

        create: especialidades.map(
          (especialidad) => ({
            especialidad,
          }),
        ),
      };
    }

    const medicoActualizado =
      await prisma.medico.update({
        where: {
          legajo: validacionLegajo.valor,
        },

        data: datosActualizacion,

        include: incluirDatosMedico,
      });

    return res.json(medicoActualizado);
  } catch (error) {
    console.error(
      'Error al actualizar médico:',
      error,
    );

    return manejarErrorPrisma(error, res);
  }
});

module.exports = router;
