const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// const { verificarToken } = require('../middleware/autenticacion');

const controlador = {};
const usuario = require('../models/usuario');
const equipo = require('../models/equipo');
const contractuales = require('../models/contractuales');

function quitarFormato(rutCrudo) {
    var strRut = new String(rutCrudo);
    while (strRut.indexOf(".") != -1) {
        strRut = strRut.replace(".", "");
    }
    while (strRut.indexOf("-") != -1) {
        strRut = strRut.replace("-", "");
    }
    return strRut;
}

controlador.todosUsuarios =
    async (req, res) => {
        const registros = await usuario.find(); //consultamos todos los registros de la tabla usuarios y lo almacenamos
        res.json({ ok: true, data: registros });
    }

controlador.ingresarUsuario =
    async (req, res) => {
        var { rut, nombre, apellido, fechaNac, email, telefono, hijos, password, emergencias, perfil, perfilSec, cargo, bancarios } = req.body; //copiamos los datos recibidos en constantes
        //extraccion rut
        let rutArray = req.body.rut.split("-");
        rut = rutArray[0];
        while (rut.indexOf(".") != -1) {
            rut = rut.replace(".", "");
        }
        let dv = rutArray[1];
        const passencripted = bcrypt.hashSync(password, 10);
        password = passencripted;
        const nuevoUsuario = new usuario({ rut, dv, nombre, apellido, fechaNac, email, telefono, hijos, password, emergencias, perfil, perfilSec, cargo, bancarios }); // creamos un objeto usuario con los datos recibidos
        await nuevoUsuario.save().then(prom => {
            res.json({ estado: "success", mensaje: "el usuario ha sido ingresado exitosamente", id: prom._id });
        }).catch(err => {
            if (err.code === 11000) {
                res.json({ estado: "warning", mensaje: "¡El rut ingresado ya existe!" });
            }
        });
    }

controlador.obtenerUsuario =
    async (req, res) => {
        const usuarioRes = await usuario.findOne({ _id: req.params.id });
        res.json(usuarioRes);
    }

controlador.actualizaUsuario =
    async (req, res) => {
        var { id, rut, nombre, apellido, fechaNac, email, telefono, hijos, emergencias, perfil, perfilSec, cargo, bancarios } = req.body; //copiamos los datos de respuesta de la peticion (datos nuevos)
        //extraccion rut
        let rutArray = req.body.rut.split("-");
        rut = rutArray[0];
        while (rut.indexOf(".") != -1) {
            rut = rut.replace(".", "");
        }
        let dv = rutArray[1];
        const nuevoUsuario = { rut, dv, nombre, apellido, fechaNac, email, telefono, hijos, emergencias, perfil, perfilSec, cargo, bancarios }; //creamos un array usuario con los datos nuevos
        await usuario.findOneAndUpdate({ _id: id }, nuevoUsuario).then(prom => { //indicamos a mongoose que en la tabla usuario busque el registro con el id y lo actualice con el nuevo objeto.
            res.json({ estado: "success", mensaje: "Datos modificados exitosamente" });
        }).catch(err => {
            if (err.code === 11000) {
                res.json({ estado: "warning", mensaje: "¡El rut ingresado ya existe!" });
            }
        });
    }

controlador.actualizaUsuarioBasico =  //funcion propia del trabajador
    async (req, res) => {  //recibe por protocolo el id del usuario
        const { email, telefono } = req.body; //copiamos los datos de respuesta de la peticion (datos nuevos)
        const nuevoUsuario = { email, telefono }; //creamos un array usuario con los datos nuevos
        await usuario.findOneAndUpdate({ _id: req.body.id }, nuevoUsuario); //indicamos a mongoose que en la tabla usuario busque el registro con el id y lo actualice con el nuevo objeto.
        await usuario.findOne({ _id: req.body.id }, (err, usuario) => {
            var perfilSesion = usuario.perfil;
            let token = jwt.sign({
                usuariobd: usuario
            }, process.env.SECRET, { expiresIn: '24h' })
            const cuerpo = { usuariobd: usuario, token };
            return res.json({
                ok: true,
                usuariobd: usuario,
                token,
                perfilSesion
            })
        });
    }

controlador.actualizaUsuarioPassword =
    async (req, res) => {  //recibe por protocolo el id del usuario
        const { id, pass } = req.body;
        const password = bcrypt.hashSync(pass, 10);
        const nuevoUsuario = { password };
        await usuario.findOneAndUpdate({ _id: id }, nuevoUsuario);
    }

controlador.actualizaUsuarioEmergencia =
    async (req, res) => {  //recibe por protocolo el id del usuario
        const { contacto, parentesco, telefono1, telefono2, direccion, comuna, ciudad } = req.body; //copiamos los datos de respuesta de la peticion (datos nuevos)
        const nuevoUsuario = { emergencias: { contacto, parentesco, telefono1, telefono2, direccion, comuna, ciudad } }; //creamos un array usuario con los datos nuevos
        await usuario.findOneAndUpdate({ _id: req.body.id }, nuevoUsuario); //indicamos a mongoose que en la tabla usuario busque el registro con el id y lo actualice con el nuevo objeto.
        await usuario.findOne({ _id: req.body.id }, (err, usuario) => {
            var perfilSesion = usuario.perfil;
            let token = jwt.sign({
                usuariobd: usuario
            }, process.env.SECRET, { expiresIn: '24h' })
            const cuerpo = { usuariobd: usuario, token };
            return res.json({
                ok: true,
                usuariobd: usuario,
                token,
                perfilSesion
            })
        });
    }

controlador.eliminaUsuario =
    async (req, res) => {  //recibe por protocolo el id del usuario

        console.log(req);
        // await usuario.findOneAndDelete({ _id: req.params.id });
        // res.json({ status: 'eliminado' });
    }


// equipo trabajador

controlador.obtenerEquipo =
    async (req, res) => {
        console.log("llega");
        console.log(req.params.rut);
        const equipoRes = await equipo.findOne({ rut: req.params.rut });
        res.json(equipoRes);
    }

controlador.ingresarEquipo =
    async (req, res) => {
        console.log("llego");
        var { rut, zapato, pantalon, polera, poleron } = req.body;
        const nuevoEquipo = { zapato, pantalon, polera, poleron }; // creamos un objeto usuario con los datos recibidos
        await equipo.findOneAndUpdate({ "rut": req.body.rut }, nuevoEquipo, { upsert: true })
            .then(prom => {
                res.json({ estado: "success", mensaje: "Datos ingresados correctamente" });
            }).catch(err => {
                console.log(err);
                if (err.code === 11000) {
                    res.json({ estado: "warning", mensaje: "¡El rut ingresado ya existe!" });
                }
            });
    }


controlador.ingresarContractuales =
    async (req, res) => {
        var archivosrec = req.files;
        var arrayArchivos = Object.entries(archivosrec);
        var direcciones = [];
        arrayArchivos.forEach(archivo => {
            var file = archivo[1];
            var separado = file.name.split(".");
            var formato = separado[1];
            uploadPath = './uploads/users/'+req.body.rut+"/"+ archivo[0]+"."+formato;
            var bdData = {
                "input": archivo[0],
                "url": "/"+req.body.rut+"/"+ archivo[0]+"."+formato
            }
            direcciones.push(bdData)
            file.mv(uploadPath, function (err) {
                console.log(err);
                if (err) {
                    console.log(err);
                }
            });
        });
        var { rut, direccion, comuna, ciudad, nacionalidad, profesion, estadocivil, hijos, carga, fechainic, fechaterm, tipoContrato } = req.body;
        const nuevoContractual = {rut, direccion, comuna, ciudad, nacionalidad, profesion, estadocivil, hijos, carga, fechainic, fechaterm, tipoContrato, archivos: direcciones}; // creamos un objeto usuario con los datos recibidos
        await contractuales.findOneAndUpdate({ "rut": req.body.rut }, nuevoContractual, {upsert: true})
        .then(prom => { 
            res.json({ estado: "success", mensaje: "Datos ingresados correctamente"});
        }).catch(err => {
            console.log(err);
            if (err.code === 11000) {
                res.json({ estado: "warning", mensaje: "¡El rut ingresado ya existe!" });
            }
        });
    }

    controlador.obtenerContractuales =
    async (req, res) => {
        const contractualesRes = await contractuales.findOne({ rut: req.params.rut });
        res.json(contractualesRes);
    }



module.exports = controlador;