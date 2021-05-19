const { Schema, model } = require('mongoose');

const codigosLer = new Schema(
    {
        codigo: { type: Number, unique: true, required:true },
        residuo: { type: String,  trim: true }
    },
    { timestamps: true }
);
module.exports = model('codigosLer', codigosLer);