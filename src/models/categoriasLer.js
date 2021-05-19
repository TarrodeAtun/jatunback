const { Schema, model } = require('mongoose');

const categoriasLers = new Schema(
    {
        key: { type: Number, unique: true, required: true },
        codigo: { type: Number, unique: true, required: true },
        nombre: { type: String, trim: true }
    },
    { timestamps: true }
);
module.exports = model('categoriasLers', categoriasLers);