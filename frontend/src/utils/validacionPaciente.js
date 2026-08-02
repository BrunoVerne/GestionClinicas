// src/utils/validacion.js

export function validarPeso(valor) {
  if (valor === '' || valor === null || valor === undefined) {
    return 'El peso es obligatorio';
  }

  const peso = Number(valor);

  if (!Number.isFinite(peso)) {
    return 'El peso debe ser un número';
  }

  if (peso < 1 || peso > 200) {
    return 'El peso debe estar entre 1 y 200 kg';
  }

  return '';
}

export function validarAltura(valor) {
  if (valor === '' || valor === null || valor === undefined) {
    return 'La altura es obligatoria';
  }

  const altura = Number(valor);

  if (!Number.isFinite(altura)) {
    return 'La altura debe ser un número';
  }

  if (altura < 0.3 || altura > 2.7) {
    return 'La altura debe estar entre 0.30 y 2.70 metros';
  }

  return '';
}

export function validarNombre(valor) {
  const nombre = String(valor ?? '').trim();

  if (!nombre) {
    return 'El nombre es obligatorio';
  }

  if (nombre.length < 2) {
    return 'El nombre debe tener al menos 2 caracteres';
  }

  if (nombre.length > 100) {
    return 'El nombre no puede superar los 100 caracteres';
  }

  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(nombre)) {
    return 'El nombre contiene caracteres inválidos';
  }

  return '';
}

export function validarDni(valor) {
  if (valor === '' || valor === null || valor === undefined) {
    return 'El DNI es obligatorio';
  }

  const dni = Number(valor);

  if (!Number.isInteger(dni)) {
    return 'El DNI debe ser un número entero';
  }

  if (dni < 1_000_000 || dni > 99_999_999) {
    return 'El DNI debe tener entre 7 y 8 dígitos';
  }

  return '';
}


export function validarFormularioPaciente({
  dni,
  nombre,
  peso,
  altura,
}) {
  const errores = {};

  const dniNumero = Number(dni);
  const pesoNumero = Number(peso);
  const alturaNumero = Number(altura);
  const nombreLimpio = String(nombre ?? '').trim();

  if (!Number.isInteger(dniNumero)) {
    errores.dni = 'El DNI debe ser un número entero';
  } else if (
    dniNumero < 1_000_000 ||
    dniNumero > 99_999_999
  ) {
    errores.dni = 'El DNI debe tener entre 7 y 8 dígitos';
  }

  if (nombreLimpio.length < 2) {
    errores.nombre =
      'El nombre debe tener al menos 2 caracteres';
  } else if (nombreLimpio.length > 100) {
    errores.nombre =
      'El nombre no puede superar los 100 caracteres';
  }

  if (!Number.isFinite(pesoNumero)) {
    errores.peso = 'El peso debe ser un número';
  } else if (pesoNumero < 1 || pesoNumero > 500) {
    errores.peso =
      'El peso debe estar entre 1 y 500 kg';
  }

  if (!Number.isFinite(alturaNumero)) {
    errores.altura = 'La altura debe ser un número';
  } else if (
    alturaNumero < 0.3 ||
    alturaNumero > 2.7
  ) {
    errores.altura =
      'La altura debe estar entre 0.30 y 2.70 metros';
  }

  return {
    valido: Object.keys(errores).length === 0,
    errores,
    datos: {
      dni: dniNumero,
      nombre: nombreLimpio,
      peso: pesoNumero,
      altura: alturaNumero,
    },
  };
}