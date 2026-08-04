export function validarDni(valor) {
  if (
    valor === '' ||
    valor === null ||
    valor === undefined
  ) {
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

  const formatoValido =
    /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;

  if (!formatoValido.test(nombre)) {
    return 'El nombre contiene caracteres inválidos';
  }

  return '';
}

export function validarTelefono(
  valor,
  { obligatorio = false } = {},
) {
  const telefono = String(valor ?? '').trim();

  if (!telefono) {
    return obligatorio
      ? 'El teléfono es obligatorio'
      : '';
  }

  if (telefono.length < 6 || telefono.length > 30) {
    return 'El teléfono debe tener entre 6 y 30 caracteres';
  }

  const formatoValido = /^[0-9+\-\s()]+$/;

  if (!formatoValido.test(telefono)) {
    return 'El teléfono contiene caracteres inválidos';
  }

  return '';
}

export function validarEmail(valor) {
  const email = String(valor ?? '').trim();

  if (!email) {
    return '';
  }

  if (email.length > 150) {
    return 'El email no puede superar los 150 caracteres';
  }

  const formatoValido =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formatoValido.test(email)) {
    return 'El email no tiene un formato válido';
  }

  return '';
}

export function validarFechaDeNacimiento(valor) {
  if (!valor) {
    return '';
  }

  const fecha = new Date(`${valor}T00:00:00`);

  if (Number.isNaN(fecha.getTime())) {
    return 'La fecha de nacimiento no es válida';
  }

  const ahora = new Date();

  if (fecha > ahora) {
    return 'La fecha de nacimiento no puede ser futura';
  }

  return '';
}

export function validarGenero(valor) {
  if (!valor) {
    return '';
  }

  // Las opciones válidas se obtienen del backend mediante
  // GET /catalogos/generos. El backend realiza la validación
  // definitiva contra el enum de Prisma.
  if (typeof valor !== 'string') {
    return 'El género seleccionado no es válido';
  }

  return '';
}

export function validarDomicilio(valor) {
  const domicilio = String(valor ?? '').trim();

  if (!domicilio) {
    return '';
  }

  if (domicilio.length < 3) {
    return 'El domicilio debe tener al menos 3 caracteres';
  }

  if (domicilio.length > 200) {
    return 'El domicilio no puede superar los 200 caracteres';
  }

  return '';
}

export function validarObraSocial(obraSocial) {
  if (!obraSocial) {
    return {};
  }

  const errores = {};

  if (!obraSocial.nombre) {
    errores.nombre =
      'Debe seleccionar una obra social';
  }

  const sinCobertura =
    obraSocial.nombre === 'SIN_COBERTURA';

  const numeroDeAfiliado = String(
    obraSocial.numeroDeAfiliado ?? '',
  ).trim();

  const plan = String(
    obraSocial.plan ?? '',
  ).trim();

  if (!sinCobertura && !numeroDeAfiliado) {
    errores.numeroDeAfiliado =
      'El número de afiliado es obligatorio';
  }

  if (numeroDeAfiliado.length > 100) {
    errores.numeroDeAfiliado =
      'El número de afiliado no puede superar los 100 caracteres';
  }

  if (plan.length > 100) {
    errores.plan =
      'El plan no puede superar los 100 caracteres';
  }

  return errores;
}

export function validarFormularioPaciente({
  dni,
  nombre,
  telefono,
  telefonoDeEmergencia,
  email,
  fechaDeNacimiento,
  genero,
  domicilio,
  obraSocial,
}) {
  const errores = {};

  const errorDni = validarDni(dni);
  const errorNombre = validarNombre(nombre);
  const errorTelefono = validarTelefono(telefono);
  const errorTelefonoEmergencia = validarTelefono(
    telefonoDeEmergencia,
  );
  const errorEmail = validarEmail(email);
  const errorFecha =
    validarFechaDeNacimiento(fechaDeNacimiento);
  const errorGenero = validarGenero(genero);
  const errorDomicilio = validarDomicilio(domicilio);

  if (errorDni) {
    errores.dni = errorDni;
  }

  if (errorNombre) {
    errores.nombre = errorNombre;
  }

  if (errorTelefono) {
    errores.telefono = errorTelefono;
  }

  if (errorTelefonoEmergencia) {
    errores.telefonoDeEmergencia =
      errorTelefonoEmergencia;
  }

  if (errorEmail) {
    errores.email = errorEmail;
  }

  if (errorFecha) {
    errores.fechaDeNacimiento = errorFecha;
  }

  if (errorGenero) {
    errores.genero = errorGenero;
  }

  if (errorDomicilio) {
    errores.domicilio = errorDomicilio;
  }

  const erroresObraSocial =
    validarObraSocial(obraSocial);

  if (Object.keys(erroresObraSocial).length > 0) {
    errores.obraSocial = erroresObraSocial;
  }

  const nombreObraSocial =
    obraSocial?.nombre || null;

  const sinCobertura =
    nombreObraSocial === 'SIN_COBERTURA';

  return {
    valido: Object.keys(errores).length === 0,

    errores,

    datos: {
      dni: Number(dni),
      nombre: String(nombre ?? '').trim(),

      telefono:
        String(telefono ?? '').trim() || null,

      telefonoDeEmergencia:
        String(telefonoDeEmergencia ?? '').trim() ||
        null,

      email:
        String(email ?? '')
          .trim()
          .toLowerCase() || null,

      fechaDeNacimiento:
        fechaDeNacimiento || null,

      genero: genero || null,

      domicilio:
        String(domicilio ?? '').trim() || null,

      obraSocial: nombreObraSocial
        ? {
            nombre: nombreObraSocial,

            numeroDeAfiliado: sinCobertura
              ? null
              : String(
                  obraSocial.numeroDeAfiliado ?? '',
                ).trim() || null,

            plan: sinCobertura
              ? null
              : String(
                  obraSocial.plan ?? '',
                ).trim() || null,
          }
        : null,
    },
  };
}