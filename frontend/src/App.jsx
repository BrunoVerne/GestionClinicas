import { useState } from 'react';
import PacienteCard from './components/CartaDePaciente';
import CartaDeMedico from './components/CartaDeMedico';
import HistoriaClinica from './components/HistoriaClinica';
import CondicionFisicaPaciente from './components/CondicionFisicaPaciente';

// ── Datos de ejemplo ──────────────────────────────────────────
const pacientes = [
  { dni: 12345678, nombre: 'Juan Pérez', peso: 78, altura: 1.75 },
  { dni: 87654321, nombre: 'María González', peso: 62, altura: 1.63 },
  { dni: 11223344, nombre: 'Carlos Rodríguez', peso: 95, altura: 1.80 },
];

const medicos = [
  { legajo: 1, nombre: 'Ana Torres', especialidad: 'CARDIOLOGIA' },
  { legajo: 2, nombre: 'Luis Herrera', especialidad: 'NEUROLOGIA' },
  { legajo: 3, nombre: 'Sofía Méndez', especialidad: 'PEDIATRIA' },
];

const historias = {};
// ─────────────────────────────────────────────────────────────

export default function App() {
  // ✅ Estado declarado correctamente al inicio del componente
  const [vista, setVista] = useState('pacientes'); // 'pacientes' | 'medicos' | 'historia' | 'condicion'
  const [historiaActiva, setHistoriaActiva] = useState(null);
  const [pacienteActivo, setPacienteActivo] = useState(null);

  const verHistoria = (dni) => {
    setHistoriaActiva(historias[dni] ?? null);
    setVista('historia');
  };

  const verCondicionFisica = (paciente) => {
    setPacienteActivo(paciente);
    setVista('condicion');
  };

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
        {/* Vista Pacientes */}
        {vista === 'pacientes' && (
          <>
            <h5 className="fw-semibold mb-3 text-secondary">
              <i className="bi bi-people me-2" />Pacientes registrados
            </h5>
            <div className="row g-3">
              {pacientes.map(p => (
                <div className="col-md-4" key={p.dni}>
                  <PacienteCard
                    paciente={p}
                    onVerHistoria={verHistoria}
                    onVerCondicionFisica={verCondicionFisica}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Vista Médicos */}
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

        {/* Vista Historia Clínica */}
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

        {/* Vista Condición Física */}
        {vista === 'condicion' && pacienteActivo && (
          <>
            <button
              className="btn btn-outline-secondary btn-sm mb-3"
              onClick={() => setVista('pacientes')}
            >
              <i className="bi bi-arrow-left me-1" />Volver
            </button>
            <CondicionFisicaPaciente paciente={pacienteActivo} />
          </>
        )}
      </div>
    </div>
  );
}