export function validarFechaConsulta(valor) {
  if (!valor) {
    return 'La fecha es obligatoria';
  }

  const fecha = new Date(`${valor}T00:00:00`);
  const hoy = new Date();

  hoy.setHours(23, 59, 59, 999);

  if (Number.isNaN(fecha.getTime())) {
    return 'La fecha no es válida';
  }

  if (fecha > hoy) {
    return 'La fecha no puede ser futura';
  }

  return '';
}

export function validarMedicoConsulta(valor) {
  const legajo = Number(valor);

  if (!Number.isInteger(legajo) || legajo <= 0) {
    return 'Debe seleccionar un médico';
  }

  return '';
}

export function validarMotivoConsulta(valor) {
  const motivo = String(valor ?? '').trim();

  if (motivo.length < 3) {
    return 'El motivo debe tener al menos 3 caracteres';
  }

  if (motivo.length > 500) {
    return 'El motivo no puede superar los 500 caracteres';
  }

  return '';
}

export function validarDiagnosticoConsulta(valor) {
  const diagnostico = String(valor ?? '').trim();

  if (diagnostico.length < 3) {
    return 'El diagnóstico debe tener al menos 3 caracteres';
  }

  if (diagnostico.length > 1000) {
    return 'El diagnóstico no puede superar los 1000 caracteres';
  }

  return '';
}

export function validarObservacionesConsulta(valor) {
  const observaciones = String(valor ?? '').trim();

  if (observaciones.length > 2000) {
    return 'Las observaciones no pueden superar los 2000 caracteres';
  }

  return '';
}