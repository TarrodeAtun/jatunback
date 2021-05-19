const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');

//importaciones
const cors = require('cors');
const morgan = require("morgan");

//Configuraciones
app.set('port', 4000);

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(fileUpload({createParentPath:true, useTempFiles:true,}));

//rutas
app.use('/api/users', require('./routes/usuarios')); 
app.use('/api/login', require('./routes/login')); 
app.use('/api/mailer', require('./routes/mailer'));
app.use('/api/bienestar', require('./routes/bienestar'));
app.use('/api/generales', require('./routes/generales'));
app.use('/api/gestion-residuos', require('./routes/gestionResiduos'));        

app.use(express.static('uploads'));
app.use('/media', express.static('./uploads'));

app.use(express.static('assets'));
app.use('/assets', express.static('./assets'));


module.exports = app;
