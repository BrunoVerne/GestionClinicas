// HistoriaClinica.jsx
import { useState, useEffect } from 'react';
import { getHistoriaByDni } from '../../services/historiaService';
import ItemConsulta from '../docs/items/ItemConsulta'
import ItemTratamiento from '../docs/items/ItemTratamiento'
import ItemAntecedente from '../docs/items/ItemAntecedente'
import ItemDocumento from '../docs/items/ItemDocumentoGenerico'
import FormularioConsulta from '../docs/forms/FormularioConsulta';
import FormularioTratamiento from '../docs/forms/FormularioTratamiento';
import FormularioAntecedente from '../docs/forms/FormularioAntecedente';
import FormularioDocumento from '../docs/forms/FormularioDocumento';

export default function HistoriaClinica({ dni, medicos }) {
  const [historia, setHistoria] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mostrandoFormularioConsulta, setMostrandoFormularioConsulta] = useState(false);
  const [mostrandoFormularioTratamiento,setMostrandoFormularioTratamiento,] = useState(false);
  const [mostrandoFormularioAntecedente,setMostrandoFormularioAntecedente,] = useState(false);
  const [mostrandoFormularioDocumento,setMostrandoFormularioDocumento] = useState(false);

  const agregarTratamiento = (tratamientoCreado) => {
    setHistoria((historiaActual) => ({
      ...historiaActual,
      tratamientos: [
        tratamientoCreado,
        ...(historiaActual.tratamientos || []),
      ],
    }));

    setMostrandoFormularioTratamiento(false);
  };

  const agregarAntecedente = (antecedenteCreado) => {
    setHistoria((historiaActual) => ({
      ...historiaActual,
      antecedentes: [
        antecedenteCreado,
        ...(historiaActual.antecedentes || []),
      ],
    }));

    setMostrandoFormularioAntecedente(false);
  };

  const agregarDocumento = (documentoCreado) => {
    setHistoria((historiaActual) => ({
      ...historiaActual,

      documentos: [
        documentoCreado,
        ...(historiaActual.documentos || []),
      ],
    }));

    setMostrandoFormularioDocumento(false);
  };

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

  const quitarConsulta = (numeroConsulta) => {
    setHistoria((historiaActual) => ({
      ...historiaActual,
      consultas: historiaActual.consultas.filter(
        (consulta) =>
          consulta.numeroConsulta !== numeroConsulta,
      ),
    }));
  };


  const actualizarTratamiento = (tratamientoActualizado) => {
    setHistoria((historiaActual) => ({
      ...historiaActual,
      tratamientos: (
        historiaActual.tratamientos || []
      ).map((tratamiento) =>
        tratamiento.numeroTratamiento ===
        tratamientoActualizado.numeroTratamiento
          ? tratamientoActualizado
          : tratamiento,
      ),
    }));
  };

  const quitarTratamiento = (numeroTratamiento) => {
    setHistoria((historiaActual) => ({
      ...historiaActual,
      tratamientos: (
        historiaActual.tratamientos || []
      ).filter(
        (tratamiento) =>
          tratamiento.numeroTratamiento !==
          numeroTratamiento,
      ),
    }));
  };

  const quitarAntecedente = (id) => {
    setHistoria((historiaActual) => ({
      ...historiaActual,
      antecedentes: (
        historiaActual.antecedentes || []
      ).filter(
        (antecedente) => antecedente.id !== id,
      ),
    }));
  };

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
              onConsultaEliminada={quitarConsulta}

            />
          ))
        ) : (
          <p className="text-muted">
            Sin consultas registradas.
          </p>
        )}
      </div>


      <div className="tab-pane fade" id="tratamientos" role="tabpanel">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-1">
              Tratamientos
            </h5>

            <small className="text-muted">
              Tratamientos indicados al paciente
            </small>
          </div>

          {!mostrandoFormularioTratamiento && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                setMostrandoFormularioTratamiento(true)
              }
            >
              <i className="bi bi-plus-lg me-1" />
              Nuevo tratamiento
            </button>
          )}
        </div>

        {mostrandoFormularioTratamiento && (
          <FormularioTratamiento
            dniPaciente={historia.dniPaciente}
            medicos={medicos}
            onTratamientoCreado={agregarTratamiento}
            onCancelar={() =>
              setMostrandoFormularioTratamiento(false)
            }
          />
        )}

        {historia.tratamientos?.length > 0 ? (
          historia.tratamientos.map((tratamiento) => (
            <ItemTratamiento
              key={tratamiento.numeroTratamiento}
              tratamiento={tratamiento}
              onTratamientoActualizado={actualizarTratamiento}
              onTratamientoEliminado={quitarTratamiento}
            />
          ))
        ) : (
          <p className="text-muted">
            Sin tratamientos registrados.
          </p>
        )}
      </div>
      
        <div className="tab-pane fade" id="antecedentes" role="tabpanel">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="mb-1">
                Antecedentes
              </h5>

              <small className="text-muted">
                Antecedentes médicos del paciente
              </small>
            </div>

            {!mostrandoFormularioAntecedente && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  setMostrandoFormularioAntecedente(true)
                }
              >
                <i className="bi bi-plus-lg me-1" />
                Nuevo antecedente
              </button>
            )}
          </div>

          {mostrandoFormularioAntecedente && (
            <FormularioAntecedente
              dniPaciente={historia.dniPaciente}
              onAntecedenteCreado={agregarAntecedente}
              onCancelar={() =>
                setMostrandoFormularioAntecedente(false)
              }
            />
          )}

          {historia.antecedentes?.length > 0 ? (
            historia.antecedentes.map((antecedente) => (
              <ItemAntecedente
                key={antecedente.id}
                antecedente={antecedente}
                onAntecedenteEliminado={quitarAntecedente}
              />
            ))
          ) : (
            <p className="text-muted">
              Sin antecedentes registrados.
            </p>
          )}
        </div>

        <div
  className="tab-pane fade"
  id="documentos"
  role="tabpanel"
>
    
  <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-1">
              Documentos
            </h5>

            <small className="text-muted">
              Documentación clínica del paciente
            </small>
          </div>

          {!mostrandoFormularioDocumento && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                setMostrandoFormularioDocumento(true)
              }
            >
              <i className="bi bi-paperclip me-1" />
              Agregar documento
            </button>
          )}
        </div>

        {mostrandoFormularioDocumento && (
          <div className="mb-4">
            <FormularioDocumento
              dniPaciente={historia.dniPaciente}
              onDocumentoCreado={agregarDocumento}
              onCancelar={() =>
                setMostrandoFormularioDocumento(false)
              }
            />
          </div>
        )}

        {historia.documentos?.length > 0 ? (
          historia.documentos.map((documento) => (
            <ItemDocumento
              key={documento.numeroDocumento}
              documento={documento}
            />
          ))
        ) : (
          <p className="text-muted">
            Sin documentos registrados.
          </p>
        )}
      </div>
    </div>
  </div>
  )


  
}