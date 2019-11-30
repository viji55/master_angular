var mysql = require('mysql');
require('dotenv').config();

var connection =mysql.createConnection({
    host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DATABASE
});

//check connection

connection.connect(function (err){
    if(err){
        connection.end();
        console.log(err);
        return;
    }
    console.log('Database Connected='+process.env.DATABASE);
});

module.exports=connection;