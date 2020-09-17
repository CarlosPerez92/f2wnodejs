const mongoose = require('mongoose')
require("dotenv").config({path:'variables.env'})

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(db => console.log('Connection establishe successfully')) 