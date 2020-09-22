const { Schema, model } = require('mongoose');
const userRequestSchema = new Schema({
    idOficio: String,
    idCustom:String,
    image:String,
    description:String,
});
module.exports = model('UserRequest', userRequestSchema)
