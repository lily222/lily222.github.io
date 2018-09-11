/*
* 连接数据库模块
* */

var mysql = require('mysql');

    //连接数据库
    var connection = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        port:'3306',
        database:'novelcomment'
    });
    connection.connect();

module.exports.connection = connection;