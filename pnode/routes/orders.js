var express = require('express');
var router = express.Router();
const app = express();
const connection = require('.././config/database');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const CRUD = require('../controller/crud');
const COMMON = require('../controller/common');
var waterfall = require('async-waterfall');
var async = require('async');
fs = require('fs');








router.post('/customerAddAddress',  function(req,res, result){
    var data = req.body;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var condFlag = false;
    var condition ='';
    var insertData = {
        name:data.name,
        address:data.address,
        mobile_no:data.mobile_no,
        city:data.city,
        state:data.state,
        customer_id:data.userId,
        address_type:data.address_type,
        pincode:data.pincode,
        country:data.country,
        created_date:date,
        updated_date:date,
        status:1
    }
    
    CRUD.INSERT(res, insertData, 'customer_address', condFlag, condition, async function(result){
        console.log('Address Added');
    res.json({status:200, message:"Address Added"});
    });
});

router.get('/ordersAll' ,function(req,res,nxt){
    var sql = "SELECT * FROM `order` order by created_date desc";
    CRUD.GET(res, sql, function(Res){ console.log(Res);
        res.json(Res);
      });

});


  
router.get('/ordersget',function(req,res,nxt){
    var orderId = req.query.orderId;
    if(!orderId){
      res.json({'status':300, 'message': 'order id not found'})
    }else {
      var sql= "select * from `order` o INNER JOIN `customer` c ON c.id = o.customer_id INNER JOIN `customer_address` ca ON ca.id = o.address_id where o.id=?";
      connection.query(sql,[orderId], function(err, results, rows){
        if(err){
            console.log(err);
            res.json({status:500, message:"something went wrong"});
        }else {
            if(results.length > 0){

                var sql1= "select * from `order_product` op INNER JOIN `products` p ON p.id = op.product_id where op.order_id=?";
                connection.query(sql1,[orderId], function(err, resultss, rows){
                  if(err){
                      console.log(err);
                      res.json({status:500, message:"something went wrong to get products"});
                  }else {
                      if(resultss.length > 0){
                        var sql2= "select * from `order` o INNER JOIN `customer_address` ca ON ca.id = o.shipping_address_id where o.id=?";
                        connection.query(sql2,[orderId], function(err, shippingResult, rows){
                            if(err){
                                console.log(err);
                                res.json({status:500, message:"something went wrong to get shipping"});
                            }else {
                        delete results[0].cust_password;
                        var getFinalData = {
                            orderDetails : results,
                            productDetails : resultss,
                            shippingDetails : shippingResult
                        }
                        res.json({"status":200, "message": 'order Found', "results": getFinalData});
                    }
                    });
                    }
               
                }
                });
          }
        }
        });
    }
  });

  router.post('/ordersStatusUpdate', function(req,res,nxt){
        var data = req.body;
        var orderId = data.orderId;
        var status = data.status;
        var updateData = {
            order_status : status
        }

        CRUD.UPDATE(res, updateData, '`order`', orderId,'id', async function(result){
            console.log('Order status Updated');
          });  
  
          res.json({"status":200, "message": 'Order Updated'}); 
  });




router.post('/customerUpdate',function(req,res,nxt){
  var data = req.body;
  var userId = data.id;
  var updateData = {
    cust_first_name : data.cust_first_name,
    cust_last_name : data.cust_last_name
  }

  var sql= "select cust_first_name,cust_last_name from customer where id=?";
  connection.query(sql,[userId], function(err, results, rows){
    if(err){
        console.log(err);
        res.json({status:500, message:"something went wrong"});
    }else {

      if(results.length > 0){

        CRUD.UPDATE(res, updateData, 'customer', userId,'id', async function(result){
          console.log('User Updated');
        });  

        res.json({"status":200, "message": 'User Found', "results": results}); 
      }
      else {
        res.json({"status":300, "message": 'User not Found'});  
      }

    }
  });
  
});

router.post('/customerStatusUpdate',function(req,res,next){
    var getData =req.body;
    var custId = getData.id;
    var changeStatus= {
      'status' : getData.status
    };

    var sql = "select * from customer where id = ?";
    connection.query(sql,[custId], function(err,result,rows){
      if(err){
        res.json({status:500, message:'something went wrong'})
      }else{
        if(result.length > 0){  
          CRUD.UPDATE(res, changeStatus, 'customer', custId,'id', async function(result){
            console.log('User status Updated');
            res.json({"status":200, "message": 'User Found', "results": result}); 
          });  
        }else {
          res.json({"status":300, "message":'user not found',"results":''})
        }
      }
    });

});



router.get('/customerAll', function(req,res, next){
  let sql = "SELECT * FROM customer order by id desc";
  CRUD.GET(res, sql, function(Res){ console.log(Res);
    res.json(Res);
  });

});

router.post('/customerAdd', function(req,res,next){
  var data = req.body;
  var getEmailID = data.cust_email;
  var condFlag =false;
  var condition='';
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  data.created_date = date;
  var sql= "select cust_email from customer where cust_email=?";
  connection.query(sql,[getEmailID], function(err, results, rows){
    if(err){
        console.log(err);
        res.json({status:500, message:"something went wrong"});
    }else {

      if(results.length > 0){

        res.json({status:300, message:"Email Already Exist", results:''});
      } else {

        CRUD.INSERT(res, data, '`customer`', condFlag,condition, async function(result){
          console.log('Customer Inserted');
          res.json({status:200, message:"Customer Inserted", results:result});
        });

      }

    }
  
});

});

router.delete('/customerDelete', function(req,res,next){
    var customer_id = req.query.cust_id;
    
    var sql = "select * from customer where id=?";
    var sqlDelete = "DELETE from customer where id="+customer_id;
    connection.query(sql,[customer_id], function(err,results,row){
      if(err){
        res.json({status:500,message:"something went wrong"});
      }else{
        if(results.length > 0){
          CRUD.DELETE(res,sqlDelete, function(RES){
          res.json({status:200,message:"Customer found and deleted"});
          });
        }else {
          res.json({status:300,message:"Customer not found"})
        }
      }
    });
});

router.delete('/deleteAllCustomer',function(req,res,next){
  var getId = req.query.ids;
  var conArray = getId.split(',');
  var totalLength = conArray.length;
  console.log(conArray);
  for (var i=0;i<totalLength;i++){

  var sql = "DELETE FROM customer where id ="+conArray[i];

  CRUD.DELETE(res,sql, function(RES){
    
  });

}
res.json({status:200,message:"Customer found and deleted"});
});

router.get('/customerDetails', function(req,res,next){
    var getId = req.query.id;

    var sql= "select cust_first_name,cust_last_name,cust_email from customer where id=?";
    connection.query(sql,[getId], function(err, results, rows){
      if(err){
          console.log(err);
          res.json({status:500, message:"something went wrong"});
      }else {
  
        if(results.length > 0){
          res.json({status:200, message:"Customer found", results:results});
        }else{
          res.json({status:300, message:"Customer not found", results:''});
        }

      }
    });

});


function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};
  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }
  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');
  return response;
}




module.exports = router;
