// src/routes/documentos.js
const { Router } = require('express');
const prisma = require('../lib/prisma');

const router = Router();

// POST DOCUMENTO
router.post('/', async (req, res) => {
  const { numeroExpediente, tipo, archivo, fecha } = req.body;
  try {
    const documento = await prisma.Documento.create({
      data: { numeroExpediente, tipo, archivo, fecha: new Date(fecha) }
    });
    res.json(documento);
  } catch (error) {
    console.error('Error al crear documento:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear el documento' });
  }
});

// GET DOCUMENTOS
router.get('/', async (req, res) => {
  try {
    const documentos = await prisma.Documento.findMany();
    res.json(documentos);
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener los documentos' });
  }
});

// GET DOCUMENTO POR NÚMERO
router.get('/:numeroDocumento', async (req, res) => {
  const numeroDocumento = parseInt(req.params.numeroDocumento);

  if (isNaN(numeroDocumento)) {
    return res.status(400).json({ error: 'El número de documento debe ser un número entero' });
  }

  try {
    const documento = await prisma.Documento.findUnique({
      where: { numeroDocumento },
      include: {
        historiaClinica: { include: { paciente: true } }
      }
    });

    if (!documento) {
      return res.status(404).json({ error: `Documento con número ${numeroDocumento} no encontrado` });
    }

    res.json(documento);
  } catch (error) {
    console.error('Error al obtener documento:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener el documento' });
  }
});

// DELETE DOCUMENTO
router.delete('/:numeroDocumento', async (req, res) => {
  const numeroDocumento = parseInt(req.params.numeroDocumento);

  if (isNaN(numeroDocumento)) {
    return res.status(400).json({ error: 'El número de documento debe ser un número entero' });
  }

  try {
    const documento = await prisma.Documento.findUnique({ where: { numeroDocumento } });

    if (!documento) {
      return res.status(404).json({ error: `Documento con número ${numeroDocumento} no encontrado` });
    }

    await prisma.Documento.delete({ where: { numeroDocumento } });
    res.json({ message: 'Documento eliminado correctamente', numeroDocumento });
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    res.status(500).json({ error: 'Error interno del servidor al eliminar el documento' });
  }
});

module.exports = router;