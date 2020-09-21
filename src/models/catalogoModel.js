const { Schema, model } = require('mongoose');
const catalogoSchema = new Schema({
    description: String,
    image:String,
    color:String,
    title:String,
});
module.exports = model('Catalogo', catalogoSchema)
