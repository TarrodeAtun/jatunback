const { Schema, model } = require('mongoose');

const regiones = new Schema(
    {
        region: { type: String, unique: true, required:true },
        comunas: { type: Array},
    },
    { timestamps: true }
);


module.exports = model('regiones', regiones);