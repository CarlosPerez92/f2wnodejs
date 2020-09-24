const { Router } = require('express');
const router = Router();
const TmpUserRequest =  require('../models/tmpUserRequestModel');
const User = require('../models/userModel');
const mongoose = require("mongoose");

router.post('/tmpuserrequest',async(req, res) => {
    try {
        // Receiving Data
        const { idUserRequest,idProvider,price} = req.body;
        // Creating a new Description Request
        const tmpuserrequest = new TmpUserRequest({
            idUserRequest,
            idProvider,
            price,           
        });
        await tmpuserrequest.save();
        res.json(); 
    } catch (e) {
        console.log(e)
        res.status(500).send('There was a problem registering your User Request');
    }
}); 
router.get('/tmpuserrequest/:id', async(req, res) =>{
    console.log(req.params.id.toString());
    try {
        const userrequest = await User.aggregate([
                      
            { $match: { "_id":new mongoose.Types.ObjectId(req.params.id.toString())} },            
            {                 
                $lookup: 
                {
                  from: "userrequests",
                  localField: "_id",// tabla principal 
                  foreignField: "idCustom",//id join
                  as: "request"
                }
            },
            {
                $unwind: {
                  path: "$request",
                  preserveNullAndEmptyArrays: true
                }
              },
              {                 
                $lookup: 
                {
                  from: "catalogos",
                  localField: "request.idOficio",// tabla principal 
                  foreignField: "_id",//id join
                  as: "oficios"
                }
            },        
            {
                $unwind: {
                  path: "$oficios",
                  preserveNullAndEmptyArrays: true
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
                preserveNullAndEmptyArrays: true
              }
            },
            {                 
              $lookup: 
              {
                from: "users",
                localField: "tmpReq.idProvider",// tabla principal 
                foreignField: "_id",//id join
                as: "provider"
              }
          },
          {
            $unwind: {
              path: "$provider",
              preserveNullAndEmptyArrays: true
            }
          },
              {
                $group: {
                  _id : "$_id",
                  usernme: { $first: "$username" },
                  profile: { $first: "$profile" },
                  idOficio: { $push: "$request.idOficio" },
                  description: { $push: "$request.description" },                  
                  oficios: { $push: "$oficios.description" },
                  idUserRequest: { $push: "$tmpReq.idUserRequest" },
                  price: { $push: "$tmpReq.price" },
                  title: { $push: "$request.title" },
                  image: { $push: "$provider.photo" },
                  idProvider: { $push: "$provider._id" },
                  nameProvider:{ $push: "$provider.username"}
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