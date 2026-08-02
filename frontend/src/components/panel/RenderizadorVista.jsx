import VistaPacientes from '../VistaPacientes';
import VistaMedicos from '../VistaMedicos';
import HistoriaClinica from '../HistoriaClinica';
import CondicionFisicaPaciente from '../CondicionFisicaPaciente';

export default function RenderizadorVista({
  vista,
  pacientes,
  medicos,
  dniSeleccionado,
  pacienteActivo,

  mostrandoFormularioPaciente,
  onMostrarFormularioPaciente,
  onCancelarFormularioPaciente,
  onPacienteCreado,

  onMostrarPacientes,
  onMostrarHistoriaClinica,
  onMostrarCondicionFisica,
  onPacienteActualizado,
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
        onVerHistoria={onMostrarHistoriaClinica}
        onVerCondicionFisica={
          onMostrarCondicionFisica
        }
      />
    );
  }

  if (vista === 'medicos') {
    return (
      <VistaMedicos
        medicos={medicos}
      />
    );
  }

  if (vista === 'historia') {
    return (
      <HistoriaClinica
        dni={dniSeleccionado}
        medicos={medicos}
        onVolver={onMostrarPacientes}
      />
    );
  }

  if (vista === 'condicion') {
    return (
      <CondicionFisicaPaciente
        paciente={pacienteActivo}
        onPacienteActualizado={
          onPacienteActualizado
        }
        onVolver={onMostrarPacientes}
      />
    );
  }

  return null;
}