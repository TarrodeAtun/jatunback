const controlador = {};
const encuesta = require("../models/encuesta");
const respuestaEncuesta = require("../models/respuestaEncuesta");

const consulta = require("../models/soporte");
const mensajeConsulta = require("../models/respuestaConsulta");

const usuario = require('../models/usuario');

const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

//funciones Encuestas

controlador.obtenerEncuestas =
    async (req, res) => {
        const registros = await encuesta.find(); //consultamos todos los registros de la tabla usuarios y lo almacenamos
        res.json({ ok: true, data: registros });
    }

controlador.crearEncuesta =
    async (req, res) => {
        var { nombre, preguntas } = req.body;
        const nuevaEncuesta = new encuesta({ nombre, preguntas });
        console.log(nuevaEncuesta);
        await nuevaEncuesta.save().then(prom => {
            console.log(prom);
            res.json({ estado: "success", mensaje: "Encuesta ingresada exitosamente" });
        }).catch(err => {
            res.json({ estado: "error", err: err });
        });

    }
controlador.modificarEncuesta =
    async (req, res) => {
        var { id, nombre, preguntas } = req.body;
        const nuevaEncuesta = { nombre, preguntas };
        console.log(nuevaEncuesta);
        await encuesta.findOneAndUpdate({ _id: id }, nuevaEncuesta).then(prom => {
            console.log(prom);
            res.json({ estado: "success", mensaje: "Encuesta ingresada exitosamente" });
        }).catch(err => {
            res.json({ estado: "error", err: err });
        });

    }

controlador.obtenerEncuesta =
    async (req, res) => {
        const registros = await encuesta.findOne({ _id: req.params.id }); //consultamos todos los registros de la tabla usuarios y lo almacenamos
        res.json({ ok: true, data: registros });
    }
controlador.eliminarEncuesta =
    async (req, res) => {
        var { id } = req.body;
        await encuesta.deleteOne({ _id: id }).then(prom => {
            res.json({ ok: true, mensaje: "Encuesta eliminada satisfactoriamente" });
        }); //consultamos todos los registros de la tabla usuarios y lo almacenamos

    }
controlador.responderEncuesta =
    async (req, res) => {
        var { idEncuesta, idUsuario, respuestas } = req.body;
        const registro = new respuestaEncuesta({ idEncuesta, idUsuario, respuestas });
        console.log(registro);
        await registro.save().then(prom => {
            console.log(prom);
            res.json({ estado: "success", mensaje: "Encuesta respondida exitosamente" });
        }).catch(err => {
            res.json({ estado: "error", err: err });
        });

    }
controlador.verEncuesta =
    async (req, res) => {
        const registroEncuesta = await encuesta.findOne({ _id: req.params.id });
        const respuestas = await respuestaEncuesta.find({ idEncuesta: req.params.id });
        var conteo = [];
        var enunciados = [];
        var options = [];
        var preguntas = registroEncuesta.preguntas;
        var preResultados = [];
        respuestasPreProcesadas = respuestas.map((resultado, index) => {
            preResultados[index] = resultado.respuestas;
        });
        preguntas.map((pregunta, index) => {
            if (pregunta.tipo === "1") {
                enunciados[index] = pregunta.pregunta
                options[index] = pregunta.opciones;
                var opciones = pregunta.opciones;
                var contador = []
                opciones.map((en, indexOp) => {
                    contador[indexOp] = 0;
                });
                preResultados.map((asd, indx) => {
                    opciones.map((en, indexOp) => {
                        if (parseInt(asd[index]) === indexOp) {
                            contador[indexOp]++;
                        }
                    });
                });
                conteo[index] = contador;
            }
        });
        var resultado = {
            nombre: registroEncuesta.nombre,
            preguntas: enunciados,
            respuestas: conteo,
            opciones: options
        }
        res.json({ ok: true, data: resultado });
    }

//Funciones Consultas

controlador.obtenerConsultas =
    async (req, res) => {
        await consulta.aggregate([
            {
                $lookup: {
                    from: 'usuarios',
                    let: { "autor": "$autor" },
                    pipeline: [
                        { "$match": { "$expr": { "$eq": ["$rut", "$$autor"] } } },
                        { "$project": { "nombre": 1, "apellido": 1 } }
                    ],
                    as: 'datosAutor'
                }
            },
            {
                $lookup: {
                    from: 'usuarios',
                    let: { "ultimaRespuesta": "$ultimaRespuesta" },
                    pipeline: [
                        { "$match": { "$expr": { "$eq": ["$rut", "$$ultimaRespuesta"] } } },
                        { "$project": { "nombre": 1, "apellido": 1 } }
                    ],
                    as: 'datosUltimaRespuesta'
                }
            },
            { $sort: { "fechaRespuesta": 1 } }
        ]).then(resp => {
            console.log(resp);
            res.json({ ok: true, data: resp });
        });
    }
controlador.obtenerMisConsultas =
    async (req, res) => {

    }
controlador.obtenerDetalleConsulta =
    async (req, res) => {
        await mensajeConsulta.aggregate([
            { $match: { refConsulta: req.params.id } },
            {
                $lookup: {
                    from: 'usuarios',
                    let: { "rutRespuesta": "$rutRespuesta" },
                    pipeline: [
                        { "$match": { "$expr": { "$eq": ["$rut", "$$rutRespuesta"] } } },
                        { "$project": { "nombre": 1, "apellido": 1, "rut": 1, "dv": 1 } }
                    ],
                    as: 'datosAutor'
                }
            },
            {
                $lookup: {
                    from: 'soportes',
                    let: { "refConsultasd": { "$toObjectId": "$refConsulta" } },
                    "pipeline": [
                        { "$match": { "$expr": { "$eq": ["$_id", "$$refConsultasd"] } } }
                    ],
                    as: 'asd'
                }
            },
            { $sort: { "fechaRespuesta": 1 } }
        ]).then(resp => {
            consulta.findOne({ _id: req.params.id }).then(consultaResp =>{
                res.json({ ok: true, data: resp, estadoConsulta: consultaResp.estado});
            });

           
        });

    }
controlador.crearConsulta =
    async (req, res) => {
        // console.log(req);
        var body = req.body;
        var { asunto, primerMensaje } = req.body;
        let token = req.get("Authorization");
        var fechaConsulta = Date.now();
        console.log(fechaConsulta);
        var estado = 0;
        console.log("1");
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            console.log("2");
            var rut = decoded.usuariobd.rut;
            const nuevaConsulta = new consulta({ asunto, autor: rut, fechaRespuesta: fechaConsulta, estado, ultimaRespuesta: rut });
            nuevaConsulta.save().then(resp => {
                const nuevaRespuestaConsulta = new mensajeConsulta({ refConsulta: resp._id, rutRespuesta: rut, fechaRespuesta: fechaConsulta, mensaje: primerMensaje });
                nuevaRespuestaConsulta.save().then(resp2 => {
                    console.log("4");
                    res.json({ estado: "success", mensaje: "Consulta ingresada exitosamente", id: resp2._id });
                }).catch(err => {
                    console.log(err);
                });
            });
        });
    }
controlador.responderConsulta =
    async (req, res) => {
        var body = req.body;
        let token = req.get("Authorization");
        console.log(body);
        var { id, mensaje } = req.body;
        var fechaConsulta = Date.now();
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            var rut = decoded.usuariobd.rut;
            const nuevaRespuestaConsulta = new mensajeConsulta({ refConsulta: id, rutRespuesta: rut, fechaRespuesta: fechaConsulta, mensaje: mensaje });
            nuevaRespuestaConsulta.save().then(resp2 => {
                res.json({ ok: true, estado: "success", mensaje: "Consulta ingresada exitosamente" });
            }).catch(err => {
                console.log(err);
            });
        });
    }

controlador.finalizarConsulta =
    async (req, res) => {
        var body = req.body;
        let token = req.get("Authorization");
        var { id } = req.body;
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            consulta.findOneAndUpdate({ _id: id }, { estado: 1 }).then(prom => {
                console.log(prom);
                res.json({ estado: "success", mensaje: "Consulta finalizada satisfactoriamente" });
            }).catch(err => {
                res.json({ estado: "error", err: err });
            });
        });
    }

module.exports = controlador;