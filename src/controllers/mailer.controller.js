var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
const jwt = require('jsonwebtoken');
var fs = require('fs');
const controlador = {};

const usuario = require('../models/usuario');

var transporter = nodemailer.createTransport({
    host:"smtp.jatunnewen.cl",
    port:465,
    secure:true,
    auth: {
        user: 'personas@jatunnewen.cl',
        pass: '123jatunnewen456 '
    }
});


//controlador de lectura de plantilla
var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

// email sender function
controlador.mailRecuperarPass =
    async (req, res) => {
        let mail = req.body.email;

        // const usuarioRes = 
        await usuario.findOne({ email: mail }).then(resp => {
            if (resp) {
                console.log("asd");
                //generacion de codigo aleatorio
                var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHJKMNPQRTUVWXYZ012346789";
                var recuperacion = "";
                let rut = resp.rut;
                recuperacion += rut;
                recuperacion += "&";
                for (i = 0; i < 30; i++) recuperacion += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
                var token = jwt.sign({
                    rut: rut,
                    recuperacion: recuperacion
                }, process.env.SECRET, { expiresIn: '24h' })
                usuario.findOneAndUpdate({ email: mail }, { recuperacion: recuperacion }, { upsert: true, multi: true }).then(respf => {
                    readHTMLFile('./src/recursos/plantillaMail.html', function (err, html) {
                        var template = handlebars.compile(html);
                        var link = "http://localhost:3000/recuperarPass/" + token;
                        var replacements = {
                            nombre: "John Doe",
                            enlace: link
                        };
                        var htmlToSend = template(replacements);
                        //Definimos el email
                        var mailOptions = {
                            from: 'Sistema Jatun Newen',
                            to: mail,
                            subject: 'Correo de recuperacion de contraseña',
                            html: htmlToSend
                        };
                        // Enviamos el email
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                                res.send(500, err.message);
                            } else {
                                console.log("Email sent");
                                res.status(200).jsonp(req.body);
                            }
                        });
                    });
                })

            } else {
                console.log("no");
            }
        }).catch(err => {
            console.log(err);
        });
        // console.log(usuarioRes);




    };

// email sender function
controlador.mailSoporte =
    async (req, res) => {
        let { nombre, apellido, rut, telefono, mensaje } = req.body;
        // const usuarioRes = 

        readHTMLFile('./src/recursos/plantillaMailSoporte.html', function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                nombre: nombre,
                apellido: apellido,
                telefono : telefono,
                mensaje: mensaje
            };
            var htmlToSend = template(replacements);
            //Definimos el email
            var mailOptions = {
                from: 'Sistema Jatun Newen',
                to: "cvidal@socialventis.cl",
                subject: 'Correo de contacto soporte',
                html: htmlToSend
            };
            // Enviamos el email
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    res.send(500, err.message);
                } else {
                    console.log("Email sent");
                    res.status(200).jsonp(req.body);
                }
            });
        });



    };


module.exports = controlador;