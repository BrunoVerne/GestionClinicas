const { Router } = require('express');
const { Especialidad } = require('@prisma/client');

const prisma = require('../lib/prisma');

const {
  verificarDisponibilidad,
  validarRangoFechas,
} = require('../services/agendaService');

const router = Router();

router.get('/disponibilidad', async (req, res) => {
  const {
    especialidad,
    fechaInicio,
    fechaFin,
  } = req.query;

  if (
    !Object.values(Especialidad).includes(
      especialidad,
    )
  ) {
    return res.status(400).json({
      error: 'La especialidad no es válida',
    });
  }

  const rango = validarRangoFechas(
    fechaInicio,
    fechaFin,
  );

  if (!rango.valido) {
    return res.status(400).json({
      error: rango.error,
    });
  }

  try {
    const medicos = await prisma.medico.findMany({
      where: {
        activo: true,

        especialidades: {
          some: {
            especialidad,
          },
        },
      },

      select: {
        legajo: true,
        nombre: true,
        matricula: true,
        email: true,
      },

      orderBy: {
        nombre: 'asc',
      },
    });

    const verificaciones = await Promise.all(
      medicos.map(async (medico) => {
        const resultado =
          await verificarDisponibilidad({
            legajoMedico: medico.legajo,
            especialidad,
            fechaInicio:
              rango.fechaInicio,
            fechaFin:
              rango.fechaFin,
          });

        return {
          medico,
          disponible:
            resultado.disponible,
        };
      }),
    );

    const disponibles = verificaciones
      .filter(
        (resultado) =>
          resultado.disponible,
      )
      .map(
        (resultado) =>
          resultado.medico,
      );

    return res.json(disponibles);
  } catch (error) {
    console.error(
      'Error al consultar disponibilidad:',
      error,
    );

    return res.status(500).json({
      error:
        'Error interno al consultar disponibilidad',
    });
  }
});

module.exports = router;