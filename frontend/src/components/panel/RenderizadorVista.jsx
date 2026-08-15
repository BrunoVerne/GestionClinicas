import VistaPacientes from '../views/VistaPacientes';
import VistaMedicos from '../views/VistaMedicos';
import VistaHistoriaClinica from '../views/VistaHistoriaClinica';
import VistaTurnos from '../views/VistaTurnos';
import VistaDetalleMedico from '../views/VistaDetalleMedico';
import VistaCrearTurno from '../views/VistaCrearTurno';
import VistaCrearPaciente from '../views/VistaCrearPaciente';
import VistaCrearMedico from '../views/VistaCrearMedico';

export default function RenderizadorVista({
  vista,
  pacientes,
  medicos,
  dniSeleccionado,

  onPacienteCreado,
  onMedicoCreado,

  onVolverAPacientes,

  onMostrarHistoriaClinica,
  legajoMedicoSeleccionado,
  onMostrarDetalleMedico,
  onVolverAMedicos,

  onMostrarCrearTurno,
  onVolverATurnos,
  onTurnoCreado,

  onMostrarCrearPaciente,
  onMostrarCrearMedico,
}) {
      if (vista === 'pacientes') {
        return (
          <VistaPacientes
            pacientes={pacientes}
            onNuevoPaciente={
              onMostrarCrearPaciente
            }
            onVerHistoria={
              onMostrarHistoriaClinica
            }
          />
        );
      }

    if (vista === 'crearPaciente') {
      return (
        <VistaCrearPaciente
          onPacienteCreado={
            onPacienteCreado
          }
          onVolver={
            onVolverAPacientes
          }
        />
      );
    }

  if (vista === 'medicos') {
    return (
      <VistaMedicos
        medicos={medicos}
        onNuevoMedico={
          onMostrarCrearMedico
        }
        onVerMedico={
          onMostrarDetalleMedico
        }
      />
    );
  }

  if (vista === 'crearMedico') {
    return (
      <VistaCrearMedico
        onMedicoCreado={
          onMedicoCreado
        }
        onVolver={
          onVolverAMedicos
        }
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