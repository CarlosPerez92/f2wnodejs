const { Router } = require('express');
const router = Router();
const UserRequest =  require('../models/userRequestModel');
const User = require('../models/userModel');
const mongoose = require("mongoose");

router.post('/userrequest',async(req, res) => {
    try {
        // Receiving Data
        const { idOficio,idCustom,image,description,title,idProvider } = req.body;
        // Creating a new Description Request
        const userrequest = new UserRequest({
            idOficio,
            idCustom,
            image,
            description, 
            title,
            idProvider,          
        });
        await userrequest.save();
        res.json(); 
    } catch (e) {
        console.log(e)
        res.status(500).send('There was a problem registering your User Request');
    }
}); 

router.get('/userOficios/:id', async(req, res) =>{
    console.log(req.params.id.toString());
    try {
        const userrequest = await User.aggregate([
                      
            { $match: { "_id":new mongoose.Types.ObjectId(req.params.id.toString())} },            
            {                 
                $lookup: 
                {
                  from: "catalogos",
                  localField: "oficio",// tabla principal 
                  foreignField: "_id",//id join
                  as: "lsg"
                }
              }
        ]);
        if (!userrequest) {
            return res.status(404).send("The User Request doesn't exists")
        }               
        res.status(200).json({userrequest});        
    } catch (e) {
        console.log(e)
        res.status(500).send('There was a problem userRequest' + e);
    }
}); 

module.exports = router; 