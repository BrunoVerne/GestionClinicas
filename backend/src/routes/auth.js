const express = require('express');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const prisma = require('../lib/prisma');
const autenticarUsuario = require('../middleware/autenticarUsuario');

const router = express.Router();

const opcionesCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
};

/**
 * POST /auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { nombreUsuario, password } = req.body;

    if (!nombreUsuario || !password) {
      return res.status(400).json({
        error: 'El usuario y la contraseña son obligatorios',
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        nombreUsuario: nombreUsuario.trim(),
      },
    });

    /*
     * Se devuelve el mismo mensaje si el usuario no existe,
     * está inactivo o la contraseña es incorrecta.
     */
    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        error: 'Usuario o contraseña incorrectos',
      });
    }

    const passwordCorrecta = await argon2.verify(
      usuario.passwordHash,
      password,
    );

    if (!passwordCorrecta) {
      return res.status(401).json({
        error: 'Usuario o contraseña incorrectos',
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nombreUsuario: usuario.nombreUsuario,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '8h',
      },
    );

    res.cookie('token', token, {
      ...opcionesCookie,
      maxAge: 8 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      mensaje: 'Inicio de sesión correcto',
      usuario: {
        id: usuario.id,
        nombreUsuario: usuario.nombreUsuario,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error('Error iniciando sesión:', error);

    return res.status(500).json({
      error: 'Error interno del servidor',
    });
  }
});

/**
 * GET /auth/me
 */
router.get('/me', autenticarUsuario, async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: {
        id: req.usuario.id,
      },
      select: {
        id: true,
        nombreUsuario: true,
        rol: true,
        activo: true,
      },
    });

    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        error: 'El usuario ya no tiene acceso al sistema',
      });
    }

    return res.status(200).json({
      usuario: {
        id: usuario.id,
        nombreUsuario: usuario.nombreUsuario,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error('Error recuperando sesión:', error);

    return res.status(500).json({
      error: 'Error interno del servidor',
    });
  }
});

/**
 * POST /auth/logout
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token', opcionesCookie);

  return res.status(200).json({
    mensaje: 'Sesión cerrada correctamente',
  });
});

module.exports = router;