// src/routes/tratamientos.js
const { Router } = require('express');
const prisma = require('../lib/prisma');

const router = Router();

// POST TRATAMIENTO
router.post('/', async (req, res) => {
  const { numeroExpediente, descripcion, fechaInicio, legajoMedico } = req.body;
  try {
    const tratamiento = await prisma.Tratamiento.create({
      data: {
        numeroExpediente,
        descripcion,
        fechaInicio: new Date(fechaInicio),
        activo: true,
        legajoMedico
      }
    });
    res.json(tratamiento);
  } catch (error) {
    console.error('Error al crear tratamiento:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear el tratamiento' });
  }
});

// PATCH DESACTIVAR TRATAMIENTO
router.patch('/:id/desactivar', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'El ID del tratamiento debe ser un número entero' });
  }

  try {
    const tratamiento = await prisma.Tratamiento.update({
      where: { numeroTratamiento: id },
      data: { activo: false }
    });
    res.json(tratamiento);
  } catch (error) {
    console.error('Error al desactivar tratamiento:', error);
    res.status(500).json({ error: 'Error interno del servidor al desactivar el tratamiento' });
  }
});

// GET TRATAMIENTOS
router.get('/', async (req, res) => {
  try {
    const total = await prisma.Tratamiento.findMany();
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
    const tratamiento = await prisma.Tratamiento.findUnique({
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
    const tratamiento = await prisma.Tratamiento.findUnique({ where: { numeroTratamiento } });

    if (!tratamiento) {
      return res.status(404).json({ error: `Tratamiento con número ${numeroTratamiento} no encontrado` });
    }

    await prisma.Tratamiento.delete({ where: { numeroTratamiento } });
    res.json({ message: 'Tratamiento eliminado correctamente', numeroTratamiento });
  } catch (error) {
    console.error('Error al eliminar tratamiento:', error);
    res.status(500).json({ error: 'Error interno del servidor al eliminar el tratamiento' });
  }
});

module.exports = router;