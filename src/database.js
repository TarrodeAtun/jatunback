const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI; //llamamos la variable desde el OS que contiene la ruta de conexion a la base de datos

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(uri)
    .then(db => console.log("conectado"))
    .catch(err => console.error(err));

    
module.exports = mongoose;

