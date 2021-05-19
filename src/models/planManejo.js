const { Schema, model } = require('mongoose');

const planmanejos = new Schema(
    {
        clienteRut: { type: Number, required: true, trim: true },
        nombre: { type: String, required: true, trim: true },
        fecha: { type: Date, required: true },
        centro: { type: Number, required: true },
        direccion: { type: String, required: true, trim: true },
        comuna: { type: Number, required: true, trim: true },
        id: { type: Number, required: true, trim: true },
        vuretc: { type: String, required: true, trim: true },
        recoleccion: { type: Number, required: true, trim: true },
        valorizacion: { type: Number, required: true, trim: true },
        residuos: { type: Object, required: true, trim: true },
        techadoAltura: { type: Number, required: true, trim: true },
        techadoSuperficie: { type: Number, required: true, trim: true },
        superficie: { type: Number, required: true, trim: true },
        imagen: { type: Object },
        comentarios: { type: String, required: true, trim: true },
        contenedores: { type: Number },
        residuosegregado: { type: String, required: true, trim: true },
        estado: { type: Number }
    },
    { timestamps: true }
);


module.exports = model('planmanejos', planmanejos);