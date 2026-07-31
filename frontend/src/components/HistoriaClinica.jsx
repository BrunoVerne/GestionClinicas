// HistoriaClinica.jsx
import { useState, useEffect } from 'react';
import { getHistoriaByDni } from '../services/historiaService';
import ItemConsulta from './Docs/ItemConsulta'
import ItemTratamiento from './Docs/ItemTratamiento'
import ItemAntecedente from './Docs/ItemAntecedente'
import ItemDocumento from './Docs/ItemDocumentoGenerico'

export default function HistoriaClinica({ dni }) {
  const [historia, setHistoria] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (dni) {
      cargarHistoria();
    }
  }, [dni]);

  const cargarHistoria = async () => {
    setCargando(true);
    setError(null);
    
    try {
      const data = await getHistoriaByDni(dni);
      setHistoria(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
      <p className="mt-2 text-muted">Cargando historia clínica para DNI: {dni}...</p>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger">
      <i className="bi bi-exclamation-triangle me-2" />
      Error: {error}
    </div>
  );

  if (!historia) return (
    <div className="alert alert-info">
      <i className="bi bi-info-circle me-2" />
      No se encontró la historia clínica para el DNI {dni}.
    </div>
  );

  return (
    <div>
      {/* Encabezado */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body bg-primary text-white rounded">
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-folder2-open fs-2" />
            <div>
              <small className="opacity-75">Paciente: {historia.paciente?.nombre} — DNI {historia.dniPaciente}</small>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs - resto igual */}
      <ul className="nav nav-tabs mb-4" id="hcTabs" role="tablist">
        {[
          { id: 'consultas', icon: 'bi-calendar2-check', label: 'Consultas', count: historia.consultas?.length },
          { id: 'tratamientos', icon: 'bi-capsule', label: 'Tratamientos', count: historia.tratamientos?.length },
          { id: 'antecedentes', icon: 'bi-clock-history', label: 'Antecedentes', count: historia.antecedentes?.length },
          { id: 'documentos', icon: 'bi-file-earmark-text', label: 'Documentos', count: historia.documentos?.length },
        ].map((tab, i) => (
          <li className="nav-item" role="presentation" key={tab.id}>
            <button
              className={`nav-link ${i === 0 ? 'active' : ''}`}
              data-bs-toggle="tab"
              data-bs-target={`#${tab.id}`}
              type="button"
            >
              <i className={`bi ${tab.icon} me-1`} />
              {tab.label}
              <span className="badge bg-secondary ms-1">{tab.count ?? 0}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="tab-content">
        <div className="tab-pane fade show active" id="consultas">
          {historia.consultas?.length > 0
            ? historia.consultas.map(c => <ItemConsulta key={c.numeroConsulta} consulta={c} />)
            : <p className="text-muted">Sin consultas registradas.</p>}
        </div>

        <div className="tab-pane fade" id="tratamientos">
          {historia.tratamientos?.length > 0
            ? historia.tratamientos.map(t => <ItemTratamiento key={t.numeroTratamiento} tratamiento={t} />)
            : <p className="text-muted">Sin tratamientos registrados.</p>}
        </div>

        <div className="tab-pane fade" id="antecedentes">
          {historia.antecedentes?.length > 0
            ? historia.antecedentes.map(a => <ItemAntecedente key={a.id} antecedente={a} />)
            : <p className="text-muted">Sin antecedentes registrados.</p>}
        </div>

        <div className="tab-pane fade" id="documentos">
          {historia.documentos?.length > 0
            ? historia.documentos.map(d => <ItemDocumento key={d.numeroDocumento} documento={d} />)
            : <p className="text-muted">Sin documentos registrados.</p>}
        </div>
      </div>
    </div>
  )
}