export default function CartaDePaciente({ paciente, onVerHistoria, onVerCondicionFisica }) {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-primary text-white d-flex align-items-center gap-2 py-3">
        <i className="bi bi-person-fill fs-4" />
        <div>
          <h6 className="mb-0 fw-semibold">{paciente.nombre}</h6>
          <small className="opacity-75">DNI: {paciente.dni}</small>
        </div>
      </div>
      <div className="card-body">
        {/* Sin contenido adicional */}
      </div>
      <div className="card-footer bg-transparent border-0 pb-3 px-3 d-flex gap-2">
        <button
          className="btn btn-outline-primary w-100 btn-sm"
          onClick={() => onVerHistoria?.(paciente.dni)}
        >
          <i className="bi bi-folder2-open me-1" />
          Historia Clínica
        </button>
        <button
          className="btn btn-outline-secondary w-100 btn-sm"
          onClick={() => onVerCondicionFisica?.(paciente)}
        >
          <i className="bi bi-heart-pulse me-1" />
          Condición Física
        </button>
      </div>
    </div>
  );
}