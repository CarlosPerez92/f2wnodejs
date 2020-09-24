const { Schema, model } = require('mongoose');
const userRequestSchema = new Schema({
    idOficio: String,
    idCustom:String,
    image:String,
    description:String,
    title:String,
    provider:String,
});
let UserRequest = module.exports = model('UserRequest', userRequestSchema)

module.exports.get = function(callback, limit) {
    UserRequest.find(callback).limit(limit);
}

