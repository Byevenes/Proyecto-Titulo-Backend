const express = require("express");
const moment = require("moment-timezone");

const {
  verificaToken,
  verificaAdminRole,
  verificaChoferRole,
} = require("../middlewares/autenticacion");

let app = express();

let Notificacion = require("../models/Notificacion");

/**
 * ==================================
 * Obtener todas las notificaciones
 * ==================================
 */

app.get("/api/notificacion", verificaToken, (req, res) => {
  Notificacion.find({})
    .sort({ date_notificacion: "desc" })
    .exec((err, notificaciones) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        notificaciones,
      });
    });
});

/**
 * ================================
 * Obtener una notificacion por ID
 * ================================
 */

app.get("/api/notificacion/:id", verificaToken, (req, res) => {
  let id = req.params.id;

  Notificacion.findById(id, (err, notificacionDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!notificacionDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "El ID de la notificacion no existe",
        },
      });
    }

    res.json({
      ok: true,
      notificacion: notificacionDB,
    });
  });
});

/**
 * ==========================
 * Crear nueva notificacion
 * ==========================
 */

app.post(
  "/api/notificacion",
  [verificaToken, verificaAdminRole],
  (req, res) => {
    let body = req.body;

    let notificacion = new Notificacion({
      name_notificacion: body.name_notificacion,
      description_notificacion: body.description_notificacion,
      tipo_notificacion: body.tipo_notificacion,
    });

    notificacion.save((err, notificacionDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!notificacionDB) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        notificacion: notificacionDB,
      });
    });
  }
);

/**
 * ==================================
 * Modificar una notificacion por ID
 * ==================================
 */

app.put(
  "/api/notificacion/:id",
  [verificaToken, verificaAdminRole],
  (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let dataNotificacion = {
      name_notificacion: body.name_notificacion,
      description_notificacion: body.description_notificacion,
      tipo_notificacion: body.tipo_notificacion,
      date_notificacion: moment()
        .tz("America/Santiago")
        .format("DD-MM-YYYY, h:mm:ss a"),
    };

    Notificacion.findByIdAndUpdate(
      id,
      dataNotificacion,
      { new: true, runValidators: true },
      (err, notificacionDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }

        if (!notificacionDB) {
          return res.status(400).json({
            ok: false,
            err: {
              message: "El ID de la notificacion no existe",
            },
          });
        }

        res.json({
          ok: true,
          notificacion: notificacionDB,
        });
      }
    );
  }
);

/**
 * =================================
 * Eliminar una notificacion por ID
 * =================================
 */

app.delete(
  "/api/notificacion/:id",
  [verificaToken, verificaAdminRole],
  (req, res) => {
    let id = req.params.id;

    Notificacion.findByIdAndRemove(id, (err, notificacionDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!notificacionDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "El ID de la notificacion no existe",
          },
        });
      }

      res.json({
        ok: true,
        message: "Notificacion Borrada",
      });
    });
  }
);

module.exports = app;
