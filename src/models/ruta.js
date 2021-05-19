const { Schema, model } = require('mongoose');

const rutas = new Schema(
    {
        patente: { type: String, required: true, trim: true },
        servicio: { type: Number, required: true },
        conductorRut: { type: Number },
        fecha: { type: Date, required: true },
        ordenes: { type: Array },
        inicio: { type: String, required: true },
        termino: { type: String, required: true },
        enlace: { type: String, required: true }
    },
    { timestamps: true }
);


module.exports = model('rutas', rutas);
