var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var router = express.Router();
var bodyParser = require('body-parser');
var cors = require('cors');

const connection = require('./config/database');
const config = require('./config/config');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT;
console.log(port);

//routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var teachersRouter = require('./routes/teachers');
var productsRouter = require('./routes/products');
var customerRouter = require('./routes/customer');
var ordersRouter = require('./routes/orders');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + 'public/images'));


app.use(logger('dev'));
//for image upload to accept large files
app.use(express.json( {limit : '50mb' }));
app.use(express.urlencoded({limit: '50mb'}));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//
//app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//cors
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/teachers',tokenCheck,teachersRouter);
app.use('/products', productsRouter);
//checking token from headers for each request[tokenCheck]
app.use('/customer',tokenCheck,customerRouter);
app.use('/orders',ordersRouter);


// Add Headers
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Origin', process.env.NG_HOST);
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'x-account, accept, access-control-request-origin');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});



// caching disabled for every route
app.use(function (req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});


function tokenCheck(req, res, next) { console.log('checktoken');
  // To get tokenHeader from header sent from client side
  var tokenHeader = req.headers['authorization'];  
  console.log(tokenHeader);
  // To get User id from header sent from client side
  // const headerUserId = req.headers['userid']
  if (tokenHeader) {
     req.token = tokenHeader;
     jwt.verify(tokenHeader,config.secret, function(err, data){
          if(err){
              console.log('Error message',err.message)
              return res.json({ status: 501, message: 'No Authorization.' });
          }
          else{
              // console.log(data);
              // if(data.id == headerUserId){
                  next();
              // }
              // else{
                  // return res.json({ status: 501, message: 'No Authorization.' });                    
              // }
              
          }
     })
  } else {
      return res.json({ status: 501, message: 'No Authorization.' });
  }
}

app.listen(port);
console.log("This listing port is " + port);
