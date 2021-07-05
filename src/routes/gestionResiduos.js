const { Router } = require('express');
const { verificarToken } = require('../middleware/autenticacion');

const router = Router();

const controlador = require('../controllers/gestionResiduos.controller.js');

router.use(verificarToken);

//ordenes de retiro

router.route('/ordenes-retiro/')
    .get(controlador.obtenerOrdenes)
router.route('/ordenes-retiro/obtener/:id')
    .get(controlador.obtenerOrden)
router.route('/ordenes-retiro/no-asignados/')
    .get(controlador.ordenesNoAsignadas)
router.route('/ordenes-retiro/create/')
    .post(controlador.crearOrden)
router.route('/ordenes-retiro/modificar/')
    .post(controlador.modificarOrden)

router.route('/retiros/create/')
    .post(controlador.crearRetiro)
router.route('/retiros/modificar/')
    .post(controlador.modificarRetiro)
router.route('/retiros/')
    .get(controlador.obtenerRetiros)
router.route('/retiros/:fecha')
    .get(controlador.obtenerRetiros)
router.route('/retiros/obtener/:id')
    .get(controlador.obtenerRetiro)

router.route('/retirosnoasignados/')
    .post(controlador.obtenerRetirosNoAsignados)
router.route('/retirosnoasignados/:fecha')
    .get(controlador.obtenerRetirosNoAsignados)

router.route('/rutas/')
    .get(controlador.obtenerRutas)
router.route('/rutas/:fecha')
    .get(controlador.obtenerRutas)
router.route('/rutas/create/')
    .post(controlador.crearRuta)
router.route('/rutas/modificar/')
    .post(controlador.modificarRuta)
router.route('/rutas/ordenes/:fecha')
    .get(controlador.obtenerOrdenesRuta)
router.route('/rutas/obtener/:id')
    .get(controlador.obtenerRuta)

router.route('/trazabilidad/ordenes/')
    .get(controlador.obtenerOrdenesTrazabilidad)
router.route('/trazabilidad/orden/:id')
    .get(controlador.obtenerOrdenTrazabilidad)
router.route('/trazabilidad/etapauno/')
    .post(controlador.trazabilidadEtapaUno)
router.route('/trazabilidad/etapados/')
    .post(controlador.trazabilidadEtapaDos)
    router.route('/trazabilidad/etapatres/')
    .post(controlador.trazabilidadEtapaTres)

router.route('/plan-manejo/obtener-planes/:rut')
    .get(controlador.obtenerPlanesManejo)
router.route('/plan-manejo/ver-plan/:id')
    .get(controlador.obtenerPlanManejo)
router.route('/plan-manejo/crear/')
    .post(controlador.crearPlanManejo)
router.route('/plan-manejo/modificar/')
    .post(controlador.modificarPlanManejo)
router.route('/plan-manejo/finalizar/')
    .post(controlador.finalizarPlanManejo)

router.route('/emergencias/residuos/')
    .get(controlador.obtenerEmergenciasResiduos)
router.route('/emergencias/residuos/obtener/:id')
    .get(controlador.obtenerEmergenciaResiduo)
    
router.route('/emergencias/vehiculos/')
    .get(controlador.obtenerEmergenciasVehiculos)

router.route('/emergencias/residuos/crear/')
    .post(controlador.crearEmergenciasResiduos)
router.route('/emergencias/vehiculos/crear/')
    .post(controlador.crearEmergenciasVehiculos)




module.exports = router;
