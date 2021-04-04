const { Schema, model } = require('mongoose');

const encuesta = new Schema(
    {
        nombre: { type: String, required: true, trim: true },
        preguntas: { type: Object, required: true, trim: true }
    },
    { timestamps: true }
);


module.exports = model('encuesta', encuesta);