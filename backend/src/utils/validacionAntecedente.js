const { validarDni } = require('./validacionPaciente');

 
function validarTipoAntecedente(valor) {
  if (typeof valor !== 'string') {
    return {
      valido: false,
      error: 'El tipo debe ser texto',
    };
  }

  const tipo = valor.trim();

  if (tipo.length < 2) {
    return {
      valido: false,
      error: 'El tipo debe tener al menos 2 caracteres',
    };
  }

  if (tipo.length > 100) {
    return {
      valido: false,
      error: 'El tipo no puede superar los 100 caracteres',
    };
  }

  return {
    valido: true,
    valor: tipo,
  };
}

function validarDescripcionAntecedente(valor) {
  if (typeof valor !== 'string') {
    return {
      valido: false,
      error: 'La descripción debe ser texto',
    };
  }

  const descripcion = valor.trim();

  if (descripcion.length < 3) {
    return {
      valido: false,
      error: 'La descripción debe tener al menos 3 caracteres',
    };
  }

  if (descripcion.length > 1000) {
    return {
      valido: false,
      error: 'La descripción no puede superar los 1000 caracteres',
    };
  }

  return {
    valido: true,
    valor: descripcion,
  };
}

function validarDatosAntecedente(datos) {
  const camposPermitidos = [
    'dniPaciente',
    'tipo',
    'descripcion',
  ];

  const camposDesconocidos = Object.keys(datos).filter(
    (campo) => !camposPermitidos.includes(campo),
  );

  if (camposDesconocidos.length > 0) {
    return {
      valido: false,
      errores: {
        general: `Campos no permitidos: ${camposDesconocidos.join(', ')}`,
      },
    };
  }

  const validaciones = {
    dniPaciente: validarDni(datos.dniPaciente),
    tipo: validarTipoAntecedente(datos.tipo),
    descripcion: validarDescripcionAntecedente(
      datos.descripcion,
    ),
  };

  const errores = {};
  const datosValidados = {};

  for (const [campo, resultado] of Object.entries(
    validaciones,
  )) {
    if (!resultado.valido) {
      errores[campo] = resultado.error;
    } else {
      datosValidados[campo] = resultado.valor;
    }
  }

  if (Object.keys(errores).length > 0) {
    return {
      valido: false,
      errores,
    };
  }

  return {
    valido: true,
    datos: datosValidados,
  };
}

module.exports = {
  validarTipoAntecedente,
  validarDescripcionAntecedente,
  validarDatosAntecedente,
};