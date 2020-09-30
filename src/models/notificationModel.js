const { Schema, model,ObjectId = Schema.ObjectId } = require('mongoose');
const notificationSchema = new Schema({
    idProvider: ObjectId,    
    idOficio:ObjectId,
});
let NotificationSchema = module.exports = model('userOficios', notificationSchema)
  module.exports.get = function(callback, limit) {
  NotificationSchema.find(callback).limit(limit);
}