const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// const { verificarToken } = require('../middleware/autenticacion');

const controlador = {};
const usuario = require('../models/usuario');
const equipo = require('../models/equipo');
const contractuales = require('../models/contractuales');
const previsionales = require('../models/previsionales');
const capacitaciones = require('../models/capacitaciones');
const amonestaciones = require('../models/amonestaciones');
const turnos = require('../models/turnos');

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
controlador.todosTrabajadores =
    async (req, res) => {
        await usuario.aggregate([
            { $match: { cargo: "2" } },
            { $project: { "nombre": 1, "apellido": 1, "rut": 1, "dv": 1 } }
        ]).then(resp => {
            // console.log(resp);
            res.json({ ok: true, data: resp });
        });
    }

controlador.todosJefes =
    async (req, res) => {
        await usuario.aggregate([
            { $match: { cargo: "1" } },
            { $project: { "nombre": 1, "apellido": 1, "rut": 1, "dv": 1 } }
        ]).then(resp => {
            console.log(resp);
            res.json({ ok: true, data: resp });
        });
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

controlador.obtenerPrevisional =
    async (req, res) => {
        console.log("llega");
        console.log(req.params.rut);
        const equipoRes = await previsionales.findOne({ rut: req.params.rut });
        res.json(equipoRes);
    }

controlador.ingresarPrevisional =
    async (req, res) => {
        console.log("llego");
        console.log(req.body);
        var { rut, afp, apv, valorApv, tipoSalud, prevision, pactada, valorSalud, montoSalud } = req.body;
        const nuevoPrevisional = { afp, apv, valorApv, tipoSalud, prevision, pactada, valorSalud, montoSalud }; // creamos un objeto usuario con los datos recibidos
        await previsionales.findOneAndUpdate({ "rut": req.body.rut }, nuevoPrevisional, { upsert: true })
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
            uploadPath = './uploads/users/' + req.body.rut + "/" + archivo[0] + "." + formato;
            var bdData = {
                "input": archivo[0],
                "url": "/" + req.body.rut + "/" + archivo[0] + "." + formato
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
        const nuevoContractual = { rut, direccion, comuna, ciudad, nacionalidad, profesion, estadocivil, hijos, carga, fechainic, fechaterm, tipoContrato, archivos: direcciones }; // creamos un objeto usuario con los datos recibidos
        await contractuales.findOneAndUpdate({ "rut": req.body.rut }, nuevoContractual, { upsert: true })
            .then(prom => {
                res.json({ estado: "success", mensaje: "Datos ingresados correctamente" });
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

//hoja de vida

controlador.obtenerCapacitaciones =
    async (req, res) => {
        console.log(req.params);
        const registros = await capacitaciones.find({ rut: req.params.id });
        console.log(registros);
        res.json({ ok: true, data: registros });
    }
controlador.obtenerCapacitacion =
    async (req, res) => {
        console.log(req.params);
        const registros = await capacitaciones.findOne({ _id: req.params.id }).then(resp => {
            const registrosUsuario = usuario.findOne({ rut: resp.rut }).then(respUser => {
                res.json({ ok: true, data: resp, dataUser: respUser });
            });
        });
    }
controlador.obtenerAmonestaciones =
    async (req, res) => {
        const registros = await amonestaciones.find({ rut: req.params.id });
        res.json({ ok: true, data: registros });
    }
controlador.obtenerAmonestacion =
    async (req, res) => {
        console.log(req.params);
        const registros = await amonestaciones.findOne({ _id: req.params.id }).then(resp => {
            const registrosUsuario = usuario.findOne({ rut: resp.rut }).then(respUser => {
                res.json({ ok: true, data: resp, dataUser: respUser });
            });
        });
    }

controlador.ingresarCapacitacion =
    async (req, res) => {
        console.log(req.body);
        console.log(req.files);
        var archivosrec = req.files;
        var arrayArchivos = Object.entries(archivosrec);
        var direcciones = [];
        arrayArchivos.forEach(archivo => {
            var file = archivo[1];
            var separado = file.name.split(".");
            var formato = separado[1];
            var tiempo = Date.now();
            uploadPath = './uploads/users/' + req.body.rut + "/capacitaciones/" + archivo[0] + "-" + tiempo + "." + formato;
            var bdData = {
                "input": archivo[0] + "-" + tiempo + "." + formato,
                "url": "/" + req.body.rut + "/capacitaciones/" + archivo[0] + "-" + tiempo + "." + formato
            }
            direcciones.push(bdData)
            file.mv(uploadPath, function (err) {
                console.log(err);
                if (err) {
                    console.log(err);
                }
            });
        });
        var { rut, curso, responsable, duracion, fecha, tematica, descripcion } = req.body;
        const nuevaCapacitacion = new capacitaciones({ rut, curso, responsable, duracion, fecha, tematica, descripcion, certificado: direcciones })
        await nuevaCapacitacion.save()
            .then(prom => {
                res.json({ estado: "success", mensaje: "Datos ingresados correctamente" });
            }).catch(err => {
                console.log(err);
                if (err.code === 11000) {
                    res.json({ estado: "warning", mensaje: "¡El rut ingresado ya existe!" });
                }
            });
    }

controlador.modificarCapacitacion =
    async (req, res) => {
        console.log(req.body);
        console.log(req.files);
        if (req.files) {
            var archivosrec = req.files;
            var arrayArchivos = Object.entries(archivosrec);
            var direcciones = [];
            arrayArchivos.forEach(archivo => {
                var file = archivo[1];
                var separado = file.name.split(".");
                var formato = separado[1];
                var tiempo = Date.now();
                uploadPath = './uploads/users/' + req.body.rut + "/capacitaciones/" + archivo[0] + "-" + tiempo + "." + formato;
                var bdData = {
                    "input": archivo[0] + "-" + tiempo + "." + formato,
                    "url": "/" + req.body.rut + "/capacitaciones/" + archivo[0] + "-" + tiempo + "." + formato
                }
                direcciones.push(bdData)
                file.mv(uploadPath, function (err) {
                    console.log(err);
                    if (err) {
                        console.log(err);
                    }
                });
            });
        }
        var { rut, curso, responsable, duracion, fecha, tematica, descripcion } = req.body;
        if (req.files) {
            const nuevaCapacitacion = { curso, responsable, duracion, fecha, tematica, descripcion, certificado: direcciones };
            await capacitaciones.findOneAndUpdate({ "_id": req.body.id }, nuevaCapacitacion, { upsert: true })
                .then(prom => {
                    res.json({ estado: "success", mensaje: "Datos modificados correctamente" });
                }).catch(err => {
                    console.log(err);
                    if (err.code === 11000) {
                        res.json({ estado: "warning", mensaje: "¡El rut ingresado ya existe!" });
                    }
                });
        } else {
            const nuevaCapacitacion = { curso, responsable, duracion, fecha, tematica, descripcion };
            await capacitaciones.findOneAndUpdate({ "_id": req.body.id }, nuevaCapacitacion, { upsert: true })
                .then(prom => {
                    res.json({ estado: "success", mensaje: "Datos modificados correctamente" });
                }).catch(err => {
                    console.log(err);
                    if (err.code === 11000) {
                        res.json({ estado: "warning", mensaje: "¡El rut ingresado ya existe!" });
                    }
                });
        }
    }
controlador.eliminarCapacitacion =
    async (req, res) => {
        console.log(req.body);
        await capacitaciones.findOneAndDelete({ _id: req.body.id });
        res.json({ mensaje: "Capacitacion eliminada exitosamente", status: 'eliminado', estado: "success" });
    }
controlador.ingresarAmonestacion =
    async (req, res) => {
        console.log("llego");
        console.log(req.body);
        var { rut, tipo, responsable, fecha, descripcion } = req.body;
        const nuevaAmonestacion = new amonestaciones({ rut, tipo, responsable, fecha, descripcion }); // creamos un objeto usuario con los datos recibidos
        await nuevaAmonestacion.save()
            .then(prom => {
                res.json({ estado: "success", mensaje: "Datos ingresados correctamente" });
            }).catch(err => {
                console.log(err);
                if (err.code === 11000) {
                    res.json({ estado: "warning", mensaje: "¡El rut ingresado ya existe!" });
                }
            });
    }
controlador.modificarAmonestacion =
    async (req, res) => {
        console.log("llego");
        console.log(req.body);
        var { tipo, responsable, fecha, descripcion } = req.body;

        const nuevaAmonestacion = { tipo, responsable, fecha, descripcion }; // creamos un objeto usuario con los datos recibidos
        await amonestaciones.findOneAndUpdate({ "_id": req.body.id }, nuevaAmonestacion, { upsert: true })
            .then(prom => {
                res.json({ estado: "success", mensaje: "Datos ingresados correctamente" });
            }).catch(err => {
                console.log(err);
                if (err.code === 11000) {
                    res.json({ estado: "warning", mensaje: "¡El rut ingresado ya existe!" });
                }
            });
    }
controlador.eliminarAmonestacion =
    async (req, res) => {
        console.log(req.body);
        await amonestaciones.findOneAndDelete({ _id: req.body.id });
        res.json({ mensaje: "Amonestacion eliminada exitosamente", status: 'eliminado', estado: "success" });
    }


controlador.obtenerTurnos =
    async (req, res) => {
        var today;
        if (req.params.fecha) {
            console.log(req.params.fecha);
            var today = new Date(req.params.fecha);
        } else {
            today = new Date();
        }
        var firstday = new Date(today.setDate(today.getDate() - today.getDay()));
        var lastday = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        console.log(firstday);
        console.log(lastday);
        const registros = turnos.aggregate([
            { $match: { fecha: { $gte: firstday, $lte: lastday } } },
            {
                $lookup: {
                    from: 'servicios',
                    let: { "servicio": "$servicio" },
                    pipeline: [
                        { "$match": { "$expr": { "$eq": ["$key", "$$servicio"] } } },
                        { "$project": { "nombre": 1 } }
                    ],
                    as: 'datosServicio'
                }
            },
            {
                $lookup: {
                    from: 'sectores',
                    let: { "sector": "$sector" },
                    pipeline: [
                        { "$match": { "$expr": { "$eq": ["$key", "$$sector"] } } },
                        { "$project": { "nombre": 1 } }
                    ],
                    as: 'datosSectores'
                }
            },
            { $sort: { "fecha": 1 } }
        ]).then(resp => {
            console.log(resp);
            res.json({ ok: true, data: resp });
        });
    }
controlador.crearTurnos =
    async (req, res) => {
        console.log(req.body);
        var { clienterut, sector, servicio, tipoTurno, fecha, inicio, termino, jefe, trabajadores, frecuencia } = req.body;
        for (let turno of frecuencia) {
            let fechaFre = turno.fecha;
            console.log(fechaFre);
            var nuevoTurno = await new turnos({ clienterut, sector, servicio, tipoTurno, fecha: fechaFre, inicio, termino, estado: 0, jefeCuadrilla: jefe, trabajadores });
            await nuevoTurno.save().then(prom => {
                console.log(prom);
            }).catch(err => {
                console.log(err);
            });
        }
    }
controlador.detalleTurno =
    async (req, res) => {
        const turnoRes = await turnos.findOne({ _id: req.params.id });
        res.json({ ok: true, data: turnoRes });
  
    }

controlador.modificarTurno =
    async (req, res) => {
        console.log(req.body);
        var { clienterut, sector, servicio, tipoTurno, fecha, inicio, termino, trabajadores } = req.body;
        var jefeCuadrilla = req.body.jefe;
        const nuevaTurno = { clienterut, sector, servicio, tipoTurno, fecha, inicio, termino, jefeCuadrilla, trabajadores }; // creamos un objeto usuario con los datos recibidos
        await turnos.findOneAndUpdate({ "_id": req.body.id }, nuevaTurno)
    }


module.exports = controlador;