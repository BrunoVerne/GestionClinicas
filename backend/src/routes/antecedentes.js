// src/routes/antecedentes.js
const { Router } = require('express');
const prisma = require('../lib/prisma');

const router = Router();
const {
  validarDatosAntecedente,
} = require('../utils/validacionAntecedente');

// GET ANTECEDENTES
router.get('/', async (req, res) => {
  try {
    const total = await prisma.antecedente.findMany();
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
    const antecedente = await prisma.antecedente.findUnique({
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
  try {
    const validacion = validarDatosAntecedente(
      req.body,
    );

    if (!validacion.valido) {
      return res.status(400).json({
        error: 'Datos del antecedente inválidos',
        errores: validacion.errores,
      });
    }

    const {
      dniPaciente,
      tipo,
      descripcion,
    } = validacion.datos;

    const historiaClinica =
      await prisma.historiaClinica.findUnique({
        where: {
          dniPaciente,
        },
      });

    if (!historiaClinica) {
      return res.status(404).json({
        error:
          `No existe una historia clínica para el paciente con DNI ${dniPaciente}`,
      });
    }

    const antecedente =
      await prisma.antecedente.create({
        data: {
          numeroExpediente:
            historiaClinica.expediente,
          tipo,
          descripcion,
        },
      });

    return res.status(201).json(antecedente);
  } catch (error) {
    console.error(
      'Error al crear antecedente:',
      error,
    );

    return res.status(500).json({
      error:
        'Error interno del servidor al crear el antecedente',
    });
  }
});

// DELETE ANTECEDENTE
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'El ID del antecedente debe ser un número entero' });
  }

  try {
    const antecedente = await prisma.antecedente.findUnique({ where: { id } });

    if (!antecedente) {
      return res.status(404).json({ error: `Antecedente con ID ${id} no encontrado` });
    }

    await prisma.antecedente.delete({ where: { id } });
    res.json({ message: 'Antecedente eliminado correctamente', id });
  } catch (error) {
    console.error('Error al eliminar antecedente:', error);
    res.status(500).json({ error: 'Error interno del servidor al eliminar el antecedente' });
  }
});

module.exports = router;