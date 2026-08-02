import { useState } from 'react';

import { crearConsulta } from '../../services/consultaService';

import {
  validarFechaConsulta,
  validarMedicoConsulta,
  validarMotivoConsulta,
  validarDiagnosticoConsulta,
  validarObservacionesConsulta,
} from '../../utils/validacionConsulta';

import '../../styles/formularioConsulta.css';

function obtenerFechaActual() {
  const fecha = new Date();

  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');

  return `${anio}-${mes}-${dia}`;
}

export default function FormularioConsulta({
  dniPaciente,
  medicos,
  onConsultaCreada,
  onCancelar,
}) {
  const [fecha, setFecha] = useState(obtenerFechaActual());
  const [legajoMedico, setLegajoMedico] = useState('');
  const [motivo, setMotivo] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [guardando, setGuardando] = useState(false);

  const validarFormulario = () => {
    const nuevosErrores = {
      fecha: validarFechaConsulta(fecha),
      legajoMedico: validarMedicoConsulta(legajoMedico),
      motivo: validarMotivoConsulta(motivo),
      diagnostico: validarDiagnosticoConsulta(diagnostico),
      observaciones:
        validarObservacionesConsulta(observaciones),
    };

    const erroresPresentes = Object.fromEntries(
      Object.entries(nuevosErrores).filter(
        ([, mensaje]) => mensaje,
      ),
    );

    setErrores(erroresPresentes);

    return Object.keys(erroresPresentes).length === 0;
  };

  const limpiarError = (campo) => {
    setErrores((erroresActuales) => ({
      ...erroresActuales,
      [campo]: '',
    }));
  };

  const guardarConsulta = async (evento) => {
    evento.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setGuardando(true);
    setErrorGeneral('');

    try {
      const consultaCreada = await crearConsulta({
        dniPaciente,
        fecha: `${fecha}T12:00:00.000Z`,
        legajoMedico: Number(legajoMedico),
        motivo: motivo.trim(),
        diagnostico: diagnostico.trim(),
        observaciones: observaciones.trim() || null,
      });

      onConsultaCreada(consultaCreada);
    } catch (error) {
      console.error('Error creando consulta:', error);

      setErrorGeneral(error.message);
      setErrores(error.errores || {});
    } finally {
      setGuardando(false);
    }
  };

  const medicosActivos = medicos.filter(
    (medico) => medico.activo,
  );

  return (
    <form
      className="formulario-consulta"
      onSubmit={guardarConsulta}
      noValidate
    >
      <header className="formulario-consulta-encabezado">
        <div>
          <h3>Nueva consulta</h3>
          <p>
            Registrá la atención médica del paciente.
          </p>
        </div>

        <button
          type="button"
          className="formulario-consulta-cerrar"
          onClick={onCancelar}
          disabled={guardando}
          aria-label="Cerrar formulario"
        >
          <i className="bi bi-x-lg" />
        </button>
      </header>

      {errorGeneral && (
        <div className="alert alert-danger">
          {errorGeneral}
        </div>
      )}

      <div className="formulario-consulta-fila">
        <div className="formulario-consulta-campo">
          <label htmlFor="consultaFecha">
            Fecha
          </label>

          <input
            id="consultaFecha"
            type="date"
            value={fecha}
            max={obtenerFechaActual()}
            className={errores.fecha ? 'campo-invalido' : ''}
            onChange={(evento) => {
              setFecha(evento.target.value);
              limpiarError('fecha');
            }}
            disabled={guardando}
          />

          {errores.fecha && (
            <span className="mensaje-error">
              {errores.fecha}
            </span>
          )}
        </div>

        <div className="formulario-consulta-campo">
          <label htmlFor="consultaMedico">
            Médico
          </label>

          <select
            id="consultaMedico"
            value={legajoMedico}
            className={
              errores.legajoMedico ? 'campo-invalido' : ''
            }
            onChange={(evento) => {
              setLegajoMedico(evento.target.value);
              limpiarError('legajoMedico');
            }}
            disabled={guardando}
          >
            <option value="">
              Seleccionar médico
            </option>

            {medicosActivos.map((medico) => (
              <option
                key={medico.legajo}
                value={medico.legajo}
              >
                {medico.nombre}
              </option>
            ))}
          </select>

          {errores.legajoMedico && (
            <span className="mensaje-error">
              {errores.legajoMedico}
            </span>
          )}
        </div>
      </div>

      <div className="formulario-consulta-campo">
        <label htmlFor="consultaMotivo">
          Motivo de consulta
        </label>

        <input
          id="consultaMotivo"
          type="text"
          value={motivo}
          placeholder="Ejemplo: dolor abdominal"
          className={errores.motivo ? 'campo-invalido' : ''}
          onChange={(evento) => {
            setMotivo(evento.target.value);
            limpiarError('motivo');
          }}
          disabled={guardando}
        />

        {errores.motivo && (
          <span className="mensaje-error">
            {errores.motivo}
          </span>
        )}
      </div>

      <div className="formulario-consulta-campo">
        <label htmlFor="consultaDiagnostico">
          Diagnóstico
        </label>

        <textarea
          id="consultaDiagnostico"
          rows="3"
          value={diagnostico}
          placeholder="Diagnóstico realizado por el profesional"
          className={
            errores.diagnostico ? 'campo-invalido' : ''
          }
          onChange={(evento) => {
            setDiagnostico(evento.target.value);
            limpiarError('diagnostico');
          }}
          disabled={guardando}
        />

        {errores.diagnostico && (
          <span className="mensaje-error">
            {errores.diagnostico}
          </span>
        )}
      </div>

      <div className="formulario-consulta-campo">
        <label htmlFor="consultaObservaciones">
          Observaciones
          <span>Opcional</span>
        </label>

        <textarea
          id="consultaObservaciones"
          rows="3"
          value={observaciones}
          placeholder="Indicaciones, controles o información adicional"
          className={
            errores.observaciones ? 'campo-invalido' : ''
          }
          onChange={(evento) => {
            setObservaciones(evento.target.value);
            limpiarError('observaciones');
          }}
          disabled={guardando}
        />

        {errores.observaciones && (
          <span className="mensaje-error">
            {errores.observaciones}
          </span>
        )}
      </div>

      <footer className="formulario-consulta-acciones">
        <button
          type="button"
          className="boton-cancelar-consulta"
          onClick={onCancelar}
          disabled={guardando}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="boton-guardar-consulta"
          disabled={guardando}
        >
          {guardando ? (
            <>
              <span className="spinner-border spinner-border-sm" />
              Guardando...
            </>
          ) : (
            <>
              <i className="bi bi-check-lg" />
              Guardar consulta
            </>
          )}
        </button>
      </footer>
    </form>
  );
}