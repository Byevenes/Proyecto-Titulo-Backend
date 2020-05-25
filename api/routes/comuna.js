const express = require('express');

const {
  verificaToken,
  verificaAdminRole,
  verificaChoferRole,
} = require('../middlewares/autenticacion');

let app = express();
let Comuna = require('../models/Comuna');

/**
 * ==========================
 * Obtener todas las comunas
 * ==========================
 */

app.get('/api/comuna', [verificaToken, verificaAdminRole], (req, res) => {
  Comuna.find({})
    .sort('name_comuna')
    .populate('region', 'name_region')
    .exec((err, comunas) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        comunas,
      });
    });
});

/**
 * ==========================
 * Obtener una comuna por ID
 * ==========================
 */

app.get('/api/comuna/:id', [verificaToken, verificaAdminRole], (req, res) => {
  let id = req.params.id;

  Comuna.findById(id, (err, comunaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!comunaDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El ID de la comuna no existe',
        },
      });
    }

    res.json({
      ok: true,
      comuna: comunaDB,
    });
  });
});

/**
 * ==========================
 * Crear nueva comuna
 * ==========================
 */

app.post('/api/comuna', [verificaToken, verificaAdminRole], (req, res) => {
  let body = req.body;

  let comuna = new Comuna({
    name_comuna: body.name_comuna,
    region: body.region,
  });

  comuna.save((err, comunaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!comunaDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      comuna: comunaDB,
    });
  });
});

/**
 * ============================
 * Modificar una comuna por ID
 * ============================
 */

app.put('/api/comuna/:id', [verificaToken, verificaAdminRole], (req, res) => {
  let id = req.params.id;
  let body = req.body;

  let nameComuna = {
    name_comuna: body.name_comuna,
  };

  Comuna.findByIdAndUpdate(
    id,
    nameComuna,
    { new: true, runValidators: true },
    (err, comunaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!comunaDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'El ID de la comuna no existe',
          },
        });
      }

      res.json({
        ok: true,
        comuna: comunaDB,
      });
    }
  );
});

/**
 * ============================
 * Eliminar una comuna por ID
 * ============================
 */

app.delete(
  '/api/comuna/:id',
  [verificaToken, verificaAdminRole],
  (req, res) => {
    let id = req.params.id;

    Comuna.findByIdAndRemove(id, (err, comunaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!comunaDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'El ID de la comuna no existe',
          },
        });
      }

      res.json({
        ok: true,
        message: 'Comuna Borrada',
      });
    });
  }
);

module.exports = app;
