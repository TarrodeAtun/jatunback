var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
const jwt = require('jsonwebtoken');
var fs = require('fs');
const controlador = {};

const usuario = require('../models/usuario');

var transporter = nodemailer.createTransport({
    host: "mail.jatunnewen.cl",
    port: 465,
    secure: true,
    auth: {
        user: 'personas@jatunnewen.cl',
        pass: '123jatunnewen456'
    },
    tls: {
        rejectUnauthorized: false
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

        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
                console.log("Server is ready to take our messages");
            }
        });

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
                    console.log(respf);
                    readHTMLFile('./src/recursos/plantillaMail.html', function (err, html) {
                        var template = handlebars.compile(html);
                        var link = "http://ec2-3-16-187-93.us-east-2.compute.amazonaws.com:3000/recuperarPass/" + token;
                        var replacements = {
                            nombre: respf.nombre + " " + respf.apellido,
                            enlace: link
                        };
                        var htmlToSend = template(replacements);
                        //Definimos el email
                        var mailOptions = {
                            from: 'personas@jatunnewen.cl',
                            to: mail,
                            subject: 'Correo de recuperacion de contraseña',
                            html: htmlToSend
                        };
                        //Enviamos el email
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                                res.send(500, err.message);
                            } else {
                                console.log(info);
                                console.log("Email sent");
                                // res.status(200).jsonp(req.body);
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
                telefono: telefono,
                mensaje: mensaje
            };
            var htmlToSend = template(replacements);
            //Definimos el email
            var mailOptions = {
                from: 'personas@jatunnewen.cl',
                to: "personas@jatunnewen.cl",
                subject: 'Correo de soporte',
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