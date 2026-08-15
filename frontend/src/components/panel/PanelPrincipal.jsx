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
    legajoMedicoSeleccionado,
    setLegajoMedicoSeleccionado,
  ] = useState(null);

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
  setLegajoMedicoSeleccionado(null);
  };

  

  const mostrarPacientes = () => {
    limpiarSeleccion();
    setVista('pacientes');
  };

  const mostrarMedicos = () => {
    limpiarSeleccion();
    setVista('medicos');
  };

  const mostrarTurnos = () => {
    limpiarSeleccion();
    setVista('turnos');
  };

  const mostrarHistoriaClinica = (dni) => {
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

    setVista('pacientes');
  };

  function agregarMedico(medicoCreado) {
    setMedicos((medicosActuales) => [
      ...medicosActuales,
      medicoCreado,
    ]);

    setVista('medicos');
  }

  function volverAPacientes() {
    setDniSeleccionado(null);
    setVista('pacientes');
  }

  const mostrarDetalleMedico = (legajo) => {
    setLegajoMedicoSeleccionado(legajo);
    setVista('detalleMedico');
  };

const volverAMedicos = () => {
    setLegajoMedicoSeleccionado(null);
    setVista('medicos');
  };


const mostrarCrearTurno = () => {
  limpiarSeleccion();
  setVista('crearTurno');
};



const mostrarCrearPaciente = () => {
  limpiarSeleccion();
  setVista('crearPaciente');
};

const mostrarCrearMedico = () => {
  limpiarSeleccion();
  setVista('crearMedico');
};

const volverATurnos = () => {
  setVista('turnos');
};

const turnoCreado = () => {
  setVista('turnos');
};




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

          

          onPacienteCreado={
            agregarPaciente
          }

          
          
          

          onMostrarCrearPaciente={
            mostrarCrearPaciente
          }

          onMostrarCrearMedico={
            mostrarCrearMedico
          }

          onMedicoCreado={agregarMedico}

          onMostrarHistoriaClinica={
            mostrarHistoriaClinica
          }

          onVolverAPacientes={
            volverAPacientes
          }

          legajoMedicoSeleccionado={
            legajoMedicoSeleccionado
          }

          onMostrarDetalleMedico={
            mostrarDetalleMedico
          }

          onVolverAMedicos={
            volverAMedicos
          }

          onMostrarCrearTurno={
            mostrarCrearTurno
          }

          onVolverATurnos={
            volverATurnos
          }

          onTurnoCreado={
            turnoCreado
          }

          

        />
      </ContenidoPanel>
    </div>
  );
}