// src/routes/consultas.js
const { Router } = require('express');
const prisma = require('../lib/prisma');

const router = Router();

const {
  validarDatosConsulta,
} = require('../utils/validacionConsulta');

// POST CONSULTA
router.post('/', async (req, res) => {
  const validacion = validarDatosConsulta(req.body);

  if (!validacion.valido) {
    return res.status(400).json({
      error: 'Datos de la consulta inválidos',
      errores: validacion.errores,
    });
  }

  const {
    dniPaciente,
    fecha,
    legajoMedico,
    motivo,
    diagnostico,
    observaciones,
  } = validacion.datos;

  try {
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

    const consulta = await prisma.consulta.create({
      data: {
        numeroExpediente: historiaClinica.expediente,
        fecha,
        legajoMedico,
        motivo,
        diagnostico,
        observaciones,
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

    return res.status(201).json(consulta);
  } catch (error) {
    console.error('Error al crear consulta:', error);

    return res.status(500).json({
      error:
        'Error interno del servidor al crear la consulta',
    });
  }
});

// GET CONSULTAS
router.get('/', async (req, res) => {
  try {
    const total = await prisma.consulta.findMany();
    res.json({ entidad: 'consultas', total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener total de consultas' });
  }
});

// GET CONSULTA POR NÚMERO
router.get('/:numeroConsulta', async (req, res) => {
  const numeroConsulta = parseInt(req.params.numeroConsulta);

  if (isNaN(numeroConsulta)) {
    return res.status(400).json({ error: 'El número de consulta debe ser un número entero' });
  }

  try {
    const consulta = await prisma.consulta.findUnique({
      where: { numeroConsulta },
      include: {
        medico: true,
        historiaClinica: { include: { paciente: true } }
      }
    });

    if (!consulta) {
      return res.status(404).json({ error: `Consulta con número ${numeroConsulta} no encontrada` });
    }

    res.json(consulta);
  } catch (error) {
    console.error('Error al obtener consulta:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener la consulta' });
  }
});

// DELETE CONSULTA
router.delete('/:numeroConsulta', async (req, res) => {
  const numeroConsulta = parseInt(req.params.numeroConsulta);

  if (isNaN(numeroConsulta)) {
    return res.status(400).json({ error: 'El número de consulta debe ser un número entero' });
  }

  try {
    const consulta = await prisma.consulta.findUnique({ where: { numeroConsulta } });

    if (!consulta) {
      return res.status(404).json({ error: `Consulta con número ${numeroConsulta} no encontrada` });
    }

    await prisma.consulta.delete({ where: { numeroConsulta } });
    res.json({ message: 'Consulta eliminada correctamente', numeroConsulta });
  } catch (error) {
    console.error('Error al eliminar consulta:', error);
    res.status(500).json({ error: 'Error interno del servidor al eliminar la consulta' });
  }
});

module.exports = router;