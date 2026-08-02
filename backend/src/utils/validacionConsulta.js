const { validarDni } = require('./validacionPaciente');

function validarNumeroExpediente(valor) {
  const numeroExpediente = Number(valor);

  if (!Number.isInteger(numeroExpediente) || numeroExpediente <= 0) {
    return {
      valido: false,
      error: 'El número de expediente debe ser un entero positivo',
    };
  }

  return {
    valido: true,
    valor: numeroExpediente,
  };
}

function validarLegajoMedico(valor) {
  const legajoMedico = Number(valor);

  if (!Number.isInteger(legajoMedico) || legajoMedico <= 0) {
    return {
      valido: false,
      error: 'El legajo del médico debe ser un entero positivo',
    };
  }

  return {
    valido: true,
    valor: legajoMedico,
  };
}

function validarFecha(valor) {
  if (!valor) {
    return {
      valido: false,
      error: 'La fecha es obligatoria',
    };
  }

  const fecha = new Date(valor);

  if (Number.isNaN(fecha.getTime())) {
    return {
      valido: false,
      error: 'La fecha no es válida',
    };
  }

  if (fecha > new Date()) {
    return {
      valido: false,
      error: 'La fecha de la consulta no puede ser futura',
    };
  }

  return {
    valido: true,
    valor: fecha,
  };
}

function validarMotivo(valor) {
  if (typeof valor !== 'string') {
    return {
      valido: false,
      error: 'El motivo debe ser texto',
    };
  }

  const motivo = valor.trim();

  if (motivo.length < 3) {
    return {
      valido: false,
      error: 'El motivo debe tener al menos 3 caracteres',
    };
  }

  if (motivo.length > 500) {
    return {
      valido: false,
      error: 'El motivo no puede superar los 500 caracteres',
    };
  }

  return {
    valido: true,
    valor: motivo,
  };
}

function validarDiagnostico(valor) {
  if (typeof valor !== 'string') {
    return {
      valido: false,
      error: 'El diagnóstico debe ser texto',
    };
  }

  const diagnostico = valor.trim();

  if (diagnostico.length < 3) {
    return {
      valido: false,
      error: 'El diagnóstico debe tener al menos 3 caracteres',
    };
  }

  if (diagnostico.length > 1000) {
    return {
      valido: false,
      error: 'El diagnóstico no puede superar los 1000 caracteres',
    };
  }

  return {
    valido: true,
    valor: diagnostico,
  };
}

function validarObservaciones(valor) {
  if (
    valor === undefined ||
    valor === null ||
    valor === ''
  ) {
    return {
      valido: true,
      valor: null,
    };
  }

  if (typeof valor !== 'string') {
    return {
      valido: false,
      error: 'Las observaciones deben ser texto',
    };
  }

  const observaciones = valor.trim();

  if (observaciones.length > 2000) {
    return {
      valido: false,
      error: 'Las observaciones no pueden superar los 2000 caracteres',
    };
  }

  return {
    valido: true,
    valor: observaciones || null,
  };
}

function validarDatosConsulta(
  datos,
  { parcial = false } = {},
) {
  const camposPermitidos = [
    'dniPaciente',
    'fecha',
    'legajoMedico',
    'motivo',
    'diagnostico',
    'observaciones',
  ];

  const validadores = {
    dniPaciente: validarDni,
    fecha: validarFecha,
    legajoMedico: validarLegajoMedico,
    motivo: validarMotivo,
    diagnostico: validarDiagnostico,
    observaciones: validarObservaciones,
  };

  const camposRecibidos = Object.keys(datos);

  const camposDesconocidos = camposRecibidos.filter(
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

  if (parcial && camposRecibidos.length === 0) {
    return {
      valido: false,
      errores: {
        general: 'Debe enviar al menos un dato para actualizar',
      },
    };
  }

  const camposObligatorios = [
    'dniPaciente',
    'fecha',
    'legajoMedico',
    'motivo',
    'diagnostico',
  ];

  const datosValidados = {};
  const errores = {};

  for (const campo of camposPermitidos) {
    const fueEnviado =
      Object.prototype.hasOwnProperty.call(datos, campo);

    const esObligatorio = camposObligatorios.includes(campo);

    if (!parcial && esObligatorio && !fueEnviado) {
      errores[campo] = `El campo ${campo} es obligatorio`;
      continue;
    }

    if (!fueEnviado) {
      continue;
    }

    const resultado = validadores[campo](datos[campo]);

    if (!resultado.valido) {
      errores[campo] = resultado.error;
      continue;
    }

    datosValidados[campo] = resultado.valor;
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
  validarNumeroExpediente,
  validarLegajoMedico,
  validarFecha,
  validarMotivo,
  validarDiagnostico,
  validarObservaciones,
  validarDatosConsulta,
};