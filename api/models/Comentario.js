const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
//const moment = require('moment');
const moment = require("moment-timezone");

let Schema = mongoose.Schema;

/**
 * Modelo de caja de comentarios utilizando mongoose para crear el modelo,
 *
 * En este modelo se piden 2 cosas
 * 1.- La descripción del comentario que sera requerida
 * 2.- el id del modelo de Usuario para poder tener una referencia con el email
 *     de quien es el creador del comentario con respecto a el recorrido, tambien es requerido.
 * 3.- el id del recorrido para poder crear un comentario referente a un recorrido en especifido.
 * 4.- la fecha que sera por default en el momento que fue creado el comentario.
 */

let comentarioSchema = new Schema({
  description_comentario: {
    type: String,
    required: [true, "La descripción es necesaria"],
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: [true, "El creador del comentario es necesario"],
  },
  recorrido: {
    type: Schema.Types.ObjectId,
    ref: "Recorrido",
    required: [true, "El recorrido es necesario"],
  },
  date_comentario: {
    type: String,
    default: () =>
      moment().tz("America/Santiago").format("DD-MM-YYYY, h:mm:ss a"),
  },
});

module.exports = mongoose.model("Comentario", comentarioSchema);
