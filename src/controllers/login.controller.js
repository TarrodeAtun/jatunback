const controlador = {};
const Usuarios = require("../models/usuario");

const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { exists } = require("../models/usuario");



controlador.login =
    async (req, res) => {
        let body = req.body
        // aqui va la la comprobacion del rut
        let rutArray =  body.rut.split("-");
        let rut = rutArray[0];
        while (rut.indexOf(".") != -1) {
            rut = rut.replace(".", "");
        }
        let dv = rutArray[1];
        Usuarios.findOne({ rut: rut}, (err, usuario) => {
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Los datos ingresados no coinciden',
                    }
                })
            }
            if (!bcrypt.compareSync(body.password, usuario.password)) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Los datos ingresados no coinciden'
                    }
                })
            }
            var perfilSesion = "";
            if(usuario.perfil === "1"){
                perfilSesion = null
            }else{
                perfilSesion = usuario.perfil;
            }
            
            delete usuario.password;
            let token = jwt.sign({
                usuariobd: usuario
            }, process.env.SECRET, { expiresIn: '24h' })
            const cuerpo = {usuariobd : usuario, token};
            return res.json({
                ok: true,
                usuariobd: usuario,
                token,
                perfilSesion
            })
        })
    }
controlador.confirma =
    async (req, res) => {
        const body = req.body;
        // const logged = body.headers['Authorization'];
        
    }

module.exports = controlador;