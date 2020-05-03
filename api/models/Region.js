const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

/**
 * Modelo de la región utilizando a libreria mongoose para poder generar el modelo
 * uniqueValidator se utilizo para poder crear objetos unicos al momento de crear regiones
 * por lo que solo existira 1 region del bio-bio a modo de ejemplo.
 *
 * En este modelo solo se pide el nombre de la region para poder crear un Schema.
 * Quitar los comentarios de unique cuando esten ya creadas las regiones correspondientes
 * dato que al ser unica no se pueden editar estos datos despues ya que es la misma id.
 */

let regionSchema = new Schema({
  name_region: {
    type: String,
    //unique: true,
    required: [true, 'El nombre es necesario'],
  },
});

//regionSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Region', regionSchema);
