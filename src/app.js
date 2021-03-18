const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');

//importaciones
const cors = require('cors');
const morgan = require("morgan");

//Configuraciones
app.set('port', 3000);

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(fileUpload({createParentPath:true, useTempFiles:true,}));

//rutas
app.use('/api/users', require('./routes/usuarios')); 
app.use('/api/login', require('./routes/login')); 

app.use(express.static('uploads'));
app.use('/media', express.static('./uploads'));


module.exports = app;
