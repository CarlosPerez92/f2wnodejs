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
        var _id = tmpuserrequest._id;
        res.json({ auth: true,any:_id});
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
            }
          },          
             {$project: {
                _id: 1,                
                tmpReq:"$tmpReq",
                idProvider: "$provider._id" ,
                nameProvider: "$provider.username",
                imageProvider: "$provider.photo" ,
                oficios:"$oficios",
                request:"$request",
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


router.get('/tmpusterrequestnotificacion/:id',async(req, res) => {
  console.log(req.params.id.toString());
  try {
    const userrequest = await TmpUserRequest.aggregate([
                      
      { $match: { "idUserRequest":new mongoose.Types.ObjectId(req.params.id.toString())} },      
      {                 
        $lookup: 
        {
          from: "users",
          localField: "idProvider",// tabla principal 
          foreignField: "_id",//id join
          as: "provider"
        }
    },
    {
      $unwind: {
        path: "$provider",              
      }
    },          
       {$project: {
          _id: 1,                
          price:"$price",
          idProvider: "$provider._id" ,
          nameProvider: "$provider.username",
          imageProvider: "$provider.photo" ,          
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

router.post('/deletetmpuserrequest/:id', function(req, res, next) {
  try {
    // Receiving Data
    var myquery = { idUserRequest : new mongoose.Types.ObjectId(req.params.id.toString())};

    console.log(myquery);
    TmpUserRequest.deleteMany(myquery, function(err, obj) {      
      console.log("1 document deleted");      
    });
    res.status(200).json();
} catch (e) {
    console.log(e)
    res.status(500).send('There was a problem registering your User Request');
}
});

module.exports = router; 