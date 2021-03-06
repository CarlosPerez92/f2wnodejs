const express = require('express');
const app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true,limit: '50mb',parameterLimit: 100000, }))

app.use(require('./controllers/authController'));
app.use(require('./controllers/catalogoController'));
app.use(require('./controllers/userRequestController'));
app.use(require('./controllers/tmpUserRequestController'));
app.use(require('./controllers/userOficiosController'));
app.use(require('./controllers/notificationController'));
module.exports = app;