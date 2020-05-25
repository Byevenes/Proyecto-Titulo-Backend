const express = require('express');
const moment = require('moment');
const _ = require('lodash');

const {
  verificaToken,
  verificaAdminRole,
  verificaChoferRole,
} = require('../middlewares/autenticacion');

let app = express();
let Recorrido = require('../models/Recorrido');

/**
 * ==============================
 * Obtener todas los recorridos
 * ==============================
 */

app.get('/api/recorrido', verificaToken, (req, res) => {
  Recorrido.find({})
    .sort('name_recorrido')
    .populate('poblacion', 'name_poblacion')
    .exec((err, recorridos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      Recorrido.countDocuments((err, conteo) => {
        res.json({
          ok: true,
          recorridos: recorridos,
          cuantos: conteo,
        });
      });
    });
});
/**
 * ==============================
 * Obtener un recorrido por ID
 * ==============================
 */

app.get('/api/recorrido/recorridoid/:id', verificaToken, (req, res) => {
  let id = req.params.id;

  Recorrido.findById(id, (err, recorridoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!recorridoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El ID del recorrido no existe',
        },
      });
    }

    res.json({
      ok: true,
      recorrido: recorridoDB,
    });
  });
});

/**
 * ============================================
 * Obtener recorrido por ID de la población
 * tambien sabiendo la cantidad de recorridos
 * ============================================
 */

app.get('/api/recorrido/:id', verificaToken, (req, res) => {
  let id = req.params.id;

  Recorrido.find({ poblacion: id })
    .sort('name_recorrido')
    .populate('poblacion', 'name_poblacion')
    .exec((err, recorridoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!recorridoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'La ID de la población no existe',
          },
        });
      }

      Recorrido.countDocuments((err, conteo) => {
        res.json({
          ok: true,
          recorrido: recorridoDB,
          cuantos: conteo,
        });
      });
    });
});

/**
 * ==========================
 * Crear nuevo recorrido
 * ==========================
 */

app.post('/api/recorrido', [verificaToken, verificaAdminRole], (req, res) => {
  let body = req.body;

  let recorrido = new Recorrido({
    poblacion: body.poblacion,
    name_recorrido: body.name_recorrido,
    descripcion_recorrido: body.descripcion_recorrido,
    estado_recorrido: body.estado_recorrido,
    location_recorrido: body.location_recorrido,
    date_recorrido_iniciado: body.date_recorrido_iniciado,
    date_recorrido_finalizado: body.date_recorrido_finalizado,
  });

  recorrido.save((err, recorridoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!recorridoDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      recorrido: recorridoDB,
    });
  });
});

/**
 * ==============================
 * Modificar un recorrido por ID
 * ==============================
 */

app.put(
  '/api/recorrido/:id',
  [verificaToken, verificaAdminRole],
  (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, [
      'name_recorrido',
      'descripcion_recorrido',
      'estado_recorrido',
      'location_recorrido',
      'date_recorrido_iniciado',
      'date_recorrido_finalizado',
    ]);

    Recorrido.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true },
      (err, recorridoDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }

        if (!recorridoDB) {
          return res.status(400).json({
            ok: false,
            err: {
              message: 'El ID del recorrido no existe',
            },
          });
        }

        res.json({
          ok: true,
          recorrido: recorridoDB,
        });
      }
    );
  }
);

/**
 * ================================================
 * "Eliminar", se modifica estado del recorrido,
 * pero no se borra de la base de datos por ID
 * esto para saber si el recorrido esta disponible
 * o se encuentra no disponible
 * ================================================
 */

app.delete(
  '/api/recorrido/:id',
  [verificaToken, verificaAdminRole],
  (req, res) => {
    let id = req.params.id;
    let cambioEstadoRecorrido = {
      estado_recorrido: false,
    };

    Recorrido.findByIdAndUpdate(
      id,
      cambioEstadoRecorrido,
      { new: true },
      (err, recorridoDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }

        if (!recorridoDB) {
          return res.status(400).json({
            ok: false,
            err: {
              message: 'Recorrido no encontrado',
            },
          });
        }

        res.json({
          ok: true,
          recorrido: recorridoDB,
        });
      }
    );
  }
);

/**
 * ==============================
 * Eliminar un recorrido por ID
 * ==============================
 */

app.delete(
  '/api/recorrido/recorridoremove/:id',
  [verificaToken, verificaAdminRole],
  (req, res) => {
    let id = req.params.id;

    Recorrido.findByIdAndRemove(id, (err, recorridoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!recorridoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'El ID del recorrido no existe',
          },
        });
      }

      res.json({
        ok: true,
        message: 'Recorrido Borrada',
      });
    });
  }
);

module.exports = app;
