document.getElementById('btnPacientes').addEventListener('click', async () => {
  const pacientes = await window.api.getPacientes();
  document.getElementById('output').textContent = JSON.stringify(pacientes, null, 2);
});

document.getElementById('btnMedicos').addEventListener('click', async () => {
  const medicos = await window.api.getMedicos();
  document.getElementById('output').textContent = JSON.stringify(medicos, null, 2);
});