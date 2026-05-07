// src/routes/antecedentes.js
const { Router } = require('express');
const prisma = require('../lib/prisma');

const router = Router();

// GET ANTECEDENTES
router.get('/', async (req, res) => {
  try {
    const total = await prisma.Antecedente.findMany();
    res.json({ entidad: 'antecedentes', total });
  } catch (error) {
    console.error('Error al obtener total de antecedentes:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener el total de antecedentes' });
  }
});

// GET ANTECEDENTE POR ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'El ID del antecedente debe ser un número entero' });
  }

  try {
    const antecedente = await prisma.Antecedente.findUnique({
      where: { id },
      include: {
        historiaClinica: {
          include: {
            paciente: true
          }
        }
      }
    });

    if (!antecedente) {
      return res.status(404).json({ error: `Antecedente con ID ${id} no encontrado` });
    }

    res.json(antecedente);
  } catch (error) {
    console.error('Error al obtener antecedente:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener el antecedente' });
  }
});

// POST ANTECEDENTE
router.post('/', async (req, res) => {
  const { numeroExpediente, tipo, descripcion } = req.body;
  const antecedente = await prisma.Antecedente.create({
    data: { numeroExpediente, tipo, descripcion }
  });
  res.json(antecedente);
});

// DELETE ANTECEDENTE
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'El ID del antecedente debe ser un número entero' });
  }

  try {
    const antecedente = await prisma.Antecedente.findUnique({ where: { id } });

    if (!antecedente) {
      return res.status(404).json({ error: `Antecedente con ID ${id} no encontrado` });
    }

    await prisma.Antecedente.delete({ where: { id } });
    res.json({ message: 'Antecedente eliminado correctamente', id });
  } catch (error) {
    console.error('Error al eliminar antecedente:', error);
    res.status(500).json({ error: 'Error interno del servidor al eliminar el antecedente' });
  }
});

module.exports = router;