const mysql = require('mysql');

module.exports.mysqlconfig = {
    host : "127.0.0.1",
    port : "3306",
    user : "root",
    password : "root",
    database : "mask",
    connectionLimit:100,
    waitForConnections:true
};

module.exports.getPool=function(){
    return mysql.createPool(module.exports.mysqlconfig);
};