import VistaPacientes from '../views/VistaPacientes';
import VistaMedicos from '../views/VistaMedicos';
import VistaHistoriaClinica from '../views/VistaHistoriaClinica';

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

  return null;
}