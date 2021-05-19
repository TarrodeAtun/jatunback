const { Router } = require('express');
const { verificarToken } = require('../middleware/autenticacion');

const router = Router();

const controlador = require('../controllers/generales.controller.js');

router.use(verificarToken);

router.route('/comunas/')
    .get(controlador.obtenerComunas)

router.route('/centroscostos/')
    .get(controlador.obtenerCentrosCostos)

router.route('/clientes/')
    .get(controlador.obtenerClientes)

router.route('/cliente/datos/:id')
    .get(controlador.obtenerDatosCliente)
router.route('/cliente/datosrut/:rut')
    .get(controlador.obtenerDatosClienteRut)

router.route('/isapres/')
    .get(controlador.obtenerIsapres)

router.route('/afp/')
    .get(controlador.obtenerAfp)

router.route('/fonasas/')
    .get(controlador.obtenerFonasas)

router.route('/vehiculos/')
    .get(controlador.obtenerVehiculos)

router.route('/servicios/')
    .get(controlador.obtenerServicios)

router.route('/sectores/')
    .get(controlador.obtenerSectores)

router.route('/tiposturno/')
    .get(controlador.obtenerTiposTurno)

router.route('/codigosler/')
    .get(controlador.obtenerCodigosLer)

router.route('/categoriasler/')
    .post(controlador.obtenerCategoriasLer)

router.route('/subcategoriasler/')
    .post(controlador.obtenerSubcategoriasLer)


module.exports = router;
