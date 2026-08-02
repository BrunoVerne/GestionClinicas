import { useEffect, useState } from 'react';

import { obtenerPacientes } from '../services/pacienteService';
import { obtenerMedicos } from '../services/medicoService';

import VistaPacientes from './VistaPacientes';
import VistaMedicos from './VistaMedicos';
import VistaHistoriaClinica from './VistaHistoriaClinica';
import VistaCondicionFisica from './VistaCondicionFisica';

import '../styles/panelPrincipal.css';

export default function PanelPrincipal({
  usuario,
  onLogout,
}) {
  const [vista, setVista] = useState('pacientes');

  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);

  const [dniSeleccionado, setDniSeleccionado] = useState(null);
  const [pacienteActivo, setPacienteActivo] = useState(null);

  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [errorDatos, setErrorDatos] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      setCargandoDatos(true);
      setErrorDatos('');

      try {
        const [
          pacientesObtenidos,
          medicosObtenidos,
        ] = await Promise.all([
          obtenerPacientes(),
          obtenerMedicos(),
        ]);

        setPacientes(pacientesObtenidos);
        setMedicos(medicosObtenidos);
      } catch (error) {
        console.error('Error cargando datos:', error);

        setErrorDatos(
          error.message || 'No se pudieron cargar los datos',
        );
      } finally {
        setCargandoDatos(false);
      }
    };

    cargarDatos();
  }, []);

  const mostrarPacientes = () => {
    setVista('pacientes');
    setDniSeleccionado(null);
    setPacienteActivo(null);
  };

  const mostrarMedicos = () => {
    setVista('medicos');
    setDniSeleccionado(null);
    setPacienteActivo(null);
  };

  const mostrarHistoriaClinica = (dni) => {
    setDniSeleccionado(dni);
    setVista('historia');
  };

  const mostrarCondicionFisica = (paciente) => {
    setPacienteActivo(paciente);
    setVista('condicion');
  };

  const manejarPacienteActualizado = (pacienteActualizado) => {
    setPacienteActivo((pacienteActual) => {
      if (!pacienteActual) {
        return pacienteActualizado;
      }

      return {
        ...pacienteActual,
        ...pacienteActualizado,
      };
    });

    setPacientes((pacientesActuales) =>
      pacientesActuales.map((paciente) =>
        paciente.dni === pacienteActualizado.dni
          ? {
              ...paciente,
              ...pacienteActualizado,
            }
          : paciente,
      ),
    );
  };

  const renderizarVista = () => {
    switch (vista) {
      case 'pacientes':
        return (
          <VistaPacientes
            pacientes={pacientes}
            onVerHistoria={mostrarHistoriaClinica}
            onVerCondicionFisica={mostrarCondicionFisica}
          />
        );

      case 'medicos':
        return (
          <VistaMedicos medicos={medicos} />
        );

      case 'historia':
        return (
          <VistaHistoriaClinica
            dni={dniSeleccionado}
            medicos={medicos}
            onVolver={mostrarPacientes}
          />
        );

      case 'condicion':
        return (
          <VistaCondicionFisica
            paciente={pacienteActivo}
            onVolver={mostrarPacientes}
            onPacienteActualizado={manejarPacienteActualizado}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="panel-principal">
      <nav className="barra-principal">
        <button
          type="button"
          className="marca-clinica"
          onClick={mostrarPacientes}
        >
          <i className="bi bi-hospital" />
          <span>Gestión Clínica</span>
        </button>

        <div className="barra-acciones">
          <div className="usuario-panel">
            <div className="usuario-avatar">
              <i className="bi bi-person-fill" />
            </div>

            <div className="usuario-informacion">
              <span className="usuario-nombre">
                {usuario.nombreUsuario}
              </span>

              <span className="usuario-rol">
                {usuario.rol}
              </span>
            </div>
          </div>

          <button
            type="button"
            className={
              vista === 'pacientes' ||
              vista === 'historia' ||
              vista === 'condicion'
                ? 'boton-navegacion activo'
                : 'boton-navegacion'
            }
            onClick={mostrarPacientes}
          >
            <i className="bi bi-people" />
            <span>Pacientes</span>
          </button>

          <button
            type="button"
            className={
              vista === 'medicos'
                ? 'boton-navegacion activo'
                : 'boton-navegacion'
            }
            onClick={mostrarMedicos}
          >
            <i className="bi bi-person-badge" />
            <span>Médicos</span>
          </button>

          <button
            type="button"
            className="boton-salir"
            onClick={onLogout}
          >
            <i className="bi bi-box-arrow-right" />
            <span>Salir</span>
          </button>
        </div>
      </nav>

      <main className="contenido-principal container py-4">
        {cargandoDatos && (
          <div className="estado-carga">
            <div
              className="spinner-border text-primary"
              role="status"
            />

            <p>Cargando información clínica...</p>
          </div>
        )}

        {!cargandoDatos && errorDatos && (
          <div className="alert alert-danger shadow-sm">
            <i className="bi bi-exclamation-triangle me-2" />
            {errorDatos}
          </div>
        )}

        {!cargandoDatos && !errorDatos && renderizarVista()}
      </main>
    </div>
  );
}