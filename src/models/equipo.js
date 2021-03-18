const { Schema, model } = require('mongoose');

const equipo = new Schema(
    {
        rut: { type: Number, required: true, unique: true },
        zapato: { type: String, required: true, trim: true },
        pantalon: { type: String, required: true, trim: true },
        polera: { type: String, required: true, trim: true },
        poleron: { type: String, required: true, trim: true }
    },
    { timestamps: true }
);


module.exports = model('equipo', equipo);