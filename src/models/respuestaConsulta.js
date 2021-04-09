const { Schema, model } = require('mongoose');

const respuestaConsulta = new Schema(
    {
        refConsulta: { type: String, required: true, trim: true },
        rutRespuesta: { type: Number, required: true, trim: true },
        fechaRespuesta: { type: Date, required: true },
        mensaje: { type: String, required: true },
    },
    { timestamps: true }
);


module.exports = model('respuestaConsulta', respuestaConsulta);