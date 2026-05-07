// src/routes/pacientes.js
const { Router } = require('express');
const prisma = require('../lib/prisma');

const router = Router();

// GET PACIENTES
router.get('/', async (req, res) => {
  try {
    const pacientes = await prisma.Paciente.findMany({
      include: { historiaClinica: true }
    });
    res.json(pacientes);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener los pacientes' });
  }
});

// POST PACIENTE
router.post('/', async (req, res) => {
  const { dni, nombre, peso, altura } = req.body;
  try {
    const paciente = await prisma.Paciente.create({
      data: { dni, nombre, peso, altura }
    });
    res.json(paciente);
  } catch (error) {
    console.error('Error al crear paciente:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear el paciente' });
  }
});

// GET PACIENTE POR DNI
router.get('/:dni', async (req, res) => {
  const dni = parseInt(req.params.dni);

  if (isNaN(dni)) {
    return res.status(400).json({ error: 'El DNI debe ser un número entero' });
  }

  try {
    const paciente = await prisma.Paciente.findUnique({
      where: { dni },
      include: {
        historiaClinica: {
          include: {
            consultas:    { include: { medico: true } },
            tratamientos: { include: { medico: true } },
            antecedentes: true,
            documentos:   true
          }
        }
      }
    });

    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    res.json(paciente);
  } catch (error) {
    console.error('Error al obtener paciente:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener el paciente' });
  }
});

module.exports = router;