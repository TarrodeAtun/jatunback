const controlador = {};
const regiones = require("../models/regiones");
const clientes = require('../models/clientes');
const isapres = require('../models/isapres');
const afps = require('../models/afps');
const fonasas = require('../models/fonasa');
const vehiculos = require('../models/vehiculos');
const servicios = require('../models/servicios');
const sectores = require('../models/sectores');
const tiposturnos = require('../models/tiposturnos');
const centroscostos = require('../models/centroscostos');

const codigosLer = require('../models/codigosLer');
const categoriaslers = require('../models/categoriasLer');
const subcategoriaslers = require('../models/subcategoriasLer');


//funciones Encuestas

controlador.obtenerComunas =
    async (req, res) => {
        const registros = await regiones.find(); //consultamos todos los registros de la tabla usuarios y lo almacenamos
        res.json({ ok: true, data: registros });
    }
controlador.obtenerCentrosCostos =
    async (req, res) => {
        const registros = await centroscostos.find(); //consultamos todos los registros de la tabla usuarios y lo almacenamos
        res.json({ ok: true, data: registros });
    }

controlador.obtenerClientes =
    async (req, res) => {
        const registros = await clientes.find(); //consultamos todos los registros de la tabla usuarios y lo almacenamos
        res.json({ ok: true, data: registros });
    }
controlador.obtenerDatosCliente =
    async (req, res) => {
        const registros = await clientes.findOne({ _id: req.params.id }).then(resp => {
            res.json({ ok: true, data: resp });
        });
    }
controlador.obtenerDatosClienteRut =
    async (req, res) => {
        const registros = await clientes.findOne({ rut: req.params.rut }).then(resp => {
            res.json({ ok: true, data: resp });
        });
    }
controlador.obtenerIsapres =
    async (req, res) => {
        const registros = await isapres.find(); //consultamos todos los registros de la tabla usuarios y lo almacenamos
        // console.log(registros);
        // console.log("asd");
        res.json({ ok: true, data: registros });
    }
controlador.obtenerAfp =
    async (req, res) => {
        // console.log("afp");
        const registros = await afps.find(); //consultamos todos los registros de la tabla usuarios y lo almacenamos
        // console.log(registros);
        res.json({ ok: true, data: registros });
    }
controlador.obtenerFonasas =
    async (req, res) => {
        const registros = await fonasas.find(); //consultamos todos los registros de la tabla usuarios y lo almacenamos
        // console.log(registros);
        res.json({ ok: true, data: registros });
    }

controlador.obtenerVehiculos =
    async (req, res) => {
        const registros = await vehiculos.find(); //consultamos todos los registros de la tabla usuarios y lo almacenamos
        console.log(registros);
        res.json({ ok: true, data: registros });
    }

controlador.obtenerServicios =
    async (req, res) => {
        const registros = await servicios.find(); //consultamos todos los registros de la tabla usuarios y lo almacenamos
        res.json({ ok: true, data: registros });
    }
controlador.obtenerSectores =
    async (req, res) => {
        const registros = await sectores.find(); //consultamos todos los registros de la tabla usuarios y lo almacenamos
        res.json({ ok: true, data: registros });
    }
controlador.obtenerTiposTurno =
    async (req, res) => {
        const registros = await tiposturnos.find(); //consultamos todos los registros de la tabla usuarios y lo almacenamos
        res.json({ ok: true, data: registros });
    }
controlador.obtenerCodigosLer =
    async (req, res) => {
        const registros = await codigosLer.find(); //consultamos todos los registros de la tabla usuarios y lo almacenamos
        console.log(registros);
        res.json({ ok: true, data: registros });

    }
controlador.obtenerCategoriasLer =
    async (req, res) => {
        console.log(req.body);
        const registros = await categoriaslers.find({ codigo: req.body.codigo }); //consultamos todos los registros de la tabla usuarios y lo almacenamos
        console.log(registros);
        res.json({ ok: true, data: registros });

    }
controlador.obtenerSubcategoriasLer =
    async (req, res) => {
        const registros = await subcategoriaslers.find({ codigo: req.body.codigo, categoria: req.body.categoria }); //consultamos todos los registros de la tabla usuarios y lo almacenamos
        console.log(registros);
        res.json({ ok: true, data: registros });

    }



module.exports = controlador;