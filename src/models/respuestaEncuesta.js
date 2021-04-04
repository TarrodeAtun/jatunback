const { Schema, model } = require('mongoose');

const respuestaEncuesta = new Schema(
    {
        idEncuesta: { type: String, required: true, trim: true },
        idUsuario: { type: String, required: true, trim: true },
        respuestas: { type: Object, required: true, trim: true }
    },
    { timestamps: true }
);


module.exports = model('respuestaEncuesta', respuestaEncuesta);