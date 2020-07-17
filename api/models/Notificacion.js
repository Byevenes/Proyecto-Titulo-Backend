const mongoose = require("mongoose");
//const moment = require('moment');
const moment = require("moment-timezone");

let Schema = mongoose.Schema;

/**
 * tiposValidos es una variable que almacena un array de valores
 * que pueden tomar los diferentes tipos de Notificaciones.
 *
 * Para que despues en la aplicación se pueda diferenciar las notificaciones
 * segun su tipo, si se refieren a un recorrido o consejo
 */

let tiposValidos = {
  values: ["Recorrido", "Consejo"],
  message: "{VALUE} no es un tipo válido",
};

/**
 * Modelo de Notificaciones utilizando mongoose para crear el modelo,
 *
 * En este modelo se piden 4 cosas
 * 1.- el nombre de la notificacion que sera necesario
 * 2.- la descripción de la notificacion que sera requerida
 * 3.- el tipo el cual explicamos anteriormente como funciona y para que lo utilizaremos
 * 4.- la fecha que sera por default en el momento que esta fue creada la notificacion.
 */

let notificacionSchema = new Schema({
  name_notificacion: {
    type: String,
    required: [true, "El nombre es necesario"],
  },
  description_notificacion: {
    type: String,
    required: [true, "La descripción es necesaria"],
  },
  tipo_notificacion: {
    type: String,
    enum: tiposValidos,
    required: [true, "El tipo es necesario"],
  },
  date_notificacion: {
    type: String,
    default: () =>
      moment().tz("America/Santiago").format("DD-MM-YYYY, h:mm:ss a"),
  },
});

module.exports = mongoose.model("Notificacion", notificacionSchema);
