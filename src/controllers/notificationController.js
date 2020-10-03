const { Router } = require('express');
var admin = require("firebase-admin");
var serviceAccount = require("../f2ws.json")
const router = Router();
admin.initializeApp({
  credential :admin.credential.cert(serviceAccount),
  databaseURL: 'https://f2ws-3da5f.firebaseio.com/'
}
);

const Notification = require('../models/userRequestModel');
const UserRequest = require('../models/userModel');
const TmpUserRequest = require('../models/tmpUserRequestModel');

const mongoose = require("mongoose");
const { credential } = require('firebase-admin');

router.get('/fcmusernotification/:id',async(req, res) => {
  console.log(req.params.id.toString());
  try {
    const userrequest = await Notification.aggregate([
                      
      { $match: { "_id":new mongoose.Types.ObjectId(req.params.id.toString())} },      
      {                 
        $lookup: 
        {
          from: "useroficios",
          localField: "idOficio",// tabla principal 
          foreignField: "idOficio",//id join
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
          localField: "oficios.idProvider",// tabla principal 
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
      {                 
        $lookup: 
        {
          from: "catalogos",
          localField: "oficios.idOficio",// tabla principal 
          foreignField: "_id",//id join
          as: "catalogos"
        }
      },  
      {
        $unwind: {
          path: "$catalogos",
          preserveNullAndEmptyArrays: false
        }
      }, 
      {$group: {
        _id : "$_id",
        token:{$push: "$users.tokenMobile"},
        title:{$first:"$title"},
        description:{$first:"$description"},
        oficio:{$first:"$catalogos.description"},
        },
       }                  
  ]);
  if (!userrequest) {
      return res.status(404).send("The User Request doesn't exists")
  }          
  const _id =     userrequest; 
  res.status(200).json({userrequest});  
  
  var registrationTokens = userrequest[0]['token'];  
  admin.messaging().unsubscribeFromTopic(registrationTokens, 'request')
  .then(function(response) {
    // See the MessagingTopicManagementResponse reference documentation
    // for the contents of response.
    console.log('Successfully unsubscribed from topic:', response);
  })
  .catch(function(error) {
    console.log('Error unsubscribing from topic:', error);
  });

  admin.messaging().subscribeToTopic(registrationTokens, 'request')
  .then(function(response) {
    // See the MessagingTopicManagementResponse reference documentation
    // for the contents of response.
    console.log('Successfully subscribed to topic:', response);
  })
  .catch(function(error) {
    console.log('Error subscribing to topic:', error);
  }); 

  var topic = 'request';

    
var topicName = 'request'

var message = {
  notification: {
    title: userrequest[0]['oficio'],
    body: userrequest[0]['title']
  },
  android: {
    notification: {
      icon: 'https://res.cloudinary.com/hzilw1ccp/image/upload/v1601688526/images/icon_tzaxt3.png',
      color: '#7e55c3'
    }
  },
  topic: topicName,
};

admin.messaging().send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });


  } catch (e) {
      console.log(e)
      res.status(500).send('There was a problem userRequest' + e);
  }
}); 

router.put('/fcmusernotification/:id', async(req, res) =>{
  console.log(req.params.id.toString());
  try {
      UserRequest.findById(req.params.id, function(err, userrequest) {
        if (err)
            res.json({
                status: 'err',
                code: 500,
                message: err
            })
            userrequest.tokenMobile = req.body.tokenMobile 
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
            })
        })
    });      
  } catch (e) {
      console.log(e)
      res.status(500).send('There was a problem userRequest' + e);
  }
});

router.get('/fcmusernotificationcustomer/:id',async(req, res) => {
  console.log(req.params.id.toString());
  try {
    const userrequest = await TmpUserRequest.aggregate([
      { $match: { "_id":new mongoose.Types.ObjectId(req.params.id.toString())} },
      {                 
        $lookup: 
        {
          from: "userrequests",
          localField: "idUserRequest",// tabla principal 
          foreignField: "_id",//id join
          as: "request"
        }
      }, 
      {
        $unwind: {
          path: "$request",
          preserveNullAndEmptyArrays: false
        }
      },  
      {                 
        $lookup: 
        {
          from: "users",
          localField: "request.idCustom",// tabla principal 
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
        title:"$request.title",
        request:"$request.description",
        price:"$price",
        token:"$users.tokenMobile"
        },
      }
    ]);
    if (!userrequest) {
      return res.status(404).send("The User Request doesn't exists")
  }          
  res.status(200).json({userrequest});
  console.log(userrequest[0]['token'])
  var registrationTokens = userrequest[0]['token'];  
  
  admin.messaging().unsubscribeFromTopic(registrationTokens, 'request')
  .then(function(response) {
    // See the MessagingTopicManagementResponse reference documentation
    // for the contents of response.
    console.log('Successfully unsubscribed from topic:', response);
  })
  .catch(function(error) {
    console.log('Error unsubscribing from topic:', error);
  });

  admin.messaging().subscribeToTopic(registrationTokens, 'request')
  .then(function(response) {
    // See the MessagingTopicManagementResponse reference documentation
    // for the contents of response.
    console.log('Successfully subscribed to topic:', response);
  })
  .catch(function(error) {
    console.log('Error subscribing to topic:', error);
  }); 

  var topic = 'request';

    
var topicName = 'request'

var message = {
  notification: {
    title: userrequest[0]['request'],
    body: '$' + userrequest[0]['price']
  },
  android: {
    notification: {
      icon: 'https://res.cloudinary.com/hzilw1ccp/image/upload/v1601688526/images/icon_tzaxt3.png',
      color: '#7e55c3'
    }
  },
  topic: topicName,
};

admin.messaging().send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });


  }
  catch (e) {
    console.log(e)
    res.status(500).send('There was a problem userRequest' + e);
  }
});

module.exports = router; 