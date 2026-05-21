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



router.get('/:dni', async (req, res) => {
  const { dni } = req.params;
  
  try {
    const historia = await prisma.HistoriaClinica.findUnique({
      where: { 
        dniPaciente: parseInt(dni)  // Convierte el DNI a número
      },
      include: {
        paciente: true,        // Incluye datos del paciente
        consultas: {
          orderBy: { fecha: 'desc' }  // Ordenar por fecha descendente
        },
        tratamientos: {
          orderBy: { fechaInicio: 'desc' }
        },
        antecedentes: true,
        documentos: true
      }
    });
    
    if (!historia) {
      return res.status(404).json({ 
        error: 'No se encontró historia clínica para el DNI proporcionado' 
      });
    }
    
    res.json(historia);
  } catch (error) {
    console.error('Error al obtener historia por DNI:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener la historia clínica' });
  }
});

module.exports = router;