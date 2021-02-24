const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { verificarToken } = require('../middleware/autenticacion');

const controlador = {};
const usuario = require('../models/usuario');

controlador.todosUsuarios =
    async (req, res) => {
        const registros = await usuario.find(); //consultamos todos los registros de la tabla usuarios y lo almacenamos
        res.json({ ok: true, data: registros });
    }

controlador.ingresarUsuario =
    async (req, res) => {
        var { nombre, apellido, edad, email, password, perfil } = req.body; //copiamos los datos recibidos en constantes
        const passencripted = bcrypt.hashSync(password, 10);
        password = passencripted;
        const nuevoUsuario = new usuario({ nombre, apellido, edad, email, password, perfil }); // creamos un objeto usuario con los datos recibidos
        await nuevoUsuario.save(); // indicamos  mongoose que guarde el nuevo registro
        res.json({ estado: "recibido" });
    }

controlador.obtenerUsuario =
    async (req, res) => {
        const usuarioRes = await usuario.findOne({ _id: req.params.id });
        res.json(usuarioRes);
    }

controlador.actualizaUsuario =
    async (req, res) => {
        console.log("notsad");
        //recibe por protocolo el id del usuario
        // const { nombre, apellido, edad } = req.body; //copiamos los datos de respuesta de la peticion (datos nuevos)
        // const nuevoUsuario = { nombre, apellido, edad }; //creamos un array usuario con los datos nuevos
        // await usuario.findOneAndUpdate({ __id: req.params.id }, nuevoUsuario); //indicamos a mongoose que en la tabla usuario busque el registro con el id y lo actualice con el nuevo objeto.
        // console.log(req.params.id);
        // res.json('recibido');
    }

controlador.actualizaUsuarioBasico =  //funcion propia del trabajador
    async (req, res) => {  //recibe por protocolo el id del usuario
        console.log(req.body);
        const { email, telefono } = req.body; //copiamos los datos de respuesta de la peticion (datos nuevos)
        const nuevoUsuario = { email, telefono }; //creamos un array usuario con los datos nuevos
        await usuario.findOneAndUpdate({ _id: req.body.id }, nuevoUsuario); //indicamos a mongoose que en la tabla usuario busque el registro con el id y lo actualice con el nuevo objeto.
        console.log("aqui");
        await usuario.findOne({ _id: req.body.id }, (err, usuario) => {
            var perfilSesion = usuario.perfil;
            let token = jwt.sign({
                usuariobd: usuario
            }, process.env.SECRET, { expiresIn: '24h' })
            const cuerpo = { usuariobd: usuario, token };
            return res.json({
                ok: true,
                usuariobd: usuario,
                token,
                perfilSesion
            })
        });
    }
controlador.actualizaUsuarioPassword =
    async (req, res) => {  //recibe por protocolo el id del usuario
        console.log("func");
        console.log(req.body);
        const { id, pass } = req.body;
        const password = bcrypt.hashSync(pass, 10);
        const nuevoUsuario = { password };
        await usuario.findOneAndUpdate({ _id: id }, nuevoUsuario);
        // const { email, telefono } = req.body; //copiamos los datos de respuesta de la peticion (datos nuevos)
        // const nuevoUsuario = { email, telefono }; //creamos un array usuario con los datos nuevos
        // await usuario.findOneAndUpdate({ __id: req.params.id }, nuevoUsuario); //indicamos a mongoose que en la tabla usuario busque el registro con el id y lo actualice con el nuevo objeto.
        // console.log(req.params.id);
        // res.json('recibido');
    }
controlador.actualizaUsuarioEmergencia =
    async (req, res) => {  //recibe por protocolo el id del usuario
        console.log(req.body);
        const { contacto, parentesco,telefono1,telefono2,direccion,comuna,ciudad } = req.body; //copiamos los datos de respuesta de la peticion (datos nuevos)
        const nuevoUsuario = { emergencias:{contacto, parentesco,telefono1,telefono2,direccion,comuna,ciudad} }; //creamos un array usuario con los datos nuevos
        await usuario.findOneAndUpdate({ _id: req.body.id }, nuevoUsuario); //indicamos a mongoose que en la tabla usuario busque el registro con el id y lo actualice con el nuevo objeto.
        console.log("aqui");
        await usuario.findOne({ _id: req.body.id }, (err, usuario) => {
            var perfilSesion = usuario.perfil;
            let token = jwt.sign({
                usuariobd: usuario
            }, process.env.SECRET, { expiresIn: '24h' })
            const cuerpo = { usuariobd: usuario, token };
            return res.json({
                ok: true,
                usuariobd: usuario,
                token,
                perfilSesion
            })
        });
    }

controlador.eliminaUsuario =
    async (req, res) => {  //recibe por protocolo el id del usuario
        console.log(req);
        // await usuario.findOneAndDelete({ _id: req.params.id });
        // res.json({ status: 'eliminado' });
    }

module.exports = controlador;