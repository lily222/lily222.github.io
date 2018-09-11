/*
* 应用程序启动文件
* */

//加载express模块
var express = require('express');
//加载模板处理模块
var swig = require('swig');
//加载数据库模块
var mysql = require('mysql');
//加载body-parser，用来处理post提交过来的数据
var bodyParser = require('body-parser');
//加载cookie
var Cookies = require('cookies');
var cookieParser =require('cookie-parser');
//创建app应用 => NodeJS Http.createServer();
var app = express();



//设置静态文件托管
app.use('/public',express.static(__dirname + '/public'));

//配置应用模板
//定义当前应用所使用的模板引擎
//第一个参数：模板引擎的名称，同时也是文件的后缀，第二个参数表示用于解析处理模板内容的方法
app.engine('html',swig.renderFile);
//设置模板文件存放的目录，第一个参数是views，第二个参数为目录
app.set('views','./views');
//注册所使用的模板引擎,第二个参数为app.engine的模板引擎名称
app.set('view engine','html');
//取消模板缓存
swig.setDefaults({cache:false});

//bodyParser设置
app.use(bodyParser.urlencoded({extended:true}));


// app.get('/',function (req,res,next) {
//
//     /*
//     * 读取views目录下的指定文件，解析并返回给客户端
//     * 第一个参数：表示模板的文件，相对于views目录
//     * 第二个参数：传递给模板的数据
//     * */
//     res.render('index');
// })

//划分不同的模块
app.use('/page',require('./routers/page'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

//设置cookie
app.use(function (req,res,next) {
   req.cookies = new Cookies(req,res);
   next();
});
app.use(cookieParser());










//监听http请求
app.listen(8081);