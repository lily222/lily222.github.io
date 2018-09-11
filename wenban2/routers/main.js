var express = require('express');
var router = express.Router();
var Mysql = require('../db/Connect');

//首页
router.get('/',function (req,res,next) {
    //发送热门小说数据
    let novelDate = {};
    var sql = 'SELECT NovelID,NovelCover,Novelname,NovelGrade,NovelAbstract,Authorname FROM novel LEFT OUTER JOIN author ON (NovelAuthor = AuthorID) ORDER BY NovelID DESC LIMIT 6;';
    Mysql.connection.query(sql,function (err,result){
        if(err){
            console.log('数据库登录用户信息查询失败');
            return;
        }
        novelDate = result;
        novelDate.forEach(function (item,index) {
            let tabstr="";
            let tabSql = 'select TabContent from tab where TabNID = ' + item.NovelID +';';
            Mysql.connection.query(tabSql,function (err,result) {
                if (err) {
                    console.log('数据库登录用户信息查询失败');
                    return;
                }
                result.forEach(function (v) {
                    tabstr= tabstr + v.TabContent + "/";
                });
                tabstr = tabstr.slice(0,-1);
                novelDate[index].tab = tabstr;
                if(index == (novelDate.length-1)){
                    res.render('main/index',{noves:novelDate});
                    // console.log(novelDate[0]);
                }
            });

        });
    });

});

//排行榜
router.get('/chart',function (req,res,next) {
    //发送高分小说排行榜信息
    var sql = 'SELECT NovelID,NovelCover,Novelname,NovelAuthor,NovelGrade,NovelGradeNum FROM novel ORDER BY NovelGrade DESC LIMIT 10;';
    Mysql.connection.query(sql,function (err,result){
        if(err){
            console.log('数据库高分小说查询失败');
            return;
        }
        let novelDate=result;
        //查询第一名作者名
        var authorsql = 'select Authorname from author where AuthorID = ' + novelDate[0].NovelAuthor + ';';
        Mysql.connection.query(authorsql,function (err,result) {
            if(err){
                console.log('数据库高分小说查询第一名小说的作者失败');
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
                res.render('charts',{highNovel:novelDate});
            });
        });

    });


});

/*
* 用户账号类页面
* */

//注册
router.get('/user/register',function (req,res,next) {
   res.render('register');
});
//登录
router.get('/user/login',function (req,res,next) {
    res.render('login');
});
//自己的个人主页
router.get('/user/mypage',function (req,res,next) {
    let Sql = "SELECT * FROM collect WHERE CollectUID = " + req.query.userID + " and CollectType ='小说' order by CollectID desc limit 3;";
    let collectDate = {};
    Mysql.connection.query(Sql,function (err,result) {   //查询收藏的小说
        if(err){
            console.log('数据库查询收藏失败',err.message);
            res.send({mes:"获取收藏失败"});
        }else {
            collectDate.novel = result;  //collectDate.novel为数组
            // console.log(collectDate.novel);
            result.forEach(function (item,index) {
                let Sql = "SELECT NovelID,NovelCover,Novelname,NovelAbstract,NovelAuthor,NovelGrade,Authorname FROM novel LEFT OUTER JOIN author ON (NovelAuthor = AuthorID) WHERE NovelID = "+item.CollectCID+";";
                Mysql.connection.query(Sql,function (err,result) {   //查询收藏的小说的相关信息
                    if(err){
                        console.log('数据库查询收藏的小说的相关信息失败',err.message);
                        res.send({mes:"查询收藏的小说的相关信息失败"});
                    }else {
                        let gradeWidth = result[0].NovelGrade*10;
                        gradeWidth = gradeWidth+"%";
                        result[0].gradewidth = gradeWidth;
                        collectDate.novel[index].novelmes = result[0];

                        if(index == (collectDate.novel.length-1)){
                            // console.log(collectDate.novel[index].novelmes);

                            let Sql = "SELECT * FROM collect WHERE CollectUID = " + req.query.userID + " and CollectType ='书单' order by CollectID desc limit 4;";
                            Mysql.connection.query(Sql,function (err,result) {   //查询收藏的书单
                                if(err){
                                    console.log('数据库查询收藏的书单失败',err.message);
                                    res.send({mes:"查询收藏的书单失败"});
                                }else {
                                    collectDate.blist = result;  //collectDate.blist为数组
                                    // console.log(result);
                                    result.forEach(function (item,index) {
                                        let Sql = "SELECT BooklistEditID,BooklistTitle,BooklistCover,BooklistGood FROM booklist WHERE BooklistID = "+item.CollectCID+";";
                                        Mysql.connection.query(Sql,function (err,result) {   //查询收藏的书单的相关信息
                                            if(err){
                                                console.log('数据库查询收藏的书单的相关信息失败',err.message);
                                                res.send({mes:"查询收藏的书单的相关信息失败"});
                                            }else {
                                                collectDate.blist[index].blistmes = result[0];

                                                if(index == (collectDate.blist.length-1)){
                                                    // console.log(collectDate.blist[index].blistmes);

                                                    let Sql = "SELECT * FROM collect WHERE CollectUID = " + req.query.userID + " and CollectType ='长评' order by CollectID desc limit 3;";
                                                    Mysql.connection.query(Sql,function (err,result) {   //查询收藏的书评
                                                        if(err){
                                                            console.log('数据库查询收藏的书评失败',err.message);
                                                            res.send({mes:"查询收藏的书评失败"});
                                                        }else {
                                                            collectDate.lcomment = result;  //collectDate.lcomment为数组
                                                            // console.log(result);
                                                            result.forEach(function (item,index) {
                                                                let Sql = "SELECT LCommentNID,LCommentTitle,LCommentContent,LCommentGrade,Novelname,NovelCover FROM lcomment LEFT OUTER JOIN novel ON(LCommentNID = NovelID) WHERE LCommentID ="+item.CollectCID+";";
                                                                Mysql.connection.query(Sql,function (err,result) {   //查询收藏的书评的相关信息
                                                                    if(err){
                                                                        console.log('数据库查询收藏的书评的相关信息失败',err.message);
                                                                        res.send({mes:"查询收藏的书评的相关信息失败"});
                                                                    }else {
                                                                        // console.log(result[0]);
                                                                        let gradeWidth = result[0].LCommentGrade*10;
                                                                        gradeWidth = gradeWidth+"%";
                                                                        result[0].gradewidth = gradeWidth;
                                                                        collectDate.lcomment[index].lcommentmes = result[0];
                                                                        if(index == (collectDate.lcomment.length-1)){
                                                                            // console.log(collectDate.lcomment[0]);
                                                                            res.render('people/my_people',{collect:collectDate});

                                                                        }
                                                                    }
                                                                });
                                                            });

                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    }
                });
            });
        }
    });

});
//他人的个人主页
router.get('/user/peoplepage',function (req,res,next) {
    let Sql = "SELECT * FROM collect WHERE CollectUID = " + req.query.userID + " and CollectType ='小说' limit 3;";
    let collectDate = {};
    Mysql.connection.query(Sql,function (err,result) {   //查询收藏的小说
        if(err){
            console.log('数据库查询收藏失败',err.message);
            res.send({mes:"获取收藏失败"});
        }else {
            collectDate.novel = result;  //collectDate.novel为数组
            // console.log(collectDate.novel);
            result.forEach(function (item,index) {
                let Sql = "SELECT NovelID,NovelCover,Novelname,NovelAbstract,NovelAuthor,NovelGrade,Authorname FROM novel LEFT OUTER JOIN author ON (NovelAuthor = AuthorID) WHERE NovelID = "+item.CollectCID+";";
                Mysql.connection.query(Sql,function (err,result) {   //查询收藏的小说的相关信息
                    if(err){
                        console.log('数据库查询收藏的小说的相关信息失败',err.message);
                        res.send({mes:"查询收藏的小说的相关信息失败"});
                    }else {
                        let gradeWidth = result[0].NovelGrade*10;
                        gradeWidth = gradeWidth+"%";
                        result[0].gradewidth = gradeWidth;
                        collectDate.novel[index].novelmes = result[0];

                        if(index == (collectDate.novel.length-1)){
                            // console.log(collectDate.novel[index].novelmes);

                            let Sql = "SELECT * FROM collect WHERE CollectUID = " + req.query.userID + " and CollectType ='书单' limit 4;";
                            Mysql.connection.query(Sql,function (err,result) {   //查询收藏的书单
                                if(err){
                                    console.log('数据库查询收藏的书单失败',err.message);
                                    res.send({mes:"查询收藏的书单失败"});
                                }else {
                                    collectDate.blist = result;  //collectDate.blist为数组
                                    // console.log(result);
                                    result.forEach(function (item,index) {
                                        let Sql = "SELECT BooklistTitle,BooklistEditID,BooklistCover,BooklistGood FROM booklist WHERE BooklistID = "+item.CollectCID+";";
                                        Mysql.connection.query(Sql,function (err,result) {   //查询收藏的书单的相关信息
                                            if(err){
                                                console.log('数据库查询收藏的书单的相关信息失败',err.message);
                                                res.send({mes:"查询收藏的书单的相关信息失败"});
                                            }else {
                                                collectDate.blist[index].blistmes = result[0];

                                                if(index == (collectDate.blist.length-1)){
                                                    // console.log(collectDate.blist[index].blistmes);

                                                    let Sql = "SELECT * FROM collect WHERE CollectUID = " + req.query.userID + " and CollectType ='长评' limit 3;";
                                                    Mysql.connection.query(Sql,function (err,result) {   //查询收藏的书评
                                                        if(err){
                                                            console.log('数据库查询收藏的书评失败',err.message);
                                                            res.send({mes:"查询收藏的书评失败"});
                                                        }else {
                                                            collectDate.lcomment = result;  //collectDate.lcomment为数组
                                                            // console.log(result);
                                                            result.forEach(function (item,index) {
                                                                let Sql = "SELECT LCommentNID,LCommentTitle,LCommentContent,LCommentGrade,Novelname,NovelCover FROM lcomment LEFT OUTER JOIN novel ON(LCommentNID = NovelID) WHERE LCommentID ="+item.CollectCID+";";
                                                                Mysql.connection.query(Sql,function (err,result) {   //查询收藏的书评的相关信息
                                                                    if(err){
                                                                        console.log('数据库查询收藏的书评的相关信息失败',err.message);
                                                                        res.send({mes:"查询收藏的书评的相关信息失败"});
                                                                    }else {
                                                                        let gradeWidth = result[0].LCommentGrade*10;
                                                                        gradeWidth = gradeWidth+"%";
                                                                        result[0].gradewidth = gradeWidth;
                                                                        collectDate.lcomment[index].lcommentmes = result[0];
                                                                        if(index == (collectDate.lcomment.length-1)){
                                                                            // console.log(collectDate.lcomment[0]);
                                                                            res.render('people/other_people',{collect:collectDate});

                                                                        }
                                                                    }
                                                                });
                                                            });

                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    }
                });
            });
        }
    });
});

//账号设置
router.get('/user/setting',function (req,res,next) {
    res.render('set/setting');
});
//账号密码设置
router.get('/user/passwordset',function (req,res,next) {
    res.render('set/password_set');
});


/*
* 书单类页面
* */
router.get('/booklist',function (req,res,next) {
        let Sql = "SELECT * FROM booklist limit 14";
        Mysql.connection.query(Sql,function (err,result) {   //查询所有书单
            if(err){
                console.log('数据库查询所有书单失败',err.message);
                res.send({mes:"查询所有书单失败"});
            }else {
                res.render('book_list/book_list',{booklist:result});
                // console.log(result);
            }
        });
});

router.get('/booklist/add',function (req,res,next) {
    res.render('book_list/add_blist');
});
// 书单的详情页面,他人的书单页
router.get('/booklist/page',function (req,res,next) {
    let allDate = {};
    //查询热门书单
    var sql = 'SELECT BooklistTitle,BooklistID,BooklistEditID,BooklistGood,Username FROM booklist LEFT OUTER JOIN USER ON(UserPhone = BooklistEditID) ORDER BY BooklistGood DESC LIMIT 6;';
    Mysql.connection.query(sql,function (err,result){
        if(err){
            console.log('数据库热门书单查询失败');
            return;
        }
        // console.log(result);
        allDate.hotblist = result;
        var sql = 'SELECT Username,UserPhone,UserAbstract,UserHead FROM USER WHERE UserPhone='+req.query.userID+';';
        Mysql.connection.query(sql,function (err,result){
            if(err){
                console.log('数据库个人主页书单查询失败');
                return;
            }
            // console.log(result);
            allDate.editor = result[0];
        });
        res.render('book_list/other_page',{alldate:allDate});
    });

});
//自己的书单页
router.get('/booklist/mypage',function (req,res,next) {
    let allDate = {};
    //查询热门书单
    var sql = 'SELECT BooklistTitle,BooklistID,BooklistEditID,BooklistGood,Username FROM booklist LEFT OUTER JOIN USER ON(UserPhone = BooklistEditID) ORDER BY BooklistGood DESC LIMIT 6;';
    Mysql.connection.query(sql,function (err,result){
        if(err){
            console.log('数据库热门书单查询失败');
            return;
        }
        // console.log(result);
        allDate.hotblist = result;
        var sql = 'SELECT Username,UserPhone,UserAbstract,UserHead FROM USER WHERE UserPhone='+req.query.userID+';';
        Mysql.connection.query(sql,function (err,result){
            if(err){
                console.log('数据库个人主页书单查询失败');
                return;
            }
            // console.log(result);
            allDate.editor = result[0];
        });
        res.render('book_list/my_page',{alldate:allDate});
    });

});




/*
* 长评文章类页面
* */
//添加长评页面
router.get('/comment/editLongComment',function (req,res,next) {
    var sql = 'SELECT novel.*,Authorname FROM novel LEFT OUTER JOIN author ON(NovelAuthor = AuthorID) WHERE NovelID = '+req.query.novelID+';';
    Mysql.connection.query(sql,function (err,result) {
        if (err) {
            console.log('数据库添加长评查询小说信息失败');
            return;
        }
        let novel = result[0];

        var sql = 'SELECT TabContent from tab where TabNID= ' + req.query.novelID + ' order by TabNum desc limit 3 ;';
        Mysql.connection.query(sql, function (err, result) {  //查询小说的3个标签
            if (err) {
                console.log('数据库长评的小说标签查询失败');
                return;
            }
            let tab_str = "";
            result.forEach(function (item, index) {
                tab_str = tab_str + item.TabContent + "、";
            });
            tab_str = tab_str.substring(0, tab_str.length - 1);
            novel.tab = tab_str;

            // console.log(novel);
            res.render("comment/edit_comment",{novelDate:novel});
        });
    });
});
//修改长评页面
router.get('/comment/change', function(req, res, next) {
    //接收cookie的phone，修改的长评id
    var searchLCommentSql = "SELECT * FROM lcomment WHERE LCommentID = " + req.query.commentID + ";";
    Mysql.connection.query(searchLCommentSql,function (err,result) {
        if(err){
            console.log('数据库查询长评失败',err.message);
            res.send({mes:"获取长评数据失败"});
        }else {
            let comment = result[0];
            // console.log(result);

            var sql = 'SELECT novel.*,Authorname FROM novel LEFT OUTER JOIN author ON(NovelAuthor = AuthorID) WHERE NovelID = '+comment.LCommentNID+';';
            Mysql.connection.query(sql,function (err,result) {
                if (err) {
                    console.log('数据库修改长评查询小说信息失败');
                    return;
                }
                let novel = result[0];

                var sql = 'SELECT TabContent from tab where TabNID= ' + comment.LCommentNID + ' order by TabNum desc limit 3 ;';
                Mysql.connection.query(sql, function (err, result) {  //查询小说的3个标签
                    if (err) {
                        console.log('数据库长评的小说标签查询失败');
                        return;
                    }
                    let tab_str = "";
                    result.forEach(function (item, index) {
                        tab_str = tab_str + item.TabContent + "、";
                    });
                    tab_str = tab_str.substring(0, tab_str.length - 1);
                    novel.tab = tab_str;

                    // console.log(novel);
                    res.render("comment/edit_comment",{commentDate:comment,novelDate:novel});
                });
            });
        }
    });
});
//显示长评页面
router.get('/comment',function (req,res,next) {
    let allDate = {};
    var sql = 'SELECT lcomment.*,Username FROM lcomment LEFT OUTER JOIN USER ON(LCommentEID = UserPhone) WHERE LCommentID ='+ req.query.commentID +';';
    Mysql.connection.query(sql,function (err,result){
        if(err){
            console.log('数据库长评基本信息查询失败');
            return;
        }
        let gradewidth = result[0].LCommentGrade*10;
        gradewidth = gradewidth + "%";
        result[0].gradewidth = gradewidth;
        let time = new Date(result[0].LCommentTime);
        time = time.getFullYear() + "-" +time.getMonth() + "-" + time.getDay();
        result[0].LCommentTime = time;
        // console.log(result);
        allDate.lcomment = result[0];

        var sql = 'SELECT novel.*,Authorname FROM novel LEFT OUTER JOIN author ON(NovelAuthor = AuthorID) WHERE NovelID = '+allDate.lcomment.LCommentNID+';';
        Mysql.connection.query(sql,function (err,result){
            if(err){
                console.log('数据库长评的小说查询失败');
                return;
            }
            // console.log(result[0]);
            allDate.novel = result[0];

            var sql = 'SELECT TabContent from tab where TabNID= '+allDate.lcomment.LCommentNID+' order by TabNum desc limit 3 ;';
            Mysql.connection.query(sql,function (err,result){  //查询小说的3个标签
                if(err){
                    console.log('数据库长评的小说标签查询失败');
                    return;
                }
                let tab_str = "";
                result.forEach(function (item,index) {
                    tab_str = tab_str + item.TabContent + "、";
                });
                tab_str = tab_str.substring(0,tab_str.length-1);
                allDate.novel.tab = tab_str;

                var sql = 'SELECT LCommentID,LCommentEID,LCommentGrade,LCommentTitle,Username FROM lcomment LEFT OUTER JOIN USER ON(LCommentEID = UserPhone) WHERE LCommentNID = '+allDate.lcomment.LCommentNID+' LIMIT 6;';
                Mysql.connection.query(sql,function (err,result){   //查询更多该小说的长评
                    if(err){
                        console.log('数据库查询更多该小说的长评失败');
                        return;
                    }
                    result.forEach(function (item,index) {
                       let gradewidth = item.LCommentGrade*10;
                       gradewidth = gradewidth + "%";
                       item.gradewidth = gradewidth;
                    });
                    allDate.morelcomment = result;

                    var sql = 'SELECT CollectID from collect where CollectCID= '+req.query.commentID+' and CollectType = "长评";';
                    Mysql.connection.query(sql,function (err,result){  //查询长评的收藏数
                        if(err){
                            console.log('数据库查询长评的收藏数失败');
                            return;
                        }
                        allDate.lcomment.collect = result.length;
                        // console.log(allDate.lcomment);
                        res.render('comment/look_comment',{commentDate:allDate});
                    });
                });
            });
        });
    });

});



/*
* 短评类页面
* */
//添加短评页面
router.get('/comment/addComment',function (req,res,next) {
    var sql = 'SELECT novel.*,Authorname FROM novel LEFT OUTER JOIN author ON(NovelAuthor = AuthorID) WHERE NovelID = '+req.query.novelID+';';
    Mysql.connection.query(sql,function (err,result) {
        if (err) {
            console.log('数据库添加短评查询小说信息失败');
            return;
        }
        let novel = result[0];

        var sql = 'SELECT TabContent from tab where TabNID= ' + req.query.novelID + ' order by TabNum desc limit 3 ;';
        Mysql.connection.query(sql, function (err, result) {  //查询小说的3个标签
            if (err) {
                console.log('数据库添加短评小说标签查询失败');
                return;
            }
            let tab_str = "";
            result.forEach(function (item, index) {
                tab_str = tab_str + item.TabContent + "、";
            });
            tab_str = tab_str.substring(0, tab_str.length - 1);
            novel.tab = tab_str;

            // console.log(novel);
            res.render("comment/edit_shot",{novelDate:novel});
        });
    });
});





/*
* 小说详情页
* */
router.get('/novel',function (req,res,next) {
    var novelid = req.query.novelID || "";
    var allDate = [];
    if(novelid == ""){
        res.send("<h1 style='margin:30px auto'>请输入正确的网址</h1>")
    }else {
        let searchNovelSql = "SELECT * FROM novel where NovelID = " + novelid + ";";
        Mysql.connection.query(searchNovelSql,function (err,result) {  //查询小说内容
            if(err){
                console.log('数据库查询小说失败',err.message);
                res.send({mes:"获取小说数据失败"});
            }else {
                let gradewidth = result[0].NovelGrade*10;
                result[0].gradeWidth = gradewidth+"%";
                allDate['novel'] = result[0];
                var searchAuthorSql = "SELECT * FROM author where AuthorID = " + allDate['novel'].NovelAuthor + ";";
                Mysql.connection.query(searchAuthorSql,function (err,result) {  //查询作者内容
                    if(err){
                        console.log('数据库查询作者失败',err.message);
                        res.send({mes:"获取作者数据失败"});
                    }else {
                        // console.log("作者" +result[0].Authorname);
                        allDate['author'] = result[0];
                        var searchTabSql = "SELECT * FROM tab where TabNID = " + allDate['novel'].NovelID + " order by TabNum desc;";
                        Mysql.connection.query(searchTabSql,function (err,result) {  //查询小说标签内容
                            if(err){
                                console.log('数据库查询小说标签失败',err.message);
                                res.send({mes:"获取小说标签数据失败"});
                            }else {
                                // console.log(result[0].TabContent);
                                allDate['tab'] = result; //此处result为数组
                                var searchScommentSql = "SELECT SCommentID,SCommentEID,SCommentTime,SCommentGrade,SCommentGood,SCommentContent,Username FROM scomment LEFT OUTER JOIN USER ON(UserPhone = SCommentEID) WHERE SCommentNID = "+ allDate['novel'].NovelID +" ORDER BY SCommentTime DESC LIMIT 5;";
                                Mysql.connection.query(searchScommentSql,function (err,result) {  //查询小说短评内容
                                    if(err){
                                        console.log('数据库查询小说短评失败',err.message);
                                        res.send({mes:"获取小说短评数据失败"});
                                    }else {
                                         result.forEach(function (item,index) {
                                             let gradewidth = item.SCommentGrade*10;
                                             item.gradeWidth = gradewidth+"%";
                                             item.SCommentTime = item.SCommentTime.toLocaleString();
                                         });
                                         // console.log(result);
                                        allDate['scomment'] = result; //此处result为数组
                                        var searchLcommentSql = "SELECT LCommentID,LCommentTime,LCommentGrade,LCommentTitle,LCommentContent,LCommentGood,LCommentBad,LCommentEID,UserHead,Username FROM lcomment LEFT OUTER JOIN USER ON(UserPhone = LCommentEID) WHERE LCommentNID = "+ allDate['novel'].NovelID +" ORDER BY LCommentTime DESC LIMIT 3;";
                                        Mysql.connection.query(searchLcommentSql,function (err,result) {  //查询小说长评内容
                                            if(err){
                                                console.log('数据库查询小说长评失败',err.message);
                                                res.send({mes:"获取小说长评数据失败"});
                                            }else {
                                                result.forEach(function (item,index) {
                                                    let gradewidth = item.LCommentGrade*10;
                                                    item.gradeWidth = gradewidth+"%";
                                                    item.LCommentTime = item.LCommentTime.toLocaleString();
                                                });
                                                allDate['lcomment'] = result; //此处result为数组
                                                // console.log(allDate['novel']);
                                                res.render('novel',{alldate:allDate});
                                            }
                                        });

                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});



/*
* 作者详情页面
* */
router.get('/author',function (req,res,next) {
    let allDate =[]; //页面的所有数据
    let searchAuthorSql = "SELECT * FROM author WHERE AuthorID = " + req.query.authorID + ";";
    Mysql.connection.query(searchAuthorSql,function (err,result) { //查询作者信息
        if(err){
            console.log('数据库查询作者失败',err.message);
            res.send({mes:"获取作者数据失败"});
        }else {
            allDate['author'] = result[0];
            let searchNovelSql = "SELECT NovelID,NovelCover,Novelname,NovelTime,NovelGrade FROM novel WHERE NovelAuthor = "+ req.query.authorID +";";
            Mysql.connection.query(searchNovelSql,function (err,result) { //查询作者的小说信息
                if(err){
                    console.log('数据库查询作者的小说失败',err.message);
                    res.send({mes:"获取作者的小说数据失败"});
                }else {
                    result.forEach(function (item,index) {
                        let gradeWidth = item.NovelGrade*10;
                        item.gradewidth = gradeWidth + "%";
                        if(index == (result.length-1)){
                            allDate['novel'] = result;
                        }

                        let tabstr= "";
                        let tabSql = 'select TabContent from tab where TabNID = ' + item.NovelID +' limit 3;';
                        Mysql.connection.query(tabSql,function (err,result) {
                            if (err) {
                                console.log('数据库小说标签查询失败');
                                return;
                            }
                            result.forEach(function (v) {
                                tabstr= tabstr + v.TabContent + "/";
                            });
                            tabstr = tabstr.slice(0,-1);
                            allDate['novel'][index].tab = tabstr;
                            if(index == (allDate['novel'].length-1)){

                                //热门小说推荐
                                let hotnovelSql = 'SELECT NovelID,Novelname,NovelAuthor,NovelGrade,Authorname FROM novel LEFT OUTER JOIN author ON(AuthorID = NovelAuthor) ORDER BY NovelGradeNum DESC LIMIT 5;'
                                Mysql.connection.query(hotnovelSql,function (err,result) {
                                    if (err) {
                                        console.log('数据库热门小说查询失败');
                                        return;
                                    }
                                    result.forEach(function (v) {
                                       let hotgradewidth = v.NovelGrade*10;
                                       v.gradewidth = hotgradewidth +"%";
                                    });
                                    allDate['hotnovel'] = result;
                                    // console.log(allDate['hotnovel']);
                                    res.render('author',{authorAll:allDate});
                                });
                            }
                        });

                    });
                }
            });
        }
    });


});


/*
* 搜索页面
* */
router.get('/search',function (req,res,next) {

    res.render("search",{searchname:req.query.search});
});


module.exports = router;