const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL;

async function procesarRespuesta(
  response,
  mensaje,
) {
  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error || mensaje,
    );
  }

  return data;
}

export async function crearDocumento({
  dniPaciente,
  tipo,
  fecha,
  archivo,
}) {
  const formData = new FormData();

  formData.append(
    'dniPaciente',
    String(dniPaciente),
  );

  formData.append('tipo', tipo);

  if (fecha) {
    formData.append('fecha', fecha);
  }

  formData.append(
    'archivo',
    archivo,
  );

  const response = await fetch(
    `${BACKEND_URL}/documentos`,
    {
      method: 'POST',
      credentials: 'include',
      body: formData,
    },
  );

  return procesarRespuesta(
    response,
    'No se pudo subir el documento',
  );
}