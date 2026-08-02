// src/routes/documentos.js
const { Router } = require('express');
const prisma = require('../lib/prisma');
const {
  validarDatosDocumento,
} = require('../utils/validacionDocumento');

const router = Router();

// POST DOCUMENTO
router.post('/', async (req, res) => {
  try {
    const validacion = validarDatosDocumento(req.body);

    if (!validacion.valido) {
      return res.status(400).json({
        error: 'Datos del documento inválidos',
        errores: validacion.errores,
      });
    }

    const {
      dniPaciente,
      tipo,
      archivo,
      fecha,
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

    const documento = await prisma.documento.create({
      data: {
        numeroExpediente:
          historiaClinica.expediente,
        tipo,
        archivo,
        fecha,
      },
    });

    return res.status(201).json(documento);
  } catch (error) {
    console.error(
      'Error al crear documento:',
      error,
    );

    return res.status(500).json({
      error:
        'Error interno del servidor al crear el documento',
    });
  }
});


// GET DOCUMENTOS
router.get('/', async (req, res) => {
  try {
    const documentos = await prisma.documento.findMany();
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
    const documento = await prisma.documento.findUnique({
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
    const documento = await prisma.documento.findUnique({ where: { numeroDocumento } });

    if (!documento) {
      return res.status(404).json({ error: `Documento con número ${numeroDocumento} no encontrado` });
    }

    await prisma.documento.delete({ where: { numeroDocumento } });
    res.json({ message: 'Documento eliminado correctamente', numeroDocumento });
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    res.status(500).json({ error: 'Error interno del servidor al eliminar el documento' });
  }
});

module.exports = router;