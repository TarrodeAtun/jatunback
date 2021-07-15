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
const emergenciasAsistencias = require('../models/emergenciasAsistencias');
const turnos = require('../models/turnos');
const Mongoose = require("mongoose");
const tamañoPag = 20;

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
        const registros = await usuario.find({ activo: 1 }); //consultamos todos los registros de la tabla usuarios y lo almacenamos
        res.json({ ok: true, data: registros });
    }

controlador.ingresarUsuario =
    async (req, res) => {
        var { rut, nombre, apellido, fechaNac, email, telefono, hijos, password, perfil, centroCosto } = req.body; //copiamos los datos recibidos en constantes
        var emergencias = JSON.parse(req.body.emergencias);
        var bancarios = JSON.parse(req.body.bancarios);
        console.log(req.body);
        //extraccion rut
        let rutArray = req.body.rut.split("-");
        rut = rutArray[0];
        while (rut.indexOf(".") != -1) {
            rut = rut.replace(".", "");
        }

        //comprobamos que el rut usuario no exista
        usuario.find({ rut: rut }).then(prom => {
            if (prom.length > 0) {
                res.json({ estado: "warning", mensaje: "Ya existe un usuario con ese rut" });
            }
        });

        usuario.find({ email: email }).then(prom => {
            if (prom.length > 0) {
                res.json({ estado: "warning", mensaje: "Ya existe un usuario con ese email" });
            }
        });
        let dv = rutArray[1];
        var archivosrec = req.files;
        var arrayArchivos = [];
        var direcciones = [];
        if (archivosrec) {
            arrayArchivos = Object.entries(archivosrec);
        }
        const passencripted = bcrypt.hashSync(password, 10);
        password = passencripted;
        const nuevoUsuario = new usuario({ rut, dv, nombre, apellido, fechaNac, email, telefono, hijos, password, emergencias, perfil, bancarios, activo: 1, centroCosto }); // creamos un objeto usuario con los datos recibidos
        await nuevoUsuario.save().then(async prom => {
            if (arrayArchivos.length > 0) {
                console.log("hay imagen");
                await arrayArchivos.forEach(async archivo => { //por cada archivo que llega lo ingresamos al array;
                    console.log(archivo);
                    var file = archivo[1];
                    var separado = file.name.split(".");
                    var formato = separado[1];
                    uploadPath = './uploads/users/' + rut + "/" + archivo[0] + "." + formato;
                    var bdData = {
                        "input": archivo[0],
                        "url": "/" + rut + "/" + archivo[0] + "." + formato
                    }
                    direcciones.push(bdData)
                    file.mv(uploadPath, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                });
                console.log(direcciones);
                usuario.findOneAndUpdate({ _id: prom._id }, { "imagen": direcciones }).then(asd => {
                    res.json({ estado: "success", mensaje: "el usuario ha sido ingresado exitosamente", id: prom._id });
                })
            } else {
                res.json({ estado: "success", mensaje: "el usuario ha sido ingresado exitosamente", id: prom._id });
            }
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
        console.log(req.body.fechaNac);
        var { id, rut, nombre, apellido, fechaNac, email, telefono, hijos, perfil, centroCosto } = req.body; //copiamos los datos de respuesta de la peticion (datos nuevos)
        perfil = parseInt(perfil);
        perfilSec = parseInt(perfilSec);
        cargo = parseInt(cargo);
        var emergencias = JSON.parse(req.body.emergencias);
        var bancarios = JSON.parse(req.body.bancarios);
        console.log(req.body);
        //extraccion rut
        let rutArray = req.body.rut.split("-");
        rut = rutArray[0];
        while (rut.indexOf(".") != -1) {
            rut = rut.replace(".", "");
        }
        let dv = rutArray[1];
        if (parseInt(rut) !== parseInt(req.body.rutOriginal)) {
            usuario.find({ rut: rut }).then(prom => {
                if (prom.length > 0) {
                    res.json({ estado: "warning", mensaje: "Ya existe un usuario con ese rut" });
                }
            });
        }
        if (email !== req.body.emailOriginal) {
            usuario.find({ email: email }).then(prom => {
                if (prom.length > 0) {
                    res.json({ estado: "warning", mensaje: "Ya existe un usuario con ese email" });
                }
            });
        }
        var archivosrec = req.files;
        var arrayArchivos = [];
        if (archivosrec) {
            arrayArchivos = Object.entries(archivosrec);
        }
        var direcciones = [];
        usuario.find()
        const nuevoUsuario = { rut, dv, nombre, apellido, fechaNac, email, telefono, hijos, emergencias, perfil, bancarios, centroCosto }; //creamos un array usuario con los datos nuevos
        await usuario.findOneAndUpdate({ _id: id }, nuevoUsuario).then(async prom => { //indicamos a mongoose que en la tabla usuario busque el registro con el id y lo actualice con el nuevo objeto.
            if (arrayArchivos.length > 0) {
                console.log("hay imagen");
                await arrayArchivos.forEach(archivo => { //por cada archivo que llega lo ingresamos al array;
                    console.log(archivo);
                    var file = archivo[1];
                    var separado = file.name.split(".");
                    var formato = separado[1];
                    uploadPath = './uploads/users/' + rut + "/" + archivo[0] + "." + formato;
                    var bdData = {
                        "input": archivo[0],
                        "url": "/" + rut + "/" + archivo[0] + "." + formato
                    }
                    direcciones.push(bdData)
                    file.mv(uploadPath, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                });
                console.log(direcciones);
                usuario.findOneAndUpdate({ _id: id }, { "imagen": direcciones }).then(asd => {
                    res.json({ estado: "success", mensaje: "Datos ingresados correctamente", data: asd });
                })
            } else {
                console.log(prom);
                res.json({ estado: "success", mensaje: "Datos ingresados correctamente", data: prom });
            }
        }).catch(err => {
            console.log(err);
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
    async (req, res) => {
        console.log(req.body);
        await usuario.findOneAndUpdate({ _id: req.body.id }, { activo: 0 });
        res.json({ mensaje: "Usuario Eliminado", estado: "success" });
    }
controlador.eliminarUsuario =
    async (req, res) => {
        console.log(req.body);
        await usuario.findOneAndUpdate({ _id: req.body.id }, { activo: 0 });
        res.json({ mensaje: "Usuario Eliminado", estado: "success" });
    }
controlador.todosTrabajadores =
    async (req, res) => {
        await usuario.aggregate([
            { $match: { cargo: 2, activo: 1 } },
            { $project: { "nombre": 1, "apellido": 1, "rut": 1, "dv": 1 } }
        ]).then(resp => {
            console.log(resp);
            res.json({ ok: true, data: resp });
        });
    }
controlador.todosTrabajadoresPost =
    async (req, res) => {
        var match = {};
        if (req.body.cargo) {
            match["cargo"] = parseInt(req.body.cargo);
        }
        if (req.body.rut) {
            let rutArray = req.body.rut.split("-");
            rut = rutArray[0];
            while (rut.indexOf(".") != -1) {
                rut = rut.replace(".", "");
            }
            console.log(rut);
            match["rut"] = parseInt(rut);
        }
        if (req.body.centro) {
            match["centroCosto"] = parseInt(req.body.centro);
        }
        var page = 1;
        if (req.body.pagina) {
            page = req.body.pagina;
        }
        const skip = (page - 1) * tamañoPag;
        match["activo"] = 1;
        var paginas = 1;
        await usuario.aggregate([
            { $match: match },
            { $project: { "nombre": 1, "apellido": 1, "rut": 1, "dv": 1, "centroCosto": 1 } },
            { $skip: skip },   // Siempre aplica "salto" antes de "límite
            { $limit: tamañoPag },
        ]).then(resp => {
            usuario.aggregate([
                { $match: match },
                { $count: "registros" }
            ]).then(re => {
                let registros = re[0].registros;
                paginas = Math.ceil(registros / tamañoPag)
                console.log(paginas);
                res.json({ ok: true, data: resp, paginas: paginas });
            });
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
controlador.todosConductores =
    async (req, res) => {
        await usuario.aggregate([
            { $match: { cargo: 3 } },
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
        var { rut, afp, apv, montoApv, valorApv, tipoSalud, prevision, pactada, valorSalud, montoSalud } = req.body;
        const nuevoPrevisional = { afp, apv, valorApv, montoApv, tipoSalud, prevision, pactada, valorSalud, montoSalud }; // creamos un objeto usuario con los datos recibidos
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
        var arrayArchivos = [];
        if (archivosrec) {
            arrayArchivos = Object.entries(archivosrec);
        }
        var direcciones = [];

        var { rut, direccion, comuna, ciudad, nacionalidad, profesion, estadocivil, hijos, carga, fechainic, fechaterm, tipoContrato } = req.body;
        const nuevoContractual = { rut, direccion, comuna, ciudad, nacionalidad, profesion, estadocivil, hijos, carga, fechainic, fechaterm, tipoContrato }; // creamos un objeto usuario con los datos recibidos
        await contractuales.findOneAndUpdate({ "rut": req.body.rut }, nuevoContractual, { upsert: true })
            .then(async prom => {
                if (arrayArchivos) {
                    let archivosOriginales = prom.archivos;
                    await arrayArchivos.forEach(archivo => { //por cada archivo que llega lo ingresamos al array;
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
                            if (err) {
                                console.log(err);
                            }
                        });
                    });
                    await direcciones.forEach(function (archivo, indice) { //teniendo todos los archivos a ingresar recorremos para comparar cuales son nuevos y cuales existen
                        archivosOriginales.find(function (original) {
                            if (archivo.input === original.input) { // si son iguales, no hacemos nada
                            } else { //sino pegamos el valor original
                                direcciones.push(original)
                            }
                        });
                    });
                    contractuales.findOneAndUpdate({ "rut": req.body.rut }, { "archivos": direcciones }).then(asd => {
                        res.json({ estado: "success", mensaje: "Datos ingresados correctamente", data: asd });
                    })
                } else {
                    res.json({ estado: "success", mensaje: "Datos ingresados correctamente", data: prom });
                }

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
        console.log(req.body);
        if (req.body.fecha) {
            console.log(req.body.fecha);
            var today = new Date(req.body.fecha);
        } else {
            today = new Date();
        }
        var firstday = new Date(today.setDate(today.getDate() - today.getDay()));
        var lastday = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        var match = { "fecha": { "$gte": firstday, "$lte": lastday } };
        if (req.body.rut) {
            console.log("rut");
            match["trabajadores.rut"] = { "$eq": parseInt(req.body.rut) };
        }
        if (req.body.cliente) {
            console.log("cliente");
            match["clienterut"] = { "$eq": parseInt(req.body.cliente) };
        }
        if (req.body.sector) {
            console.log("sector");
            match["sector"] = { "$eq": parseInt(req.body.sector) };
        }
        const registros = turnos.aggregate([
            { $match: match },
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
            // console.log(resp);
            res.json({ ok: true, data: resp });
        }).catch(err => { console.log(err) });
    }

controlador.obtenerTurnosDia =
    async (req, res) => {
        console.log(req.body.fecha);
        let fecha = new Date(req.body.fecha);
        var match = { "fecha": { "$eq": fecha } };

        const registros = turnos.aggregate([
            { $match: match },
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
            {
                $lookup: {
                    from: 'clientes',
                    let: { "clienterut": "$clienterut" },
                    pipeline: [
                        { "$match": { "$expr": { "$eq": ["$rut", "$$clienterut"] } } },
                        { "$project": { "nombre": 1 } }
                    ],
                    as: 'datosCliente'
                }
            },
            { "$unwind": "$datosCliente" },
            { "$unwind": "$datosSectores" },
            { "$unwind": "$datosServicio" },
        ]).then(resp => {
            // console.log(resp);
            res.json({ ok: true, data: resp });
        });
    }

controlador.detalleTurno =
    async (req, res) => {
        console.log(req.params.id);
        const registros = turnos.aggregate([
            { $match: { _id: Mongoose.Types.ObjectId(req.params.id) } },
            {
                $lookup: {
                    from: 'servicios', let: { "servicio": "$servicio" }, pipeline: [{ "$match": { "$expr": { "$eq": ["$key", "$$servicio"] } } }, { "$project": { "nombre": 1 } }],
                    as: 'datosServicio'
                }
            },
            {
                $lookup: {
                    from: 'sectores', let: { "sector": "$sector" }, pipeline: [{ "$match": { "$expr": { "$eq": ["$key", "$$sector"] } } }, { "$project": { "nombre": 1 } }],
                    as: 'datosSectores'
                }
            },
            {
                $lookup: {
                    from: 'clientes', let: { "clienterut": "$clienterut" }, pipeline: [{ "$match": { "$expr": { "$eq": ["$rut", "$$clienterut"] } } }, { "$project": { "nombre": 1 } }],
                    as: 'datosCliente'
                }
            },
            {
                $lookup: {
                    from: 'usuarios', let: { "rut": "$jefeCuadrilla" }, pipeline: [{ "$match": { "$expr": { "$eq": ["$rut", "$$rut"] } } }, { "$project": { "nombre": 1 } }],
                    as: 'datosJefe'
                }
            },
            { "$unwind": "$datosJefe" },
            { "$unwind": "$datosCliente" },
            { "$unwind": "$datosSectores" },
            { "$unwind": "$datosServicio" },
        ]).then(resp => {
            console.log(resp);
            res.json({ ok: true, data: resp });
        });
    }


controlador.crearTurnos =
    async (req, res) => {
        console.log(req.body);
        var { clienterut, sector, servicio, tipoTurno, fecha, inicio, termino, jefe, trabajadores, frecuencia } = req.body;
        let insertTrabajadores = [];
        for (trabajador of trabajadores) {
            let datos = {
                "rut": parseInt(trabajador.rut),
                "dv": parseInt(trabajador.dv),
                "nombre": trabajador.nombre,
                "apellido": trabajador.apellido,
                "estado": 0,
            }
            insertTrabajadores.push(datos);
        }
        for (let turno of frecuencia) {
            let fechaFre = turno.fecha;
            var nuevoTurno = await new turnos({ clienterut, sector, servicio, tipoTurno, fecha: fechaFre, inicio, termino, estado: 0, jefeCuadrilla: jefe, trabajadores: insertTrabajadores });
            await nuevoTurno.save().then(prom => {
                res.json({ ok: true, data: prom, estado: "success", mensaje: "Turno Creado!" });
            }).catch(err => {
                console.log(err);
            });
        }
    }


controlador.modificarTurno =
    async (req, res) => {
        console.log(req.body);
        var { clienterut, sector, servicio, tipoTurno, fecha, inicio, termino, trabajadores } = req.body;
        var jefeCuadrilla = req.body.jefe;
        let insertTrabajadores = [];
        for (trabajador of trabajadores) {
            let datos = {
                "rut": parseInt(trabajador.rut),
                "dv": parseInt(trabajador.dv),
                "nombre": trabajador.nombre,
                "apellido": trabajador.apellido,
                "estado": 0,
            }
            insertTrabajadores.push(datos);
        }
        const nuevaTurno = { clienterut, sector, servicio, tipoTurno, fecha, inicio, termino, jefeCuadrilla, trabajadores: insertTrabajadores }; // creamos un objeto usuario con los datos recibidos
        await turnos.findOneAndUpdate({ "_id": req.body.id }, nuevaTurno).then(prom => {
            res.json({ ok: true, data: prom, estado: "success", mensaje: "Turno Modificado!" });
        })
    }
controlador.iniciarTurno =
    async (req, res) => {
        await turnos.findOneAndUpdate({ "_id": req.body.id }, { estado: 1 }, { new: true }).then(prom => {
            res.json({ ok: true, data: prom, estado: "success", mensaje: "Turno Iniciado" });
        })
    }
controlador.subirAsistencia =
    async (req, res) => {
        await turnos.findOneAndUpdate({ "_id": req.body.id }, { estado: 2 }, { new: true }).then(prom => {
            turnos.findOneAndUpdate({ "_id": req.body.id, "trabajadores.estado": 0 },
                { "$set": { "trabajadores.$.estado": 3 } }, { new: true }).then(prom => {
                    console.log(prom);
                    res.json({ ok: true, data: prom, estado: "success", mensaje: "Asistencia Subida" });
                })
        })

    }
controlador.finalizarTurno =
    async (req, res) => {
        var trabajadores = JSON.parse(req.body.trabajadores);
        var { rendimiento, bolsas, guantes, basureros, escobillon, palas, observaciones, ruta, calle, metas, comentariometas } = req.body;
        var archivosrec = req.files;
        var insertTrabajadores = [];
        var direcciones = [];
        for (trabajador of trabajadores) {
            let datos = {
                "rut": parseInt(trabajador.rut),
                "dv": parseInt(trabajador.dv),
                "nombre": trabajador.nombre,
                "apellido": trabajador.apellido,
                "estado": parseInt(trabajador.estado),
                "chaleco": (trabajador.chaleco) ? trabajador.chaleco : false,
                "zapatos": (trabajador.zapatos) ? trabajador.zapatos : false,
                "gorro": (trabajador.gorro) ? trabajador.gorro : false,
                "casco": (trabajador.casco) ? trabajador.casco : false,
                "audio": (trabajador.audio) ? trabajador.audio : false,
            }
            insertTrabajadores.push(datos);
        } if (archivosrec) {
            var arrayArchivos = Object.entries(archivosrec);
        }

        var turnofinalizado = await { rendimiento, bolsas, guantes, basureros, trabajadores: insertTrabajadores, escobillon, palas, observaciones, ruta, calle, metas, comentariometas, estado: 3 };
        await turnos.findOneAndUpdate({ "_id": req.body.id }, turnofinalizado, { new: true }).then(prom => {
            console.log(prom);
            if (archivosrec) {
                arrayArchivos.forEach(archivo => {
                    var file = archivo[1];
                    var separado = file.name.split(".");
                    var formato = separado[1];
                    uploadPath = './uploads/turnos/' + req.body.id + "/" + archivo[0] + "." + formato;
                    var bdData = {
                        "input": archivo[0],
                        "url": "/turnos/" + req.body.id + "/" + archivo[0] + "." + formato
                    }
                    direcciones.push(bdData)
                    file.mv(uploadPath, function (err) {
                        console.log(err);
                        if (err) {
                            console.log(err);
                        }
                    });
                });
                turnos.findOneAndUpdate({ "_id": req.body.id }, { "imagen": direcciones }).then(asd => {
                    console.log(asd);
                    res.json({ estado: "success", mensaje: "Turno finalizado correctamente" });
                })
            } else {
                res.json({ estado: "success", mensaje: "Turno finalizado correctamente" });
            }
        })
    }
controlador.pasarLista =
    async (req, res) => {
        let datos = req.body.datos;
        console.log(datos);
        await turnos.findOneAndUpdate({ "_id": req.body.id, "trabajadores.rut": datos.rut },
            { "$set": { "trabajadores.$.estado": 1 } }, { new: true }).then(prom => {
                console.log(prom);
                res.json({ ok: true, data: prom, estado: "success", mensaje: "Asistencia Confirmada" });
            })
    }


controlador.obtenerTurnoVigente =
    async (req, res) => {
        let fechaProv = new Date();
        let fecha = new Date(Date.UTC(fechaProv.getFullYear(), fechaProv.getMonth(), fechaProv.getDate()));
        console.log(fecha);
        let rut = parseInt(req.params.rut);
        const registros = turnos.aggregate([
            {
                $match: {
                    $and: [
                        {
                            fecha: { $eq: fecha }
                        },
                        {
                            estado: 1
                        },
                        {
                            trabajadores: { $elemMatch: { rut: rut, estado: 0 } },
                        }

                    ]
                }
            }, {
                $project: { "_id": 1 }
            }
        ]).then(resp => {
            console.log(resp);
            res.json({ ok: true, data: resp });
        });
    }

controlador.registrosGraficos =
    async (req, res) => {
        let rut = parseInt(req.params.rut);
        let match = {};
        match["$and"] = [{ "trabajadores": { "$elemMatch": { "rut": rut, "estado": 3 } } }];
        await turnos.aggregate([
            {
                $match: match
            },
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
            { "$unwind": "$datosSectores" },
            { "$unwind": "$datosServicio" },
        ]).then(resp => {
            console.log(resp);
            res.json({ ok: true, data: resp });
        });
    }
controlador.obtenerTurnosGeneral =
    async (req, res) => {
        var match = {};
        console.log(req.body);
        if (req.body.rut) {
            match["trabajadores"] = { "$elemMatch": { "rut": req.body.rut }, "$ne": { "estado": 0 } };
        }
        var page = 1;
        if (req.body.pagina) {
            page = req.body.pagina;
        }
        if (req.body.estado) {
            match["estado"] = req.body.estado;
        }
        const skip = (page - 1) * tamañoPag;
        turnos.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: 'servicios', let: { "servicio": "$servicio" }, pipeline: [{ "$match": { "$expr": { "$eq": ["$key", "$$servicio"] } } }, { "$project": { "nombre": 1 } }],
                    as: 'datosServicio'
                }
            },
            {
                $lookup: {
                    from: 'sectores', let: { "sector": "$sector" }, pipeline: [{ "$match": { "$expr": { "$eq": ["$key", "$$sector"] } } }, { "$project": { "nombre": 1 } }],
                    as: 'datosSectores'
                }
            },
            { $sort: { "fecha": 1 } },
            { $skip: skip },   // Siempre aplica "salto" antes de "límite
            { $limit: tamañoPag },
        ]).then(resp => {
            console.log(resp);
            res.json({ ok: true, data: resp });
        });
    }
controlador.obtenerTurnoUltimo =
    async (req, res) => {
        console.log(req.body);
        var match = {};
        if (req.body.rut) {
            match["trabajadores.rut"] = { "$eq": req.body.rut };
        }
        turnos.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: 'servicios', let: { "servicio": "$servicio" }, pipeline: [{ "$match": { "$expr": { "$eq": ["$key", "$$servicio"] } } }, { "$project": { "nombre": 1 } }],
                    as: 'datosServicio'
                }
            },
            {
                $lookup: {
                    from: 'sectores', let: { "sector": "$sector" }, pipeline: [{ "$match": { "$expr": { "$eq": ["$key", "$$sector"] } } }, { "$project": { "nombre": 1 } }],
                    as: 'datosSectores'
                }
            },
            { $sort: { "fecha": 1 } }
        ]).then(resp => {
            res.json({ ok: true, data: resp });
        });
    }

controlador.obtenerTurnosMes =
    async (req, res) => {
        var match = {};
        if (req.params.fecha) {
            console.log(req.params.fecha);
            var today = new Date(req.params.fecha);
        } else {
            today = new Date();
        }
        var firstday = new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0));
        var lastday = new Date(Date.UTC(today.getFullYear(), today.getMonth() + 1, 0, 0, 0, 0, 0));
        console.log(firstday);
        console.log(lastday);
        if (req.body.rut) {
            match["trabajadores"] = { "$elemMatch": { "rut": req.body.rut } };
        }
        if (req.body.notReemplazo) {
            match["reemplazos.rut"] = { "$ne": req.body.notReemplazo };
        }
        match["estado"] = 0;
        var page = 1;
        if (req.body.pagina) {
            page = req.body.pagina;
        }
        const skip = (page - 1) * tamañoPag;
        turnos.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: 'servicios', let: { "servicio": "$servicio" }, pipeline: [{ "$match": { "$expr": { "$eq": ["$key", "$$servicio"] } } }, { "$project": { "nombre": 1 } }],
                    as: 'datosServicio'
                }
            },
            {
                $lookup: {
                    from: 'sectores', let: { "sector": "$sector" }, pipeline: [{ "$match": { "$expr": { "$eq": ["$key", "$$sector"] } } }, { "$project": { "nombre": 1 } }],
                    as: 'datosSectores'
                }
            },

            { $sort: { "fecha": 1 } },
            { $skip: skip },   // Siempre aplica "salto" antes de "límite
            // { $limit: tamañoPag },
        ]).then(resp => {
            console.log(resp);
            res.json({ ok: true, data: resp });
        });
    }

controlador.crearReemplazoPerfil =
    async (req, res) => {
        console.log(req.body);
        for (let turno of req.body.turnos) {
            reemplazo = { rut: req.body.rutUsuario, reemplazado: parseInt(turno.rut), estado: 0 }
            turnos.aggregate([
                { $match: { _id: Mongoose.Types.ObjectId(turno.turno) } },
                { $project: { "reemplazos": 1 } },
            ]).then(resp => {
                let reemplazosActuales = resp[0].reemplazos;
                let existe = false
                if (resp[0].reemplazos.length > 0) {
                    reemplazosActuales.find(function (elem, ind) {
                        if (parseInt(elem.rut) === parseInt(req.body.rutUsuario)) {
                            console.log("ya existe este rut");
                            return;
                        } else {
                            reemplazosActuales.push(reemplazo);
                            return;
                        }
                    });
                } else {
                    reemplazosActuales.push(reemplazo);
                }
                if (reemplazosActuales.length > 0) {
                    turnos.findOneAndUpdate({ "_id": turno.turno }, { "reemplazos": reemplazosActuales }
                    ).then(prom => {
                        res.json({ ok: true, data: prom, estado: "success", mensaje: "Solicitud ingresada!" });
                    })
                }
            });
        }
    }
controlador.respuestaSolicitud =
    async (req, res) => {
        console.log(req.body);
        turnos.findOneAndUpdate({ "_id": req.body.turno, "reemplazos.rut": parseInt(req.body.rut) },
            { "$set": { "reemplazos.$.estado": parseInt(req.body.estado) } }, { new: true }).then(prom => {
                console.log(prom);
                res.json({ ok: true, data: prom, estado: "success", mensaje: "Respuesta Enviada" });
            })
    }

controlador.listadoSolicitudes =
    async (req, res) => {
        var match = {};
        console.log(req.body);
        if (req.body.rut) {
            if (req.body.estado) {
                match["reemplazos"] = { "$elemMatch": { "rut": parseInt(req.body.rut), "estado": req.body.estado } };
            } else {
                match["reemplazos"] = { "$elemMatch": { "rut": parseInt(req.body.rut) } };
            }
        } else {
            if (req.body.estado) {
                match["reemplazos"] = { $exists: true, $not: { $size: 0 }, $elemMatch: { "estado": req.body.estado } }
            } else {
                match["reemplazos"] = { $exists: true, $not: { $size: 0 } }
            }
        }

        var page = 1;
        if (req.body.pagina) {
            page = req.body.pagina;
        }
        const skip = (page - 1) * tamañoPag;
        turnos.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: 'servicios', let: { "servicio": "$servicio" }, pipeline: [{ "$match": { "$expr": { "$eq": ["$key", "$$servicio"] } } }, { "$project": { "nombre": 1 } }],
                    as: 'datosServicio'
                }
            },
            {
                $lookup: {
                    from: 'sectores', let: { "sector": "$sector" }, pipeline: [{ "$match": { "$expr": { "$eq": ["$key", "$$sector"] } } }, { "$project": { "nombre": 1 } }],
                    as: 'datosSectores'
                }
            },
            {
                $lookup: {
                    from: 'usuarios',
                    let: { "rut": "$reemplazos.rut" },
                    pipeline: [
                        { "$match": { "$expr": { "$in": ["$rut", "$$rut"] } } },
                        { "$project": { "nombre": 1, "apellido": 1, "rut": 1, "dv": 1 } }
                    ],
                    as: 'datosTrabajador'
                }
            },
            {
                $lookup: {
                    from: 'usuarios',
                    let: { "reemplazo": "$reemplazos.reemplazado" },
                    pipeline: [
                        { "$match": { "$expr": { "$in": ["$rut", "$$reemplazo"] } } },
                        { "$project": { "nombre": 1, "apellido": 1, "rut": 1, "dv": 1 } }
                    ],
                    as: 'datosReemplazo'
                }
            },
            // { "$unwind": "$datosTrabajador" },
            // { "$unwind": "$datosReemplazo" },
            // {
            //     $project: {
            //         "fecha": 1,
            //         "inicio": 1,
            //         "termino": 1,
            //         "datosServicio": 1,
            //         "datosSectores": 1,
            //         "reemplazos": {
            //             "rut":{$arrayElemAt : ["$reemplazos.rut", 0]},
            //             "datos" : "$datosTrabajador",
            //             "reemplazado":{$arrayElemAt : ["$reemplazos.reemplazado", 0]},
            //             "datosrem": "$datosReemplazo"
            //         }
            //     }
            // },
            { $sort: { "fecha": 1 } },
            { $skip: skip },   // Siempre aplica "salto" antes de "límite
            { $limit: tamañoPag },
        ]).then(resp => {
            console.log(resp);
            res.json({ ok: true, data: resp });
        });
    }


controlador.turnosPaginas =
    async (req, res) => {
        var match = {};
        console.log(req.body)
        if (req.body.rut) {
            match["trabajadores"] = { "$elemMatch": { "rut": parseInt(req.body.rut) } };
        }
        turnos.aggregate([
            { $match: match },
            { $sort: { "fecha": 1 } },
            { $count: "registros" }
        ]).then(resp => {
            let registros = resp[0].registros;
            let paginas = Math.ceil(registros / tamañoPag)
            console.log();
            res.json({ ok: true, paginas: paginas });
        });
    }

controlador.solicitudesPaginas =
    async (req, res) => {
        var match = {};
        if (req.body.rut) {
            match["reemplazos"] = { "$elemMatch": { "rut": req.body.rut } };
        } else {
            match["reemplazos"] = { $exists: true, $not: { $size: 0 } }
        }
        turnos.aggregate([
            { $match: match },
            { $sort: { "fecha": 1 } },
            { $count: "registros" }
        ]).then(resp => {
            let registros = resp[0].registros;
            let paginas = Math.ceil(registros / tamañoPag)
            res.json({ ok: true, paginas: paginas });
        });
    }


controlador.desempeno =
    async (req, res) => {
        var match = {};
        var matchPasado = {};

        if (req.body.rut) {
            // match["trabajadores"] = { "$elemMatch": { "rut": req.body.rut, estado: 1 } };
            match["rut"] = req.body.rut;
        }
        var today;
        if (req.body.fecha) {
            today = new Date(req.body.fecha);
        } else {
            today = new Date();
        }

        var firstdayAnterior = new Date(Date.UTC(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0, 0));
        var lastdayAnterior = new Date(Date.UTC(today.getFullYear(), today.getMonth(), 0, 0, 0, 0, 0));

        var firstdayCurso = new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0));
        var lastdayCurso = new Date(Date.UTC(today.getFullYear(), today.getMonth() + 1, 0, 0, 0, 0, 0));

        console.log(firstdayAnterior, lastdayAnterior);
        console.log(firstdayCurso, lastdayCurso);
        // match["fecha"] = { $gte: firstdayCurso, $lte: lastdayCurso };
        // matchPasado["fecha"] = { $gte: firstdayCurso, $lte: lastdayCurso };
        let resultados = [];
        await usuario.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: 'turnos',
                    let: { "rut": "$rut" },
                    pipeline: [
                        { "$match": { "trabajadores": { "$elemMatch": { "rut": req.body.rut, estado: 1 } }, "fecha": { $gte: firstdayCurso, $lte: lastdayCurso } } },
                        { "$project": { "_id": 1 } }
                    ],
                    as: 'asistencia'
                },
            },
            {
                $lookup: {
                    from: 'turnos',
                    let: { "rut": "$rut" },
                    pipeline: [
                        { "$match": { "trabajadores": { "$elemMatch": { "rut": req.body.rut, estado: 2 } }, "fecha": { $gte: firstdayCurso, $lte: lastdayCurso } } },
                        { "$project": { "_id": 1 } }
                    ],
                    as: 'atrasos'
                },
            },
            {
                $lookup: {
                    from: 'turnos',
                    let: { "rut": "$rut" },
                    pipeline: [
                        { "$match": { "trabajadores": { "$elemMatch": { "rut": req.body.rut, estado: 3 } }, "fecha": { $gte: firstdayCurso, $lte: lastdayCurso } } },
                        { "$project": { "_id": 1 } }
                    ],
                    as: 'inasistencia'
                },
            },
            {
                $lookup: {
                    from: 'turnos',
                    let: { "rut": "$rut" },
                    pipeline: [
                        { "$match": { "trabajadores": { "$elemMatch": { "rut": req.body.rut } }, "fecha": { $gte: firstdayCurso, $lte: lastdayCurso } } },
                        { "$project": { "_id": 1 } }
                    ],
                    as: 'totalTurnos'
                },
            },
            {
                $lookup: {
                    from: 'turnos',
                    let: { "rut": "$rut" },
                    pipeline: [
                        { "$match": { "trabajadores": { "$elemMatch": { "rut": req.body.rut, "chaleco": false } }, "fecha": { $gte: firstdayCurso, $lte: lastdayCurso } } },
                        { "$project": { "_id": 1 } }
                    ],
                    as: 'faltasChaleco'
                },
            },
            {
                $lookup: {
                    from: 'turnos',
                    let: { "rut": "$rut" },
                    pipeline: [
                        { "$match": { "trabajadores": { "$elemMatch": { "rut": req.body.rut, "zapatos": false } }, "fecha": { $gte: firstdayCurso, $lte: lastdayCurso } } },
                        { "$project": { "_id": 1 } }
                    ],
                    as: 'faltasZapatos'
                },
            },
            {
                $lookup: {
                    from: 'turnos',
                    let: { "rut": "$rut" },
                    pipeline: [
                        { "$match": { "trabajadores": { "$elemMatch": { "rut": req.body.rut, "gorro": false } }, "fecha": { $gte: firstdayCurso, $lte: lastdayCurso } } },
                        { "$project": { "_id": 1 } }
                    ],
                    as: 'faltasGorro'
                },
            },
            {
                $lookup: {
                    from: 'turnos',
                    let: { "rut": "$rut" },
                    pipeline: [
                        { "$match": { "trabajadores": { "$elemMatch": { "rut": req.body.rut, "casco": false } }, "fecha": { $gte: firstdayCurso, $lte: lastdayCurso } } },
                        { "$project": { "_id": 1 } }
                    ],
                    as: 'faltasCasco'
                },
            },
            {
                $lookup: {
                    from: 'turnos',
                    let: { "rut": "$rut" },
                    pipeline: [
                        { "$match": { "trabajadores": { "$elemMatch": { "rut": req.body.rut, "audio": false } }, "fecha": { $gte: firstdayCurso, $lte: lastdayCurso } } },
                        { "$project": { "_id": 1 } }
                    ],
                    as: 'faltasAudio'
                },
            },
            {
                $lookup: {
                    from: 'turnos',
                    let: { "rut": "$rut" },
                    pipeline: [
                        { "$match": { "trabajadores": { "$elemMatch": { "rut": req.body.rut, estado: 1 } }, "fecha": { $gte: firstdayAnterior, $lte: lastdayAnterior } } },
                        { "$project": { "_id": 1 } }
                    ],
                    as: 'asistenciasAnterior'
                },
            },
            {
                $lookup: {
                    from: 'turnos',
                    let: { "rut": "$rut" },
                    pipeline: [
                        { "$match": { "trabajadores": { "$elemMatch": { "rut": req.body.rut } }, "fecha": { $gte: firstdayAnterior, $lte: lastdayAnterior } } },
                        { "$project": { "_id": 1 } }
                    ],
                    as: 'totalAsistenciasAnterior'
                },
            },
            {
                $project: {
                    "numAsistencias": { $size: "$asistencia" },
                    "numAtrasos": { $size: "$atrasos" },
                    "numInasistencias": { $size: "$inasistencia" },
                    "numTotalTurnos": { $size: "$totalTurnos" },
                    "numFaltasChaleco": { $size: "$faltasChaleco" },
                    "numFaltasZapatos": { $size: "$faltasZapatos" },
                    "numFaltasGorro": { $size: "$faltasGorro" },
                    "numFaltasCasco": { $size: "$faltasCasco" },
                    "numFaltasAudio": { $size: "$faltasAudio" },
                    "numAsistenciasAnterior": { $size: "$asistenciasAnterior" },
                    "numTotalTurnosAnterior": { $size: "$totalAsistenciasAnterior" }
                }
            }
        ]).then(resp => {
            console.log(resp);
            res.json({ ok: true, data: resp, fecha: today });
        });
    }
controlador.obtenerEmergenciasAsistencia =
    async (req, res) => {
        let match = {};
        console.log(req.body);
        if (req.body.fecha) {
            let today = new Date(req.body.fecha);
            let day = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0));
            match["fecha"] = day;
        }
        if (req.body.cliente) {
            match["cliente"] = parseInt(req.body.cliente);
        }
        if (req.body.sector) {
            match["sector"] = parseInt(req.body.sector);
        }
        if (req.body.servicio) {
            match["servicio"] = parseInt(req.body.servicio);
        }
        if (req.body.tipo) {
            match["tipo"] = parseInt(req.body.tipo);
        }
        await emergenciasAsistencias.aggregate([
            {
                $match: match
            },
            {
                $lookup: {
                    from: 'turnos',
                    let: { "turno": { "$toObjectId": "$turno" } },
                    pipeline: [
                        { "$match": { "$expr": { "$eq": ["$_id", "$$turno"] } } },

                    ],
                    as: 'datosTurno'
                }
            },
            {
                $lookup: {
                    from: 'servicios',
                    let: { "servicio": "$servicio" },
                    pipeline: [{ "$match": { "$expr": { "$eq": ["$key", "$$servicio"] } } }, { "$project": { "nombre": 1 } }],
                    as: 'datosServicio'
                }
            },
            {
                $lookup: {
                    from: 'clientes',
                    let: { "cliente": "$cliente" },
                    pipeline: [{ "$match": { "$expr": { "$eq": ["$rut", "$$cliente"] } } }],
                    as: 'datosCliente'
                }
            },
        ]).then(resp => {
            console.log(resp);
            res.json({ ok: true, data: resp });
        });
    }
controlador.obtenerEmergenciaAsistencia =
    async (req, res) => {
        await emergenciasAsistencias.aggregate([
            { $match: { _id: Mongoose.Types.ObjectId(req.params.id) } },
            {
                $lookup: {
                    from: 'turnos',
                    let: { "turno": { "$toObjectId": "$turno" } },
                    pipeline: [
                        { "$match": { "$expr": { "$eq": ["$_id", "$$turno"] } } },

                    ],
                    as: 'datosTurno'
                }
            },
            {
                $lookup: {
                    from: 'servicios',
                    let: { "servicio": "$servicio" },
                    pipeline: [{ "$match": { "$expr": { "$eq": ["$key", "$$servicio"] } } }, { "$project": { "nombre": 1 } }],
                    as: 'datosServicio'
                }
            },
            {
                $lookup: {
                    from: 'clientes',
                    let: { "cliente": "$cliente" },
                    pipeline: [{ "$match": { "$expr": { "$eq": ["$rut", "$$cliente"] } } }],
                    as: 'datosCliente'
                }
            },
        ]).then(resp => {
            console.log(resp);
            res.json({ ok: true, data: resp });
        });
    }
controlador.crearEmergenciasAsistencia =
    async (req, res) => {
        // console.log(req.body);
        var { cliente, sector, servicio, fecha, hora, turno, tipo, clasificacion, observaciones } = req.body;
        var archivosrec = req.files;
        var arrayArchivos = Object.entries(archivosrec);
        var direcciones = [];
        var fecha = new Date();


        var nuevaEmergencia = await new emergenciasAsistencias({ cliente, sector, servicio, fecha, hora, turno, tipo, clasificacion, observaciones });
        await nuevaEmergencia.save().then(prom => {

            arrayArchivos.forEach(archivo => {
                var file = archivo[1];
                var separado = file.name.split(".");
                var formato = separado[1];
                uploadPath = './uploads/emergencias/asistencia/' + prom._id + "/" + archivo[0] + "." + formato;
                var bdData = {
                    "input": archivo[0],
                    "url": "/emergencias/asistencia/" + prom._id + "/" + archivo[0] + "." + formato
                }
                direcciones.push(bdData)
                file.mv(uploadPath, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            });

            emergenciasAsistencias.findOneAndUpdate({ "_id": prom._id }, { "imagen": direcciones }).then(asd => {
                console.log(asd);
            })
            res.json({ estado: "success", mensaje: "Emergencia Ingresada!" });
        }).catch(err => {
            console.log(err);
        });

    }

controlador.eliminarEmergenciaAsistencia =
    async (req, res) => {
        await emergenciasAsistencias.findOneAndDelete({ _id: req.body.emergencia }).then(asd => {
            res.json({ estado: "success", mensaje: "Emergencia Eliminada!" });
        }).catch(err => {
            console.log(err);
        });
    }


/* registros para paginacion */


module.exports = controlador;