const { Schema, model } = require('mongoose');

const emergenciaResiduos = new Schema(
    {
        fecha: { type: Number, unique: true, required: true },
        hora: { type: String, trim: true },
        turno: { type: Number },
        involucrados: { type: Object },
        hito: { type: String, trim: true },
        imagen: { type: Object, trim: true },

    },
    { timestamps: true }
);
module.exports = model('emergenciaResiduos', emergenciaResiduos);