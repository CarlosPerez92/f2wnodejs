const { Router } = require('express');
const router = Router();

const Catalogo =  require('../models/catalogoModel');
const jwt = require('jsonwebtoken');

router.post('/catalogo',async(req, res) => {
    try {
        // Receiving Data
        const { description } = req.body;
        // Creating a new Description Catalogo
        const descr = new Catalogo({
            description            
        });
        await descr.save();
        res.json();
    } catch (e) {
        console.log(e)
        res.status(500).send('There was a problem registering your Catalogo');
    }
}); 
router.post('/catalogos', async(req, res) =>{
    try {
        const catalogos = await Catalogo.find()
        if (!catalogos) {
            return res.status(404).send("The catalogos doesn't exists")
        }               
        res.status(200).json({catalogos});
        console.log(catalogos[0].description);
    } catch (e) {
        console.log(e)
        res.status(500).send('There was a problem signin' + e);
    }
});

router.get('/catalogo', function(req, res) {
    res.status(200).send({ auth: false, token: null });
});

module.exports = router; 