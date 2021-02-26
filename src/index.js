require('dotenv').config();


const app = require('./app');
//const path = require('path');
const { mongoose } = require('./database');


async function main(){
    await app.listen(app.get('port'));
    console.log('Escuchando',app.get('port'));
}

main();