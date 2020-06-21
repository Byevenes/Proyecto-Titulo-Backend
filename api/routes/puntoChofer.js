const express = require('express');
const moment = require('moment-timezone');

const {
  verificaToken,
  verificaAdminRole,
  verificaChoferRole,
  verificaAdminOrChoferRole,
} = require('../middlewares/autenticacion');

let app = express();
let PuntoChofer = require('../models/PuntoChofer');

/**
 * =========================================
 * Obtener todas los puntos de los choferes
 * =========================================
 */

app.get('/api/puntochofer', [verificaToken, verificaAdminRole], (req, res) => {
  PuntoChofer.find({})
    .sort({ date_chofer: 'desc' })
    .populate('chofer', 'nombre email role')
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
  '/api/puntochofer/puntochoferid/:id',
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
  '/api/puntochofer/:id',
  [verificaToken, verificaAdminOrChoferRole],
  (req, res) => {
    let id = req.params.id;

    PuntoChofer.find({ chofer: id })
      .sort({ date_chofer: 'desc' })
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

        let conteo = puntoChoferDB.length;

        res.json({
          ok: true,
          puntoChofer: puntoChoferDB,
          cuantos: conteo,
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
  '/api/puntochofer',
  [verificaToken, verificaAdminOrChoferRole],
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
  '/api/puntochofer/:id',
  [verificaToken, verificaAdminOrChoferRole],
  (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let locationPuntoChofer = {
      location: body.location,
      date_chofer: moment()
        .tz('America/Santiago')
        .format('DD-MM-YYYY, h:mm:ss a'),
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

app.delete(
  '/api/puntochofer/:id',
  [verificaToken, verificaAdminRole],
  (req, res) => {
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
  }
);

module.exports = app;
