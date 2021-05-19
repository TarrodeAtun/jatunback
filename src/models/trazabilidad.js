const { Schema, model } = require('mongoose');

const trazabilidades = new Schema(
    {
       
        idor: { type: Number },
        pesoPrimer: { type: Number },
        nombreEntrega: { type: String },
        rutEntrega: { type: Number },
        dvEntrega: { type: Number },
        archivos:{ type: Object},
        comentarios: { type: String },
        tipoTarjeta:{ type: Number },
        pesoSegundo: { type: Number },
        sacas: { type: Number },
        planificacion: { type: Number },
        codigo: { type: Number },
        residuos: { type: Array }
        
    },
    { timestamps: true }
);


module.exports = model('trazabilidades', trazabilidades);
