const { Router } = require('express');

const {
  NombreObraSocial,
  Genero,
  Especialidad,

} = require('@prisma/client');

const router = Router();

router.get('/obras-sociales', (req, res) => {
  return res.json(
    Object.values(NombreObraSocial),
  );
});

router.get('/generos', (req, res) => {
  return res.json(
    Object.values(Genero),
  );
});


router.get('/especialidades', (req, res) => {
  res.json(Object.values(Especialidad));
});

module.exports = router;