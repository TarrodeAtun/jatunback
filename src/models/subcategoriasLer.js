const { Schema, model } = require('mongoose');

const subcategoriasLers = new Schema(
    {
        codigo: { type: Number, unique: true, required: true },
        categoria: { type: Number, trim: true },
        key: { type: Number, trim: true },
        nombre: { type: String, trim: true }
    },
    { timestamps: true }
);
module.exports = model('subcategoriasLers', subcategoriasLers);