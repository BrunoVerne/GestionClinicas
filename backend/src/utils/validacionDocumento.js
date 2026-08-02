const { validarDni } = require('./validacionPaciente');

function validarTipoDocumento(valor) {
  if (typeof valor !== 'string') {
    return {
      valido: false,
      error: 'El tipo de documento debe ser texto',
    };
  }

  const tipo = valor.trim();

  if (tipo.length < 2) {
    return {
      valido: false,
      error:
        'El tipo de documento debe tener al menos 2 caracteres',
    };
  }

  if (tipo.length > 100) {
    return {
      valido: false,
      error:
        'El tipo de documento no puede superar los 100 caracteres',
    };
  }

  return {
    valido: true,
    valor: tipo,
  };
}

function validarArchivoDocumento(valor) {
  if (typeof valor !== 'string') {
    return {
      valido: false,
      error: 'La ubicación del archivo debe ser texto',
    };
  }

  const archivo = valor.trim();

  if (archivo.length < 3) {
    return {
      valido: false,
      error: 'Debe indicar la ubicación del archivo',
    };
  }

  if (archivo.length > 1000) {
    return {
      valido: false,
      error:
        'La ubicación del archivo no puede superar los 1000 caracteres',
    };
  }

  return {
    valido: true,
    valor: archivo,
  };
}

function validarFechaDocumento(valor) {
  if (!valor) {
    return {
      valido: false,
      error: 'La fecha del documento es obligatoria',
    };
  }

  const fecha = new Date(valor);

  if (Number.isNaN(fecha.getTime())) {
    return {
      valido: false,
      error: 'La fecha del documento no es válida',
    };
  }

  return {
    valido: true,
    valor: fecha,
  };
}

function validarDatosDocumento(datos) {
  const camposPermitidos = [
    'dniPaciente',
    'tipo',
    'archivo',
    'fecha',
  ];

  const camposDesconocidos = Object.keys(datos).filter(
    (campo) => !camposPermitidos.includes(campo),
  );

  if (camposDesconocidos.length > 0) {
    return {
      valido: false,
      errores: {
        general:
          `Campos no permitidos: ${camposDesconocidos.join(', ')}`,
      },
    };
  }

  const validaciones = {
    dniPaciente: validarDni(datos.dniPaciente),
    tipo: validarTipoDocumento(datos.tipo),
    archivo: validarArchivoDocumento(datos.archivo),
    fecha: validarFechaDocumento(datos.fecha),
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
  validarTipoDocumento,
  validarArchivoDocumento,
  validarFechaDocumento,
  validarDatosDocumento,
};