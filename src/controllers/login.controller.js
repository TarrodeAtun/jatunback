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
            if(usuario.perfil === 1){
                perfilSesion = null
            }else{
                perfilSesion = usuario.perfil;
            }
            
            delete usuario.password;
            let token = jwt.sign({
                usuariobd: usuario
            }, process.env.SECRET, { expiresIn: '24h' })
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

    controlador.compruebaTokenPass =
    async (req, res) => {
        const body = req.body;
        jwt.verify(body.token, process.env.SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    status: 401,
                    ok: false,
                    mensaje: 'Token inválida'
                });
            } else {
                var codigo = decoded.recuperacion;
                console.log(codigo);
                codigoSplit = codigo.split("&");
                Usuarios.findOne({ rut: decoded.rut, recuperacion: codigo }).then(resp => {
                    if (resp) {
                        console.log(resp);
                        console.log("encontrado");
                        return res.status(200).json({
                            status: 200,
                            ok: true,
                            mensaje: 'Código Valido, ingrese su nueva contraseña.',
                            id: resp._id
                        });
                    } else {
                        console.log("no encontrado");
                        return res.status(401).json({
                            status: 401,
                            ok: false,
                            mensaje: 'Código No Valido, solicite un nuevo código.'
                        });
                    }
                }).catch(err => {
                    console.log(err);
                });


                console.log("token valida");
            }
        });
    }

controlador.recuperaPass =
    async (req, res) => {  //recibe por protocolo el id del usuario
        const { id, pass } = req.body;
        console.log(id);
        const password = bcrypt.hashSync(pass, 10);
        const nuevoUsuario = { password };
        await Usuarios.findOneAndUpdate({ _id: id }, nuevoUsuario).then(resp => {
            console.log(resp);
            return res.status(200).json({
                status: 200,
                ok: true,
                mensaje: 'Contraseña modificada correctamente'
            });
        });
    }

module.exports = controlador;