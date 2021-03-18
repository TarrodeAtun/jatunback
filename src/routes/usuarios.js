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


module.exports = router;
