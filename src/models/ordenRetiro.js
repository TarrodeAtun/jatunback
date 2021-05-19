const { Schema, model } = require('mongoose');

const ordenesretiros = new Schema(
    {
        key: { type: String },
        value: { type: Number },
        idor: { type: Number },
        centro: { type: Number, required: true, trim: true },
        retiro: { type: Date, required: true, trim: true },
        tarjeta: { type: Number, required: true },
        clienterut: { type: Number, required: true },
        contactoNombre: { type: String },
        contactoEmail: { type: String },
        direccion: { type: String },
        detalle: { type: String },
        comuna: { type: Number, required: true },
        establecimientoID: { type: Number },
        vuretc: { type: String, required: true },
        estado: { type: Number, required: true },
        ruta: { type: String }
    },
    { timestamps: true }
);


module.exports = model('ordenesretiros', ordenesretiros);
