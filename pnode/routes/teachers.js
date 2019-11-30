var express = require('express');
var router = express.Router();
const app = express();

//db connection
var connection = require('../config/database');
const jwt = require('jsonwebtoken');
var config = require('../config/config');
var CRUD = require('../controller/crud');


//quries
router.post('/addTeachers', function(req,res,next){
var data = req.body;
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();


 var insertData = {
    t_designation: data.t_designation,
    t_email:data.t_email,
    t_experience: data.t_experience,
    t_first_name: data.t_first_name,
    t_gender: data.t_gender,
    t_joined_date:date,
    t_last_name: data.t_last_name,
    t_martial_status: data.t_martial_status,
    t_qualification: data.t_qualification,
    t_status:1,
    t_created_date:date,
    t_updated_date:date
 };
//check email if already exist
var sql="select * from teachers where t_email=?";

connection.query(sql,[data.t_email], function(err,results,rows){
    if(err){
        res.json({status:500, message:"something went wrong"});
        
    }
    else{
        if(results.length > 0){
            res.json({status:400, message:"Record found"});     
           
        }else{
            CRUD.INSERT(res,insertData,'teachers',false,'',async function(result){
                console.log('Teachers Added');
              });  
            res.json({status:200, message:"Record not found Teacher added Succesfully"});      
    
        }
    }
        
});

});

router.get('/getProfession', function(req,res,next){
    var sql = "select * from designation order by id asc";
    connection.query(sql,function(err, results, rows){
          if(err){
              console.log(err);
        res.json({status:500, message:"something went wrong"});
          }else {
              if(results.length > 0){
                  res.json({status:200, message:"Records found", result:results});   
                 }else {
                  res.json({status:401, message:"No records found"});
                 }
          }
    
  });
});

router.get('/getQualificationAll', function(req,res,next){
    var sql = "select * from courses order by id asc";
    connection.query(sql,function(err,results,rows)  {
            if(err){
                console.log(err);
                res.json({status:500,message:"something went wrong"});
            }else {
                if(results.length > 0){
                    res.json({status:200, message:'Records found', result : results});
                }else {
                    res.json({status:401, message:"No records found"});
                }
            }
    });
});

router.get('/getQualification', function(req,res,next){
console.log(req);
   var qualificationId = req.query.id;
    var sql="select * from courses where id ="+qualificationId;
    var getResult = promiseQueryGet(sql,{}).
    then(resu => {
         if(resu.length > 0){
            res.json({status:200,message:"Records found",result:resu });
         }else{
            res.json({status:401,message:"Records not found"});
         }  
    })
});

router.get('/allTeachers',function(req,res,next){
    var sql="select * from teachers order by id desc";
    var sql1 = "select * from courses order by id asc";
    //for multiple query to get or insert
    /*var getResult = promiseQueryGet(sql,{}).
    then(res => {
        var getQual = promiseQueryGet(sql1,{}).
        then(ress=>{
            console.log(ress);
            console.log(res);
        });
        
        
    });*/

    var getResult = promiseQueryGet(sql,{}).
    then(resu => {
            if(resu.length > 0){
                res.json({status:200,message:"Records found",result:resu });
            }else {
                res.json({status:401,message:"Records not found"});
            }
    });
    
});

router.get('/getTeachers',function(req,res,next){
    var teachersId = req.query.id;
    var sql="select * from teachers where id ="+teachersId;
    var getResult = promiseQueryGet(sql,{}).
    then(resu => {
         if(resu.length > 0){
            res.json({status:200,message:"Records found",result:resu });
         }else{
            res.json({status:401,message:"Records not found"});
         }  
    })
});


function decodeBase64Image(dataString) {
    
    return dataString;
  }

  function delay(){
    setInterval(()=>{
    },3000);
  }

  async function promiseQueryGet(sql,args){
      return new Promise( (resolve, reject) => {
        connection.query(sql,[args],function(err,results,rows)  {
            if(err){
                reject(err);
            }else{
                
                resolve(results);
              
            }
        });
      });
  }
  

function checkDuplicateValue(value,key,table){


}



module.exports = router;