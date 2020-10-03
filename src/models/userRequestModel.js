const { Schema, model,ObjectId = Schema.ObjectId } = require('mongoose');
const userRequestSchema = new Schema({
    idOficio: ObjectId,
    idCustom:ObjectId,
    image:String,
    description:String,
    title:String,
    idProvider:String,
    status: {type:String,default:"0"},
    direccion:String,
});
let UserRequest = module.exports = model('UserRequest', userRequestSchema)

module.exports.get = function(callback, limit) {
    UserRequest.find(callback).limit(limit);
}

