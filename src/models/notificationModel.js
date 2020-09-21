exports = function(toPhone) {
    const mdb = context.services.get('mongodb-atlas');
    const users = mdb.db('demo').collection('users');
    const user = users.findOne({ _id: context.user.id });
    return user.phoneNumber === toPhone;
  }