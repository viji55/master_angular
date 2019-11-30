var express = require('express');
var router = express.Router();
var app = express();
var async = require('async');
var connection = require('.././config/database');
var sequelize = require('.././config/sequelize_config');
//const importSettings = require('.././model/importSettings.js');

module.exports = {
  CHECK: function (res, sql, callback) {
    connection.query(sql, function (err, result) {
      if (err) {
        console.log(err);
        callback({ "status": 400, "message": 'Error' });
      } else {
        callback({ "status": 200, "message": 'Success', "length": result.length, "result": result });
      }
    });
  },
  decodeBase64Image: async (dataString, callback) => {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};
    if (matches.length !== 3) {
      var err = new Error('Invalid input string');
      await callback(err);
    }
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    await callback(response);
  },
  query: function ( sql, args ) {
    return new Promise( ( resolve, reject ) => {
        connection.query( sql, args, ( err, rows ) => {
            if ( err )
                return reject( err );
            let result = JSON.parse(JSON.stringify(rows));    
            resolve( result);
        } );
    } );
  },
  // insertImportSetting: function ( sql, args ) {
  //   connection.query( sql, args, ( err, rows ) => {
  //     if ( err )
  //         return reject( err );
  //         let result = JSON.parse(JSON.stringify(rows));    
  //           resolve( result);
  // });
  // } 
};