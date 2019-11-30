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



//Quries
/* GET admin listing. */
router.post('/login', function(req, res, next) {
  
  var data = req.body;
  var email = data.cust_email;
  var password = data.cust_password;

  var sql = "SELECT * from customer where cust_email = ? and cust_password = ?";
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
       
       } 
       console.log(results);
       res.json({status:200, message:"Login Sucess", item:results,token: token})
       
    }
  })

});

function updateAccessToken(res,user_id,token){
  var sql = "UPDATE customer SET ? WHERE id ="+user_id;
  var data = {"cust_access_token": token}
  connection.query(sql, [data], function (err, results, rows){
    if(err){
      console.log('Something went wrong when token update');
      res.json({status : 500, message : "Something went wrong"})
    }else {
      console.log('Token Updated');
    }
  })
}



router.post('/customerTempCart', function(req,res,nxt) {
    var data = req.body;
    var products = JSON.stringify(data.cart.userProducts);
    var userId = data.userId;
    var condFlag = false;
    var condition ='';
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    console.log(data.userId);
    var sql = "SELECT * from customer_temp_cart where user_id = ?";
     connection.query(sql,[userId], function(err, results, rows){
            if(err){
                console.log(err);
                res.json({status:500, message:"something went wrong"});
            }else {
                if(results.length > 0){
                var cartDetails = {cart_datas:products}
                CRUD.UPDATE(res, cartDetails, 'customer_temp_cart', userId,'user_id', async function(result){
                                  console.log('Cart Updated');
                        
                                })    
                    
                }else {
                    var cartDetails = {cart_datas:products,user_id:userId,created_date:date}
                CRUD.INSERT(res, cartDetails, 'customer_temp_cart', condFlag, condition, async function(result){
                        console.log('Cart Added');
              
                      });
                }
            }
     });


    res.json({status:200, message:"Cart Added", result:data});
});

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

router.get('/customerALLAddress' ,function(req,res,nxt){
    var data = req.query.userId;
    var userId = data;
    var sql = "SELECT * FROM customer_address WHERE customer_id=?";
    connection.query(sql,[userId], function(err, results, rows){
        if(err){
            res.json({status:500, message:"something went wrong",err:err});
        }else {
            if(results.length > 0){ console.log(results);
                res.json({status:200, message:"Success", result:results});
            } else {
                res.json({status:300, message:"No items found", result:results});
            }
        }
    });

});

router.post('/placeOrder', function(req,res,nxt){
    var data = req.body;
    var getOrderDetails = data.products; 
    var getCustomerId = data.userId;
    var getaddressId = data.caddress[0].caddress;
    var getsaddressId = data.saddress[0].saddress;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    condFlag = false;
    condition='';
    async.waterfall([
        insertOrder,
        insertOrderProducts
    ], function (error,success) {
        if (error) {
           console.log('Error in asyn:' + error);
        }
        else if(success){
          console.log('Everything fine');
          res.json({"status":200, "message": success});
        }
    });

   function insertOrder(sendIdToNxtFun){
    var orderDetails = {
        customer_id : getCustomerId,
        address_id: getaddressId,
        shipping_address_id: getsaddressId,
        order_status : 0,
        delivered_date : date,
        created_date : date,
        updated_date :date
    }

    CRUD.INSERT(res, orderDetails, '`order`', condFlag,condition, async function(result){
        console.log('Order Inserted');
        sendIdToNxtFun(null, result);

      })  

   } 

   function insertOrderProducts(result){
    if(result.status == 200){
        var getOrderId = result.id;
       getOrderDetails.filter(item => {
        console.log(item);
        var getproductDetails = {
            order_id : getOrderId,
            product_id : item.productId,
            product_name : item.productName,
            quantity : item.quantity,
            price : item.price,
            created_date : date,
            updated_date : date
        }

        CRUD.INSERT(res, getproductDetails, '`order_product`', condFlag,condition, async function(result){
            console.log('Order Product Inserted');
    
          })  

       });
       res.json({"status":200, "message": 'Added'}); 
    }
   }
    
});

router.get('/customerProfile',function(req,res,nxt){
  var userId = req.query.userId;
  if(!userId){
    res.json({'status':300, 'message': 'User id not found'})
  }else {
    var sql= "select cust_first_name,cust_last_name,cust_image from customer where id=?";
    connection.query(sql,[userId], function(err, results, rows){
      if(err){
          console.log(err);
          res.json({status:500, message:"something went wrong"});
      }else {
          if(results.length > 0){
            res.json({"status":200, "message": 'User Found', "results": results}); 
          }
        }
      });
  }
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

router.post('/customerImgUpdate', function(req,res,next){
  var data = req.body;
  var userId = data.userId;
  var userImage = data.userImage;
 
  var uploadedImages = [];
  var fileType = data.fileType;
  var uniqueImageName = jwt.sign({id : userId}, config.secret);

  var userPic = (userImage !='') ? userImage : '';
  if(userPic !=''){
  var decodeRes = decodeBase64Image(userPic.toString('ascii'));
  var imageName = uniqueImageName+ '.' + fileType;
  var imagePath = 'profile/'+imageName; 
  var updateData = {
    cust_image : imagePath
  }
  fs.writeFile('public/images/profile/' + imageName , decodeRes.data, function(err){
    console.log(err);
    
    });
    
    CRUD.UPDATE(res, updateData, 'customer', userId,'id', async function(result){
      console.log('User Image Updated');
    });  

    res.json({"status":200, "message": 'User Image Updated', "results": updateData}); 
  }else {
    res.json({status:403,message:'No image selected'});
  }

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

router.get('/getAllCounts', function(req,res,next){
  var id = 0;
  async.waterfall([
    getYears,
    getCustomersBasedYears,
    getOrdersBasedYears,
    getSalesBasesYears
], function (error,success) {
    if (error) {``
       console.log('Error in asyn:' + error);
    }
    else if(success){
      console.log('Everything fine');
      res.json({"status":200, "message": success});
    }
});

function getYears(sendYears){
  var sqlYear = "SELECT YEAR(created_date) as year from customer group by YEAR(created_date)";
  connection.query(sqlYear, function(err, results, rows){
    if(err){
        console.log(err);
        res.json({status:500, message:"something went wrong"});
    }else {

      
        
       // res.json({status:200, message:"Customers found", results:results});
       sendYears(null,results);
    

    }
  });
}

function getCustomersBasedYears(result,sendCustomerCallBack){
  var sqlCustomer = "SELECT count(id) as customerCount,YEAR(created_date) as year from customer group by YEAR(created_date)";
  connection.query(sqlCustomer, function(err, results, rows){
    if(err){
        console.log(err);
        res.json({status:500, message:"something went wrong"});
    }else {

      if(results.length > 0){
       // res.json({status:200, message:"Customers found", results:results});
       var sendAllResult = {
         year : result,
         customer : results
       }
       sendCustomerCallBack(null,sendAllResult)
      }else{
        res.json({status:300, message:"Customers not found", results:''});
      }

    }
  });
}

function getOrdersBasedYears(result,sendOrderCallBack){
  var sqlOrder = "SELECT count(id) as ordersCount,YEAR(created_date) as year from `order` group by YEAR(created_date)";
  connection.query(sqlOrder, function(err, results, rows){
    if(err){
        console.log(err);
        res.json({status:500, message:"something went wrong"});
    }else {

      if(results.length > 0){
       // res.json({status:200, message:"Customers found", results:results});
       var sendAllResult = {
         data : result,
         order : results
       }
       sendOrderCallBack(null,sendAllResult);
      }else{
        res.json({status:300, message:"Customers not found", results:''});
      }

    }
  });
}

function getSalesBasesYears(orderResult){
  var sqlSales = "SELECT count(id) as salesCount,YEAR(created_date) as year from order_product group by YEAR(created_date)";
  connection.query(sqlSales, function(err, results, rows){
    if(err){
        console.log(err);
        res.json({status:500, message:"something went wrong"});
    }else {

      if(results.length > 0){
        console.log(orderResult);
       var sendAllResult = {
         year: orderResult.data.year,
         customer : orderResult.data.customer,
         order : orderResult.order,
         sales : results
       }
       res.json({status:200, message:"Customers found", results:sendAllResult});
      }else{
        res.json({status:300, message:"Customers not found", results:''});
      }

    }
  });
}

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
