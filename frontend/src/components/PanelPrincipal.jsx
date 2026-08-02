import { useState } from 'react';

import useDatosClinica from '../hooks/useDatosClinica';

import BarraPrincipal from './panel/BarraPrincipal';
import ContenidoPanel from './panel/ContenidoPanel';
import RenderizadorVista from './panel/RenderizadorVista';

import '../styles/panelPrincipal.css';

export default function PanelPrincipal({
  usuario,
  onLogout,
}) {
  const [vista, setVista] = useState('pacientes');
  const [dniSeleccionado, setDniSeleccionado] = useState(null);
  const [pacienteActivo, setPacienteActivo] = useState(null);
  const [mostrandoFormularioPaciente,setMostrandoFormularioPaciente,] = useState(false);

  const {
    pacientes,
    setPacientes,
    medicos,
    cargandoDatos,
    errorDatos,
  } = useDatosClinica();

  const limpiarSeleccion = () => {
    setDniSeleccionado(null);
    setPacienteActivo(null);
  };

  const mostrarPacientes = () => {
    limpiarSeleccion();
    setVista('pacientes');
  };

  const mostrarMedicos = () => {
    limpiarSeleccion();
    setVista('medicos');
  };

  const mostrarHistoriaClinica = (dni) => {
    setPacienteActivo(null);
    setDniSeleccionado(dni);
    setVista('historia');
  };

  const mostrarCondicionFisica = (paciente) => {
    setDniSeleccionado(null);
    setPacienteActivo(paciente);
    setVista('condicion');
  };

  const agregarPaciente = (pacienteCreado) => {
    setPacientes((pacientesActuales) =>
      [...pacientesActuales, pacienteCreado].sort(
        (a, b) =>
          a.nombre.localeCompare(b.nombre, 'es'),
      ),
    );

    setMostrandoFormularioPaciente(false);
  };

  const manejarPacienteActualizado = (pacienteActualizado) => {
    setPacienteActivo((pacienteActual) => ({
      ...pacienteActual,
      ...pacienteActualizado,
    }));

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

  return (
    <div className="panel-principal">
      <BarraPrincipal
        usuario={usuario}
        vista={vista}
        onMostrarPacientes={mostrarPacientes}
        onMostrarMedicos={mostrarMedicos}
        onLogout={onLogout}
      />

      <ContenidoPanel
        cargando={cargandoDatos}
        error={errorDatos}
      >
        <RenderizadorVista
          vista={vista}
          pacientes={pacientes}
          medicos={medicos}
          dniSeleccionado={dniSeleccionado}
          pacienteActivo={pacienteActivo}
          mostrandoFormularioPaciente={
            mostrandoFormularioPaciente
          }
          onMostrarFormularioPaciente={() =>
            setMostrandoFormularioPaciente(true)
          }
          onCancelarFormularioPaciente={() =>
            setMostrandoFormularioPaciente(false)
          }
          onPacienteCreado={agregarPaciente}
          onMostrarPacientes={mostrarPacientes}
          onMostrarHistoriaClinica={mostrarHistoriaClinica}
          onMostrarCondicionFisica={mostrarCondicionFisica}
          onPacienteActualizado={manejarPacienteActualizado}
        />
      </ContenidoPanel>
    </div>
  );
}