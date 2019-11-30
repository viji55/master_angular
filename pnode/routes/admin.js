var express = require('express');
var router = express.Router();
const app = express();
const connection = require('.././config/database');
const jwt = require('jsonwebtoken');
const config = require('../config/config');


//Quries
/* GET admin listing. */
router.post('/login', function(req, res, next) {
  
  var data = req.body;
  var email = data.email;
  var password = data.password;

  var sql = "SELECT * from admin where email = ? and password = ?";
  connection.query(sql,[email,password], function(err, results, rows){
    if(err){
      console.log(err);
      res.json({status:500, message:"something went wrong"});
    } else {
       if(results.length > 0){
         var token = jwt.sign({id:results[0].id}, config.secret,{
          expiresIn:86400
         });
         console.log(token);
         updateAccessToken(res,results[0].id, token);
         console.log(results);
         res.json({status:200, message:"Login Sucess", item:results,token: token})
       } else{
        res.json({status:300, message:"Login failed username or password invalid", item:results});
       }
     
    }
  })

});

function updateAccessToken(res,user_id,token){
  var sql = "UPDATE admin SET ? WHERE id ="+user_id;
  var data = {"access_token": token}
  connection.query(sql, [data], function (err, results, rows){
    if(err){
      console.log('Something went wrong when token update');
      res.json({status : 500, message : "Something went wrong"})
    }else {
      console.log('Token Updated');
    }
  })
}


module.exports = router;
