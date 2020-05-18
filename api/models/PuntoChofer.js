const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const moment = require('moment');

let Schema = mongoose.Schema;

let pointSchema = new Schema({
  type: {
    type: String,
    default: 'Point',
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

let puntoChoferSchema = new Schema({
  chofer: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'El chofer es necesario'],
  },
  date_chofer: {
    type: String,
    default: () => moment().format('DD-MM-YYYY, h:mm:ss a'),
  },
  location: {
    type: pointSchema,
    required: [true, 'El punto del chofer es necesario'],
  },
});

module.exports = mongoose.model('PuntoChofer', puntoChoferSchema);
