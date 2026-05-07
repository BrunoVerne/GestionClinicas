// src/routes/medicos.js
const { Router } = require('express');
const prisma = require('../lib/prisma');

const router = Router();

// GET MEDICOS
router.get('/', async (req, res) => {
  try {
    const medicos = await prisma.Medico.findMany();
    res.json(medicos);
  } catch (error) {
    console.error('Error al obtener médicos:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener los médicos' });
  }
});

// GET MEDICO POR LEGAJO
router.get('/:legajo', async (req, res) => {
  const legajo = parseInt(req.params.legajo);

  if (isNaN(legajo)) {
    return res.status(400).json({ error: 'El legajo debe ser un número entero' });
  }

  try {
    const medico = await prisma.Medico.findUnique({
      where: { legajo },
      include: {
        consultas: true,
        tratamientos: true
      }
    });

    if (!medico) {
      return res.status(404).json({ error: `Médico con legajo ${legajo} no encontrado` });
    }

    res.json(medico);
  } catch (error) {
    console.error('Error al obtener médico:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener el médico' });
  }
});

// POST MEDICO
router.post('/', async (req, res) => {
  const { nombre, especialidad } = req.body;
  try {
    const medico = await prisma.Medico.create({ data: { nombre, especialidad } });
    res.json(medico);
  } catch (error) {
    console.error('Error al crear médico:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear el médico' });
  }
});

module.exports = router;