var express = require('express');
var router = express.Router();
const app = express();
const connection = require('../config/database');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const CRUD = require('../controller/crud');
fs = require('fs');

//Quries
router.post('/addcategories', function(req, res, next) {
  
  var data = req.body;
  var name = data.category_name;
  var description = data.category_description;
  var fileType = data.fileType;
  var category_image = data.category_image;
  var uniquImgName = jwt.sign({id : name}, config.secret);
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  if(category_image) {
    var userPic = (category_image !='') ? category_image : '';
    var decodeRes = decodeBase64Image(userPic.toString('ascii'));
    var imageName = uniquImgName + '.' + fileType;
    var imagePath = 'user/'+imageName;
    fs.writeFile('public/images/user/' + imageName , decodeRes.data, function(err){
      console.log(err);
    });
  } else {
    imagePath = null;
  }
 
 
  var cData = {
    category_name : name,
    category_description : description,
    category_image : imagePath,
    created_date : date,
    updated_date : date,
    status: 1
  }

  var sql = "SELECT * from categories where category_name = ?";
  connection.query(sql,[name], function(err, results, rows){
    if(err){
      console.log(err);
      res.json({status:500, message:"something went wrong"});
    } else {
       if(results.length > 0){
        res.json({status:401, message:"Category Name Already Exist"})
       } else {
       CRUD.INSERT(res,cData,'categories',false,'',async function(result){
        console.log('Categories Added');
      });  
        res.json({status:200, message:"Categories Added", item:results})
       }
       console.log(results);
       
    }
  })

});

router.get('/allCategories', function(req,res, next){
  let sql = "SELECT * FROM categories order by id desc";
  CRUD.GET(res, sql, function(Res){ console.log(Res);
    res.json(Res);
  });

});

router.get('/editCategories', function(req,res, next){
  var getId = req.query.id;
  let sql = "SELECT * FROM categories where id = "+ getId;
  CRUD.GET(res, sql, function(Res){
    res.json(Res);
  });

});

router.put('/updateCategories', function(req,res,next){
    var data = req.body;
    var id = data.id;
    var catName = data.category_name;
    var cData = {
        category_name: data.category_name,
        category_description: data.category_description
    }

    var sql = "SELECT * from categories where category_name = ? and id != ?";
    connection.query(sql,[catName,id], function(err, results, rows){
      if(err){
        console.log(err);
        res.json({status:500, message:"something went wrong"});
      } else {
         if(results.length > 0){
          res.json({status:401, message:"Category Name Already Exist"})
         } else {
         CRUD.UPDATE(res,cData,'categories',id,'id', function(result){
          console.log(result);
        });  
          res.json({status:200, message:"Categories Updated", item:results})
         }
         console.log(results);
         
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


//Update user Logo
router.put('/updateCategoriesImg', async (req, res, next) => {
  var data = req.body;
  var id = data.id;
  //Image size reduction.
  if (data.category_image) {
  	var uniqImgName = jwt.sign({ id: data.id }, config.secret);
    var userPic = (data.category_image != '') ? data.category_image : '';
    let decodedRes = await decodeBase64Image(userPic.toString('ascii'));
    //var fileType = data.fileType;
    var fileType = decodedRes.type;
    (fileType.length > 3) ? fileType = fileType.substring(fileType.length - 4).replace(/\./g, '').replace(/\//g, "") : fileType = 'jpg';
    var imageName = uniqImgName + '.' + fileType;
    var imagePath = 'user/' + imageName;
    //console.log(imageName)
    fs.writeFile('public/images/user/' + imageName, decodedRes.data, function (err) {
      console.log(err);
    });
  } else {
    imagePath = null;
  }
  var comp_img = {
    category_image: imagePath,
  }
  var sql = "UPDATE categories SET ? where id = "+id;
  connection.query(sql, [comp_img], function (err, results) {
    if (err) {
      console.log(err);
      res.json('error');
    } else {
      res.json({ status: 200, message: 'Success Cat image updated.', item: results });
    }
  });
});

//remove image
router.post('/removeCategoriesImg', function(req,res){
  var id= req.body.id;
  var cat_image = req.body.category_image;
  var filePath = './public/images/' + cat_image;
  if(fs.existsSync(filePath)){
    fs.unlinkSync(filePath);
  }
  var cat_img = {
    category_image: ''
  }
  var sql = "UPDATE categories SET ? where id = ?";
  connection.query(sql, [cat_img, id], function (err, results) {
    if (err) { console.log(err); res.json(400); }
    else {
      res.json({ status: 200, message: 'Success Cat image removed', item: results });
    }
  });
});

//delete categories
router.delete('/deleteCategories',function(req,res){
  var getId = req.query.cat_id;
  var imgGet = "SELECT category_image FROM categories where id ="+getId;
  var sql = "DELETE FROM categories where id ="+getId;
  CRUD.GET(res,imgGet, function(RES1){
    var catImage = RES1['result'][0].category_image;
    if(catImage!=''){
    var filePath = './public/images/'+catImage;
    if(fs.existsSync(filePath)){
      fs.unlinkSync(filePath);
    }
    }
    CRUD.DELETE(res,sql, function(RES){
      res.json(RES);
    })
  })

});

//delete All categories
router.delete('/deleteAllCategories',function(req,res){
  var getId = req.query.ids;
  var conArray = getId.split(',');
  var totalLength = conArray.length;
  console.log(conArray);
  for (var i=0;i<totalLength;i++){
  var imgGet = "SELECT category_image FROM categories where id ="+conArray[i];
  console.log(imgGet);
  var sql = "DELETE FROM categories where id ="+conArray[i];
  CRUD.GET(res,imgGet, function(RES1){
  console.log(RES1);
    var catImage = RES1['result'][0].category_image;
    if(catImage!=''){
    var filePath = './public/images/'+catImage;
    if(fs.existsSync(filePath)){
      fs.unlinkSync(filePath);
    }
    }
  });

  CRUD.DELETE(res,sql, function(RES){
    console.log(sql);
  });

}

});



module.exports = router;
