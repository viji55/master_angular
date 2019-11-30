var express = require('express');
var router = express.Router();
var app = express();
var connection = require('.././config/database');
var sequelize = require('.././config/sequelize_config'); 

module.exports = {
  INSERT: function (res, data, table, condFlag, condition, callback) {
    if (condFlag == true) {
      var condSql = " WHERE " + condition;
    } else {
      condSql = " ";
    }
    var sql = "INSERT INTO " + table + " SET ? " + condSql;
    connection.query(sql, [data], function (err, result) {
      if (err) {
        console.log(err);
        callback({ status: 400, message: 'Error' });
      } else {
        callback({ status: 200, message: 'Success', id: result.insertId, result: result });
      }
    });
  },
  GET: function (res, sql, callback) {
    connection.query(sql, function (err, result) {
      if (err) {
        console.log(err);
        callback({ status: 400, message: 'Error' });
      } else {
        callback({ status: 200, message: 'Success', result: result });
      }
    });
  },
  GETONE: function () {
    // whatever
  },
  EDIT: function () {
    // whatever
  },
  UPDATE: function (res, data, table, col, id, callback) {
    var sql = "UPDATE " + table + " SET ? WHERE "+col+" = "+id;
    connection.query(sql, [data], function (err, result) {
      if (err) {
        console.log(err);
        callback({ status: 400, message: 'Error' });
      } else {
        callback({ status: 200, message: 'Success', result: result });
      }
    });
  },
  DELETE: function (res, sql, callback) {
    connection.query(sql, function (err, result) {
      if (err) {
        console.log(err);
        callback({ status: 400, message: 'Error' });
      } else {
        callback({ status: 200, message: 'Success', result: result });
      }
    });
  },
  GETIMAGE: function (res, sql, callback) {
    connection.query(sql, function (err, result) {
      if (err) {
        console.log(err);
        callback({ message: 'Error' });
      } else {
        callback(result);
      }
    });
  },
};