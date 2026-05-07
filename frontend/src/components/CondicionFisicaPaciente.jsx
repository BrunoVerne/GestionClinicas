// CondicionFisicaPaciente.jsx
export default function CondicionFisicaPaciente({ paciente }) {
  // Cálculo del IMC (solo aquí)
  const imc = (paciente.peso / (paciente.altura ** 2)).toFixed(1);
  const obtenerEstado = (imcVal) => {
    if (imcVal < 18.5) return "Bajo peso";
    if (imcVal < 25) return "Normal";
    if (imcVal < 30) return "Sobrepeso";
    return "Obesidad";
  };
  const estado = obtenerEstado(parseFloat(imc));

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-info text-white">
        <h5 className="mb-0">Condición Física de {paciente.nombre}</h5>
      </div>
      <div className="card-body">
        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex justify-content-between">
            <span className="fw-semibold">Peso:</span>
            <span>{paciente.peso} kg</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <span className="fw-semibold">Altura:</span>
            <span>{paciente.altura} m</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <span className="fw-semibold">IMC:</span>
            <span>{imc} — {estado}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}