const { Router } = require('express');
const router = Router();

const Notification = require('../models/userOficiosModel');
const mongoose = require("mongoose");

router.get('/fcmusernotification/:id',async(req, res) => {
  console.log(req.params.id.toString());
  try {
    const userrequest = await Notification.aggregate([
                      
      { $match: { "idOficio":new mongoose.Types.ObjectId(req.params.id.toString())} },      
      {                 
        $lookup: 
        {
          from: "catalogos",
          localField: "idOficio",// tabla principal 
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
          from: "users",
          localField: "idProvider",// tabla principal 
          foreignField: "_id",//id join
          as: "users"
        }
      },  
      {
        $unwind: {
          path: "$users",
          preserveNullAndEmptyArrays: false
        }
      },
       {$project: {
        _id : "$_id",
        token: "$users.token"
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