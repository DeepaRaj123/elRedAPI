const jwt = require('jsonwebtoken');
const User = require('../models/user');
 
function AuthMiddleware(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
    
  if (token == null) return res.status(401).json({
      success:false, 
      message: "Token should not be empty!",
      result:[]
  });
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err){
      res.status(500).json({
          success:false,
          isAuth:false, 
          message: err,
          result:[]
      });
    } 
    else{
      req.user = user
      const uid = req.user.user;

      User.findById(uid).then(result=>{
        //checking if user is authorised
        if(result.isAuth){
          next();
        }
        else{
          res.status(500).json({
              success:false, 
              isAuth:false,
              message: 'Login to continue',
              result:[]
          }); 
        }
      })
    }
  })
}

module.exports =AuthMiddleware;