const express = require('express');

let app = express();
let Region = require('../models/Region');

/**
 * ==========================
 * Obtener todas las regiones
 * ==========================
 */

app.get('/', (req, res) => {
  Region.find({})
    .sort('name_region')
    .exec((err, regiones) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        regiones,
      });
    });
});

/**
 * ==========================
 * Obtener una region por ID
 * ==========================
 */

app.get('/:id', (req, res) => {
  let id = req.params.id;

  Region.findById(id, (err, regionDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!regionDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El ID de la región no existe',
        },
      });
    }

    res.json({
      ok: true,
      region: regionDB,
    });
  });
});

/**
 * ==========================
 * Crear nueva región
 * ==========================
 */

app.post('/', (req, res) => {
  let body = req.body;

  let region = new Region({
    name_region: body.name_region,
  });

  region.save((err, regionDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!regionDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      region: regionDB,
    });
  });
});

/**
 * ============================
 * Modificar una región por ID
 * ============================
 */

app.put('/:id', (req, res) => {
  let id = req.params.id;
  let body = req.body;

  let nameRegion = {
    name_region: body.name_region,
  };

  Region.findByIdAndUpdate(
    id,
    nameRegion,
    { new: true, runValidators: true },
    (err, regionDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!regionDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'El ID de la región no existe',
          },
        });
      }

      res.json({
        ok: true,
        region: regionDB,
      });
    }
  );
});

/**
 * ============================
 * Eliminar una región por ID
 * ============================
 */

app.delete('/:id', (req, res) => {
  let id = req.params.id;

  Region.findByIdAndRemove(id, (err, regionDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!regionDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El ID de la región no existe',
        },
      });
    }

    res.json({
      ok: true,
      message: 'Región Borrada',
    });
  });
});

module.exports = app;
