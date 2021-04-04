const { Router } = require('express');

const router = Router();

const controlador = require('../controllers/mailer.controller.js');


router.route('/recuperarPass/')
    .post(controlador.mailRecuperarPass)
router.route('/soporte/')
    .post(controlador.mailSoporte)


module.exports = router;