const { validarDni } = require('./validacionPaciente');

function validarDescripcionTratamiento(valor) {
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

function validarFechaInicio(valor) {
  if (!valor) {
    return {
      valido: false,
      error: 'La fecha de inicio es obligatoria',
    };
  }

  const fechaInicio = new Date(valor);

  if (Number.isNaN(fechaInicio.getTime())) {
    return {
      valido: false,
      error: 'La fecha de inicio no es válida',
    };
  }

  return {
    valido: true,
    valor: fechaInicio,
  };
}

function validarLegajoMedico(valor) {
  const legajoMedico = Number(valor);

  if (!Number.isInteger(legajoMedico) || legajoMedico <= 0) {
    return {
      valido: false,
      error: 'Debe seleccionar un médico válido',
    };
  }

  return {
    valido: true,
    valor: legajoMedico,
  };
}

function validarDatosTratamiento(datos) {
    const camposPermitidos = [
        'dniPaciente',
        'descripcion',
        'fechaInicio',
        'fechaFin',
        'legajoMedico'
    ];

    const camposRecibidos = Object.keys(datos);

    const camposDesconocidos = camposRecibidos.filter(
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

    const resultadoFechaInicio = validarFechaInicio(datos.fechaInicio);

    const validaciones = {
        dniPaciente: validarDni(datos.dniPaciente),

        descripcion:
            validarDescripcionTratamiento(datos.descripcion),

        fechaInicio: resultadoFechaInicio,

        fechaFin: validarFechaFin(
            datos.fechaFin,
            resultadoFechaInicio.valido
            ? resultadoFechaInicio.valor
            : null,
        ),

        legajoMedico:
            validarLegajoMedico(datos.legajoMedico),
    };

    const errores = {};
    const datosValidados = {};

    for (const [campo, resultado] of Object.entries(validaciones)) {
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

function validarFechaFin(valor, fechaInicio) {
  if (!valor) {
    return {
      valido: false,
      error: 'La fecha de finalización es obligatoria',
    };
  }

  const fechaFin = new Date(valor);

  if (Number.isNaN(fechaFin.getTime())) {
    return {
      valido: false,
      error: 'La fecha de finalización no es válida',
    };
  }

  if (
    fechaInicio instanceof Date &&
    fechaFin < fechaInicio
  ) {
    return {
      valido: false,
      error:
        'La fecha de finalización no puede ser anterior a la fecha de inicio',
    };
  }

  return {
    valido: true,
    valor: fechaFin,
  };
}


module.exports = {
  validarDescripcionTratamiento,
  validarFechaInicio,
  validarFechaFin,
  validarLegajoMedico,
  validarDatosTratamiento,
};
