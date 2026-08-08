import { useState } from 'react';

import useDatosClinica from '../../hooks/useDatosClinica';

import BarraPrincipal from './BarraPrincipal';
import ContenidoPanel from './ContenidoPrincipal';
import RenderizadorVista from './RenderizadorVista';

import '../../styles/panel/panelPrincipal.css';

export default function PanelPrincipal({
  usuario,
  onLogout,
}) {
  const [vista, setVista] =
    useState('pacientes');

  const [
    dniSeleccionado,
    setDniSeleccionado,
  ] = useState(null);

  const [
    mostrandoFormularioPaciente,
    setMostrandoFormularioPaciente,
  ] = useState(false);

  const [
    mostrandoFormularioMedico,
    setMostrandoFormularioMedico,
  ] = useState(false);

  const {
    pacientes,
    setPacientes,
    medicos,
    setMedicos,
    cargandoDatos,
    errorDatos,
  } = useDatosClinica();

  const limpiarSeleccion = () => {
    setDniSeleccionado(null);
  };

  const cerrarFormularios = () => {
    setMostrandoFormularioPaciente(false);
    setMostrandoFormularioMedico(false);
  };

  const mostrarPacientes = () => {
    limpiarSeleccion();
    cerrarFormularios();
    setVista('pacientes');
  };

  const mostrarMedicos = () => {
    limpiarSeleccion();
    cerrarFormularios();
    setVista('medicos');
  };

  const mostrarTurnos = () => {
    limpiarSeleccion();
    cerrarFormularios();
    setVista('turnos');
  };

  const mostrarHistoriaClinica = (dni) => {
    cerrarFormularios();
    setDniSeleccionado(dni);
    setVista('historia');
  };

  const agregarPaciente = (
    pacienteCreado,
  ) => {
    setPacientes(
      (pacientesActuales) =>
        [
          ...pacientesActuales,
          pacienteCreado,
        ].sort((a, b) =>
          a.nombre.localeCompare(
            b.nombre,
            'es',
          ),
        ),
    );

    setMostrandoFormularioPaciente(false);
  };

  function agregarMedico(medicoCreado) {
    setMedicos((medicosActuales) => [
      ...medicosActuales,
      medicoCreado,
    ]);

    setMostrandoFormularioMedico(false);
  }

  function volverAPacientes() {
    setDniSeleccionado(null);
    setVista('pacientes');
  }

  return (
    <div className="panel-principal">
      <BarraPrincipal
        usuario={usuario}
        vista={vista}
        onMostrarPacientes={mostrarPacientes}
        onMostrarMedicos={mostrarMedicos}
        onMostrarTurnos={mostrarTurnos}
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
          dniSeleccionado={
            dniSeleccionado
          }

          mostrandoFormularioPaciente={
            mostrandoFormularioPaciente
          }
          onMostrarFormularioPaciente={() =>
            setMostrandoFormularioPaciente(
              true,
            )
          }
          onCancelarFormularioPaciente={() =>
            setMostrandoFormularioPaciente(
              false,
            )
          }
          onPacienteCreado={
            agregarPaciente
          }

          mostrandoFormularioMedico={
            mostrandoFormularioMedico
          }
          onMostrarFormularioMedico={() =>
            setMostrandoFormularioMedico(
              true,
            )
          }
          onCancelarFormularioMedico={() =>
            setMostrandoFormularioMedico(
              false,
            )
          }
          onMedicoCreado={agregarMedico}

          onMostrarHistoriaClinica={
            mostrarHistoriaClinica
          }

          onVolverAPacientes={
            volverAPacientes
          }
        />
      </ContenidoPanel>
    </div>
  );
}