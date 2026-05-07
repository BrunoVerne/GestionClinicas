// src/routes/consultas.js
const { Router } = require('express');
const prisma = require('../lib/prisma');

const router = Router();

// POST CONSULTA
router.post('/', async (req, res) => {
  const { numeroExpediente, fecha, legajoMedico, motivo, diagnostico, observaciones } = req.body;
  try {
    const consulta = await prisma.Consulta.create({
      data: { numeroExpediente, fecha: new Date(fecha), legajoMedico, motivo, diagnostico, observaciones }
    });
    res.json(consulta);
  } catch (error) {
    console.error('Error al crear consulta:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear la consulta' });
  }
});

// GET CONSULTAS
router.get('/', async (req, res) => {
  try {
    const total = await prisma.Consulta.findMany();
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
    const consulta = await prisma.Consulta.findUnique({
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
    const consulta = await prisma.Consulta.findUnique({ where: { numeroConsulta } });

    if (!consulta) {
      return res.status(404).json({ error: `Consulta con número ${numeroConsulta} no encontrada` });
    }

    await prisma.Consulta.delete({ where: { numeroConsulta } });
    res.json({ message: 'Consulta eliminada correctamente', numeroConsulta });
  } catch (error) {
    console.error('Error al eliminar consulta:', error);
    res.status(500).json({ error: 'Error interno del servidor al eliminar la consulta' });
  }
});

module.exports = router;