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
router.route('/worker/trabajadoresPost')
    .post(controlador.todosTrabajadoresPost)
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

/*****  TURNOS  ******/

/*  obtener  */
router.route('/worker/turnos/')
    .post(controlador.obtenerTurnos) /*obtiene los turnos de la semana*/
router.route('/worker/turnos/especifico/')
    .post(controlador.obtenerTurnosDia)/*obtiene los turnos de un dia*/
router.route('/worker/turnos/general/')
    .post(controlador.obtenerTurnosGeneral)/*obtiene los turnos en general (uso paginador)*/
router.route('/worker/turnos/ultimo/')
    .post(controlador.obtenerTurnoUltimo)/*obtiene el ultimo turno*/
router.route('/worker/turnos/turnoVigente/:rut')
    .get(controlador.obtenerTurnoVigente)
router.route('/worker/turnos/registros/:rut')
    .get(controlador.registrosGraficos)

router.route('/worker/turnos/paginas/') /*obtiene las paginas totales a partir del filtro*/
    .post(controlador.turnosPaginas)


/*  crud  */
router.route('/worker/turnos/detalle/:id')
    .get(controlador.detalleTurno)
router.route('/worker/turnos/create')
    .post(controlador.crearTurnos)
router.route('/worker/turnos/modificar')
    .post(controlador.modificarTurno)

/* interacciones */
router.route('/worker/turnos/iniciar')
    .post(controlador.iniciarTurno)
router.route('/worker/turnos/pasarLista')
    .post(controlador.pasarLista)
router.route('/worker/turnos/subirAsistencia')
    .post(controlador.subirAsistencia)
router.route('/worker/turnos/finalizar')
    .post(controlador.finalizarTurno)


router.route('/conductores')
    .get(controlador.todosUsuarios)  //reemplazar por listado de conductores


module.exports = router;
