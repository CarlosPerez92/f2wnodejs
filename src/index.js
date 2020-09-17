const app = require('./app')
require('./connection');
require("dotenv").config({path:'variables.env'})

//leer variables de sesioon
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

async function init() {
    await app.listen(port);
    console.log('Connected correctly to server')
}

init();