const { Schema, model } = require('mongoose');

const usuario = new Schema(
    {
        rut: { type: Number, required: true, unique: true },
        dv: { type: Number, required: true },
        nombre: { type: String, required: true, trim: true },
        apellido: { type: String, required: true, trim: true },
        fechaNac: { type: Date },
        email: { type: String, required: true },
        telefono: { type: String, required: true },
        hijos: { type: Number, required: true },
        puestos: { type: Array, required: true },
        emergencias: { type: Object, required: true },
        bancarios: { type: Object, required: true },
        password: { type: String, required: true },
        perfil: { type: String, required: true }
    },
    { timestamps: true }
);

usuario.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject
}

module.exports = model('usuario', usuario);