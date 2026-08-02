// HistoriaClinica.jsx
import { useState, useEffect } from 'react';
import { getHistoriaByDni } from '../services/historiaService';
import ItemConsulta from './Docs/ItemConsulta'
import ItemTratamiento from './Docs/ItemTratamiento'
import ItemAntecedente from './Docs/ItemAntecedente'
import ItemDocumento from './Docs/ItemDocumentoGenerico'
import FormularioConsulta from './Docs/FormularioConsulta';

export default function HistoriaClinica({ dni, medicos }) {
  const [historia, setHistoria] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mostrandoFormularioConsulta, setMostrandoFormularioConsulta] = useState(false);

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

  const agregarConsulta = (consultaCreada) => {
    setHistoria((historiaActual) => ({
      ...historiaActual,
      consultas: [
        consultaCreada,
        ...(historiaActual.consultas || []),
      ],
    }));

    setMostrandoFormularioConsulta(false);
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

      <div className="tab-pane fade show active" id="consultas">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-1">Consultas médicas</h5>

            <small className="text-muted">
              Registro de atenciones del paciente
            </small>
          </div>

          {!mostrandoFormularioConsulta && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                setMostrandoFormularioConsulta(true)
              }
            >
              <i className="bi bi-plus-lg me-1" />
              Nueva consulta
            </button>
          )}
        </div>

        {mostrandoFormularioConsulta && (
          <FormularioConsulta
            dniPaciente={historia.dniPaciente}
            medicos={medicos}
            onConsultaCreada={agregarConsulta}
            onCancelar={() =>
              setMostrandoFormularioConsulta(false)
            }
          />
        )}

        {historia.consultas?.length > 0 ? (
          historia.consultas.map((consulta) => (
            <ItemConsulta
              key={consulta.numeroConsulta}
              consulta={consulta}
            />
          ))
        ) : (
          <p className="text-muted">
            Sin consultas registradas.
          </p>
        )}
      </div>
    </div>
  )


  
}