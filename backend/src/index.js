const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config({
  path: '../.env',
});

const PORT = process.env.PORT;

const app = express();

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use(
  '/uploads',
  express.static(
    path.join(__dirname, '../uploads'),
  ),
);

app.use('/medicos', require('./routes/medicos'));
app.use('/pacientes', require('./routes/pacientes'));
app.use('/historias', require('./routes/historias'));
app.use('/consultas', require('./routes/consultas'));
app.use('/tratamientos', require('./routes/tratamientos'));
app.use('/antecedentes', require('./routes/antecedentes'));
app.use('/documentos', require('./routes/documentos'));
app.use('/auth', require('./routes/auth'));

app.listen(PORT, () => {
  console.log(
    `Servidor corriendo en http://localhost:${PORT}`,
  );
});