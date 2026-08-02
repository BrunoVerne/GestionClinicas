const API_URL = import.meta.env.VITE_BACKEND_URL;

async function procesarRespuesta(respuesta) {
  const data = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    throw new Error(
      data?.error || 'Ocurrió un error con el tratamiento',
    );
  }

  return data;
}

export async function actualizarFechaFinTratamiento(
  numeroTratamiento,
  fechaFin,
) {
  const respuesta = await fetch(
    `${API_URL}/tratamientos/${numeroTratamiento}/fecha-fin`,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fechaFin: `${fechaFin}T12:00:00.000Z`,
      }),
    },
  );

  return procesarRespuesta(respuesta);
}

export async function eliminarTratamiento(
  numeroTratamiento,
) {
  const respuesta = await fetch(
    `${API_URL}/tratamientos/${numeroTratamiento}`,
    {
      method: 'DELETE',
      credentials: 'include',
    },
  );

  return procesarRespuesta(respuesta);
}


export async function crearTratamiento(datosTratamiento) {
  const respuesta = await fetch(
    `${API_URL}/tratamientos`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosTratamiento),
    },
  );

  return procesarRespuesta(respuesta);
}