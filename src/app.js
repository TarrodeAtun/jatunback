const express = require('express');
const app = express();

//importaciones
const cors = require('cors');
const morgan = require("morgan");

//Configuraciones
app.set('port', process.env.PORT || 4000);

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//rutas
app.use('/api/users', require('./routes/usuarios')); 
app.use('/api/login', require('./routes/login')); 




module.exports = app;
