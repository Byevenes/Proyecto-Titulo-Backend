const express = require('express');
const moment = require('moment');

const {
  verificaToken,
  verificaAdminRole,
  verificaChoferRole,
} = require('../middlewares/autenticacion');

let app = express();
let Comentario = require('../models/Comentario');

/**
 * ==============================
 * Obtener todas los comentarios
 * ==============================
 */

app.get('/', verificaToken, (req, res) => {
  Comentario.find({})
    .sort('description_comentario')
    .populate('creator', 'email')
    .exec((err, comentarios) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        comentarios,
      });
    });
});

/**
 * ==============================
 * Obtener un comentario por ID
 * ==============================
 */

app.get('/comentarioid/:id', verificaToken, (req, res) => {
  let id = req.params.id;

  Comentario.findById(id, (err, comentarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!comentarioDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El ID del comentario no existe',
        },
      });
    }

    res.json({
      ok: true,
      comentario: comentarioDB,
    });
  });
});

/**
 * ============================================
 * Obtener comentarios por ID del creador
 * tambien sabiendo la cantidad de comentarios
 * ============================================
 */

app.get('/:id', verificaToken, (req, res) => {
  let id = req.params.id;

  Comentario.find({ creator: id })
    .populate('creator', 'email')
    .exec((err, comentarioDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!comentarioDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'El ID del creador no existe',
          },
        });
      }

      Comentario.countDocuments((err, conteo) => {
        res.json({
          ok: true,
          comentario: comentarioDB,
          cuantos: conteo,
        });
      });
    });
});

/**
 * ==========================
 * Crear nuevo comentario
 * ==========================
 */

app.post('/', verificaToken, (req, res) => {
  let body = req.body;

  let comentario = new Comentario({
    description_comentario: body.description_comentario,
    creator: body.creator,
  });

  comentario.save((err, comentarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!comentarioDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      comentario: comentarioDB,
    });
  });
});

/**
 * ==============================
 * Modificar un comentario por ID
 * ==============================
 */

app.put('/:id', verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  let descriptionComentario = {
    description_comentario: body.description_comentario,
    date_comentario: moment().format('DD-MM-YYYY, h:mm:ss a'),
  };

  Comentario.findByIdAndUpdate(
    id,
    descriptionComentario,
    { new: true, runValidators: true },
    (err, comentarioDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!comentarioDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'El ID del comentario no existe',
          },
        });
      }

      res.json({
        ok: true,
        comentario: comentarioDB,
      });
    }
  );
});

/**
 * ==============================
 * Eliminar un comentario por ID
 * ==============================
 */

app.delete('/:id', verificaToken, (req, res) => {
  let id = req.params.id;

  Comentario.findByIdAndRemove(id, (err, comentarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!comentarioDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El ID del comentario no existe',
        },
      });
    }

    res.json({
      ok: true,
      message: 'Comentario Borrado',
    });
  });
});

module.exports = app;
