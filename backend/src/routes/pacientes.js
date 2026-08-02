// src/routes/pacientes.js
const { Router } = require('express');
const prisma = require('../lib/prisma');
const {
  validarDni,
  validarDatosPaciente
} = require('../utils/validacionPaciente');

const router = Router();

// GET TODOS LOS PACIENTES
router.get('/', async (req, res) => {
  try {
    const pacientes = await prisma.paciente.findMany({
      include: {
        historiaClinica: true
      },
      orderBy: {
        nombre: 'asc'
      }
    });

    return res.json(pacientes);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);

    return res.status(500).json({
      error: 'Error interno del servidor al obtener los pacientes'
    });
  }
});

// POST CREAR PACIENTE
router.post('/', async (req, res) => {
  const validacion = validarDatosPaciente(req.body);

  if (!validacion.valido) {
    return res.status(400).json({
      error: 'Datos del paciente inválidos',
      errores: validacion.errores
    });
  }

  try {
    const paciente = await prisma.paciente.create({
      data: validacion.datos
    });

    return res.status(201).json(paciente);
  } catch (error) {
    console.error('Error al crear paciente:', error);

    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Ya existe un paciente con ese DNI'
      });
    }

    return res.status(500).json({
      error: 'Error interno del servidor al crear el paciente'
    });
  }
});

// GET PACIENTE POR DNI
router.get('/:dni', async (req, res) => {
  const validacionDni = validarDni(req.params.dni);

  if (!validacionDni.valido) {
    return res.status(400).json({
      error: validacionDni.error
    });
  }

  try {
    const paciente = await prisma.paciente.findUnique({
      where: {
        dni: validacionDni.valor
      },
      include: {
        historiaClinica: {
          include: {
            consultas: {
              include: {
                medico: true
              }
            },
            tratamientos: {
              include: {
                medico: true
              }
            },
            antecedentes: true,
            documentos: true
          }
        }
      }
    });

    if (!paciente) {
      return res.status(404).json({
        error: 'Paciente no encontrado'
      });
    }

    return res.json(paciente);
  } catch (error) {
    console.error('Error al obtener paciente:', error);

    return res.status(500).json({
      error: 'Error interno del servidor al obtener el paciente'
    });
  }
});

// PATCH ACTUALIZAR PARCIALMENTE UN PACIENTE
router.patch('/:dni', async (req, res) => {
  const validacionDni = validarDni(req.params.dni);

  if (!validacionDni.valido) {
    return res.status(400).json({
      error: validacionDni.error
    });
  }

  const validacionDatos = validarDatosPaciente(req.body, {
    parcial: true
  });

  if (!validacionDatos.valido) {
    return res.status(400).json({
      error: 'Datos de actualización inválidos',
      errores: validacionDatos.errores
    });
  }

  try {
    const pacienteExistente = await prisma.paciente.findUnique({
      where: {
        dni: validacionDni.valor
      }
    });

    if (!pacienteExistente) {
      return res.status(404).json({
        error: 'Paciente no encontrado'
      });
    }

    const pacienteActualizado = await prisma.paciente.update({
      where: {
        dni: validacionDni.valor
      },
      data: validacionDatos.datos
    });

    return res.json(pacienteActualizado);
  } catch (error) {
    console.error('Error al actualizar paciente:', error);

    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Ya existe otro paciente con ese DNI'
      });
    }

    return res.status(500).json({
      error: 'Error interno del servidor al actualizar el paciente'
    });
  }
});

module.exports = router;