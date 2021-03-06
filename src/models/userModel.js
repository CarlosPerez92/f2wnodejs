const { Schema, model,ObjectId = Schema.ObjectId } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    lastName:String,
    firstName:String,
    rfc:String,
    photo:String,
    phone:String,
    profile:String,
    oficio:ObjectId,
    tokenMobile:String,
});

userSchema.methods.encryptPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = model('User', userSchema)