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



module.exports = router;
