// DocumentoItem.jsx
const TIPO_CONFIG = {
  ESTUDIO_LABORATORIO: { label: 'Laboratorio',       icon: 'bi-droplet',          color: 'info' },
  IMAGEN_DIAGNOSTICA:  { label: 'Imagen Diagnóstica', icon: 'bi-image',            color: 'purple' },
  RECETA:              { label: 'Receta',             icon: 'bi-file-earmark-plus', color: 'success' },
  INFORME_MEDICO:      { label: 'Informe Médico',     icon: 'bi-file-earmark-text', color: 'primary' },
  CONSENTIMIENTO:      { label: 'Consentimiento',     icon: 'bi-pen',              color: 'warning' },
  OTRO:                { label: 'Otro',               icon: 'bi-paperclip',        color: 'secondary' },
}

export default function DocumentoItem({ documento }) {
  const config = TIPO_CONFIG[documento.tipo] || TIPO_CONFIG.OTRO
  const fecha = new Date(documento.fecha).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric'
  })

  return (
    <div className="card border-0 shadow-sm mb-2">
      <div className="card-body d-flex align-items-center gap-3">
        <div className={`text-${config.color} fs-3`}>
          <i className={`bi ${config.icon}`} />
        </div>
        <div className="flex-grow-1">
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className={`badge bg-${config.color}-subtle text-${config.color}`}>
              {config.label}
            </span>
            <small className="text-muted">#{documento.numeroDocumento}</small>
          </div>
          <small className="text-muted">
            <i className="bi bi-calendar3 me-1" />{fecha}
          </small>
        </div>
        <a
          href={documento.archivo}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-secondary btn-sm"
        >
          <i className="bi bi-download" />
        </a>
      </div>
    </div>
  )
}