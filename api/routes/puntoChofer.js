const express = require('express');
const moment = require('moment');

const {
  verificaToken,
  verificaAdminRole,
  verificaChoferRole,
} = require('../middlewares/autenticacion');

let app = express();
let PuntoChofer = require('../models/PuntoChofer');

/**
 * =========================================
 * Obtener todas los puntos de los choferes
 * =========================================
 */

app.get('/', [verificaToken, verificaAdminRole], (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 10;
  limite = Number(limite);

  PuntoChofer.find({})
    .sort({ date_chofer: 'desc' })
    .populate('chofer', 'nombre email role')
    .skip(desde)
    .limit(limite)
    .exec((err, puntoChoferes) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      PuntoChofer.countDocuments((err, conteo) => {
        res.json({
          ok: true,
          puntoChoferes,
          cuantos: conteo,
        });
      });
    });
});

/**
 * =========================
 * Obtener un punto por ID
 * =========================
 */

app.get(
  '/puntochoferid/:id',
  [verificaToken, verificaAdminRole],
  (req, res) => {
    let id = req.params.id;

    PuntoChofer.findById(id, (err, puntoChoferDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!puntoChoferDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'El ID del punto no existe',
          },
        });
      }

      res.json({
        ok: true,
        puntoChofer: puntoChoferDB,
      });
    });
  }
);

/**
 * ============================================
 * Obtener puntos por ID del chofer, tambien
 * sabiendo la cantidad de puntos que marco
 * ============================================
 */

app.get(
  '/:id',
  [verificaToken, verificaChoferRole && verificaAdminRole],
  (req, res) => {
    let id = req.params.id;

    PuntoChofer.find({ chofer: id })
      .populate('chofer', 'nombre, email, role')
      .exec((err, puntoChoferDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }

        if (!puntoChoferDB) {
          return res.status(400).json({
            ok: false,
            err: {
              message: 'El ID del chofer no existe',
            },
          });
        }

        PuntoChofer.countDocuments((err, conteo) => {
          res.json({
            ok: true,
            puntoChofer: puntoChoferDB,
            cuantos: conteo,
          });
        });
      });
  }
);

/**
 * ============================
 * Crear nuevo punto de Chofer
 * ============================
 */

app.post(
  '/',
  [verificaToken, verificaChoferRole && verificaAdminRole],
  (req, res) => {
    let body = req.body;

    let puntoChofer = new PuntoChofer({
      chofer: body.chofer,
      location: body.location,
    });

    puntoChofer.save((err, puntoChoferDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!puntoChoferDB) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        puntoChofer: puntoChoferDB,
      });
    });
  }
);

/**
 * ====================================
 * Modificar un punto de chofer por ID
 * ====================================
 */

app.put(
  '/:id',
  [verificaToken, verificaChoferRole && verificaAdminRole],
  (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let locationPuntoChofer = {
      location: body.location,
      date_chofer: moment().format('DD-MM-YYYY, h:mm:ss a'),
    };

    PuntoChofer.findByIdAndUpdate(
      id,
      locationPuntoChofer,
      { new: true, runValidators: true },
      (err, puntoChoferDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }

        if (!puntoChoferDB) {
          return res.status(400).json({
            ok: false,
            err: {
              message: 'El ID del punto no existe',
            },
          });
        }

        res.json({
          ok: true,
          puntoChofer: puntoChoferDB,
        });
      }
    );
  }
);

/**
 * ==========================
 * Eliminar un punto por ID
 * ==========================
 */

app.delete('/:id', [verificaToken, verificaAdminRole], (req, res) => {
  let id = req.params.id;

  PuntoChofer.findByIdAndRemove(id, (err, puntoChoferDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!puntoChoferDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El ID del punto no existe',
        },
      });
    }

    res.json({
      ok: true,
      message: 'Punto de Chofer Borrado',
    });
  });
});

module.exports = app;
