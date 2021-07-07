const { Router } = require('express');
const { verificarToken } = require('../middleware/autenticacion');

const router = Router();

const controlador = require('../controllers/usuarios.controller.js');

// router.use(verificarToken);

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
router.route('/worker/conductores')
    .get(controlador.todosConductores)

router.route('/worker/:id')
    .get(controlador.obtenerUsuario)
router.route('/worker/update/')
    .put(controlador.actualizaUsuario)
router.route('/worker/create/')
    .post(controlador.ingresarUsuario)
router.route('/worker/eliminar/')
    .post(controlador.eliminarUsuario)


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

router.route('/worker/desempeno')
    .post(controlador.desempeno)

/*****  TURNOS  ******/

/*  obtener  */
router.route('/worker/turnos/')
    .post(controlador.obtenerTurnos) /*obtiene los turnos de la semana*/
router.route('/worker/turnos/especifico/')
    .post(controlador.obtenerTurnosDia)/*obtiene los turnos de un dia especifico*/
router.route('/worker/turnos/general/')
    .post(controlador.obtenerTurnosGeneral)/*obtiene los turnos en general (uso paginador)*/
router.route('/worker/turnos/ultimo/')
    .post(controlador.obtenerTurnoUltimo)/*obtiene el ultimo turno*/
router.route('/worker/turnos/turnoVigente/:rut')
    .get(controlador.obtenerTurnoVigente)
router.route('/worker/turnos/registros/:rut')
    .get(controlador.registrosGraficos)
router.route('/worker/turnos/mes/')
    .post(controlador.obtenerTurnosMes)

router.route('/worker/turnos/paginas/') /*obtiene las paginas totales a partir del filtro*/
    .post(controlador.turnosPaginas)
router.route('/worker/turnos/solicitudes/paginas/')
    .post(controlador.solicitudesPaginas)


/*  crud  */
router.route('/worker/turnos/detalle/:id')
    .get(controlador.detalleTurno)
router.route('/worker/turnos/create')
    .post(controlador.crearTurnos)
router.route('/worker/turnos/modificar')
    .post(controlador.modificarTurno)

router.route('/worker/turnos/crear-reemplazo-perfil')
    .post(controlador.crearReemplazoPerfil)
router.route('/worker/turnos/listado-solicitudes')
    .post(controlador.listadoSolicitudes)
router.route('/worker/turnos/solicitudes/respuesta')
    .post(controlador.respuestaSolicitud)

router.route('/worker/turnos/asistencia/emergencias/')
    .post(controlador.obtenerEmergenciasAsistencia)
router.route('/worker/turnos/asistencia/emergencias/crear')
    .post(controlador.crearEmergenciasAsistencia)
router.route('/worker/turnos/asistencia/emergencias/eliminar')
    .post(controlador.eliminarEmergenciaAsistencia)
router.route('/worker/turnos/asistencia/emergencias/detalle/:id')
    .get(controlador.obtenerEmergenciaAsistencia)


/* interacciones */
router.route('/worker/turnos/iniciar')
    .post(controlador.iniciarTurno)
router.route('/worker/turnos/pasarLista')
    .post(controlador.pasarLista)
router.route('/worker/turnos/subirAsistencia')
    .post(controlador.subirAsistencia)
router.route('/worker/turnos/finalizar')
    .post(controlador.finalizarTurno)



module.exports = router;
