const { Schema, model } = require('mongoose');

const afps = new Schema(
    {
        key: { type: Number, unique: true, required:true },
        nombre: { type: String,  trim: true }
    },
    { timestamps: true }
);
module.exports = model('afps', afps);