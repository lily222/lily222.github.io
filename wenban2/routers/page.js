/*
* 渲染页面，填充数据库中的数据
* */

var express = require('express');
var router = express.Router();
var Mysql = require('../db/Connect');

//首页热门书单
router.get('/host_blist',function (req,res,next) {
    var sql = 'SELECT BooklistID,BooklistEditID,BooklistTitle,BooklistCover,BooklistGood,BooklistCollect,BooklistTab FROM booklist ORDER BY BooklistGood DESC LIMIT 10;';
    Mysql.connection.query(sql,function (err,result){
        if(err){
            console.log('数据库热门书单查询失败');
            return;
        }
        res.send(result);
    });

});
//首页热门书评
router.post('/host_lcomment',function (req,res,next) {
    let lcommentDate = {};
    var sql = 'SELECT LCommentID,LCommentNID,LCommentEID,LCommentGrade,LCommentTitle,LCommentContent,Novelname,NovelCover FROM lcomment LEFT OUTER JOIN novel ON(NovelID = LCommentNID) LIMIT 10;';
    Mysql.connection.query(sql,function (err,result){
        if(err){
            console.log('数据库热门书评查询失败');
            return;
        }
        lcommentDate = result;
        lcommentDate.forEach(function (item,index) {
            let Sql = 'select Username from user where UserPhone = ' + item.LCommentEID +';';
            Mysql.connection.query(Sql,function (err,result) {
                if (err) {
                    console.log('数据库用户信息查询失败');
                    return;
                }
                lcommentDate[index].username = result[0].Username;  //添加编辑者姓名
                if(index == (lcommentDate.length-1)){
                    res.send(lcommentDate);
                    // console.log(lcommentDate[0]);
                }
            });

        });
    });

});


//排行榜最受关注小说
router.post('/focus_chart',function (req,res,next) {
    //发送最受关注小说排行榜信息
    var sql = 'SELECT NovelID,NovelCover,Novelname,NovelAuthor,NovelGrade,NovelGradeNum FROM novel ORDER BY NovelGradeNum DESC LIMIT 10;';
    Mysql.connection.query(sql,function (err,result){
        if(err){
            console.log('数据库最受关注小说查询失败');
            return;
        }
        let novelDate=result;
        //查询第一名作者名
        var authorsql = 'select Authorname from author where AuthorID = ' + novelDate[0].NovelAuthor + ';';
        Mysql.connection.query(authorsql,function (err,result) {
            if(err){
                console.log('数据库最受关注小说查询第一名小说的作者失败');
                return;
            }
            novelDate[0].authorName = result[0].Authorname; //添加第一名作者名字
            var grade_width = novelDate[0].NovelGrade*10;
            novelDate[0].gradeWidth = grade_width + '%';

            //查询第一名小说的最热门短评
            let scommentsql = 'SELECT SCommentContent FROM scomment WHERE SCommentNID = ' + novelDate[0].NovelID + ' ORDER BY SCommentGood DESC LIMIT 1;';
            Mysql.connection.query(scommentsql,function (err,result) {
                novelDate[0].comment = result[0].SCommentContent;
                // console.log(novelDate[0]);
                res.send({highNovel:novelDate});
            });
        });

    });
});


//类似的小说推荐
router.post('/novel/similer', function(req, res, next) {
    let allDate ={};
    var Sql = "SELECT NovelID,Novelname,NovelAuthor,NovelGrade FROM tab LEFT OUTER JOIN novel ON(NovelID = TabNID) WHERE TabContent = '"+ req.body.tab +"' ORDER BY TabNum DESC LIMIT 5;"
    Mysql.connection.query(Sql,function (err,result) {
        if(err){
            console.log('数据库查询类似的小说失败',err.message);
            res.send({mes:"查询类似的小说失败"});
        }else {
            allDate = result;
            result.forEach(function (item,index) {
                let Sql = "SELECT Authorname from author where AuthorID="+item.NovelAuthor+";"
                Mysql.connection.query(Sql,function (err,result) {    //查询作者名
                    if(err){
                        console.log('数据库查询类似的小说失败',err.message);
                        res.send({mes:"查询类似的小说失败"});
                    }else {
                        if(result[0]){
                            allDate[index].authorname = result[0].Authorname;
                        }else {
                            allDate[index].authorname = "";
                        }
                        var grade_width = allDate[index].NovelGrade*10;
                        allDate[index].gradeWidth = grade_width + '%';
                        if(index == (allDate.length-1)){
                            // console.log(allDate);
                            res.send(allDate);
                        }
                    }
                });
            });
        }
    });
});
//添加到书单，显示用户所有的书单
router.post('/add/showBookList',function (req,res,next) {
    let Sql = "SELECT BooklistTitle,BooklistID from booklist where BooklistEditID='"+req.body.phone+"';"
    Mysql.connection.query(Sql,function (err,result) {
        if(err){
            console.log('数据库查询书单失败',err.message);
            res.send({mes:"查询书单失败"});
        }else {
            // console.log(result);
            res.send(result);
        }
    });
});

/*
* 个人主页
* */
//书单部分
router.post('/personpage/blist',function (req,res,next) {
    var sql = 'select BooklistID,BooklistEditID,BooklistTitle,BooklistCover,BooklistTime from booklist where BooklistEditID='+ req.body.userid +' order by BooklistTime desc limit 3;';
    Mysql.connection.query(sql,function (err,result){
        if(err){
            console.log('数据库个人主页书单查询失败');
            return;
        }
        // result.BooklistTime = new Date(result.BooklistTime).toLocaleString();
        // console.log(result);
        res.send(result);
    });
});
//书评部分
router.post('/personpage/lcomment',function (req,res,next) {
    var sql = 'SELECT LCommentID,LCommentNID,LCommentTitle,LCommentContent,LCommentTime,LCommentGrade,Novelname,NovelCover,NovelID FROM lcomment LEFT OUTER JOIN novel ON(LCommentNID = NovelID) WHERE LCommentEID ='+req.body.userid+' order by LCommentTime desc limit 5;';
    Mysql.connection.query(sql,function (err,result){
        if(err){
            console.log('数据库个人主页书评查询失败');
            return;
        }
        // console.log(result);
        res.send(result);
    });

});
//关注部分
router.post('/personpage/attention',function (req,res,next) {
    var sql = 'SELECT AttentionedUId,UserHead,Username from attention left outer join user on(AttentionedUId = UserPhone) where AttentionUId='+ req.body.userid +';';
    Mysql.connection.query(sql,function (err,result){   //关注了多少人
        if(err){
            console.log('数据库个人主页关注查询失败');
            return;
        }
        // console.log(result);
        let Date = {
            attention:result,
            attentionNum:result.length
        };
        let Sql = "SELECT * from attention where AttentionedUId="+req.body.userid+";";
        Mysql.connection.query(Sql,function (err,result) {   //被多少人关注
            if(err){
                console.log('数据库个人主页被关注查询失败',err.message);
            }else {
                Date.attentionedNum = result.length;
                // console.log(Date);
                res.send(Date);
            }
        });
    });

});


/*
* 书单页面
* */
//列表页面
router.post('/blist/ago',function (req,res,next) {
    var sql = 'SELECT BooklistTitle,BooklistCover,BooklistGood,BooklistCollect,BooklistTab,BooklistID FROM booklist WHERE BooklistTab LIKE "%古色古香%";';
    Mysql.connection.query(sql,function (err,result){
        if(err){
            console.log('数据库古色古香书单查询失败');
            return;
        }
        // console.log(result);
        res.send(result);
    });
});
router.post('/blist/now',function (req,res,next) {
    var sql = 'SELECT BooklistTitle,BooklistCover,BooklistGood,BooklistCollect,BooklistTab,BooklistID FROM booklist WHERE BooklistTab LIKE "%近代现代%";';
    Mysql.connection.query(sql,function (err,result){
        if(err){
            console.log('数据库近代现代书单查询失败');
            return;
        }
        // console.log(result);
        res.send(result);
    });
});
router.post('/blist/future',function (req,res,next) {
    var sql = 'SELECT BooklistTitle,BooklistCover,BooklistGood,BooklistCollect,BooklistTab,BooklistID FROM booklist WHERE BooklistTab LIKE "%幻想未来%";';
    Mysql.connection.query(sql,function (err,result){
        if(err){
            console.log('数据库幻想未来书单查询失败');
            return;
        }
        // console.log(result);
        res.send(result);
    });
});
//详细页面的基本书单信息
router.post('/blist/detailpage/mes',function (req,res,next) {
    var sql = 'SELECT booklist.*,Username FROM booklist LEFT OUTER JOIN USER ON(BooklistEditID = UserPhone) WHERE BooklistID = ' + req.body.blistid+';';
    Mysql.connection.query(sql,function (err,result){
        if(err){
            console.log('数据库查询书单基本信息失败');
            return;
        }
        // console.log(result[0]);
        res.send(result[0]);
    });
});
//详细页面的书单包含的小说信息
router.post('/blist/detailpage/novels',function (req,res,next) {
    let novelsDate =[];
    var sql = 'SELECT blnovel.*,NovelCover,Novelname,NovelAbstract,NovelAuthor,NovelGrade FROM blnovel LEFT OUTER JOIN novel ON(BLNovelNID = NovelID) WHERE BLNovelBID = '+req.body.blistid+' ORDER BY BLNovelID DESC LIMIT 6;';
    Mysql.connection.query(sql,function (err,result){
        if(err){
            console.log('数据库查询书单包含的小说信息失败');
            return;
        }
        // console.log(result);
        novelsDate = result;
        if(result[0]){
            result.forEach(function (item,index) {
                var sql = 'SELECT Authorname from author where AuthorID = '+item.NovelAuthor+';';
                Mysql.connection.query(sql,function (err,result){
                    if(err){
                        console.log('数据库查询书单包含的小说的作者失败');
                        return;
                    }
                    novelsDate[index].authorname = result[0].Authorname;
                    if(index == (novelsDate.length-1)){
                        // console.log(novelsDate);
                        res.send(novelsDate);
                    }
                });
            });
        }else {
            res.send({mes:"该书单无小说"});
        }

    });
});



/*
* 搜索页面
* */
// 搜索小说
router.post('/search/novel',function (req,res,next) {
    var sql = 'SELECT NovelID,Novelname,NovelGrade,NovelGradeNum,NovelTime,NovelAbstract,NovelCover,Authorname FROM novel LEFT OUTER JOIN author ON(NovelAuthor = AuthorID) WHERE Novelname LIKE "%'+ req.body.searchcontent+'%" LIMIT '+req.body.starnum+';';
    Mysql.connection.query(sql,function (err,result){
        if(err){
            console.log('数据库搜索小说失败');
            return;
        }
        if(!result[0]){
            res.send({mes:"无相关的小说"});
        }else {
            // console.log(result);
            res.send(result);
        }
    });
});
// 搜索用户
router.post('/search/user',function (req,res,next) {
    var sql = 'SELECT UserHead,Username,UserAbstract,UserPhone FROM USER WHERE Username LIKE "%'+req.body.searchcontent+'%" LIMIT '+req.body.starnum+';';
    Mysql.connection.query(sql,function (err,result){
        if(err){
            console.log('数据库搜索用户失败');
            return;
        }
        if(!result[0]){
            res.send({mes:"无相关的用户"});
        }else {
            // console.log(result);
            let userDate = result;
            result.forEach(function (item,index) {
                var sql = 'select AttentionID from attention where AttentionedUID='+ item.UserPhone +';';
                Mysql.connection.query(sql,function (err,result){
                    if(err){
                        console.log('数据库个人主页书单查询失败');
                        return;
                    }
                    if(result[0]){
                        userDate[index].attentionedNum = result.length;
                    }else {
                        userDate[index].attentionedNum = 0;
                    }
                    if(index == userDate.length-1){
                        // console.log(userDate);
                        res.send(userDate);
                    }
                });
            });
        }
    });
});
// 搜索作者
router.post('/search/author',function (req,res,next) {
    var sql = 'SELECT AuthorID,AuthorHead,Authorname,AuthorAbstract FROM author WHERE Authorname LIKE "%'+req.body.searchcontent+'%" LIMIT '+req.body.starnum+';';
    Mysql.connection.query(sql,function (err,result){
        if(err){
            console.log('数据库搜索作者失败');
            return;
        }
        if(!result[0]){
            res.send({mes:"无相关的作者"});
        }else {
            // console.log(result);
            let authorDate = result;
            result.forEach(function (item,index) {
                var sql = 'SELECT Novelname FROM novel WHERE NovelAuthor = '+item.AuthorID+' LIMIT 3;';
                Mysql.connection.query(sql,function (err,result){
                    if(err){
                        console.log('数据库搜索作者作品失败');
                        return;
                    }
                    if(result[0]){
                        let product = "";
                        result.forEach(function (item,index) {

                            product = product + "《"+item.Novelname + "》";
                        });
                        authorDate[index].production = product;
                    }else {
                        authorDate[index].production = "无";
                    }
                    if(index == authorDate.length-1){
                        // console.log(authorDate);
                        res.send(authorDate);
                    }
                });
            });
        }
    });
});
// 搜索书评
router.post('/search/comment',function (req,res,next) {
    // console.log(req.body.starnum);
    var sql = 'SELECT LCommentID,LCommentNID,LCommentTitle,LCommentContent,Username FROM lcomment LEFT OUTER JOIN USER ON(LCommentEID = UserPhone) where LCommentTitle like "%'+req.body.searchcontent+'%" LIMIT '+req.body.starnum+';';
    Mysql.connection.query(sql,function (err,result){
        if(err){
            console.log('数据库搜索书评失败');
            return;
        }
        if(!result[0]){
            res.send({mes:"无相关的书评"});
        }else {
            // console.log(result);
            let commentDate = result;
            result.forEach(function (item,index) {
                var sql = 'SELECT Novelname FROM novel WHERE NovelID = '+item.LCommentNID+';';
                Mysql.connection.query(sql,function (err,result){
                    if(err){
                        console.log('数据库搜索作者作品失败');
                        return;
                    }

                    commentDate[index].novelname = result[0].Novelname;

                    if(index == commentDate.length-1){
                        // console.log(commentDate);
                        res.send(commentDate);
                    }
                });
            });
        }
    });
});
// 搜索书单
router.post('/search/blist',function (req,res,next) {
    var sql = 'SELECT BooklistTitle,BooklistID,BooklistEditID,BooklistCover,BooklistTab,Username FROM booklist LEFT OUTER JOIN USER ON(BooklistEditID= UserPhone) where BooklistTitle like "%'+req.body.searchcontent+'%" LIMIT '+req.body.starnum+';';
    Mysql.connection.query(sql,function (err,result){
        if(err){
            console.log('数据库搜索书单失败');
            return;
        }
        if(!result[0]){
            res.send({mes:"无相关的书单"});
        }else {
            // console.log(result);
            let blistDate = result;
            result.forEach(function (item,index) {
                var sql = 'SELECT CollectID FROM collect WHERE CollectCID = '+item.BooklistID+' and CollectType="长评";';
                Mysql.connection.query(sql,function (err,result){
                    if(err){
                        console.log('数据库搜索作者作品失败');
                        return;
                    }

                    blistDate[index].collectNum = result.length;

                    if(index == blistDate.length-1){
                        // console.log(blistDate);
                        res.send(blistDate);
                    }
                });
            });
        }
    });
});



module.exports = router;