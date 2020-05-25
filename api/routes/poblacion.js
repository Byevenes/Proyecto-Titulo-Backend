const express = require('express');

const {
  verificaToken,
  verificaAdminRole,
  verificaChoferRole,
} = require('../middlewares/autenticacion');

let app = express();
let Poblacion = require('../models/Poblacion');

/**
 * ==============================
 * Obtener todas las poblaciones
 * ==============================
 */

app.get('/api/poblacion', verificaToken, (req, res) => {
  Poblacion.find({})
    .sort('name_poblacion')
    .populate('comuna', 'name_comuna')
    .exec((err, poblaciones) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        poblaciones,
      });
    });
});

/**
 * =============================
 * Obtener una poblacion por ID
 * =============================
 */

app.get('/api/poblacion/:id', verificaToken, (req, res) => {
  let id = req.params.id;

  Poblacion.findById(id, (err, poblacionDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!poblacionDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El ID de la población no existe',
        },
      });
    }

    res.json({
      ok: true,
      poblacion: poblacionDB,
    });
  });
});

/**
 * ==========================
 * Crear nueva poblacion
 * ==========================
 */

app.post('/api/poblacion', [verificaToken, verificaAdminRole], (req, res) => {
  let body = req.body;

  let poblacion = new Poblacion({
    name_poblacion: body.name_poblacion,
    comuna: body.comuna,
  });

  poblacion.save((err, poblacionDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!poblacionDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      poblacion: poblacionDB,
    });
  });
});

/**
 * ==============================
 * Modificar una poblacion por ID
 * ==============================
 */

app.put(
  '/api/poblacion/:id',
  [verificaToken, verificaAdminRole],
  (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let namePoblacion = {
      name_poblacion: body.name_poblacion,
    };

    Poblacion.findByIdAndUpdate(
      id,
      namePoblacion,
      { new: true, runValidators: true },
      (err, poblacionDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }

        if (!poblacionDB) {
          return res.status(400).json({
            ok: false,
            err: {
              message: 'El ID de la población no existe',
            },
          });
        }

        res.json({
          ok: true,
          poblacion: poblacionDB,
        });
      }
    );
  }
);

/**
 * ==============================
 * Eliminar una poblacion por ID
 * ==============================
 */

app.delete(
  '/api/poblacion/:id',
  [verificaToken, verificaAdminRole],
  (req, res) => {
    let id = req.params.id;

    Poblacion.findByIdAndRemove(id, (err, poblacionDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!poblacionDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'El ID de la población no existe',
          },
        });
      }

      res.json({
        ok: true,
        message: 'Población Borrada',
      });
    });
  }
);

module.exports = app;
