const { Schema, model,ObjectId = Schema.ObjectId } = require('mongoose');
const tmpuserRequestSchema = new Schema({
    idUserRequest: ObjectId,
    idProvider:ObjectId,
    price:String,    
});
let TmpUserRequest = module.exports = model('tmpUserRequest', tmpuserRequestSchema)

module.exports.get = function(callback, limit) {
    TmpUserRequest.find(callback).limit(limit);
}
