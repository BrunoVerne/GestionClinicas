export function validarTipoAntecedente(valor) {
  const tipo = String(valor ?? '').trim();

  if (tipo.length < 2) {
    return 'El tipo debe tener al menos 2 caracteres';
  }

  if (tipo.length > 100) {
    return 'El tipo no puede superar los 100 caracteres';
  }

  return '';
}

export function validarDescripcionAntecedente(valor) {
  const descripcion = String(valor ?? '').trim();

  if (descripcion.length < 3) {
    return 'La descripción debe tener al menos 3 caracteres';
  }

  if (descripcion.length > 1000) {
    return 'La descripción no puede superar los 1000 caracteres';
  }

  return '';
}

export function validarFormularioAntecedente({
  tipo,
  descripcion,
}) {
  const errores = {};

  const errorTipo = validarTipoAntecedente(tipo);
  const errorDescripcion =
    validarDescripcionAntecedente(descripcion);

  if (errorTipo) {
    errores.tipo = errorTipo;
  }

  if (errorDescripcion) {
    errores.descripcion = errorDescripcion;
  }

  return {
    valido: Object.keys(errores).length === 0,
    errores,
    datos: {
      tipo: String(tipo ?? '').trim(),
      descripcion: String(descripcion ?? '').trim(),
    },
  };
}