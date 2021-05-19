const { Schema, model } = require('mongoose');

const previsionales = new Schema(
    {
        rut: { type: Number, required: true, unique: true },
        afp: { type: Number, required: true, trim: true },
        apv: { type: Number, required: true, trim: true },
        valorApv: { type: Number, required: true, trim: true },
        tipoSalud: { type: Number, required: true, trim: true },
        prevision: { type: Number, required: true, trim: true },
        pactada: { type: Number, required: true, trim: true },
        valorSalud: { type: Number, required: true, trim: true },
        montoSalud: { type: Number, required: true, trim: true }
    },
    { timestamps: true }
);



module.exports = model('previsionales', previsionales);