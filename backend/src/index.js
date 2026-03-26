const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ——— MEDICOS ———
app.get('/medicos', async (req, res) => {
  const medicos = await prisma.Medico.findMany();
  res.json(medicos);
});

app.post('/medicos', async (req, res) => {
  const { nombre, especialidad } = req.body;
  const medico = await prisma.Medico.create({ data: { nombre, especialidad } });
  res.json(medico);
});

// ——— PACIENTES ———
app.get('/pacientes', async (req, res) => {
  const pacientes = await prisma.Paciente.findMany({
    include: { historiaClinica: true }
  });
  res.json(pacientes);
});

app.post('/pacientes', async (req, res) => {
  const { dni, nombre, peso, altura } = req.body;
  const paciente = await prisma.Paciente.create({
    data: { dni, nombre, peso, altura }
  });
  res.json(paciente);
});

app.get('/pacientes/:dni', async (req, res) => {
  const paciente = await prisma.Paciente.findUnique({
    where: { dni: parseInt(req.params.dni) },
    include: {
      historiaClinica: {
        include: {
          consultas: { include: { medico: true } },
          tratamientos: { include: { medico: true } },
          antecedentes: true,
          documentos: true
        }
      }
    }
  });
  if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
  res.json(paciente);
});

// ——— HISTORIA CLINICA ———
app.post('/historias', async (req, res) => {
  const { dniPaciente } = req.body;
  const historia = await prisma.HistoriaClinica.create({
    data: { dniPaciente }
  });
  res.json(historia);
});

// ——— CONSULTAS ———
app.post('/consultas', async (req, res) => {
  const { numeroExpediente, fecha, legajoMedico, motivo, diagnostico, observaciones } = req.body;
  const consulta = await prisma.Consulta.create({
    data: {
      numeroExpediente,
      fecha: new Date(fecha),
      legajoMedico,
      motivo,
      diagnostico,
      observaciones
    }
  });
  res.json(consulta);
});

// ——— TRATAMIENTOS ———
app.post('/tratamientos', async (req, res) => {
  const { numeroExpediente, descripcion, fechaInicio, legajoMedico } = req.body;
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
});

app.patch('/tratamientos/:id/desactivar', async (req, res) => {
  const tratamiento = await prisma.Tratamiento.update({
    where: { numeroTratamiento: parseInt(req.params.id) },
    data: { activo: false }
  });
  res.json(tratamiento);
});

// ——— ANTECEDENTES ———
app.post('/antecedentes', async (req, res) => {
  const { numeroExpediente, tipo, descripcion } = req.body;
  const antecedente = await prisma.Antecedente.create({
    data: { numeroExpediente, tipo, descripcion }
  });
  res.json(antecedente);
});

// ——— DOCUMENTOS ———
app.post('/documentos', async (req, res) => {
  const { numeroExpediente, tipo, archivo, fecha } = req.body;
  const documento = await prisma.Documento.create({
    data: { numeroExpediente, tipo, archivo, fecha: new Date(fecha) }
  });
  res.json(documento);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});