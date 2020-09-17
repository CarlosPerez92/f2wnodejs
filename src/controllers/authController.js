const { Router } = require('express');
const router = Router();

const User = require('../models/userModel');
const verifyToken = require('./verifyToken')

const jwt = require('jsonwebtoken');
const config = require('../config');

const userController =  require('./userABCController')


router.post('/signup', async(req, res) => {
    try {
        // Receiving Data
        const { username, password,email,lastName,firstName,rfc,photo,phone } = req.body;
        // Creating a new User
        const user = new User({
            username,
            password,
            email,
            lastName,
            firstName,
            rfc,
            photo,
            phone,
        });
        user.password = await user.encryptPassword(password);
        await user.save();
        // Create a Token
        const token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 60 * 60 * 24 // expires in 24 hours
        });
        var _id = user.id
        res.json({ auth: true, token,any:_id});

    } catch (e) {
        console.log(e)
        res.status(500).send('There was a problem registering your user');
    }
});

router.post('/signin', async(req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })
        if (!user) {
            return res.status(404).send("The username doesn't exists")
        }
        const validPassword = await user.validatePassword(req.body.password, user.password);
        if (!validPassword) {
            return res.status(401).send({ auth: false, token: null });
        }
        const token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: '24h'
        });
        const _id = user._id ;
        res.status(200).json({ auth: true, token,any:_id });
    } catch (e) {
        console.log(e)
        res.status(500).send('There was a problem signin');
    }
});

router.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
});


router.route('/user')
    .get(userController.index)
router.route('/user/:id')
    .get(userController.view) 
    .put(userController.update)

module.exports = router;