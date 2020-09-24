const { Router } = require('express');
const router = Router();
const UserRequest =  require('../models/userRequestModel');
router.post('/userrequest',async(req, res) => {
    try {
        // Receiving Data
        const { idOficio,idCustom,image,description,title,provider } = req.body;
        // Creating a new Description Request
        const userrequest = new UserRequest({
            idOficio,
            idCustom,
            image,
            description, 
            title,
            provider,          
        });
        await userrequest.save();
        res.json(); 
    } catch (e) {
        console.log(e)
        res.status(500).send('There was a problem registering your User Request');
    }
}); 

router.get('/catalogosOficios', async(req, res) =>{
    try {
        const userrequest = await UserRequest.aggregate([
            /* {
                $addFields:{
                    "id":{
                        $to:"$_id"
                    }
                }
            }, */
            {                 
                $lookup: 
                {
                  from: "userrequests",
                  localField: "id",// tabla principal 
                  foreignField: "idOficio",//id join
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