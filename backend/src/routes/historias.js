// src/routes/historias.js
const { Router } = require('express');
const prisma = require('../lib/prisma');

const router = Router();

// POST HISTORIA CLÍNICA
router.post('/', async (req, res) => {
  const { dniPaciente } = req.body;
  try {
    const historia = await prisma.HistoriaClinica.create({
      data: { dniPaciente }
    });
    res.json(historia);
  } catch (error) {
    console.error('Error al crear historia clínica:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear la historia clínica' });
  }
});

// GET HISTORIAS CLÍNICAS
router.get('/', async (req, res) => {
  try {
    const total = await prisma.HistoriaClinica.findMany();
    res.json({ entidad: 'historias_clinicas', total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener total de historias clínicas' });
  }
});

module.exports = router;