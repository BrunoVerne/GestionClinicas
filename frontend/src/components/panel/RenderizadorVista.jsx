import VistaPacientes from '../views/VistaPacientes';
import VistaMedicos from '../views/VistaMedicos';
import VistaHistoriaClinica from '../views/VistaHistoriaClinica';
import VistaTurnos from '../views/VistaTurnos';
import VistaDetalleMedico from '../views/VistaDetalleMedico';
import VistaCrearTurno from '../views/VistaCrearTurno';

export default function RenderizadorVista({
  vista,
  pacientes,
  medicos,
  dniSeleccionado,

  mostrandoFormularioPaciente,
  onMostrarFormularioPaciente,
  onCancelarFormularioPaciente,
  onPacienteCreado,

  mostrandoFormularioMedico,
  onMostrarFormularioMedico,
  onCancelarFormularioMedico,
  onMedicoCreado,

  onVolverAPacientes,

  onMostrarHistoriaClinica,
  legajoMedicoSeleccionado,
  onMostrarDetalleMedico,
  onVolverAMedicos,



  onMostrarCrearTurno,
  onVolverATurnos,
  onTurnoCreado,

}) {
  if (vista === 'pacientes') {
    return (
      <VistaPacientes
        pacientes={pacientes}
        mostrandoFormularioPaciente={
          mostrandoFormularioPaciente
        }
        onMostrarFormularioPaciente={
          onMostrarFormularioPaciente
        }
        onCancelarFormularioPaciente={
          onCancelarFormularioPaciente
        }
        onPacienteCreado={onPacienteCreado}
        onVerHistoria={
          onMostrarHistoriaClinica
        }


      />
    );
  }

  if (vista === 'medicos') {
    return (
      <VistaMedicos
        medicos={medicos}
        mostrandoFormularioMedico={
          mostrandoFormularioMedico
        }
        onMostrarFormularioMedico={
          onMostrarFormularioMedico
        }
        onCancelarFormularioMedico={
          onCancelarFormularioMedico
        }
        onMedicoCreado={onMedicoCreado}
        onVerMedico={onMostrarDetalleMedico}
      />
    );
  }

  if (vista === 'turnos') {
    return (
      <VistaTurnos
        onNuevoTurno={onMostrarCrearTurno}
      />
    );
  }

  if (vista === 'crearTurno') {
    return (
      <VistaCrearTurno
        pacientes={pacientes}
        onTurnoCreado={onTurnoCreado}
        onVolver={onVolverATurnos}
      />
    );
  }

  if (vista === 'historia') {
    return (
      <VistaHistoriaClinica
        dni={dniSeleccionado}
        medicos={medicos}
        onVolver={onVolverAPacientes}
      />
    );
  }


  if (vista === 'detalleMedico') {
      return (
        <VistaDetalleMedico
          legajo={
            legajoMedicoSeleccionado
          }
          medicos={medicos}
          onVolver={
            onVolverAMedicos
          }
        />
      );
    }

  return null;
}