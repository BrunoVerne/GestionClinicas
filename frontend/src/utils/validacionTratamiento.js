export function validarDescripcionTratamiento(valor) {
  const descripcion = String(valor ?? '').trim();

  if (descripcion.length < 3) {
    return 'La descripción debe tener al menos 3 caracteres';
  }

  if (descripcion.length > 1000) {
    return 'La descripción no puede superar los 1000 caracteres';
  }

  return '';
}

export function validarFechaInicio(valor) {
  if (!valor) {
    return 'La fecha de inicio es obligatoria';
  }

  const fecha = new Date(`${valor}T00:00:00`);

  if (Number.isNaN(fecha.getTime())) {
    return 'La fecha de inicio no es válida';
  }

  return '';
}

export function validarLegajoMedico(valor) {
  const legajo = Number(valor);

  if (!Number.isInteger(legajo) || legajo <= 0) {
    return 'Debe seleccionar un médico válido';
  }

  return '';
}