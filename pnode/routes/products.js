var express = require('express');
var router = express.Router();
const app = express();
const connection = require('../config/database');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const CRUD = require('../controller/crud');
const COMMON = require('../controller/common');
fs = require('fs');
var waterfall = require('async-waterfall');
var async = require('async');


router.get('/allProducts' , function(req,res,next){

  async.waterfall([
    getproduct,
    productImg,

], function (error,success) {
    if (error) {
       console.log('Error in asyn:' + error);
    }
    else if(success){
      console.log('Everything fine');
      res.json({"status":200, "message": success});
    }
});

function getproduct(productCallBack){

  let sql ="SELECT *,p.id as pproduct_id,pc.category_id, false AS isAddedToCart, 0 as pquantity FROM products p LEFT JOIN product_category pc on pc.product_id = p.id order by p.id desc";
  CRUD.GET(res, sql, function(result){ //console.log(result);
    productCallBack(null, result);
  });
}

function delay() {
  return new Promise(
    resolve => 
    setTimeout(resolve, 300));
}
async function delayedLog(item) {
  // notice that we can await a function
  // that returns a promise
  await delay();
  console.log(item);
}

  function productImg(proResult){
    global.getImages = [];
    var getResultData = proResult.result;
    //console.log(getResultData);
    processArray(getResultData);
    //asynchorons process
    async function processArray(array) {
      for (const item of array) {
        
        let sql ="SELECT image,status,product_id FROM product_images where product_id = "+item.pproduct_id+" and status = 1 order by product_id desc";
        
        CRUD.GETIMAGE(res, sql, function(resultImg){ 
          console.log(resultImg);
          getImages.push({image:resultImg,product:item});
          
        });
        await delayedLog(item);
      }
      console.log('Done!');
      res.json(getImages);
    }
  
  }


function finalValue(){

}


});


router.post('/addProducts', function(req,res,next){
    var data = req.body;
    var product_code = data.product_unique_id;
    var catId = data.product_category;
    var getImages = data.product_image;
    var uploadedImages = [];
    var fileType = data.fileType;
    var uniqueImageName = jwt.sign({id : product_code}, config.secret);
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    condFlag = false;
    condition='';

    
    if(getImages) {
      getCountImages = getImages.length;
     
      for(var i=0;i<getCountImages;i++){ 
      var userPic = (getImages[i].image !='') ? getImages[i].image : '';
      var decodeRes = decodeBase64Image(userPic.toString('ascii'));
      var imageName = uniqueImageName+i + '.' + fileType;
      var imagePath = 'product/'+imageName;
      uploadedImages.push(imagePath); 
      fs.writeFile('public/images/product/' + imageName , decodeRes.data, function(err){
        console.log(err);
        });
      }
    } else {
      imagePath = null;
    }
   
    var productDetails = {
        'product_name' : data.product_name,
        'product_description' : data.product_description,
        'product_price' : data.product_price,
        'product_offer_price' :data.product_offer_price,
        'product_unique_id':data.product_unique_id,
        'product_quantity':data.product_quantity,
        'product_status':'IN STOCK',
        'status': 1,
        'created_date':date,
        'updated_date':date
    }

    async.waterfall([
        productInsert,
        proCatInsert,
        proImagesInsert

    ], function (error,success) {
        if (error) {
           console.log('Error in asyn:' + error);
        }
        else if(success){
          console.log('Everything fine');
          res.json({"status":200, "message": success});
        }
    });


    function productInsert(readFileCallback) {
       
        var codeChk = "SELECT id FROM products WHERE product_unique_id = '" + product_code + "'";
        COMMON.CHECK(res, codeChk, function(chkRes)
        {
          if(chkRes.status == 200 && chkRes.length==0){
            CRUD.INSERT(res, productDetails, 'products', condFlag, condition, async function(result){
              console.log('Product Added');
    
              var sendDatas = {
                'productId' : result.id,
                'catId' : catId
              };
              console.log(sendDatas);
              readFileCallback(null,sendDatas);
            })
          }
          else if(chkRes.status == 200 && chkRes.length > 0){
            res.json({"status":401, "message": 'Product code already exist'});
          }
        });
            
        }


        function proCatInsert(result, processFileCallback) {
            var productId = result.productId;
            var catId = result.catId;
            
              var cpData = {
                product_id: productId,
                category_id: catId,
              }
              
              CRUD.INSERT(res, cpData, 'product_category', condFlag, condition, async function(result){
                console.log('CP Added');
              });

              processFileCallback(null,cpData);
           
          }

          function proImagesInsert(imgResult, finallFileCallback){
            var productId = imgResult.product_id;
            
            uploadedImages.forEach(element => {

              var iData = {
                product_id : productId,
                image : element,
                created_date : date,
                updated_date : date,
                status : 1
              }

              CRUD.INSERT(res, iData, 'product_images', condFlag, condition, async function(result){
                console.log(i+' Images Added');
              });
             
            });
            //finallFileCallback(null,'done');
            res.json({"status":200, "message": 'Added'});

          }



});

router.get('/editProducts', function (req,res, next){
  var getId= req.query.id;

  async.waterfall([
    proGet,
    proImagesGet

], function (error,success) {
    if (error) {
       console.log('Error in asyn:' + error);
    }
    else if(success){
      console.log('Everything fine');
      res.json({"status":200, "message": success});
    }
});


function proGet(sendDatasToImages){

  const sql ='SELECT p.id as product_id, p.product_name,p.product_description,p.product_price,p.product_offer_price,p.product_unique_id,p.product_quantity,p.product_status,p.status,c.category_name,pc.category_id FROM products p LEFT JOIN product_category pc ON p.id = pc.product_id LEFT JOIN categories c ON pc.category_id = c.id Where p.id = '+getId;
  CRUD.GET(res,sql,function(Res){
    console.log(Res);
    //res.json(Res);
    sendDatasToImages(null,Res);
  });

}

function proImagesGet(result){
  var getProId = result.result[0].product_id;
  const sql ='SELECT product_id, image, status FROM product_images Where product_id = '+getProId;
  CRUD.GET(res,sql,function(Res){
    console.log(Res);
    //res.json(Res);
    res.json({"status":200, "productData": result,"Image" : Res});
  });
}

  
});

router.put('/updateProducts', function(req,res,next){
  var data = req.body;
  var id = data.id;

    var product_code = data.product_unique_id;
    var catId = data.product_category;
    var getImages = data.product_image;
    var fileType = data.fileType;
    var uniqueImageName = jwt.sign({id : product_code}, config.secret);
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    condFlag = false;
    condition='';
    console.log(getImages);
    if(getImages) {
      getCountImages = getImages.length;
      for(var i=0;i<getCountImages;i++){
      var userPic = (getImages[i] !='') ? getImages[i] : '';
      var decodeRes = decodeBase64Image(userPic.toString('ascii'));
      var imageName = uniquImgName + '.' + fileType;
      var imagePath = 'product/'+imageName;
      
      fs.writeFile('public/images/product/' + imageName , decodeRes.data, function(err){
        console.log(err);
        });
      }
    } else {
      imagePath = null;
    }
    
    return false;
    var productDetails = {
        'product_name' : data.product_name,
        'product_description' : data.product_description,
        'product_price' : data.product_price,
        'product_offer_price' :data.product_offer_price,
        'product_unique_id':data.product_unique_id,
        'product_quantity':data.product_quantity,
        'updated_date':date
    }

    async.waterfall([
        productInsert,
        proCatInsert
    ], function (error,success) {
        if (error) {
           console.log('Error in asyn:' + error);
        }
        else if(success){
          console.log('Everything fine');
          res.json({"status":200, "message": success});
        }
    });


    // function productInsert(readFileCallback) {
       
    //     var codeChk = "SELECT id FROM products WHERE product_unique_id = '" + product_code + "' and id !="+id;
    //     COMMON.CHECK(res, codeChk, function(chkRes)
    //     {
    //       if(chkRes.status == 200 && chkRes.length==0){
    //         CRUD.UPDATE(res, productDetails, 'products', id,'id', async function(result){
    //           console.log('Product Updated');
    
    //           var sendDatas = {
    //             'productId' : data.id,
    //             'catId' : catId
    //           };
    //           console.log(sendDatas);
    //           readFileCallback(null,sendDatas);
    //         })
    //       }
    //       else if(chkRes.status == 200 && chkRes.length > 0){
    //         res.json({"status":401, "message": 'Product code already exist'});
    //       }
    //     });
            
    //     }


    //     function proCatInsert(result, processFileCallback) {
    //         var productId = result.productId;
    //         var catId = result.catId;
            
    //           var cpData = {
    //             category_id: catId.id,
    //           }
    //           console.log(cpData);
    //           console.log(productId);
    //           CRUD.UPDATE(res, cpData, 'product_category', productId, 'product_id', async function(result){
    //             console.log('CP Updated');
    //             res.json({"status":200, "message": result});
    //           });
           
    //       }



});

//delete categories
router.delete('/deleteProducts',function(req,res){
  var getId = req.query.pro_id;
  var sql = "DELETE FROM products where id ="+getId;
    CRUD.DELETE(res,sql, function(RES){
      res.json(RES);
    })
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