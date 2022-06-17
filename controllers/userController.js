'use strict';

const req = require('express/lib/request');
const firebase = require('../db');
const User = require('../models/user');
const firestore = firebase.firestore();
var admin = require("firebase-admin");

var serviceAccount = require("../fir-course-76fe1-firebase-adminsdk-cbwmt-a20da17a79.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-course-76fe1-default-rtdb.firebaseio.com"
});

const postSignup = async (req, res, next) => {
    try {

        const user = {
            email: req.body.email,
            password: req.body.password
          }
          const userResponse = await admin.auth().createUser({
            email: user.email,
            password: user.password,
            emailVerified: false,
            disabled: false
          });
          const user1 = new User({
            _id:userResponse.uid,
            email: req.body.email
          });
          user1.save();
          res.json(userResponse);
        
    }  catch(err) {
        const message = err.message;
        const type = err.name;
        res.status(500).json({
            success:false, 
            type: type,
            message: message
        });  
      };
}

const postLogin =async (req, res, next) => {

  try{
    var uid;
     admin.auth().getUserByEmail(req.body.email)
  .then(function(userRecord) {
    // See the tables above for the contents of userRecord
    uid = userRecord.toJSON().uid;
  }).catch(err=>{
    console.log(err);
      });
    firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
    .then(function(result) {
      req.session.isAuth = true;
      req.session.uid = uid;
      req.session.cookie.originalMaxAge = 30 * 10000
 
      res.status(500).json({
        success:true, 
        message: "Logged In  Successfully!",
        result:req.session
    });
     
    }).catch(function (error) 
    {
      res.status(500).json({
        success:false, 
        type:error.code,
        message: error.message

    });
    });
  }
  catch(err){
console.log(err);
  }
 
  }

  const postLogout =async (req, res, next) => {
    try{
      if(req.session.isAuth)
      {
        //req.session.isAuth = false;
        await req.session.destroy();
        res.status(500).json({
          success:true, 
          message: "Logout successfully!",
          result:[]
  
      });
      }
      else{
        res.status(500).json({
          success:false, 
          message: "You have to login first before trying to logout",
          result:[]
  
      });
      }
    
    }
    catch(err){
  console.log(err);
    }
   
    }
 



module.exports = {
   postSignup,
   postLogin,
   postLogout}