const { Schema, model } = require('mongoose');

const secuencias = new Schema(
    {
        key: {type: String},
        value: {type: Number}
    },
    { timestamps: true }
);


module.exports = model('secuencias', secuencias);