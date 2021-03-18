const { Schema, model } = require('mongoose');

const contractuales = new Schema(
    {
        rut: { type: Number, unique: true, required:true },
        direccion: { type: String,  trim: true },
        comuna: { type: String,  trim: true },
        ciudad: { type: String,  trim: true },
        nacionalidad: { type: String,  trim: true },
        profesion: { type: String, trim: true },
        estadocivil: { type: String,  trim: true },
        hijos: { type: String,  trim: true },
        carga: { type: String,  trim: true },
        fechainic: { type: String, trim: true },
        fechaterm: { type: String,  trim: true },
        tipoContrato: { type: String,  trim: true },
        archivos:{ type: Object}
    },
    { timestamps: true }
);


module.exports = model('contractuales', contractuales);