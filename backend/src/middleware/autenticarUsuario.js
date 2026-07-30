const jwt = require('jsonwebtoken');

function autenticarUsuario(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      error: 'No hay una sesión iniciada',
    });
  }

  try {
    const datosToken = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = datosToken;

    next();
  } catch (error) {
    return res.status(401).json({
      error: 'La sesión no es válida o expiró',
    });
  }
}

module.exports = autenticarUsuario;