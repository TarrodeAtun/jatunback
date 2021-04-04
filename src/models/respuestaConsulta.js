const { Schema, model } = require('mongoose');

const respuestaConsulta = new Schema(
    {
        rutRespuesta:{ type: String, required: true, trim: true },
        fechaRespuesta:{ type: Date, required: true},
        mensaje:{ type: String, required: true },
    },
    { timestamps: true }
);


module.exports = model('respuestaConsulta', respuestaConsulta);