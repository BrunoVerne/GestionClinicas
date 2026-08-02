const API_URL = import.meta.env.VITE_BACKEND_URL;

async function procesarRespuesta(respuesta) {
  const data = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    throw new Error(
      data?.error ||
        'Ocurrió un error al procesar el antecedente',
    );
  }

  return data;
}

export async function crearAntecedente(datosAntecedente) {
  const respuesta = await fetch(
    `${API_URL}/antecedentes`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosAntecedente),
    },
  );

  return procesarRespuesta(respuesta);
}

export async function eliminarAntecedente(id) {
  const respuesta = await fetch(
    `${API_URL}/antecedentes/${id}`,
    {
      method: 'DELETE',
      credentials: 'include',
    },
  );

  return procesarRespuesta(respuesta);
}

