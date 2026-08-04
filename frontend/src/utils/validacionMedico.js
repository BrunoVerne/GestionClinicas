function campoVacio(valor) {
  return (
    valor === null ||
    valor === undefined ||
    (typeof valor === 'string' && valor.trim() === '')
  );
}

function validarNombre(valor) {
  if (campoVacio(valor)) {
    return 'El nombre es obligatorio';
  }

  const nombre = valor.trim();

  if (nombre.length < 2) {
    return 'El nombre debe tener al menos 2 caracteres';
  }

  if (nombre.length > 100) {
    return 'El nombre no puede superar los 100 caracteres';
  }

  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(nombre)) {
    return 'El nombre contiene caracteres inválidos';
  }

  return null;
}

function validarMatricula(valor) {
  if (campoVacio(valor)) {
    return 'La matrícula es obligatoria';
  }

  const matricula = valor.trim();

  if (matricula.length < 3) {
    return 'La matrícula debe tener al menos 3 caracteres';
  }

  if (matricula.length > 50) {
    return 'La matrícula no puede superar los 50 caracteres';
  }

  if (!/^[a-zA-Z0-9./\-\s]+$/.test(matricula)) {
    return 'La matrícula contiene caracteres inválidos';
  }

  return null;
}

function validarTelefono(valor) {
  if (campoVacio(valor)) {
    return null;
  }

  const telefono = valor.trim();

  if (telefono.length < 6 || telefono.length > 30) {
    return 'El teléfono debe tener entre 6 y 30 caracteres';
  }

  if (!/^[0-9+\-\s()]+$/.test(telefono)) {
    return 'El teléfono contiene caracteres inválidos';
  }

  return null;
}

function validarEmail(valor) {
  if (campoVacio(valor)) {
    return null;
  }

  const email = valor.trim();

  if (email.length > 150) {
    return 'El email no puede superar los 150 caracteres';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'El email no tiene un formato válido';
  }

  return null;
}

function validarFechaDeNacimiento(valor) {
  if (campoVacio(valor)) {
    return null;
  }

  const fecha = new Date(`${valor}T00:00:00`);

  if (Number.isNaN(fecha.getTime())) {
    return 'La fecha de nacimiento no es válida';
  }

  if (fecha > new Date()) {
    return 'La fecha de nacimiento no puede ser futura';
  }

  return null;
}

function validarGenero(valor, generosDisponibles) {
  if (campoVacio(valor)) {
    return null;
  }

  if (!generosDisponibles.includes(valor)) {
    return 'El género seleccionado no es válido';
  }

  return null;
}

function validarDomicilio(valor) {
  if (campoVacio(valor)) {
    return null;
  }

  const domicilio = valor.trim();

  if (domicilio.length < 3) {
    return 'El domicilio debe tener al menos 3 caracteres';
  }

  if (domicilio.length > 200) {
    return 'El domicilio no puede superar los 200 caracteres';
  }

  return null;
}

function validarEspecialidades(
  especialidades,
  especialidadesDisponibles,
) {
  if (!Array.isArray(especialidades)) {
    return 'Las especialidades deben enviarse como una lista';
  }

  if (especialidades.length === 0) {
    return 'Seleccioná al menos una especialidad';
  }

  const especialidadesUnicas = new Set(especialidades);

  if (especialidadesUnicas.size !== especialidades.length) {
    return 'No se pueden repetir especialidades';
  }

  const hayEspecialidadInvalida = especialidades.some(
    (especialidad) =>
      !especialidadesDisponibles.includes(especialidad),
  );

  if (hayEspecialidadInvalida) {
    return 'Una o más especialidades no son válidas';
  }

  return null;
}

export function validarFormularioMedico(
  formulario,
  {
    generos = [],
    especialidades = [],
  } = {},
) {
  const errores = {};

  const errorNombre = validarNombre(formulario.nombre);
  const errorMatricula = validarMatricula(formulario.matricula);
  const errorTelefono = validarTelefono(formulario.telefono);
  const errorTelefonoDeEmergencia = validarTelefono(
    formulario.telefonoDeEmergencia,
  );
  const errorEmail = validarEmail(formulario.email);
  const errorFechaDeNacimiento = validarFechaDeNacimiento(
    formulario.fechaDeNacimiento,
  );
  const errorGenero = validarGenero(
    formulario.genero,
    generos,
  );
  const errorDomicilio = validarDomicilio(
    formulario.domicilio,
  );
  const errorEspecialidades = validarEspecialidades(
    formulario.especialidades,
    especialidades,
  );

  if (errorNombre) {
    errores.nombre = errorNombre;
  }

  if (errorMatricula) {
    errores.matricula = errorMatricula;
  }

  if (errorTelefono) {
    errores.telefono = errorTelefono;
  }

  if (errorTelefonoDeEmergencia) {
    errores.telefonoDeEmergencia =
      errorTelefonoDeEmergencia;
  }

  if (errorEmail) {
    errores.email = errorEmail;
  }

  if (errorFechaDeNacimiento) {
    errores.fechaDeNacimiento = errorFechaDeNacimiento;
  }

  if (errorGenero) {
    errores.genero = errorGenero;
  }

  if (errorDomicilio) {
    errores.domicilio = errorDomicilio;
  }

  if (errorEspecialidades) {
    errores.especialidades = errorEspecialidades;
  }

  if (Object.keys(errores).length > 0) {
    return {
      valido: false,
      errores,
    };
  }

  return {
    valido: true,

    datos: {
      nombre: formulario.nombre.trim(),
      matricula: formulario.matricula.trim().toUpperCase(),

      telefono: campoVacio(formulario.telefono)
        ? null
        : formulario.telefono.trim(),

      telefonoDeEmergencia: campoVacio(
        formulario.telefonoDeEmergencia,
      )
        ? null
        : formulario.telefonoDeEmergencia.trim(),

      email: campoVacio(formulario.email)
        ? null
        : formulario.email.trim().toLowerCase(),

      fechaDeNacimiento: campoVacio(
        formulario.fechaDeNacimiento,
      )
        ? null
        : formulario.fechaDeNacimiento,

      genero: campoVacio(formulario.genero)
        ? null
        : formulario.genero,

      domicilio: campoVacio(formulario.domicilio)
        ? null
        : formulario.domicilio.trim(),

      especialidades: [...formulario.especialidades],
    },
  };
}
