const express = require('express');
const moment = require('moment-timezone');

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

app.get('/api/comentario', verificaToken, (req, res) => {
  Comentario.find({})
    .sort({ date_comentario: 'desc' })
    .populate('creator', 'email')
    .populate('recorrido', 'name_recorrido')
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

app.get('/api/comentario/comentarioid/:id', verificaToken, (req, res) => {
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

app.get('/api/comentario/:id', verificaToken, (req, res) => {
  let id = req.params.id;

  Comentario.find({ creator: id })
    .sort({ date_comentario: 'desc' })
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

      let conteo = comentarioDB.length;

      res.json({
        ok: true,
        comentario: comentarioDB,
        cuantos: conteo,
      });
    });
});

/**
 * ============================================
 * Obtener comentarios por ID del recorrido
 * tambien sabiendo la cantidad de comentarios
 * ============================================
 */

app.get(
  '/api/comentario/comentariorecorridoid/:id',
  verificaToken,
  (req, res) => {
    let id = req.params.id;

    Comentario.find({ recorrido: id })
      .sort({ date_comentario: 'desc' })
      .populate(
        'recorrido',
        'name_recorrido descripcion_recorrido estado_recorrido date_recorrido_iniciado date_recorrido_finalizado'
      )
      .populate('creator', 'email nombre')
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
              message: 'El ID del recorrido no existe',
            },
          });
        }

        let conteo = comentarioDB.length;

        res.json({
          ok: true,
          comentario: comentarioDB,
          cuantos: conteo,
        });
      });
  }
);

/**
 * ==========================
 * Crear nuevo comentario
 * ==========================
 */

app.post('/api/comentario', verificaToken, (req, res) => {
  let body = req.body;

  let comentario = new Comentario({
    description_comentario: body.description_comentario,
    creator: body.creator,
    recorrido: body.recorrido,
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

app.put('/api/comentario/:id', verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  let descriptionComentario = {
    description_comentario: body.description_comentario,
    date_comentario: moment()
      .tz('America/Santiago')
      .format('DD-MM-YYYY, h:mm:ss a'),
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

app.delete('/api/comentario/:id', verificaToken, (req, res) => {
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
