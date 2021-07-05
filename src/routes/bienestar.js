const { Router } = require('express');
const { verificarToken } = require('../middleware/autenticacion');

const router = Router();

const controlador = require('../controllers/bienestar.controller.js');

router.use(verificarToken);

router.route('/encuestas/')
    .get(controlador.obtenerEncuestas)
router.route('/mis-encuestas/')
    .post(controlador.obtenerMisEncuestas)
router.route('/encuestas/:id')
    .get(controlador.obtenerEncuesta)
router.route('/encuestas/create/')
    .post(controlador.crearEncuesta)
router.route('/encuestas/modify/')
    .post(controlador.modificarEncuesta)
router.route('/encuestas/delete/')
    .post(controlador.eliminarEncuesta)
router.route('/encuestas/responder/')
    .post(controlador.responderEncuesta)
router.route('/encuestas/ver-resultado/:id')
    .get(controlador.verEncuesta)


router.route('/soporte/')
    .get(controlador.obtenerConsultas)
router.route('/soporte/:rut')
    .get(controlador.obtenerMisConsultas)
router.route('/soporte/consultas/:id')
    .get(controlador.obtenerDetalleConsulta)
router.route('/soporte/consulta/crear')
    .post(controlador.crearConsulta)
router.route('/soporte/consulta/responder')
    .post(controlador.responderConsulta)
router.route('/soporte/consulta/finalizar')
    .post(controlador.finalizarConsulta)

module.exports = router;
