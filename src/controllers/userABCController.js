const User = require('../models/userModel');

exports.index = async(req, res) => {
    User.get((err, user) => {
        if (err) {
            res.json({
                status: 'err',
                code: 500,
                message: err
            });
        }

        res.json(user)
    })
}
//create fucntion view products
exports.view = function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            res.json({
                status: 'err',
                code: 500,
                message: err
            })
        }
        
        res.json({
            //status: 'success',
            //code: 200,
            //message: 'Registros encontrado',
            data: user
        })
    })
}

exports.update = function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err)
            res.json({
                status: 'err',
                code: 500,
                message: err
            })
            user.username = req.body.username
            user.email = req.body.email 
            user.firstName = req.body.firstName
            user.lastName = req.body.lastName
            user.rfc = req.body.rfc
             
            user.save(function(err) {
            if (err)
                res.json({
                    status: 'err',
                    code: 500,
                    message: err
                })
            res.json({
                status: 'success',
                code: 200,
                message: 'Registro actualizado',
                data: user
            })
        })
    })
}