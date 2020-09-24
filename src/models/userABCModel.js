const { Schema, model,ObjectId = Schema.ObjectId } = require('mongoose');
const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    lastName:String,
    firstName:String,
    rfc:String,
    photo:String,
    phone:String,
    oficio:ObjectId,
});
let User = module.exports = model('User', userSchema)
module.exports.get = function(callback, limit) {
    User.find(callback).limit(limit);
}