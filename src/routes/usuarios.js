const { Router } = require('express');
const { verificarToken } = require('../middleware/autenticacion');

const router = Router();

const controlador = require('../controllers/usuarios.controller.js');

router.use(verificarToken);

router.route('/')
    .get(controlador.todosUsuarios)
    .post(controlador.ingresarUsuario)
    .put(controlador.actualizaUsuario)
    .delete(controlador.eliminaUsuario)

router.route('/worker/obtenertrabajadores')
    .get(controlador.todosTrabajadores)
router.route('/worker/obtenerjefes')
    .get(controlador.todosJefes)

router.route('/worker/:id')
    .get(controlador.obtenerUsuario)
router.route('/worker/update/')
    .put(controlador.actualizaUsuario)
router.route('/worker/create/')
    .post(controlador.ingresarUsuario)


router.route('/worker/basic')
    .put(controlador.actualizaUsuarioBasico)
router.route('/worker/pass')
    .put(controlador.actualizaUsuarioPassword)
router.route('/worker/emergency')
    .put(controlador.actualizaUsuarioEmergencia)


router.route('/worker/ficha/equipo')
    .post(controlador.ingresarEquipo)
router.route('/worker/ficha/equipo/:rut')
    .get(controlador.obtenerEquipo)


router.route('/worker/ficha/contractuales')
    .post(controlador.ingresarContractuales)
router.route('/worker/ficha/contractuales/:rut')
    .get(controlador.obtenerContractuales)


router.route('/worker/ficha/previsional')
    .post(controlador.ingresarPrevisional)
router.route('/worker/ficha/previsional/:rut')
    .get(controlador.obtenerPrevisional)


router.route('/worker/ficha/hojavida/capacitaciones/:id')
    .get(controlador.obtenerCapacitaciones)
router.route('/worker/ficha/hojavida/obtenerCapacitacion/:id')
    .get(controlador.obtenerCapacitacion)
router.route('/worker/ficha/hojavida/amonestaciones/:id')
    .get(controlador.obtenerAmonestaciones)
router.route('/worker/ficha/hojavida/obtenerAmonestacion/:id')
    .get(controlador.obtenerAmonestacion)
router.route('/worker/ficha/hojavida/crearCapacitacion')
    .post(controlador.ingresarCapacitacion)
router.route('/worker/ficha/hojavida/modificarCapacitacion')
    .post(controlador.modificarCapacitacion)
router.route('/worker/ficha/hojavida/eliminarCapacitacion')
    .post(controlador.eliminarCapacitacion)
router.route('/worker/ficha/hojavida/crearAmonestacion')
    .post(controlador.ingresarAmonestacion)
router.route('/worker/ficha/hojavida/modificarAmonestacion')
    .post(controlador.modificarAmonestacion)
router.route('/worker/ficha/hojavida/eliminarAmonestacion')
    .post(controlador.eliminarAmonestacion)

router.route('/worker/turnos/:fecha')
    .get(controlador.obtenerTurnos)
router.route('/worker/turnos/detalle/:id')
    .get(controlador.detalleTurno)
router.route('/worker/turnos/create')
    .post(controlador.crearTurnos)
router.route('/worker/turnos/modificar')
    .post(controlador.modificarTurno)

router.route('/conductores')
    .get(controlador.todosUsuarios)  //reemplazar por listado de conductores


module.exports = router;
