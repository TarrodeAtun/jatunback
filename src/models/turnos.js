const { Schema, model } = require('mongoose');

const turnos = new Schema(
    {

        clienterut: { type: Number, required: true },
        sector: { type: Number, required: true },
        servicio: { type: Number, required: true },
        tipoTurno: { type: Number, required: true },
        fecha: { type: Date, required: true },
        inicio: { type: String, required: true },
        termino: { type: String, required: true },
        estado: { type: Number, required: true },
        jefeCuadrilla: { type: Number, required: true },
        trabajadores: { type: Array, required: true },
        rendimiento: { type: Number },
        bolsas: { type: Boolean },
        guantes: { type: Boolean },
        basureros: { type: Boolean },
        escobillon: { type: Boolean },
        palas: { type: Boolean },
        observaciones: { type: String },
        ruta: { type: String },
        calle: { type: String },
        metas: { type: Number },
        comentariometas: { type: String },
        imagen: { type: Object }
    },
    { timestamps: true }
);


module.exports = model('turnos', turnos);

