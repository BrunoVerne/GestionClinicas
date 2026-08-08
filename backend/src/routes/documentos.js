const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const prisma = require('../lib/prisma');

const router = Router();

const CARPETA_DOCUMENTOS = path.join(
  __dirname,
  '../../uploads/documentos',
);

fs.mkdirSync(CARPETA_DOCUMENTOS, {
  recursive: true,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, CARPETA_DOCUMENTOS);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname,
    );

    const nombre =
      `${Date.now()}-${Math.round(
        Math.random() * 1e9,
      )}${extension}`;

    cb(null, nombre);
  },
});

const TIPOS_PERMITIDOS = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
];

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (
      !TIPOS_PERMITIDOS.includes(
        file.mimetype,
      )
    ) {
      return cb(
        new Error(
          'Tipo de archivo no permitido',
        ),
      );
    }

    cb(null, true);
  },
});


// ========================================
// POST documento
// ========================================

router.post(
  '/',
  upload.single('archivo'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error:
            'Debe seleccionar un archivo',
        });
      }

      const dniPaciente = Number(
        req.body.dniPaciente,
      );

      const tipo =
        req.body.tipo?.trim();

      const fecha = req.body.fecha
        ? new Date(req.body.fecha)
        : new Date();

      if (
        !Number.isInteger(dniPaciente) ||
        dniPaciente <= 0
      ) {
        eliminarArchivo(req.file.path);

        return res.status(400).json({
          error:
            'El DNI del paciente no es válido',
        });
      }

      if (!tipo) {
        eliminarArchivo(req.file.path);

        return res.status(400).json({
          error:
            'El tipo de documento es obligatorio',
        });
      }

      if (
        Number.isNaN(fecha.getTime())
      ) {
        eliminarArchivo(req.file.path);

        return res.status(400).json({
          error:
            'La fecha del documento no es válida',
        });
      }

      const historiaClinica =
        await prisma.historiaClinica.findUnique({
          where: {
            dniPaciente,
          },
        });

      if (!historiaClinica) {
        eliminarArchivo(req.file.path);

        return res.status(404).json({
          error:
            `No existe una historia clínica para el paciente con DNI ${dniPaciente}`,
        });
      }

      const documento =
        await prisma.documento.create({
          data: {
            numeroExpediente:
              historiaClinica.expediente,

            tipo,

            archivo:
              `/uploads/documentos/${req.file.filename}`,

            nombreOriginal:
              req.file.originalname,

            mimeType:
              req.file.mimetype,

            tamanio:
              req.file.size,

            fecha,
          },
        });

      return res
        .status(201)
        .json(documento);
    } catch (error) {
      if (req.file?.path) {
        eliminarArchivo(
          req.file.path,
        );
      }

      console.error(
        'Error al crear documento:',
        error,
      );

      return res.status(500).json({
        error:
          'Error interno del servidor al crear el documento',
      });
    }
  },
);


// ========================================
// GET documentos
// ========================================

router.get('/', async (req, res) => {
  try {
    const documentos =
      await prisma.documento.findMany({
        orderBy: {
          fecha: 'desc',
        },
      });

    return res.json(documentos);
  } catch (error) {
    console.error(
      'Error al obtener documentos:',
      error,
    );

    return res.status(500).json({
      error:
        'Error interno del servidor al obtener los documentos',
    });
  }
});


// ========================================
// GET documento
// ========================================

router.get(
  '/:numeroDocumento',
  async (req, res) => {
    const numeroDocumento = Number(
      req.params.numeroDocumento,
    );

    if (
      !Number.isInteger(numeroDocumento) ||
      numeroDocumento <= 0
    ) {
      return res.status(400).json({
        error:
          'El número de documento debe ser un número entero',
      });
    }

    try {
      const documento =
        await prisma.documento.findUnique({
          where: {
            numeroDocumento,
          },

          include: {
            historiaClinica: {
              include: {
                paciente: true,
              },
            },
          },
        });

      if (!documento) {
        return res.status(404).json({
          error:
            `Documento con número ${numeroDocumento} no encontrado`,
        });
      }

      return res.json(documento);
    } catch (error) {
      console.error(
        'Error al obtener documento:',
        error,
      );

      return res.status(500).json({
        error:
          'Error interno del servidor al obtener el documento',
      });
    }
  },
);


// ========================================
// DELETE documento
// ========================================

router.delete(
  '/:numeroDocumento',
  async (req, res) => {
    const numeroDocumento = Number(
      req.params.numeroDocumento,
    );

    if (
      !Number.isInteger(numeroDocumento) ||
      numeroDocumento <= 0
    ) {
      return res.status(400).json({
        error:
          'Número de documento inválido',
      });
    }

    try {
      const documento =
        await prisma.documento.findUnique({
          where: {
            numeroDocumento,
          },
        });

      if (!documento) {
        return res.status(404).json({
          error:
            'Documento no encontrado',
        });
      }

      await prisma.documento.delete({
        where: {
          numeroDocumento,
        },
      });

      const rutaArchivo = path.join(
        __dirname,
        '../..',
        documento.archivo,
      );

      eliminarArchivo(rutaArchivo);

      return res.json({
        message:
          'Documento eliminado correctamente',
        numeroDocumento,
      });
    } catch (error) {
      console.error(
        'Error al eliminar documento:',
        error,
      );

      return res.status(500).json({
        error:
          'Error interno del servidor al eliminar el documento',
      });
    }
  },
);

function eliminarArchivo(ruta) {
  if (
    ruta &&
    fs.existsSync(ruta)
  ) {
    fs.unlinkSync(ruta);
  }
}

module.exports = router;