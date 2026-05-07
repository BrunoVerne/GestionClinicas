// HistoriaClinica.jsx
import ItemConsulta from '../Docs/ItemConsulta'
import ItemTratamiento from '../Docs/ItemTratamiento'
import ItemAntecedente from '../Docs/ItemAntecedente'
import ItemDocumento from '../Docs/ItemDocumento'

export default function HistoriaClinica({ historia }) {
  if (!historia) return (
    <div className="alert alert-info">
      <i className="bi bi-info-circle me-2" />
      No se encontró la historia clínica.
    </div>
  )

  return (
    <div>
      {/* Encabezado */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body bg-primary text-white rounded">
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-folder2-open fs-2" />
            <div>
              <h5 className="mb-0 fw-bold">Historia Clínica #{historia.expediente}</h5>
              <small className="opacity-75">Paciente: {historia.paciente?.nombre} — DNI {historia.dniPaciente}</small>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
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
        {/* Consultas */}
        <div className="tab-pane fade show active" id="consultas">
          {historia.consultas?.length > 0
            ? historia.consultas.map(c => <ConsultaItem key={c.numeroConsulta} consulta={c} />)
            : <p className="text-muted">Sin consultas registradas.</p>}
        </div>

        {/* Tratamientos */}
        <div className="tab-pane fade" id="tratamientos">
          {historia.tratamientos?.length > 0
            ? historia.tratamientos.map(t => <TratamientoItem key={t.numeroTratamiento} tratamiento={t} />)
            : <p className="text-muted">Sin tratamientos registrados.</p>}
        </div>

        {/* Antecedentes */}
        <div className="tab-pane fade" id="antecedentes">
          {historia.antecedentes?.length > 0
            ? historia.antecedentes.map(a => <AntecedenteItem key={a.id} antecedente={a} />)
            : <p className="text-muted">Sin antecedentes registrados.</p>}
        </div>

        {/* Documentos */}
        <div className="tab-pane fade" id="documentos">
          {historia.documentos?.length > 0
            ? historia.documentos.map(d => <DocumentoItem key={d.numeroDocumento} documento={d} />)
            : <p className="text-muted">Sin documentos registrados.</p>}
        </div>
      </div>
    </div>
  )
}