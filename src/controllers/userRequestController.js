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
                  from: "useroficios",
                  localField: "_id",// tabla principal 
                  foreignField: "idProvider",//id join
                  as: "provider"
                }
            },           
            {
                $unwind: {
                  path: "$provider",
                  preserveNullAndEmptyArrays: false
                }
             },
             {
                $lookup: 
                {
                  from: "catalogos",
                  localField: "provider.idOficio",// tabla principal 
                  foreignField: "_id",//id join
                  as: "oficios"
                }
             },
             {
                $unwind: {
                  path: "$oficios",
                  preserveNullAndEmptyArrays: false
                }
             },
             
          {
                $lookup: 
                {
                  from: "userrequests",
                  localField: "oficios._id",// tabla principal 
                  foreignField: "idOficio",//id join
                  as: "request"
                }
             },{
                $unwind: {
                  path: "$request",
                  preserveNullAndEmptyArrays: false
                }
             },  
             {                 
              $lookup: 
              {
                from: "tmpuserrequests",
                localField: "request._id",// tabla principal 
                foreignField: "idUserRequest",//id join
                as: "tmpReq"
              }
          },
          {
            $unwind: {
              path: "$tmpReq",
              preserveNullAndEmptyArrays: false
            },            
         }, 
         { $addFields: { "result": {$ne:  [ "$tmpReq.idProvider", "$_id" ]  } }}   ,                     
             {$project: {
                _id: 1,                
                provider:"$provider",
                oficios:"$oficios",
                request:"$request",                                  
                result:"$result",
              },
             }   ,
             { $match: { "result":true} },           
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

router.get('/userrequest/:id', async(req, res) =>{
  console.log(req.params.id.toString());
  try {
      const userrequest = await UserRequest.aggregate([
                    
          { $match: { "idCustom":new mongoose.Types.ObjectId(req.params.id.toString())} },                                                     
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

router.put('/userrequest/:id', async(req, res) =>{
  console.log(req.params.id.toString());
  try {
      UserRequest.findById(req.params.id, function(err, userrequest) {
        if (err)
            res.json({
                status: 'err',
                code: 500,
                message: err
            })
            userrequest.idProvider = req.body.idProvider 
            console.log(req.body.idProvider);                       
            userrequest.save(function(err) {
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
                data: userrequest
            })
        })
    });      
  } catch (e) {
      console.log(e)
      res.status(500).send('There was a problem userRequest' + e);
  }
});

router.put('/userrequestStatus/:id', async(req, res) =>{
  console.log(req.params.id.toString());
  try {
      UserRequest.remove(req.params.id, function(err, userrequest) {
        if (err)
            res.json({
                status: 'err',
                code: 500,
                message: err
            })
            userrequest.status = req.body.status                                 
            userrequest.save(function(err) {
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
                data: userrequest
            })
        })
    });      
  } catch (e) {
      console.log(e)
      res.status(500).send('There was a problem userRequest' + e);
  }
});

router.get('/providerrequestnotificacion/:id', async(req, res) =>{
  try {
    const userrequest = await UserRequest.aggregate([
                  
        { $match: { "idProvider":req.params.id.toString()} },   
        {$project: {
          _id: 1,                
          title:"title",
          description:"description",
          image:"image",
        },
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