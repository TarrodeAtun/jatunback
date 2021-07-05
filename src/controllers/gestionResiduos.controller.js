const controlador = {};

const ordenesRetiro = require("../models/ordenRetiro");
const retiros = require("../models/retiro");
const secuencias = require("../models/secuencias");
const rutas = require("../models/ruta");
const trazabilidades = require("../models/trazabilidad");
const planesmanejos = require("../models/planManejo");
const emergenciasResiduos = require("../models/emergenciasResiduos");
const Mongoose = require("mongoose");
const ordenRetiro = require("../models/ordenRetiro");

//funciones ordenes retiro

controlador.obtenerOrdenes =
    async (req, res) => {

        await ordenesRetiro.aggregate([
            {
                $lookup: {
                    from: 'centrocostos',
                    let: { "centro": "$centro" },
                    pipeline: [
                        { "$match": { "$expr": { "$eq": ["$key", "$$centro"] } } },
                        { "$project": { "nombre": 1 } }
                    ],
                    as: 'datosCentro'
                }
            },
            { $sort: { "idor": -1 } }
        ]).then(resp => {
            console.log(resp);
            res.json({ ok: true, data: resp });
        });
    }
controlador.ordenesNoAsignadas =
    async (req, res) => {
        await ordenesRetiro.aggregate([
            { $match: { estado: 0 } },
            { $sort: { "idor": -1 } }
        ]).then(resp => {
            res.json({ ok: true, data: resp });
        });
    }

controlador.crearOrden =
    async (req, res) => {
        console.log(req.body);
        var idornuew = await getSequenceNextValue("secuencia");
        await console.log(idornuew);
        var { centro, retiro, tarjeta, clienterut, contactoNombre, contactoEmail, direccion, comuna, establecimientoID, vuretc, detalle } = req.body;
        const nuevaOrden = new ordenesRetiro({ idor: idornuew, centro, retiro, tarjeta, clienterut, contactoNombre, contactoEmail, direccion, comuna, establecimientoID, vuretc, detalle, estado: 0 });
        await nuevaOrden.save().then(prom => {
            console.log(prom);
            res.json({ estado: "success", mensaje: "Orden Ingresada exitosamente" });
        }).catch(err => {
            // console.log(err);
            res.json({ estado: "error", err: err });
        });
    }

controlador.obtenerOrden =
    async (req, res) => {
        console.log(req.params);
        const registros = await ordenesRetiro.findOne({ _id: req.params.id }).then(resp => {
            res.json({ ok: true, data: resp });
        });
    }

controlador.modificarOrden =
    async (req, res) => {
        console.log(":D");
        console.log(req.body);
        var { centro, retiro, tarjeta, clienterut, contactoNombre, contactoEmail, direccion, comuna, establecimientoID, vuretc, detalle } = req.body;
        const nuevaOrden = { centro, retiro, tarjeta, clienterut, contactoNombre, contactoEmail, direccion, comuna, establecimientoID, vuretc, detalle, estado: 0 };
        await ordenesRetiro.findOneAndUpdate({ "_id": req.body.id }, nuevaOrden, { upsert: true }).then(prom => {
            console.log(prom);
            res.json({ estado: "success", mensaje: "Orden modificada exitosamente" });
        }).catch(err => {
            // console.log(err);
            res.json({ estado: "error", err: err });
        });
    }


async function getSequenceNextValue(seqName) {
    const valor = await secuencias.findOneAndUpdate(
        { key: seqName },
        { $inc: { value: 1 } },
        { new: true }
    ).then(async resp => {
        var objeto = resp.toObject();
        return objeto.value;
    }).catch(err => { console.log(err) });
    return valor;
}

controlador.crearRetiro =
    async (req, res) => {
        var ordenes = req.body.or;
        console.log(ordenes);
        var { centro, clienterut, direccion, comuna, codigoler, categoria, fecha, inicio, termino } = req.body;
        if (ordenes) {
            for (orden of ordenes) {
                console.log(orden.fecha);
                var fechaOrden = new Date(orden.fecha);
                var numOrden = await orden.or;
                if (numOrden) {
                    var nuevoRetiro = await new retiros({ centro, clienterut, direccion, comuna, codigoler, categoria, fecha: fechaOrden, inicio, termino, estado: 0, or: numOrden });
                    await nuevoRetiro.save().then(prom => {
                        console.log(prom);
                        ordenesRetiro.findOneAndUpdate({ "idor": orden.or }, { "estado": 1 }).then(asd => {
                            // console.log(asd);
                        })
                    }).catch(err => {
                        console.log(err);
                    });
                }
            }
            res.json({ estado: "success", mensaje: "Programacion de retiro ingresado exitosamente" });
        } else {

        }

        // const nuevoRetiro = new retiros({ centro, clienterut, direccion, comuna, codigoler, categoria, fecha, inicio, termino, or });
        // await nuevoRetiro.save().then(prom => {
        //     console.log(prom);
        //     res.json({ estado: "success", mensaje: "Retiro Ingresada exitosamente" });
        // }).catch(err => {
        //     res.json({ estado: "error", err: err });
        // });

    }


controlador.obtenerRetiros =
    async (req, res) => {
        var today;
        if (req.params.fecha) {
            console.log(req.params.fecha);
            var today = new Date(req.params.fecha);
        } else {
            today = new Date();
        }
        console.log(today);
        // var nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
        // // console.log(nextweek);
        var firstday = new Date(today.setDate(today.getDate() - today.getDay()));
        var lastday = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        console.log(firstday, lastday);
        const registros = retiros.aggregate([
            { $match: { fecha: { $gte: firstday, $lte: lastday } } },
            {
                $lookup: {
                    from: 'centrocostos',
                    let: { "centro": "$centro" },
                    pipeline: [
                        { "$match": { "$expr": { "$eq": ["$key", "$$centro"] } } },
                        { "$project": { "nombre": 1 } }
                    ],
                    as: 'datosCentro'
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
            { $sort: { "fecha": 1 } }
        ]).then(resp => {
            // console.log(resp);
            res.json({ ok: true, data: resp });
        });
    }

controlador.obtenerRetiro =
    async (req, res) => {
        console.log(req.params);
        const registros = await retiros.findOne({ _id: req.params.id }).then(resp => {
            res.json({ ok: true, data: resp });
        });
    }

controlador.modificarRetiro =
    async (req, res) => {
        console.log(req.body);
        console.log("modificando")
        var { centro, clienterut, direccion, comuna, codigoler, categoria, fecha, inicio, termino, or, ordenActual } = req.body;
        const nuevoRetiro = { centro, clienterut, direccion, comuna, codigoler, categoria, fecha, inicio, termino, or };
        await retiros.findOneAndUpdate({ "_id": req.body.id }, nuevoRetiro).then(async prom => {
            await ordenesRetiro.findOneAndUpdate({ "idor": ordenActual }, { "estado": 0 }).then(asd => {
                res.json({ estado: "success", mensaje: "Retiro modificado exitosamente" });
            });
            await ordenesRetiro.findOneAndUpdate({ "idor": or }, { "estado": 1 }).then(asd => {
                res.json({ estado: "success", mensaje: "Retiro modificado exitosamente" });
            })
        }).catch(err => {
            res.json({ estado: "error", err: err });
        });
    }

controlador.obtenerRetirosNoAsignados =
    async (req, res) => {
        var fecha = new Date(req.params.fecha);
        console.log(fecha);
        await retiros.aggregate([
            { $match: { estado: 0, fecha: fecha } },
            {
                $lookup: {
                    from: 'clientes',
                    let: { "clienterut": "$clienterut" },
                    pipeline: [
                        { "$match": { "$expr": { "$eq": ["$rut", "$$clienterut"] } } },
                        { "$project": { "nombre": 1, "rut": 1 } }
                    ],
                    as: 'datosCliente'
                }
            },
            { $sort: { "fecha": 1 } }
        ]).then(resp => {
            console.log(resp);
            res.json({ ok: true, data: resp });
        });
    }

controlador.obtenerRutas =
    async (req, res) => {
        var today;
        if (req.params.fecha) {
            console.log(req.params.fecha);
            var today = new Date(req.params.fecha);
        } else {
            today = new Date();
        }
        console.log(today);
        var firstday = new Date(today.setDate(today.getDate() - today.getDay() + 1));
        var lastday = new Date(today.setDate(today.getDate() - today.getDay() + 7));
        const registros = rutas.aggregate([
            { $match: { fecha: { $gte: firstday, $lte: lastday } } },
            {
                $lookup: {
                    from: 'centrocostos',
                    let: { "centro": "$centro" },
                    pipeline: [
                        { "$match": { "$expr": { "$eq": ["$key", "$$centro"] } } },
                        { "$project": { "nombre": 1 } }
                    ],
                    as: 'datosCentro'
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
            { $sort: { "fecha": 1 } }
        ]).then(resp => {
            console.log(resp);
            res.json({ ok: true, data: resp });
        });
    }



controlador.crearRuta =
    async (req, res) => {
        var ordenes = req.body.ordenes;
        console.log(ordenes);
        var { patente, servicio, conductor, fecha, inicio, termino, enlace } = req.body;
        var nuevaRuta = await new rutas({ patente, servicio, conductorRut: conductor, fecha, ordenes, inicio, termino, enlace });
        await nuevaRuta.save().then(prom => {
            console.log(prom);
            for (retiro of ordenes) {
                retiros.findOneAndUpdate({ "_id": retiro.retiro }, { "estado": 1 }).then(asd => {
                    console.log(asd);
                })
                ordenesRetiro.findOneAndUpdate({ "idor": retiro.or }, { "ruta": prom._id, estado: 2 }).then(asd => {
                    console.log(asd);
                })
            }
            res.json({ estado: "success", mensaje: "Ruta creada correctamente" });
        }).catch(err => {
            console.log(err);
        });
    }

controlador.modificarRuta =
    async (req, res) => {
        var ordenes = req.body.ordenes;
        console.log(ordenes);
        var { patente, servicio, conductor, fecha, inicio, termino, enlace } = req.body;
        var nuevaRuta = { patente, servicio, conductorRut: conductor, fecha, ordenes, inicio, termino, enlace };
        await rutas.findOneAndUpdate({ "_id": req.body.id }, { "estado": 1 }).then(resp => {
            for (retiro of resp.ordenes) {
                retiros.findOneAndUpdate({ "_id": retiro.retiro }, { "estado": 0 }).then(asd => {
                    console.log(asd);
                })
            }
        }).catch(err => {
            console.log(err);
        });
        await rutas.findOneAndUpdate({ "_id": req.body.id }, nuevaRuta).then(prom => {
            console.log(prom);
            for (retiro of ordenes) {
                retiros.findOneAndUpdate({ "_id": retiro.retiro }, { "estado": 1 }).then(asd => {
                    console.log(asd);
                })
                ordenesRetiro.findOneAndUpdate({ "idor": retiro.or }, { "ruta": prom._id, estado:2 }).then(asd => {
                    console.log(asd);
                })
            }
        }).catch(err => {
            console.log(err);
        });
    }

controlador.obtenerRuta =
    async (req, res) => {
        console.log(req.params);
        const registros = await rutas.findOne({ _id: req.params.id }).then(resp => {
            console.log(resp);
            res.json({ ok: true, data: resp });
        });
    }

controlador.obtenerOrdenesRuta =
    async (req, res) => {
        var fecha = new Date(req.params.fecha);
        var firstday = new Date(fecha.setDate(fecha.getDate() - fecha.getDay()));
        var lastday = new Date(fecha.setDate(fecha.getDate() - fecha.getDay() + 6));
        await ordenesRetiro.aggregate([
            {
                $match: {
                    ruta: {
                        "$exists": true,
                        "$ne": null // $ne = not empty
                    },
                    retiro: { $gte: firstday, $lte: lastday }
                }
            },
            {
                $lookup: {
                    from: 'rutas',
                    let: { "ruta": { "$toObjectId": "$ruta" } },
                    pipeline: [
                        { "$match": { "$expr": { "$eq": ["$_id", "$$ruta"] } } },
                        { "$project": { "patente": 1, "servicio": 1, "conductorRut": 1 } }
                    ],
                    as: 'datosRuta'
                }
            },
            {
                $lookup: {
                    from: 'retiros',
                    let: { "idor": "$idor" },
                    pipeline: [
                        { "$match": { "$expr": { "$eq": ["$or", "$$idor"] } } },
                        { "$project": { "inicio": 1, "termino": 1 } }
                    ],
                    as: 'datosRetiro'
                }
            },
            {
                $lookup: {
                    from: "usuarios",
                    localField: "datosRuta.conductorRut",
                    foreignField: "rut",
                    as: "datosConductor",
                }
            },
            {
                $lookup: {
                    from: "servicios",
                    localField: "datosRuta.servicio",
                    foreignField: "key",
                    as: "datosServicio",
                }
            },
            {
                $lookup: {
                    from: 'centrocostos',
                    let: { "centro": "$centro" },
                    pipeline: [
                        { "$match": { "$expr": { "$eq": ["$key", "$$centro"] } } },
                        { "$project": { "nombre": 1 } }
                    ],
                    as: 'datosCentro'
                }
            },
            { $sort: { "idor": -1 } }
        ]).then(resp => {
            resp.prueba = "caca";
            console.log(resp);
            res.json({ ok: true, data: resp });
        });
    }

controlador.obtenerOrdenesTrazabilidad =
    async (req, res) => {
        await ordenesRetiro.aggregate([
            {
                $match: {   // cambiar luego para que consulte estado de or a 2 (que se asignara cuando una or se ponga en ruta)
                    ruta: {
                        "$exists": true,
                        "$ne": null // $ne = not empty
                    }
                }
            },
            {
                $lookup: {
                    from: 'centrocostos',
                    let: { "centro": "$centro" },
                    pipeline: [
                        { "$match": { "$expr": { "$eq": ["$key", "$$centro"] } } },
                        { "$project": { "nombre": 1 } }
                    ],
                    as: 'datosCentro'
                }
            },
            {
                $lookup: {
                    from: 'retiros',
                    let: { "idor": "$idor" },
                    pipeline: [
                        { "$match": { "$expr": { "$eq": ["$or", "$$idor"] } } },
                        { "$project": { "codigoler": 1, "categoria": 1 } }
                    ],
                    as: 'datosRetiro'
                }
            },
            { $sort: { "idor": -1 } }
        ]).then(resp => {
            console.log(resp);
            res.json({ ok: true, data: resp });
        });
    }

controlador.obtenerOrdenTrazabilidad =
    async (req, res) => {
        await ordenesRetiro.aggregate([
            { $match: { _id: Mongoose.Types.ObjectId(req.params.id) } },
            {
                $lookup: {
                    from: 'rutas',
                    let: { "ruta": { "$toObjectId": "$ruta" } },
                    pipeline: [
                        { "$match": { "$expr": { "$eq": ["$_id", "$$ruta"] } } },
                        { "$project": { "patente": 1, "servicio": 1, "conductorRut": 1, "enlace": 1 } }
                    ],
                    as: 'datosRuta'
                }
            },
            {
                $lookup: {
                    from: 'retiros',
                    let: { "idor": "$idor" },
                    pipeline: [
                        { "$match": { "$expr": { "$eq": ["$or", "$$idor"] } } },
                        { "$project": { "codigoler": 1, "categoria": 1 } }
                    ],
                    as: 'datosRetiro'
                }
            },
            {
                $lookup: {
                    from: "usuarios",
                    localField: "datosRuta.conductorRut",
                    foreignField: "rut",
                    as: "datosConductor",
                }
            },
            {
                $lookup: {
                    from: "servicios",
                    localField: "datosRuta.servicio",
                    foreignField: "key",
                    as: "datosServicio",
                }
            },
            {
                $lookup: {
                    from: 'centrocostos',
                    let: { "centro": "$centro" },
                    pipeline: [
                        { "$match": { "$expr": { "$eq": ["$key", "$$centro"] } } },
                        { "$project": { "nombre": 1 } }
                    ],
                    as: 'datosCentro'
                }
            },
            {
                $lookup: {
                    from: "trazabilidades",
                    localField: "idor",
                    foreignField: "idor",
                    as: "datosTrazabilidad",
                }
            },
            {
                $lookup: {
                    from: 'clientes',
                    let: { "clienterut": "$clienterut" },
                    pipeline: [
                        { "$match": { "$expr": { "$eq": ["$rut", "$$clienterut"] } } },
                        { "$project": { "nombre": 1, "rut": 1, "dv": 1 } }
                    ],
                    as: 'datosCliente'
                }
            },
            {
                $lookup: {
                    from: 'categoriaslers',
                    let: { "codigo": "$datosRetiro.codigoler", "categoria": "$datosRetiro.categoria" },
                    pipeline: [
                        { "$match": { "$expr": { "$and": [{ "$in": ["$codigo", "$$codigo"] }, { "$in": ["$key", "$$categoria"] }] } } },
                        { "$project": { "categoria": 1 } }
                    ],
                    as: 'datosLer'
                }
            },
            { $sort: { "idor": -1 } }
        ]).then(resp => {
            console.log(resp);
            res.json({ ok: true, data: resp[0] });
        });
    }
controlador.trazabilidadEtapaUno =
    async (req, res) => {
        var archivosrec = req.files;
        var arrayArchivos = Object.entries(archivosrec);
        var direcciones = [];
        arrayArchivos.forEach(archivo => {
            var file = archivo[1];
            var separado = file.name.split(".");
            var formato = separado[1];
            uploadPath = './uploads/trazabilidad/or/' + req.body.idor + "/" + archivo[0] + "." + formato;
            var bdData = {
                "input": archivo[0],
                "url": "/or/" + req.body.idor + "/" + archivo[0] + "." + formato
            }
            direcciones.push(bdData)
            file.mv(uploadPath, function (err) {
                console.log(err);
                if (err) {
                    console.log(err);
                }
            });
        });
        console.log(req.body);
        var { idor, pesoPrimer, nombreEntrega, rutEntrega, tipoTarjeta, comentarios } = req.body;
        const nuevoTrazabilidad = { idor, pesoPrimer, nombreEntrega, rutEntrega, tipoTarjeta, comentarios, archivos: direcciones }; // creamos un objeto usuario con los datos recibidos
        await trazabilidades.findOneAndUpdate({ "idor": req.body.idor }, nuevoTrazabilidad, { upsert: true })
            .then(prom => {
                ordenRetiro.findOneAndUpdate({ "idor": req.body.idor }, {estado: 3} ).then(prom2 => {
                    res.json({ estado: "success", mensaje: "Datos ingresados correctamente" });
                })
            }).catch(err => {
                console.log(err);
                // if (err.code === 11000) {
                //     res.json({ estado: "warning", mensaje: "¡El rut ingresado ya existe!" });
                // }
            });

    }
controlador.trazabilidadEtapaDos =
    async (req, res) => {
        console.log(req.body);
        var { idor, pesoSegundo, sacas, planificacion, codigo } = req.body;
        const nuevoTrazabilidad = { idor, pesoSegundo, sacas, planificacion, codigo }; // creamos un objeto usuario con los datos recibidos
        await trazabilidades.findOneAndUpdate({ "idor": req.body.idor }, nuevoTrazabilidad, { upsert: true })
            .then(prom => {
                ordenRetiro.findOneAndUpdate({ "idor": req.body.idor }, {estado: 4} ).then(prom2 => {
                    res.json({ estado: "success", mensaje: "Datos ingresados correctamente" });
                })
            }).catch(err => {
                console.log(err);
                // if (err.code === 11000) {
                //     res.json({ estado: "warning", mensaje: "¡El rut ingresado ya existe!" });
                // }
            });
    }
controlador.trazabilidadEtapaTres =
    async (req, res) => {
        console.log(req.body);
        var { idor, residuos } = req.body;
        var insertResiduos = [];
        for await (residuo of residuos) {
            let datos = {
                "subcategoria": parseInt(residuo.subcategoria),
                "pesoClasif": parseInt(residuo.pesoClasif),
                "sacas": parseInt(residuo.sacas),
                "planificacion": parseInt(residuo.planificacion),
                "destino": parseInt(residuo.destino),
            }
            insertResiduos.push(datos);
        }
        console.log(insertResiduos);
        const nuevoTrazabilidad = { residuos: insertResiduos }; // creamos un objeto usuario con los datos recibidos
        await trazabilidades.findOneAndUpdate({ "idor": req.body.idor }, nuevoTrazabilidad, { upsert: true })
            .then(prom => {
                ordenRetiro.findOneAndUpdate({ "idor": req.body.idor }, {estado: 5} ).then(prom2 => {
                    res.json({ estado: "success", mensaje: "Datos ingresados correctamente" });
                })
            }).catch(err => {
                console.log(err);
                // if (err.code === 11000) {
                //     res.json({ estado: "warning", mensaje: "¡El rut ingresado ya existe!" });
                // }
            });
    }

controlador.obtenerPlanesManejo =
    async (req, res) => {
        const registros = await planesmanejos.find({ "clienteRut": req.params.rut }); //consultamos todos los registros de la tabla usuarios y lo almacenamos
        res.json({ ok: true, data: registros });
    }
controlador.obtenerPlanManejo =
    async (req, res) => {
        console.log(req.params);
        await planesmanejos.aggregate([
            {
                $match: { "_id": Mongoose.Types.ObjectId(req.params.id) }
            },
            {
                $lookup: {
                    from: 'clientes',
                    let: { "clienteRut": "$clienteRut" },
                    pipeline: [
                        { "$match": { "$expr": { "$eq": ["$rut", "$$clienteRut"] } } },
                        { "$project": { "nombre": 1 } }
                    ],
                    as: 'datosCliente'
                }
            },
            {
                $lookup: {
                    from: 'subcategoriaslers',
                    let: { "codigo": "$residuos.codigo", "categoria": "$residuos.categoria" },
                    pipeline: [
                        { "$match": { "$expr": { "$and": [{ "$in": ["$codigo", "$$codigo"] }, { "$in": ["$categoria", "$$categoria"] }] } } }

                    ],
                    as: 'subcategorias'
                }
            },
            {
                $lookup: {
                    from: 'categoriaslers',
                    let: { "codigo": "$residuos.codigo", "categoria": "$residuos.categoria" },
                    pipeline: [
                        { "$match": { "$expr": { "$and": [{ "$in": ["$codigo", "$$codigo"] }, { "$in": ["$key", "$$categoria"] }] } } },
                        { "$project": { "categoria": 1 } }
                    ],
                    as: 'categoriaslabel'
                }
            },
            { "$unwind": "$categoriaslabel" },
            {
                $project: {
                    "clienteRut": 1,
                    "nombre": 1,
                    "fecha": 1,
                    "centro": 1,
                    "direccion": 1,
                    "comuna": 1,
                    "imagen": 1,
                    "id": 1,
                    "vuretc": 1,
                    "recoleccion": 1,
                    "valorizacion": 1,
                    "techadoAltura": 1,
                    "techadoSuperficie": 1,
                    "superficie": 1,
                    "comentarios": 1,
                    "contenedores": 1,
                    "residuosegregado": 1,
                    "estado": 1,
                    "_id": 1,
                    "datosCliente": "$datosCliente",
                    "residuos": {
                        "codigo": { $arrayElemAt: ["$residuos.codigo", 0] },
                        "categoria": { $arrayElemAt: ["$residuos.categoria", 0] },
                        "cantidad": { $arrayElemAt: ["$residuos.cantidad", 0] },
                        "clasificacion": { $arrayElemAt: ["$residuos.clasificacion", 0] },
                        "pretratamiento": { $arrayElemAt: ["$residuos.pretratamiento", 0] },
                        "pretratamientoValor": { $arrayElemAt: ["$residuos.pretratamientoValor", 0] },
                        "proceso": { $arrayElemAt: ["$residuos.proceso", 0] },
                        "subcategorias": "$subcategorias",
                        "label": "$categoriaslabel.categoria",
                    }
                }
            },


        ]).then(resp => {
            console.log(resp);
            res.json({ ok: true, data: resp });
        });
        // const registros = await planesmanejos.findOne({ "_id": req.params.id }); //consultamos todos los registros de la tabla usuarios y lo almacenamos
        // res.json({ ok: true, data: registros });
    }

controlador.crearPlanManejo =
    async (req, res) => {
        var residuos = JSON.parse(req.body.residuos);
        var { clienteRut, nombre, centro, direccion, comuna, id, vuretc, recoleccion, valorizacion, techadoAltura, techadoSuperficie, superficie, comentarios, contenedores, residuosegregado } = req.body;
        console.log(residuos);
        var archivosrec = req.files;
        var arrayArchivos = Object.entries(archivosrec);
        var direcciones = [];
        var fecha = new Date();

        var insertResiduos = [];
        for (residuo of residuos) {
            let datos = {
                "codigo": parseInt(residuo.codigo),
                "categoria": parseInt(residuo.categoria),
                "clasificacion": parseInt(residuo.clasificacion),
                "cantidad": parseInt(residuo.cantidad),
                "pretratamiento": parseInt(residuo.pretratamiento),
                "pretratamientoValor": residuo.pretratamientoValor,
                "proceso": residuo.proceso
            }
            insertResiduos.push(datos);
        }
        console.log(insertResiduos);

        var nuevoPlan = await new planesmanejos({ clienteRut, nombre, fecha, centro, direccion, comuna, id, vuretc, recoleccion, valorizacion, residuos: insertResiduos, techadoAltura, techadoSuperficie, superficie, comentarios, contenedores, residuosegregado, estado: 0 });
        await nuevoPlan.save().then(prom => {
            arrayArchivos.forEach(archivo => {
                var file = archivo[1];
                var separado = file.name.split(".");
                var formato = separado[1];
                uploadPath = './uploads/planes/cliente/' + clienteRut + "/" + prom._id + "/" + archivo[0] + "." + formato;
                var bdData = {
                    "input": archivo[0],
                    "url": "/cliente/" + req.body.clienteRut + "/" + prom._id + "/" + archivo[0] + "." + formato
                }
                direcciones.push(bdData)
                file.mv(uploadPath, function (err) {
                    console.log(err);
                    if (err) {
                        console.log(err);
                    }
                });
            });

            planesmanejos.findOneAndUpdate({ "_id": prom._id }, { "imagen": direcciones }).then(asd => {
                res.json({ estado: "success", mensaje: "Datos ingresados correctamente" });
            })
        }).catch(err => {
            console.log(err);
        });

    }

controlador.modificarPlanManejo =
    async (req, res) => {
        var residuos = JSON.parse(req.body.residuos);
        var { _id, clienteRut = parseInt(req.body.clienteRut), nombre, centro, direccion, comuna, id, vuretc, recoleccion, valorizacion, techadoAltura, techadoSuperficie, superficie, comentarios, contenedores, residuosegregado } = req.body;
        var fecha = new Date(req.body.fecha);
        var archivosrec = req.files;
        var direcciones = [];
        var insertResiduos = [];
        for (residuo of residuos) {
            let datos = {
                "codigo": parseInt(residuo.codigo),
                "categoria": parseInt(residuo.categoria),
                "clasificacion": parseInt(residuo.clasificacion),
                "cantidad": parseInt(residuo.cantidad),
                "pretratamiento": parseInt(residuo.pretratamiento),
                "pretratamientoValor": parseInt(residuo.pretratamientoValor),
                "proceso": residuo.proceso
            }
            insertResiduos.push(datos);
        }
        if (archivosrec) {
            var arrayArchivos = Object.entries(archivosrec);
        }
        var nuevoPlan = await { clienteRut, nombre, fecha, centro, direccion, comuna, id, vuretc, recoleccion, valorizacion, residuos: insertResiduos, techadoAltura, techadoSuperficie, superficie, comentarios, contenedores, residuosegregado, estado: 0 };
        await planesmanejos.findOneAndUpdate({ "_id": req.body._id }, nuevoPlan).then(prom => {
            console.log(prom);
            console.log(prom._id);
            if (archivosrec) {
                arrayArchivos.forEach(archivo => {
                    var file = archivo[1];
                    var separado = file.name.split(".");
                    var formato = separado[1];
                    uploadPath = './uploads/planes/cliente/' + clienteRut + "/" + prom._id + "/" + archivo[0] + "." + formato;
                    var bdData = {
                        "input": archivo[0],
                        "url": "/cliente/" + req.body.clienteRut + "/" + prom._id + "/" + archivo[0] + "." + formato
                    }
                    direcciones.push(bdData)
                    file.mv(uploadPath, function (err) {
                        console.log(err);
                        if (err) {
                            console.log(err);
                        }
                    });
                });
                planesmanejos.findOneAndUpdate({ "_id": prom._id }, { "imagen": direcciones }).then(asd => {
                    res.json({ estado: "success", mensaje: "Datos ingresados correctamente" });
                })
            } else {
                res.json({ estado: "success", mensaje: "Datos ingresados correctamente" });
            }
        }).catch(err => {
            console.log(err);
        });

    }


controlador.finalizarPlanManejo =
    async (req, res) => {
        console.log(req.body);

    }



controlador.obtenerEmergenciasResiduos =
    async (req, res) => {
        const registros = await emergenciasResiduos.find(); //consultamos todos los registros de la tabla usuarios y lo almacenamos
        res.json({ ok: true, data: registros });
    }
controlador.obtenerEmergenciaResiduo =
    async (req, res) => {
        console.log(req.params);
        const registros = await emergenciasResiduos.findOne({ "_id": req.params.id }); //consultamos todos los registros de la tabla usuarios y lo almacenamos
        res.json({ ok: true, data: registros });
    }
controlador.obtenerEmergenciasVehiculos =
    async (req, res) => {
        console.log(req.body);

    }
controlador.crearEmergenciasResiduos =
    async (req, res) => {
        var involucrados = JSON.parse(req.body.involucrados);
        var { fecha, hora, turno, hito } = req.body;
        var archivosrec = req.files;
        var arrayArchivos = Object.entries(archivosrec);
        var direcciones = [];
        var fecha = new Date();

        var insertInvolucrados = [];
        for (involucrado of involucrados) {
            let datos = {
                "rut": involucrado.rut,
                "dv": involucrado.dv,
                "nombre": involucrado.nombre,
                "apellido": involucrado.apellido
            }
            insertInvolucrados.push(datos);
        }
        console.log(insertInvolucrados);

        var nuevoPlan = await new emergenciasResiduos({ fecha, hora, turno, hito, involucrados: insertInvolucrados });
        await nuevoPlan.save().then(prom => {
            arrayArchivos.forEach(archivo => {
                var file = archivo[1];
                var separado = file.name.split(".");
                var formato = separado[1];
                uploadPath = './uploads/emergencias/residuos/' + prom._id + "/" + archivo[0] + "." + formato;
                var bdData = {
                    "input": archivo[0],
                    "url": "/emergencias/residuos/" + prom._id + "/" + archivo[0] + "." + formato
                }
                direcciones.push(bdData)
                file.mv(uploadPath, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            });
            emergenciasResiduos.findOneAndUpdate({ "_id": prom._id }, { "imagen": direcciones }).then(asd => {
                console.log(asd);
            })
        }).catch(err => {
            console.log(err);
        });

    }
controlador.crearEmergenciasVehiculos =
    async (req, res) => {
        console.log(req.body);

    }



module.exports = controlador;