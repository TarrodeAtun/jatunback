const { Schema, model } = require('mongoose');



const tiposturnos = new Schema(
    {
        key: { type: Number, required: true, trim: true },
        Nombre: { type: String, required: true }
    },
    { timestamps: true }
);


module.exports = model('tiposturnos', tiposturnos);

