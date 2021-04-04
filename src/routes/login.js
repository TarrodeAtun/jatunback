const { Router } = require('express');

const router = Router();

const controlador = require('../controllers/login.controller.js');

router.route('/')
    .post(controlador.login)
    .get(controlador.confirma)

router.route('/recuperarPass')
    .post(controlador.recuperaPass)

router.route('/recuperarPass/compruebatoken')
    .post(controlador.compruebaTokenPass)


module.exports = router;