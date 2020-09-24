const { Schema, model,ObjectId = Schema.ObjectId } = require('mongoose');
const userOficiosSchema = new Schema({
    idProvider: ObjectId,    
    idOficio:ObjectId,
});
let UserOficiosSchema = module.exports = model('userOficios', userOficiosSchema)
module.exports.get = function(callback, limit) {
    UserOficiosSchema.find(callback).limit(limit);
}