const { Schema, model } = require('mongoose');

const isapres = new Schema(
    {
        key: { type: Number, unique: true, required:true },
        nombre: { type: String,  trim: true }
    },
    { timestamps: true }
);
module.exports = model('isapres', isapres);