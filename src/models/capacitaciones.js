const { Schema, model } = require('mongoose');

const capacitaciones = new Schema(
    {
        rut: { type: Number, required: true },
        curso: { type: String, required: true, trim: true },
        responsable: { type: String, required: true, trim: true },
        duracion: { type: String, required: true, trim: true },
        fecha: { type: Date, required: true },
        tematica: { type: String, required: true, trim: true },
        descripcion: { type: String, required: true, trim:true },
        certificado: { type: Object, required: true }
    },
    { timestamps: true }
);


module.exports = model('capacitaciones', capacitaciones);