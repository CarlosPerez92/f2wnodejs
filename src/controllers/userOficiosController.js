const { Router } = require('express');
const router = Router();
const UserOficiosRequest =  require('../models/userOficiosModel');
router.post('/useroficios',async(req, res) => {
    try {
        // Receiving Data
        const { idOficio,idCustom,image,description,title,idProvider } = req.body;
        // Creating a new Description Request
        const useroficiodrequest = new UserOficiosRequest({
            idProvider,
            idOficio,                    
        });
        await useroficiodrequest.save();
        res.json(); 
    } catch (e) {
        console.log(e)
        res.status(500).send('There was a problem registering your User Request');
    }
}); 
module.exports = router; 