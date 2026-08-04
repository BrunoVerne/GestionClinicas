const {
  Genero,
  Especialidad,
  RolUsuario,
} = require('@prisma/client');

function validarLegajo(valor) {
  const legajo = Number(valor);

  if (!Number.isInteger(legajo) || legajo <= 0) {
    return {
      valido: false,
      error: 'El legajo debe ser un número entero positivo',
    };
  }

  return {
    valido: true,
    valor: legajo,
  };
}

function validarNombre(valor) {
  if (typeof valor !== 'string') {
    return {
      valido: false,
      error: 'El nombre debe ser texto',
    };
  }

  const nombre = valor.trim();

  if (nombre.length < 2) {
    return {
      valido: false,
      error: 'El nombre debe tener al menos 2 caracteres',
    };
  }

  if (nombre.length > 100) {
    return {
      valido: false,
      error: 'El nombre no puede superar los 100 caracteres',
    };
  }

  const formatoValido =
    /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;

  if (!formatoValido.test(nombre)) {
    return {
      valido: false,
      error: 'El nombre contiene caracteres inválidos',
    };
  }

  return {
    valido: true,
    valor: nombre,
  };
}

function validarTelefono(valor) {
  if (
    valor === null ||
    valor === undefined ||
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
      error: 'El teléfono debe ser texto',
    };
  }

  const telefono = valor.trim();

  if (telefono.length < 6 || telefono.length > 30) {
    return {
      valido: false,
      error:
        'El teléfono debe tener entre 6 y 30 caracteres',
    };
  }

  if (!/^[0-9+\-\s()]+$/.test(telefono)) {
    return {
      valido: false,
      error: 'El teléfono contiene caracteres inválidos',
    };
  }

  return {
    valido: true,
    valor: telefono,
  };
}

function validarEmail(valor) {
  if (
    valor === null ||
    valor === undefined ||
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
      error: 'El email debe ser texto',
    };
  }

  const email = valor.trim().toLowerCase();

  if (email.length > 150) {
    return {
      valido: false,
      error: 'El email no puede superar los 150 caracteres',
    };
  }

  const formatoValido =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formatoValido.test(email)) {
    return {
      valido: false,
      error: 'El email no tiene un formato válido',
    };
  }

  return {
    valido: true,
    valor: email,
  };
}

function validarFechaDeNacimiento(valor) {
  if (
    valor === null ||
    valor === undefined ||
    valor === ''
  ) {
    return {
      valido: true,
      valor: null,
    };
  }

  const fecha = new Date(valor);

  if (Number.isNaN(fecha.getTime())) {
    return {
      valido: false,
      error: 'La fecha de nacimiento no es válida',
    };
  }

  if (fecha > new Date()) {
    return {
      valido: false,
      error:
        'La fecha de nacimiento no puede ser futura',
    };
  }

  return {
    valido: true,
    valor: fecha,
  };
}

function validarGenero(valor) {
  if (
    valor === null ||
    valor === undefined ||
    valor === ''
  ) {
    return {
      valido: true,
      valor: null,
    };
  }

  if (!Object.values(Genero).includes(valor)) {
    return {
      valido: false,
      error: 'El género seleccionado no es válido',
    };
  }

  return {
    valido: true,
    valor,
  };
}

function validarDomicilio(valor) {
  if (
    valor === null ||
    valor === undefined ||
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
      error: 'El domicilio debe ser texto',
    };
  }

  const domicilio = valor.trim();

  if (domicilio.length < 3) {
    return {
      valido: false,
      error:
        'El domicilio debe tener al menos 3 caracteres',
    };
  }

  if (domicilio.length > 200) {
    return {
      valido: false,
      error:
        'El domicilio no puede superar los 200 caracteres',
    };
  }

  return {
    valido: true,
    valor: domicilio,
  };
}

function validarMatricula(valor) {
  if (typeof valor !== 'string') {
    return {
      valido: false,
      error: 'La matrícula debe ser texto',
    };
  }

  const matricula = valor.trim().toUpperCase();

  if (matricula.length < 3) {
    return {
      valido: false,
      error:
        'La matrícula debe tener al menos 3 caracteres',
    };
  }

  if (matricula.length > 50) {
    return {
      valido: false,
      error:
        'La matrícula no puede superar los 50 caracteres',
    };
  }

  if (!/^[A-Z0-9./\-\s]+$/.test(matricula)) {
    return {
      valido: false,
      error: 'La matrícula contiene caracteres inválidos',
    };
  }

  return {
    valido: true,
    valor: matricula,
  };
}

function validarActivo(valor) {
  if (typeof valor !== 'boolean') {
    return {
      valido: false,
      error: 'El estado activo debe ser verdadero o falso',
    };
  }

  return {
    valido: true,
    valor,
  };
}

function validarRol(valor) {
  if (
    valor === null ||
    valor === undefined ||
    valor === ''
  ) {
    return {
      valido: true,
      valor: RolUsuario.MEDICO,
    };
  }

  if (valor !== RolUsuario.MEDICO) {
    return {
      valido: false,
      error: 'El rol de un médico debe ser MEDICO',
    };
  }

  return {
    valido: true,
    valor: RolUsuario.MEDICO,
  };
}

function validarEspecialidades(valor) {
  if (!Array.isArray(valor)) {
    return {
      valido: false,
      error: 'Las especialidades deben enviarse como una lista',
    };
  }

  if (valor.length === 0) {
    return {
      valido: false,
      error: 'Debe seleccionar al menos una especialidad',
    };
  }

  const especialidadesUnicas = [...new Set(valor)];

  if (especialidadesUnicas.length !== valor.length) {
    return {
      valido: false,
      error: 'No se pueden repetir especialidades',
    };
  }

  const especialidadesInvalidas =
    especialidadesUnicas.filter(
      (especialidad) =>
        !Object.values(Especialidad).includes(
          especialidad,
        ),
    );

  if (especialidadesInvalidas.length > 0) {
    return {
      valido: false,
      error: `Especialidades inválidas: ${especialidadesInvalidas.join(', ')}`,
    };
  }

  return {
    valido: true,
    valor: especialidadesUnicas,
  };
}

function validarDatosMedico(
  datos,
  { parcial = false } = {},
) {
  if (
    !datos ||
    typeof datos !== 'object' ||
    Array.isArray(datos)
  ) {
    return {
      valido: false,
      errores: {
        general: 'Los datos del médico no son válidos',
      },
    };
  }

  if (parcial && Object.keys(datos).length === 0) {
    return {
      valido: false,
      errores: {
        general:
          'Debe enviar al menos un dato para actualizar',
      },
    };
  }

  const validadores = {
    nombre: validarNombre,
    activo: validarActivo,
    telefono: validarTelefono,
    telefonoDeEmergencia: validarTelefono,
    email: validarEmail,
    fechaDeNacimiento: validarFechaDeNacimiento,
    genero: validarGenero,
    domicilio: validarDomicilio,
    matricula: validarMatricula,
    especialidades: validarEspecialidades,
  };

  const datosValidados = {};
  const errores = {};

  for (const [campo, valor] of Object.entries(datos)) {
    const validador = validadores[campo];

    /*
     * No rechazamos acá los campos desconocidos.
     * Prisma hará la validación estructural definitiva.
     */
    if (!validador) {
      datosValidados[campo] = valor;
      continue;
    }

    const resultado = validador(valor);

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
  validarLegajo,
  validarNombre,
  validarTelefono,
  validarEmail,
  validarFechaDeNacimiento,
  validarGenero,
  validarDomicilio,
  validarMatricula,
  validarActivo,
  validarRol,
  validarEspecialidades,
  validarDatosMedico,
};
