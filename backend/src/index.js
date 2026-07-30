require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser()); // Tiene que estar antes de app.use('/auth', ...)

app.use('/auth', require('./routes/auth'));

app.use('/medicos', require('./routes/medicos'));
app.use('/pacientes', require('./routes/pacientes'));
app.use('/historias', require('./routes/historias'));
app.use('/consultas', require('./routes/consultas'));
app.use('/tratamientos', require('./routes/tratamientos'));
app.use('/antecedentes', require('./routes/antecedentes'));
app.use('/documentos', require('./routes/documentos'));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});