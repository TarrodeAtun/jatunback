const { Schema, model } = require('mongoose');

const sectores = new Schema(
    {
        key: { type: Number, required: true, trim: true },
        Nombre: { type: String, required: true }
    },
    { timestamps: true }
);


module.exports = model('sectores', sectores);

