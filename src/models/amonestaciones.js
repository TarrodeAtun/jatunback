const { Schema, model } = require('mongoose');

const amonestaciones = new Schema(
    {
        rut: { type: Number },
        tipo: { type: String },
        responsable: { type: String, trim: true },
        fecha: { type: Date, trim: true },
        descripcion: { type: String, trim: true },
    },
    { timestamps: true }
);


module.exports = model('amonestaciones', amonestaciones);