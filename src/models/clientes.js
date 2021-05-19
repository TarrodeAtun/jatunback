const { Schema, model } = require('mongoose');

const clientes = new Schema(
    {
        rut: { type: Number, unique: true, required:true },
        dv: { type: Number},
        nombre: { type: String,  trim: true },
        sectores: { type: Array}
    },
    { timestamps: true }
);


module.exports = model('clientes', clientes);