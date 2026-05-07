const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/medicos',      require('./routes/medicos'));
app.use('/pacientes',    require('./routes/pacientes'));
app.use('/historias',    require('./routes/historias'));
app.use('/consultas',    require('./routes/consultas'));
app.use('/tratamientos', require('./routes/tratamientos'));
app.use('/antecedentes', require('./routes/antecedentes'));
app.use('/documentos',   require('./routes/documentos'));

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));