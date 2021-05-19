const { Schema, model } = require('mongoose');

const servicios = new Schema(
    {
        key: { type: Number, required: true, trim: true },
        Nombre: { type: String, required: true }
    },
    { timestamps: true }
);


module.exports = model('servicios', servicios);