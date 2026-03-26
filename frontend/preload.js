const { contextBridge } = require('electron');

const API_URL = 'http://localhost:3001';

contextBridge.exposeInMainWorld('api', {
  // Medicos
  getMedicos: () => fetch(`${API_URL}/medicos`).then(r => r.json()),
  createMedico: (data) => fetch(`${API_URL}/medicos`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  // Pacientes
  getPacientes: () => fetch(`${API_URL}/pacientes`).then(r => r.json()),
  getPaciente: (dni) => fetch(`${API_URL}/pacientes/${dni}`).then(r => r.json()),
  createPaciente: (data) => fetch(`${API_URL}/pacientes`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  // Consultas
  createConsulta: (data) => fetch(`${API_URL}/consultas`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  // Tratamientos
  createTratamiento: (data) => fetch(`${API_URL}/tratamientos`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  desactivarTratamiento: (id) => fetch(`${API_URL}/tratamientos/${id}/desactivar`, {
    method: 'PATCH'
  }).then(r => r.json()),

  // Antecedentes
  createAntecedente: (data) => fetch(`${API_URL}/antecedentes`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  // Documentos
  createDocumento: (data) => fetch(`${API_URL}/documentos`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
});