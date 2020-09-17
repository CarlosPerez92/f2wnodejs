const { Schema, model } = require('mongoose');
const catalogoSchema = new Schema({
    description: String,
});
module.exports = model('Catalogo', catalogoSchema)
