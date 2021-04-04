const { Schema, model } = require('mongoose');

const soporte = new Schema(
    {
        asunto: { type: String, required: true, trim: true },
        autor: { type: String, required: true, trim: true },
        fechaRespuesta: { type: Date, required: true },
        estado: { type: Number, required: true },
        ultimaRespuesta: { type: String, required: true, trim:true },
    },
    { timestamps: true }
);


module.exports = model('soporte', soporte);