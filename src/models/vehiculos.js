const { Schema, model } = require('mongoose');

const vehiculos = new Schema(
    {
        patente: { type: String, required: true },
    },
    { timestamps: true }
);


module.exports = model('vehiculos', vehiculos);
