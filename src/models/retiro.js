const { Schema, model } = require('mongoose');

const retiros = new Schema(
    {
        centro: { type: Number, required: true, trim: true },
        clienterut: { type: Number, required: true },
        direccion: { type: String },
        comuna: { type: Number, required: true },
        codigoler: { type: Number },
        categoria: { type: Number, required: true },
        fecha: {type:Date, required:true},
        inicio: { type: String, required: true },
        termino: { type: String, required: true },
        estado: { type: Number, required: true },
        or: { type: Number, required: true }
    },
    { timestamps: true }
);


module.exports = model('retiros', retiros);