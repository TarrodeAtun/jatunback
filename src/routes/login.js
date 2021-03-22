const { Router } = require('express');

const router = Router();

const controlador = require('../controllers/login.controller.js');

router.route('/')
    .post(controlador.login)
    .get(controlador.confirma)


module.exports = router;