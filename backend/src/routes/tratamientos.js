// src/routes/tratamientos.js
const { Router } = require('express');
const prisma = require('../lib/prisma');
const {
  validarDatosTratamiento,
} = require('../utils/validacionTratamiento');

const router = Router();


//POST
router.post('/', async (req, res) => {
  try {
    const validacion = validarDatosTratamiento(req.body);

    if (!validacion.valido) {
      return res.status(400).json({
        error: 'Datos del tratamiento inválidos',
        errores: validacion.errores,
      });
    }

    const {
      dniPaciente,
      descripcion,
      fechaInicio,
      fechaFin,
      legajoMedico,
    } = validacion.datos;

    const historiaClinica =
      await prisma.historiaClinica.findUnique({
        where: {
          dniPaciente,
        },
        include: {
          paciente: true,
        },
      });

    if (!historiaClinica) {
      return res.status(404).json({
        error:
          `No existe una historia clínica para el paciente con DNI ${dniPaciente}`,
      });
    }

    const medico = await prisma.medico.findUnique({
      where: {
        legajo: legajoMedico,
      },
    });

    if (!medico) {
      return res.status(404).json({
        error:
          `No existe un médico con legajo ${legajoMedico}`,
      });
    }

    if (!medico.activo) {
      return res.status(409).json({
        error:
          `El médico con legajo ${legajoMedico} se encuentra inactivo`,
      });
    }

    const tratamiento = await prisma.tratamiento.create({
      data: {
        numeroExpediente: historiaClinica.expediente,
        descripcion,
        fechaInicio,
        fechaFin,
        legajoMedico,
      },
      include: {
        medico: true,
        historiaClinica: {
          include: {
            paciente: true,
          },
        },
      },
    });

    return res.status(201).json(tratamiento);
  } catch (error) {
    console.error('Error al crear tratamiento:', error);

    return res.status(500).json({
      error:
        'Error interno del servidor al crear el tratamiento',
    });
  }
});




// GET TRATAMIENTOS
router.get('/', async (req, res) => {
  try {
    const total = await prisma.tratamiento.findMany();
    res.json({ entidad: 'tratamientos', total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener total de tratamientos' });
  }
});

// GET TRATAMIENTO POR NÚMERO
router.get('/:numeroTratamiento', async (req, res) => {
  const numeroTratamiento = parseInt(req.params.numeroTratamiento);

  if (isNaN(numeroTratamiento)) {
    return res.status(400).json({ error: 'El número de tratamiento debe ser un número entero' });
  }

  try {
    const tratamiento = await prisma.tratamiento.findUnique({
      where: { numeroTratamiento },
      include: {
        medico: true,
        historiaClinica: { include: { paciente: true } }
      }
    });

    if (!tratamiento) {
      return res.status(404).json({ error: `Tratamiento con número ${numeroTratamiento} no encontrado` });
    }

    res.json(tratamiento);
  } catch (error) {
    console.error('Error al obtener tratamiento:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener el tratamiento' });
  }
});

// DELETE TRATAMIENTO
router.delete('/:numeroTratamiento', async (req, res) => {
  const numeroTratamiento = parseInt(req.params.numeroTratamiento);

  if (isNaN(numeroTratamiento)) {
    return res.status(400).json({ error: 'El número de tratamiento debe ser un número entero' });
  }

  try {
    const tratamiento = await prisma.tratamiento.findUnique({ where: { numeroTratamiento } });

    if (!tratamiento) {
      return res.status(404).json({ error: `Tratamiento con número ${numeroTratamiento} no encontrado` });
    }

    await prisma.tratamiento.delete({ where: { numeroTratamiento } });
    res.json({ message: 'Tratamiento eliminado correctamente', numeroTratamiento });
  } catch (error) {
    console.error('Error al eliminar tratamiento:', error);
    res.status(500).json({ error: 'Error interno del servidor al eliminar el tratamiento' });
  }
});



// PATCH FECHA DE FINALIZACIÓN
router.patch('/:numeroTratamiento/fecha-fin', async (req, res) => {
  const numeroTratamiento = Number(
    req.params.numeroTratamiento,
  );

  const { fechaFin } = req.body;

  if (
    !Number.isInteger(numeroTratamiento) ||
    numeroTratamiento <= 0
  ) {
    return res.status(400).json({
      error:
        'El número de tratamiento debe ser un entero válido',
    });
  }

  if (!fechaFin) {
    return res.status(400).json({
      error: 'La fecha de finalización es obligatoria',
    });
  }

  const nuevaFechaFin = new Date(fechaFin);

  if (Number.isNaN(nuevaFechaFin.getTime())) {
    return res.status(400).json({
      error: 'La fecha de finalización no es válida',
    });
  }

  try {
    const tratamientoExistente =
      await prisma.tratamiento.findUnique({
        where: {
          numeroTratamiento,
        },
      });

    if (!tratamientoExistente) {
      return res.status(404).json({
        error: 'Tratamiento no encontrado',
      });
    }

    if (
      nuevaFechaFin <
      new Date(tratamientoExistente.fechaInicio)
    ) {
      return res.status(400).json({
        error:
          'La fecha de finalización no puede ser anterior a la fecha de inicio',
      });
    }

    const tratamientoActualizado =
      await prisma.tratamiento.update({
        where: {
          numeroTratamiento,
        },
        data: {
          fechaFin: nuevaFechaFin,
        },
        include: {
          medico: true,
        },
      });

    return res.json(tratamientoActualizado);
  } catch (error) {
    console.error(
      'Error actualizando fecha del tratamiento:',
      error,
    );

    return res.status(500).json({
      error:
        'Error interno al actualizar el tratamiento',
    });
  }
});

module.exports = router;