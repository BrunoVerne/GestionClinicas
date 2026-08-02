import { useEffect, useState } from 'react';
import { actualizarPaciente } from '../services/pacienteService';
import {
  validarPeso,
  validarAltura
} from '../utils/validacionPaciente';

export default function CondicionFisicaPaciente({
  paciente,
  onPacienteActualizado
}) {
  const [editando, setEditando] = useState(false);
  const [peso, setPeso] = useState(String(paciente.peso ?? ''));
  const [altura, setAltura] = useState(String(paciente.altura ?? ''));
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    setPeso(String(paciente.peso ?? ''));
    setAltura(String(paciente.altura ?? ''));
  }, [paciente]);

  const pesoNumerico = Number(paciente.peso);
  const alturaNumerica = Number(paciente.altura);

  const imcValido =
    Number.isFinite(pesoNumerico) &&
    Number.isFinite(alturaNumerica) &&
    alturaNumerica > 0;

  const imc = imcValido
    ? pesoNumerico / alturaNumerica ** 2
    : null;

  const obtenerEstado = (valorImc) => {
    if (valorImc < 18.5) return 'Bajo peso';
    if (valorImc < 25) return 'Normal';
    if (valorImc < 30) return 'Sobrepeso';
    return 'Obesidad';
  };

  const cancelarEdicion = () => {
    setPeso(String(paciente.peso ?? ''));
    setAltura(String(paciente.altura ?? ''));
    setErrores({});
    setErrorGeneral('');
    setEditando(false);
  };

  const guardarCambios = async (evento) => {
    evento.preventDefault();

    const nuevosErrores = {
      peso: validarPeso(peso),
      altura: validarAltura(altura)
    };

    const erroresPresentes = Object.fromEntries(
      Object.entries(nuevosErrores).filter(([, mensaje]) => mensaje)
    );

    if (Object.keys(erroresPresentes).length > 0) {
      setErrores(erroresPresentes);
      return;
    }

    setErrores({});
    setErrorGeneral('');
    setGuardando(true);

    try {
      const pacienteActualizado = await actualizarPaciente(
        paciente.dni,
        {
          peso: Number(peso),
          altura: Number(altura)
        }
      );

      onPacienteActualizado?.(pacienteActualizado);
      setEditando(false);
    } catch (error) {
      setErrores(error.errores ?? {});
      setErrorGeneral(error.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          Condición Física de {paciente.nombre}
        </h5>

        {!editando && (
          <button
            type="button"
            className="btn btn-light btn-sm"
            onClick={() => setEditando(true)}
          >
            <i className="bi bi-pencil me-1" />
            Editar
          </button>
        )}
      </div>

      <div className="card-body">
        {errorGeneral && (
          <div className="alert alert-danger">
            {errorGeneral}
          </div>
        )}

        {editando ? (
          <form onSubmit={guardarCambios} noValidate>
            <div className="mb-3">
              <label
                htmlFor="pesoPaciente"
                className="form-label fw-semibold"
              >
                Peso en kilogramos
              </label>

              <input
                id="pesoPaciente"
                type="number"
                min="1"
                max="500"
                step="0.1"
                className={`form-control ${
                  errores.peso ? 'is-invalid' : ''
                }`}
                value={peso}
                onChange={(evento) => {
                  setPeso(evento.target.value);

                  if (errores.peso) {
                    setErrores(actuales => ({
                      ...actuales,
                      peso: ''
                    }));
                  }
                }}
                disabled={guardando}
              />

              {errores.peso && (
                <div className="invalid-feedback">
                  {errores.peso}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label
                htmlFor="alturaPaciente"
                className="form-label fw-semibold"
              >
                Altura en metros
              </label>

              <input
                id="alturaPaciente"
                type="number"
                min="0.3"
                max="2.7"
                step="0.01"
                className={`form-control ${
                  errores.altura ? 'is-invalid' : ''
                }`}
                value={altura}
                onChange={(evento) => {
                  setAltura(evento.target.value);

                  if (errores.altura) {
                    setErrores(actuales => ({
                      ...actuales,
                      altura: ''
                    }));
                  }
                }}
                disabled={guardando}
              />

              {errores.altura && (
                <div className="invalid-feedback">
                  {errores.altura}
                </div>
              )}
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={cancelarEdicion}
                disabled={guardando}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="btn btn-info text-white"
                disabled={guardando}
              >
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        ) : (
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

              <span>
                {imc !== null
                  ? `${imc.toFixed(1)} — ${obtenerEstado(imc)}`
                  : 'No disponible'}
              </span>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}