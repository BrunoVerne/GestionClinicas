import { useState } from 'react'
import CartaDePaciente from './components/CartaDePaciente'
import CartaDeMedico from './components/CartaDeMedico'
import HistoriaClinica from './components/HistoriaClinica'

// ── Datos de ejemplo ──────────────────────────────────────────
const pacientes = [
  { dni: 12345678, nombre: 'Juan Pérez', peso: 78, altura: 1.75 },
  { dni: 87654321, nombre: 'María González', peso: 62, altura: 1.63 },
  { dni: 11223344, nombre: 'Carlos Rodríguez', peso: 95, altura: 1.80 },
]

const medicos = [
  { legajo: 1, nombre: 'Ana Torres', especialidad: 'CARDIOLOGIA' },
  { legajo: 2, nombre: 'Luis Herrera', especialidad: 'NEUROLOGIA' },
  { legajo: 3, nombre: 'Sofía Méndez', especialidad: 'PEDIATRIA' },
]

const historias = {
  12345678: {
    expediente: 1001,
    dniPaciente: 12345678,
    paciente: pacientes[0],
    consultas: [
      {
        numeroConsulta: 1,
        fecha: '2024-03-15',
        motivo: 'Dolor en el pecho',
        diagnostico: 'Angina de pecho leve. Se recomienda reposo.',
        observaciones: 'Paciente con antecedentes familiares cardíacos.',
        legajoMedico: 1,
        medico: medicos[0],
      },
      {
        numeroConsulta: 2,
        fecha: '2024-06-20',
        motivo: 'Control de rutina',
        diagnostico: 'Paciente estable. Sin novedades.',
        observaciones: null,
        legajoMedico: 1,
        medico: medicos[0],
      },
    ],
    tratamientos: [
      {
        numeroTratamiento: 1,
        descripcion: 'Atorvastatina 20mg — 1 comprimido por día con la cena.',
        fechaInicio: '2024-03-16',
        activo: true,
        legajoMedico: 1,
        medico: medicos[0],
      },
    ],
    antecedentes: [
      { id: 1, tipo: 'ALERGIAS', descripcion: 'Alergia a la penicilina.' },
      { id: 2, tipo: 'FAMILIAR', descripcion: 'Padre con infarto de miocardio a los 58 años.' },
    ],
    documentos: [
      { numeroDocumento: 1, tipo: 'ESTUDIO_LABORATORIO', archivo: '#', fecha: '2024-03-14' },
      { numeroDocumento: 2, tipo: 'IMAGEN_DIAGNOSTICA', archivo: '#', fecha: '2024-03-14' },
    ],
  },
}
// ─────────────────────────────────────────────────────────────

export default function App() {
  const [vista, setVista] = useState('pacientes') // 'pacientes' | 'medicos' | 'historia'
  const [historiaActiva, setHistoriaActiva] = useState(null)

  const verHistoria = (dni) => {
    setHistoriaActiva(historias[dni] ?? null)
    setVista('historia')
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-primary shadow-sm px-4">
        <span className="navbar-brand fw-bold fs-5">
          <i className="bi bi-hospital me-2" />
          Gestión de Pacientes
        </span>
        <div className="d-flex gap-2">
          <button
            className={`btn btn-sm ${vista === 'pacientes' ? 'btn-light' : 'btn-outline-light'}`}
            onClick={() => setVista('pacientes')}
          >
            <i className="bi bi-people me-1" />Pacientes
          </button>
          <button
            className={`btn btn-sm ${vista === 'medicos' ? 'btn-light' : 'btn-outline-light'}`}
            onClick={() => setVista('medicos')}
          >
            <i className="bi bi-person-badge me-1" />Médicos
          </button>
        </div>
      </nav>

      <div className="container py-4">

        {/* Vista: Pacientes */}
        {vista === 'pacientes' && (
          <>
            <h5 className="fw-semibold mb-3 text-secondary">
              <i className="bi bi-people me-2" />Pacientes registrados
            </h5>
            <div className="row g-3">
              {pacientes.map(p => (
                <div className="col-md-4" key={p.dni}>
                  <CartaDePaciente paciente={p} onVerHistoria={verHistoria} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Vista: Médicos */}
        {vista === 'medicos' && (
          <>
            <h5 className="fw-semibold mb-3 text-secondary">
              <i className="bi bi-person-badge me-2" />Médicos del sistema
            </h5>
            <div className="row g-3">
              {medicos.map(m => (
                <div className="col-md-4" key={m.legajo}>
                  <CartaDeMedico medico={m} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Vista: Historia Clínica */}
        {vista === 'historia' && (
          <>
            <button
              className="btn btn-outline-secondary btn-sm mb-3"
              onClick={() => setVista('pacientes')}
            >
              <i className="bi bi-arrow-left me-1" />Volver
            </button>
            <HistoriaClinica historia={historiaActiva} />
          </>
        )}

      </div>
    </div>
  )
}