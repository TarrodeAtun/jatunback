const { Schema, model } = require('mongoose');

const emergenciasAsistencias = new Schema(
    {
        cliente: { type: Number },
        sector: { type: Number },
        servicio: { type: Number },
        turno: { type: String },
        hora: { type: String },
        tipo: { type: Number },
        clasificacion: { type: Number },
        observaciones: { type: String },
        imagen: { type: Object, trim: true },

    },
    { timestamps: true }
);
module.exports = model('emergenciasAsistencias', emergenciasAsistencias);