const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const {
  verificaToken,
  verificaAdminRole,
  verificaChoferRole,
} = require('../middlewares/autenticacion');

const app = express();
const Usuario = require('../models/Usuario');

/**
 * ============================
 * Obtener todos los usuarios
 * paginados hasta 10 usuarios
 * segun si su estado es true
 * ============================
 */

app.get('/api/usuario', [verificaToken, verificaAdminRole], (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 10;
  limite = Number(limite);

  Usuario.find({ estado: true }, 'nombre email role')
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Usuario.countDocuments({ estado: true }, (err, conteo) => {
        res.json({
          ok: true,
          usuarios,
          cuantos: conteo,
        });
      });
    });
});

/**
 * ============================
 * Obtener usuario por ID
 * ============================
 */

app.get('/api/usuario/:id', verificaToken, (req, res) => {
  let id = req.params.id;

  Usuario.findOne({ _id: id }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        err: { message: 'El usuario no existe' },
      });
    }

    res.json({
      ok: true,
      id: usuarioDB._id,
      nombre: usuarioDB.nombre,
      email: usuarioDB.email,
      role: usuarioDB.role,
      estado: usuarioDB.estado,
    });
  });
});

/**
 * ==================================
 * Crear nueva usuario / registrarse
 * ==================================
 */

app.post('/api/usuario', (req, res) => {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role, // en consideración todavia si no colocarlo
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB,
    });
  });
});

/**
 * ============================
 * Modificar un usuario por ID
 * ============================
 */

app.put('/api/usuario/:id', verificaToken, (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['nombre', 'email', 'role', 'estado']);

  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true, context: 'query' },
    (err, usuarioDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        usuario: usuarioDB,
      });
    }
  );
});

/**
 * ============================================
 * "Eliminar", se modifica estado del usuario,
 * pero no se borra de la base de datos por ID
 * ============================================
 */

app.delete(
  '/api/usuario/:id',
  [verificaToken, verificaAdminRole],
  (req, res) => {
    let id = req.params.id;
    let cambioEstado = {
      estado: false,
    };

    Usuario.findByIdAndUpdate(
      id,
      cambioEstado,
      { new: true },
      (err, usuarioDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!usuarioDB) {
          return res.status(400).json({
            ok: false,
            err: {
              message: 'Usuario no encontrado',
            },
          });
        }

        res.json({
          ok: true,
          usuario: usuarioDB,
        });
      }
    );
  }
);

module.exports = app;
