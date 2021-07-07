const { Schema, model } = require('mongoose');

const emergenciaVehiculos = new Schema(
    {
        fecha: { type: Number,  required: true },
        hora: { type: String, trim: true },
        patente: { type: String },
        conductor: { type: Number },
        hito: { type: String, trim: true },
        imagen: { type: Object, trim: true },
    },
    { timestamps: true }
);
module.exports = model('emergenciaVehiculos', emergenciaVehiculos);