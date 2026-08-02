// src/utils/validacion.js

function validarDni(valor) {
  const dni = Number(valor);

  if (!Number.isInteger(dni)) {
    return {
      valido: false,
      error: 'El DNI debe ser un número entero'
    };
  }

  if (dni < 1_000_000 || dni > 99_999_999) {
    return {
      valido: false,
      error: 'El DNI debe tener entre 7 y 8 dígitos'
    };
  }

  return {
    valido: true,
    valor: dni
  };
}

function validarNombre(valor) {
  if (typeof valor !== 'string') {
    return {
      valido: false,
      error: 'El nombre debe ser texto'
    };
  }

  const nombre = valor.trim();

  if (nombre.length < 2) {
    return {
      valido: false,
      error: 'El nombre debe tener al menos 2 caracteres'
    };
  }

  if (nombre.length > 100) {
    return {
      valido: false,
      error: 'El nombre no puede superar los 100 caracteres'
    };
  }

  const formatoValido = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;

  if (!formatoValido.test(nombre)) {
    return {
      valido: false,
      error: 'El nombre contiene caracteres inválidos'
    };
  }

  return {
    valido: true,
    valor: nombre
  };
}

function validarPeso(valor) {
  const peso = Number(valor);

  if (!Number.isFinite(peso)) {
    return {
      valido: false,
      error: 'El peso debe ser un número'
    };
  }

  if (peso < 1 || peso > 500) {
    return {
      valido: false,
      error: 'El peso debe estar entre 1 y 500 kg'
    };
  }

  return {
    valido: true,
    valor: peso
  };
}

function validarAltura(valor) {
  const altura = Number(valor);

  if (!Number.isFinite(altura)) {
    return {
      valido: false,
      error: 'La altura debe ser un número'
    };
  }

  if (altura < 0.3 || altura > 2.7) {
    return {
      valido: false,
      error: 'La altura debe estar entre 0.30 y 2.70 metros'
    };
  }

  return {
    valido: true,
    valor: altura
  };
}

function validarDatosPaciente(datos, { parcial = false } = {}) {
  const camposPermitidos = ['dni', 'nombre', 'peso', 'altura'];
  const camposRecibidos = Object.keys(datos);

  const camposDesconocidos = camposRecibidos.filter(
    campo => !camposPermitidos.includes(campo)
  );

  if (camposDesconocidos.length > 0) {
    return {
      valido: false,
      errores: {
        general: `Campos no permitidos: ${camposDesconocidos.join(', ')}`
      }
    };
  }

  if (parcial && camposRecibidos.length === 0) {
    return {
      valido: false,
      errores: {
        general: 'Debe enviar al menos un dato para actualizar'
      }
    };
  }

  const validadores = {
    dni: validarDni,
    nombre: validarNombre,
    peso: validarPeso,
    altura: validarAltura
  };

  const datosValidados = {};
  const errores = {};

  for (const campo of camposPermitidos) {
    const fueEnviado = Object.prototype.hasOwnProperty.call(datos, campo);

    if (!parcial && !fueEnviado) {
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
      errores
    };
  }

  return {
    valido: true,
    datos: datosValidados
  };
}



module.exports = {
  validarDni,
  validarNombre,
  validarPeso,
  validarAltura,
  validarDatosPaciente,
  
};