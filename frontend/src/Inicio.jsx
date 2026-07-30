import { useEffect, useState } from 'react';
import { obtenerPacientes } from './services/pacienteService';
import { obtenerMedicos } from './services/medicoService';
import PacienteCard from './components/CartaDePaciente';
import CartaDeMedico from './components/CartaDeMedico';
import HistoriaClinica from './components/HistoriaClinica';
import CondicionFisicaPaciente from './components/CondicionFisicaPaciente';
import Login from './Login';

import {
  logout,
  obtenerUsuarioActual,
} from './services/authService';



export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  const [vista, setVista] = useState('pacientes');
  const [dniSeleccionado, setDniSeleccionado] = useState(null);
  const [pacienteActivo, setPacienteActivo] = useState(null);

  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);

  const [cargandoDatos, setCargandoDatos] = useState(false);
  const [errorDatos, setErrorDatos] = useState('');

  useEffect(() => {
    const recuperarSesion = async () => {
      try {
        const usuarioActual = await obtenerUsuarioActual();
        setUsuario(usuarioActual);
      } catch (error) {
        console.error('Error recuperando sesión:', error);
        setUsuario(null);
      } finally {
        setCargandoSesion(false);
      }
    };

    recuperarSesion();
  }, []);

  useEffect(() => 
  {

    if (!usuario) {
      setPacientes([]);
      setMedicos([]);
      return;
    }

      const cargarDatos = async () => {
        setCargandoDatos(true);
        setErrorDatos('');

        try {
          const [pacientesObtenidos, medicosObtenidos] =
            await Promise.all([
              obtenerPacientes(),
              obtenerMedicos(),
            ]);

          setPacientes(pacientesObtenidos);
          setMedicos(medicosObtenidos);
        } catch (error) {
          console.error('Error cargando datos:', error);
          setErrorDatos(error.message);
        } finally {
          setCargandoDatos(false);
        }
      };

      cargarDatos();
    }, [usuario]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      setUsuario(null);
      setVista('pacientes');
      setDniSeleccionado(null);
      setPacienteActivo(null);
    }
  };

  const verHistoria = (dni) => {
    setDniSeleccionado(dni);
    setVista('historia');
  };

  const verCondicionFisica = (paciente) => {
    setPacienteActivo(paciente);
    setVista('condicion');
  };

  if (cargandoSesion) {
    return (
      <main className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div
            className="spinner-border text-primary mb-3"
            role="status"
          />
          <p className="text-secondary mb-0">
            Cargando...
          </p>
        </div>
      </main>
    );
  }

  if (!usuario) {
    return <Login onLogin={setUsuario} />;
  }

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-primary shadow-sm px-4">
        <span className="navbar-brand fw-bold fs-5">
          <i className="bi bi-hospital me-2" />
          Gestión de Pacientes
        </span>

        <div className="d-flex align-items-center gap-3">
          <div className="text-white text-end d-none d-md-block">
            <div className="small fw-semibold">
              {usuario.nombreUsuario}
            </div>

            <div className="small opacity-75">
              {usuario.rol}
            </div>
          </div>

          <button
            className={`btn btn-sm ${
              vista === 'pacientes'
                ? 'btn-light'
                : 'btn-outline-light'
            }`}
            onClick={() => setVista('pacientes')}
          >
            <i className="bi bi-people me-1" />
            Pacientes
          </button>

          <button
            className={`btn btn-sm ${
              vista === 'medicos'
                ? 'btn-light'
                : 'btn-outline-light'
            }`}
            onClick={() => setVista('medicos')}
          >
            <i className="bi bi-person-badge me-1" />
            Médicos
          </button>

          <button
            className="btn btn-sm btn-outline-light"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-1" />
            Salir
          </button>
        </div>
      </nav>

      <div className="container py-4">

        {cargandoDatos && (
          <div className="text-center py-5">
            <div
              className="spinner-border text-primary mb-3"
              role="status"
            />

            <p className="text-secondary mb-0">
              Cargando datos...
            </p>
          </div>
        )}

        {errorDatos && (
          <div className="alert alert-danger">
            {errorDatos}
          </div>
        )}

        {vista === 'pacientes' && (
          <>
            <h5 className="fw-semibold mb-3 text-secondary">
              <i className="bi bi-people me-2" />
              Pacientes registrados
            </h5>

            <div className="row g-3">
              {pacientes.map((paciente) => (
                <div
                  className="col-md-4"
                  key={paciente.dni}
                >
                  <PacienteCard
                    paciente={paciente}
                    onVerHistoria={verHistoria}
                    onVerCondicionFisica={verCondicionFisica}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {vista === 'medicos' && (
          <>
            <h5 className="fw-semibold mb-3 text-secondary">
              <i className="bi bi-person-badge me-2" />
              Médicos del sistema
            </h5>

            <div className="row g-3">
              {medicos.map((medico) => (
                <div
                  className="col-md-4"
                  key={medico.legajo}
                >
                  <CartaDeMedico medico={medico} />
                </div>
              ))}
            </div>
          </>
        )}

        {vista === 'historia' && (
          <>
            <button
              className="btn btn-outline-secondary btn-sm mb-3"
              onClick={() => setVista('pacientes')}
            >
              <i className="bi bi-arrow-left me-1" />
              Volver
            </button>

            <HistoriaClinica dni={dniSeleccionado} />
          </>
        )}

        {vista === 'condicion' && pacienteActivo && (
          <>
            <button
              className="btn btn-outline-secondary btn-sm mb-3"
              onClick={() => setVista('pacientes')}
            >
              <i className="bi bi-arrow-left me-1" />
              Volver
            </button>

            <CondicionFisicaPaciente
              paciente={pacienteActivo}
            />
          </>
        )}
      </div>
    </div>
  );
}