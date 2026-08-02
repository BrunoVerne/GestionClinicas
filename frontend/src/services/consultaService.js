// src/services/consultaService.js

const API_URL = import.meta.env.VITE_BACKEND_URL;

export async function crearConsulta(datosConsulta) {
  const respuesta = await fetch(`${API_URL}/consultas`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datosConsulta),
  });

  const contenido = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const error = new Error(
      contenido?.error || 'No se pudo crear la consulta',
    );

    error.errores = contenido?.errores || {};
    throw error;
  }

  return contenido;
}


export async function eliminarConsulta(numeroConsulta) {
  const respuesta = await fetch(
    `${API_URL}/consultas/${numeroConsulta}`,
    {
      method: 'DELETE',
      credentials: 'include',
    },
  );

  const contenido = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    throw new Error(
      contenido?.error || 'No se pudo eliminar la consulta',
    );
  }

  return contenido;
}