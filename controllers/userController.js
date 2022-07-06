'use strict';

const User = require('../models/user');
var admin = require("firebase-admin");
var serviceAccount = require("../elred-bf28f-firebase-adminsdk-g0mnh-80c393a1e7.json");
const jwt = require('jsonwebtoken');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://elred-bf28f-default-rtdb.firebaseio.com"
});


const verifyUser =async (req, res, next) => {

  try{
      var uid =  req.body.uid;
      var user =  await User.findById(uid);
      if(!user)
      {
        admin.auth().getUser(uid)
        .then(function(result){  
          if(result.phoneNumber!=undefined)
          {
            //save authorised user in database
            const mongoUser = new User({
              _id:uid,
              uid:uid,
              phone: result.phoneNumber,
              isAuth:true
            });
    
            mongoUser.save().then(result=>{
              generateAccessToken(result);  
            })
          }
          else{
            res.status(500).json({
              success:false, 
              isAuth:false,
              message: 'Phonenumber not found with the given ID',
              result:[]
            }); 
          }
        }).catch(function (error) {
            res.status(500).json({
            success:false, 
            isAuth:false,
            message: error.message,
            result:[]
            });
          });
      }
    else{
      admin.auth().getUser(uid)
        .then(function(result){
          //save authorised user in database
          user._id=uid,
          user.uid=uid,
          user.phone= result.phoneNumber,
          user.isAuth=true;
          user.save().then(result=>{
            generateAccessToken(result);  
          })
        }).catch(function (error) {
            res.status(500).json({
              success:false, 
              isAuth:false,
              message: error.message,
              result:[]
            });
        });
    }

    function generateAccessToken(result)
    {
      const jwt = require('jsonwebtoken');
      const accessToken = jwt.sign({user:uid}, process.env.ACCESS_TOKEN_SECRET,{ expiresIn:process.env.JWT_EXPIRES_IN });

      res.status(500).json({
        success:true, 
        isAuth:result.isAuth,
        message: "user authenticated successfully!",
        result:[{
          accessToken:accessToken, 
          expiryTime:process.env.JWT_EXPIRES_IN
        }]
      }); 
    }
  }
  catch (err) {
    const errorMessage = err.message;
    res.status(500).json({
        success:false, 
        isAuth:false,
        message: errorMessage,
        result:[]
    }); 
  }
 
}


const postUserInfo =async (req, res, next) => {
  try{
    const uid = req.user.user;
    var user =  await User.findById(uid);

    if(req.body.userType!=undefined && req.body.name!=undefined && req.body.email!=undefined && req.body.userName!=undefined){
      if(req.body.userType!="" && req.body.name!="" && req.body.email!="" && req.body.userName!=""){
          var requestBodyArray = Object.keys(req.body);
          let expectedArray = ["userType", "name", "email", "userName"]
          expectedArray = requestBodyArray.filter(item => !expectedArray.includes(item));
          if(expectedArray.length>0)
          {
            res.status(500).json({
              success:false, 
              isAuth:true,
              message: 'Invalid input fields',
              result:[]
            });
          }
          else{
            admin.auth().getUser(uid)
            .then(function(data){
              user.userType=req.body.userType,
              user.name=req.body.name,
              user.email= req.body.email,
              user.userName=req.body.userName;
              user.save().then(result=>{
                var response = {
                  uid: uid,
                  phone: result.phone,
                  email: result.email,
                  name: result.name,
                  userName: result.userName,
                  userType: result.userType
                }
                res.status(500).json({
                  success:true, 
                  isAuth:result.isAuth,
                  message: "user details updated successfully!",
                  result:response
                }); 
              })
            }).catch(function (error) {
              res.status(500).json({
                success:false, 
                isAuth:false,
                message: error.message,
                result:[]
              });
            });
          }
        }
        else{
          res.status(500).json({
            success:false, 
            isAuth:user.isAuth,
            message:"Input field with empty value is not valid",
            result:[]
          }); 
        }
    }
    else{
      var message = [];
      if(req.body.userType===undefined){
        message.push("userType");
      }
      if(req.body.name===undefined){
        message.push("name");
      }
      if(req.body.email===undefined){
        message.push("email");
      }
      if(req.body.userName===undefined){
        message.push("userName");
      }

      res.status(500).json({
        success:false,
        isAuth:user.isAuth,
        message: message + " required.",
        result: []
      }); 
    }
  }
  catch (err) {
    const errorMessage = err.message;
    res.status(500).json({
      success:false, 
      isAuth:user.isAuth,
      message: errorMessage,
      result:[]
    }); 
  }
   
}


const patchUserInfo =async (req, res, next) => {
  try{
    const uid = req.user.user;
    var user =  await User.findById(uid);
    if(req.body.gender!="" && req.body.dob!="" && req.body.location!="" &&
    req.body.profession!="" && req.body.organizationType!="" && req.body.organizationName!=""){
      admin.auth().getUser(uid)
      .then(function(data){
        if(req.body.gender!=undefined){
          user.gender=req.body.gender;
        }
        if(req.body.dob!=undefined){
          user.dob=req.body.dob;
        }
        if(req.body.location!=undefined){
          user.location=req.body.location;
        }
        if(req.body.profession!=undefined){
          user.profession=req.body.profession;
        }
        if(req.body.organizationType!=undefined){
          user.organizationType=req.body.organizationType;
        }
        if(req.body.organizationName!=undefined){
          user.organizationName=req.body.organizationName;
        }

        var requestBodyArray = Object.keys(req.body);
        let expectedArray = ["gender", "dob", "location", "profession", "organizationType", "organizationName"]
        expectedArray = requestBodyArray.filter(item => !expectedArray.includes(item));
        if(expectedArray.length>0)
        {
          res.status(500).json({
            success:false, 
            isAuth:true,
            message: 'Invalid input fields',
            result:[]
          });
        }
        else{
          user.save().then(result=>{
            User.findById(uid).then(user=>{
              var response = {
                uid: uid,
                gender: user.gender,
                dob: user.dob,
                location: user.location,
                profession: user.profession,
                organizationType: user.organizationType,
                organizationName: user.organizationName
              }
              res.status(500).json({
                success:true, 
                isAuth:result.isAuth,
                message: "user details updated successfully!",
                result:response
              }); 
            })
        
         
          })
        }
     
      }).catch(function (error) {
        res.status(500).json({
          success:false, 
          isAuth:false,
          message: error.message,
          result:[]
        });
      });
    }
    else{
      res.status(500).json({
        success:false, 
        isAuth:user.isAuth,
        message:"Input field with empty value is not valid",
        result:[]
      }); 
    }
    
  }
  catch (err) {
    const errorMessage = err.message;
    res.status(500).json({
      success:false, 
      isAuth:user.isAuth,
      message: errorMessage,
      result:[]
    }); 
  }
   
}

const showwelcomeMessage =async (req, res, next) => {
  res.json('This is elRed Dev API'); 
}
   
module.exports = {
   verifyUser,
   postUserInfo,
   patchUserInfo,
   showwelcomeMessage
}