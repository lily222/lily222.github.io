var express = require('express');
var router = express.Router();
var Mysql = require('../db/Connect');
//加载上传图片的模块
var multer = require('multer');
var path = require('path');
/*
* 关于用户账号的api
* */

//查询手机号码是否已经注册
router.post('/user/register/phone',function (req,res,next) {
    var sql = 'SELECT UserPhone FROM user';
    Mysql.connection.query(sql,function (err,result) {
        if(err){
            console.log('数据库查询失败');
            return;
        }
        // console.log(result[0].UserPhone);
        // console.log(result.length);
        var exit = 0;
        for(var i=0 ;i<result.length;i++){
            if(req.body.phone == result[i].UserPhone){
                res.send({mes:"手机号码已注册"});
                exit=1;
                return;
            }
        }
        if(exit == 0){
            res.send({mes:"手机号码未注册"});
        }
    });

});

//保存注册数据到数据库
router.post('/user/register',function (req,res,next){
    var addUserSql = 'insert into user(UserHead,Username,UserPhone,UserPassword) values(?,?,?,?)';
    var addUserSqlParams = ['/public/img/people.png',req.body.name,req.body.phone,req.body.password];
    Mysql.connection.query(addUserSql,addUserSqlParams,function (err,result) {
        if(err){
            console.log('数据库添加用户失败',err.message);
            res.send({mes:"注册失败"});
            return;
        }else {
            console.log(result);
            res.send({mes:"注册成功"});
        }
    });

});

//登录查询
router.post('/user/login',function (req,res,next) {
    var sql = 'SELECT UserPhone,UserPassword FROM user';
    Mysql.connection.query(sql,function (err,result) {
        if(err){
            console.log('数据库登录查询失败');
            return;
        }
        var user_exit = 0;
        for(var i=0 ;i<result.length;i++){
            if(req.body.phone == result[i].UserPhone){
                if(req.body.password == result[i].UserPassword){
                    res.cookie('userMes',{
                        phone:req.body.phone,
                        name:req.body.name
                    });
                    res.send({mes:"登录成功"});

                }else {
                    res.send({mes:"密码错误"});
                }
                user_exit=1;
                return;
            }
        }
        if(user_exit == 0){
            res.send({mes:"账号不存在"});

        }
    });

});

//搜索登录用户信息
router.post('/user/message',function (req,res,next){
    var phone = req.body.phone;
    var sql = 'select * from user where UserPhone =' + phone + ';';
    Mysql.connection.query(sql,function (err,result){
        if(err){
            console.log('数据库登录用户信息查询失败');
            return;
        }
        var userHead = result[0].UserHead;
        if(result[0].UserHead==null || result[0].UserHead == ""){
            userHead = '/public/img/people.png';
        }

        res.send({"userHead":userHead,
            "userName":result[0].Username,
            "userAbstract":result[0].UserAbstract,
            "userID":result[0].UserID
            //resultDate:result
        });
    });
});
//修改用户简介
router.post('/user/changeAbstract',function (req,res,next) {
    var text = req.body.abstract;
    var phone = req.body.phone;
    var sql = 'UPDATE USER SET UserAbstract = \'' + text + '\' WHERE UserPhone = ' + phone + ';';
    Mysql.connection.query(sql,text,function (err) {
        if(err){
            console.log('数据库修改用户简介失败'+ err.message);
            return;
        }
    })
});

//修改登录密码
router.post('/user/changePassword',function (req,res,next) {
    var new_password = req.body.new_password;
    var phone = req.body.phone;
    var sql = 'UPDATE USER SET UserPassword = \'' + new_password + '\' WHERE UserPhone = ' + phone + ';';
    Mysql.connection.query(sql,new_password,function (err) {
        if(err){
            console.log('数据库修改密码失败'+ err.message);
            res.send({mes:"修改失败"});
            return;
        }
        res.send({mes:"修改成功"});
    })
});
/*
* 保存上传图片
* */
//选择diskStorage存储
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('public/uploads/user'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));//增加了文件的扩展名
    }
});

const upload = multer({storage: storage});
router.post('/user/changeHead', upload.single('picfile'), function(req, res, next) {
    //只处理更新头像
    var filePath = '/public/uploads/user/' + path.basename(req.file.path);
    var phone = req.body.phone;
    var sql = 'UPDATE USER SET UserHead = \"' + filePath + '\" WHERE UserPhone = ' + phone + ';';
    Mysql.connection.query(sql,function (err) {
        if(err){
            console.log('数据库更新头像失败'+ err.message);
            res.send({mes:"更新头像失败"});
            return;
        }
        res.send({mes:"更新头像成功"});
    })
});
router.post('/user/changeName', function(req, res, next) {
    //只处理更新名字
    var name = req.body.name;
    var phone = req.body.phone;
    var sql = 'UPDATE USER SET Username = \"' + name + '\" WHERE UserPhone = ' + phone + ';';
    Mysql.connection.query(sql,function (err) {
        if(err){
            console.log('数据库更新用户名失败'+ err.message);
            res.send({mes:"更新失败"});
            return;
        }
        res.send({mes:"更新成功"});
    })

});

/*
*书单类操作
* */
//添加书单
router.post('/blist/add',function (req,res,next){
    // var addBListSql = "INSERT INTO booklist(BooklistTitle,BooklistEditID,BooklistTime,BooklistTab) VALUES('一个书单',12345678901,2017/4/4,'强强');"
    var addBListSql = "INSERT INTO booklist(BooklistTitle,BooklistEditID,BooklistTime,BooklistTab) VALUES(?,?,?,?);"
    var addBListSqlParams = [req.body.name,req.body.phone,req.body.date,req.body.tabs];
    Mysql.connection.query(addBListSql,addBListSqlParams,function (err) {
        if(err){
            console.log('数据库添加书单失败',err.message);
            res.send({mes:"创建失败"});
        }else {
            res.send({mes:"创建成功"});
        }
    });
});
//添加小说到书单
router.post('/blist/addNovel',function (req,res,next){
    let Sql = "select BLNovelNID from blnovel where BLNovelBID ="+req.body.booklistid+" AND BLNovelNID ="+req.body.novelid+";";
    Mysql.connection.query(Sql,function (err,result) {   //检测小说是否已存在于书单中
        if(err){
            console.log('数据库查询书单小说失败',err.message);
            res.send({mes:"添加失败"});
        }else {
            if(result[0]){
                res.send({mes:"书单中已包含该小说"});
            }else {
                //添加小说到书单
                var addBlNovelSql = "INSERT INTO blnovel(BLNovelNID,BLNovelBID,BLNovelRecom) VALUES(?,?,?);"
                var addBlNovelParams = [req.body.novelid,req.body.booklistid,req.body.recomment];
                Mysql.connection.query(addBlNovelSql,addBlNovelParams,function (err) {
                    if(err){
                        console.log('数据库添加小说到书单失败',err.message);
                        res.send({mes:"添加失败"});
                    }else {
                        res.send({mes:"添加成功"});
                    }
                });
            }
        }
    });
});
//修改书单标签
router.post('/blist/changetab',function (req,res,next) {
    var sql = 'UPDATE booklist SET BooklistTab = "'+ req.body.tab +'" WHERE BooklistID = '+req.body.blistid+';';
    Mysql.connection.query(sql,function (err,result){
        if(err){
            console.log('数据库修改书单标签失败');
            return;
        }
        res.send({mes:"修改成功"});
    });
});
//修改书单标题
router.post('/blist/changetitle',function (req,res,next) {
    var sql = 'UPDATE booklist SET BooklistTitle = "'+ req.body.title +'" WHERE BooklistID = '+req.body.blistid+';';
    Mysql.connection.query(sql,function (err,result){
        if(err){
            console.log('数据库修改书单标签失败');
            return;
        }
        res.send({mes:"修改成功"});
    });
});
//删除书单中的小说
router.post('/blist/deleteNovel',function (req,res,next) {
    var sql = 'delete from blnovel where BLNovelBID='+req.body.blistid+' and BLNovelNID='+req.body.novelid+';';
    Mysql.connection.query(sql,function (err,result){
        if(err){
            console.log('数据库删除书单小说失败');
            res.send({mes:"删除失败"});
            return;
        }
        res.send({mes:"删除成功"});
    });
});
//删除书单
router.post('/blist/delete',function (req,res,next) {
    var sql = 'delete from booklist where BooklistID='+req.body.blistid+';';
    Mysql.connection.query(sql,function (err,result){
        if(err){
            console.log('数据库删除书单失败');
            res.send({mes:"删除失败"});
            return;
        }
        res.send({mes:"删除成功"});
    });
    var deleteCollectsql = 'delete from collect where CollectCID='+req.body.blistid+' and CollectType = "书单";';
    Mysql.connection.query(deleteCollectsql,function (err,result){
        if(err){
            console.log('数据库删除书单，同步删除收藏表中相关数据失败');
            // res.send({mes:"同步删除失败"});
            return;
        }
        // res.send({mes:"同步删除成功"});

    });

});


/*
* 长评类操作
* */
//添加长评
router.post('/comment/add', function(req, res, next) {
    var addLCommentSql = "INSERT INTO lcomment(LCommentNID,LCommentEID,LCommentTime,LCommentGrade,LCommentTitle,LCommentContent) VALUES(?,?,?,?,?,?);"
    var addLCommentSqlParams = [req.body.novelId,req.body.phone,req.body.datetime,req.body.grade,req.body.title,req.body.content];
    Mysql.connection.query(addLCommentSql,addLCommentSqlParams,function (err) {
        if(err){
            console.log('数据库添加长评失败',err.message);
            res.send({mes:"发表失败"});
        }else {
            res.send({mes:"发表成功"});
        }
    });
});
//显示修改长评内容页面
router.post('/comment/message', function(req, res, next) {
    var lCommentid = req.body.lcommentid;

    var searchLCommentSql = "select * from lcomment where LCommentID =" + lCommentid + ";";
    Mysql.connection.query(searchLCommentSql,function (err,result) {
        if(err){
            console.log('数据库查询长评失败',err.message);
            res.send({mes:"获取长评数据失败"});
        }else {
            res.send({commentDate:result[0]});
            // console.log(result[0]);
        }
    });
});
//修改数据库长评
router.post('/comment/change', function(req, res, next) {
    var grade = req.body.grade;
    var lCommentid = req.body.lcommentid;
    var content = req.body.content;
    var title = req.body.title;

    var searchLCommentSql = "UPDATE lcomment SET  LCommentGrade= " + grade + ",LCommentTitle = \'" + title + "\',LCommentContent = \'" + content +"\' WHERE LCommentID = " + lCommentid + ";";
    Mysql.connection.query(searchLCommentSql,function (err,result) {
        if(err){
            console.log('数据库修改长评失败',err.message);
            res.send({mes:"修改失败"});
        }else {
            res.send({mes:"修改成功"});
        }
    });
});
//修改长评有用数
router.post('/comment/chengeLcommentGood', function(req, res, next) {

    var changeSCommentGSql = "UPDATE lcomment SET LCommentGood = "+ req.body.good +" WHERE LCommentID = " + req.body.lcommentid +";"
    Mysql.connection.query(changeSCommentGSql,function (err) {
        if(err){
            console.log('数据库更新长评有用数失败',err.message);
            res.send({mes:"长评更新失败"});
        }else {
            res.send({mes:"长评更新成功"});
        }
    });
});
//修改长评无用数
router.post('/comment/chengeLcommentBad', function(req, res, next) {
    var changeSCommentBSql = "UPDATE lcomment SET LCommentBad = "+ req.body.bad +" WHERE LCommentID = " + req.body.lcommentid +";"
    Mysql.connection.query(changeSCommentBSql,function (err) {
        if(err){
            console.log('数据库更新长评无用数失败',err.message);
            res.send({mes:"长评更新失败"});
        }else {
            res.send({mes:"长评更新成功"});
        }
    });
});
//删除长评
router.post('/comment/delete', function(req, res, next) {
    var deleteLCommentSql = "delete from lcomment where LCommentID = "+req.body.commentid+";";
    Mysql.connection.query(deleteLCommentSql,function (err) {
        if(err){
            console.log('数据库删除长评失败',err.message);
            res.send({mes:"删除失败"});
        }else {
            res.send({mes:"删除成功"});
        }
    });
    var deleteCollectsql = 'delete from collect where CollectCID='+req.body.commentid+' and CollectType = "长评";';
    Mysql.connection.query(deleteCollectsql,function (err,result){
        if(err){
            console.log('数据库删除书单，同步删除收藏表中相关数据失败');
            // res.send({mes:"同步删除失败"});
            return;
        }
        // res.send({mes:"同步删除成功"});

    });
});



/*
* 短评类操作
* */
//添加短评
router.post('/comment/addShortComment', function(req, res, next) {
console.log(req.body.tab);

    var addSCommentSql = "INSERT INTO scomment(SCommentNID,SCommentEID,SCommentTime,SCommentGrade,SCommentContent) VALUES(?,?,?,?,?);"
    var addSCommentSqlParams = [req.body.novelId,req.body.phone,req.body.datetime,req.body.grade,req.body.content];
    Mysql.connection.query(addSCommentSql,addSCommentSqlParams,function (err) {
        if(err){
            console.log('数据库添加短评失败',err.message);
            res.send({mes:"保存失败"});
        }else {
            res.send({mes:"保存成功"});
        }
    });


});
//更新短评点赞数
router.post('/comment/chengeScommentGood', function(req, res, next) {

    var changeSCommentGSql = "UPDATE scomment SET SCommentGood = "+ req.body.good +" WHERE SCommentID = " + req.body.scommentid +";"
    Mysql.connection.query(changeSCommentGSql,function (err) {
        if(err){
            console.log('数据库更新短评点赞数失败',err.message);
            res.send({mes:"短评更新失败"});
        }else {
            res.send({mes:"短评更新成功"});
        }
    });
});


/*
* 收藏类操作
* */
//添加收藏
router.post('/collect/novel', function(req, res, next) {
    let Sql = "select CollectCID from collect where CollectCID ="+req.body.novelid+" AND CollectUID ="+req.body.userid+";";
    Mysql.connection.query(Sql,function (err,result) {   //检测小说是否已收藏
        if (err) {
            console.log('数据库查询收藏失败', err.message);
            res.send({mes: "收藏失败"});
        } else {
            if (result[0]) {
                res.send({mes: "小说已被收藏"});
            } else {
                var addCollectSql = "INSERT INTO collect(CollectCID,CollectUID,CollectType) VALUES(?,?,?);"
                var addCollectParams = [req.body.novelid,req.body.userid,req.body.ctype];
                Mysql.connection.query(addCollectSql,addCollectParams,function (err) {
                    if(err){
                        console.log('数据库小说收藏失败',err.message);
                        res.send({mes:"收藏失败"});
                    }else {
                        res.send({mes:"收藏成功"});
                    }
                });
            }
        }
    });

});






module.exports = router;