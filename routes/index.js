//var Author = require('../models/author.js');
//var User = require('../models/user.js');

var DB = require('../models/db.js');
var fs = require('fs');

module.exports = function(app){
    app.get('/',function(req,res){
        res.render('index',{
            "u":req.session.user
        });
    });
    app.get('/login',function(req,res){
        res.render('login',{});
    });
    app.post('/login',function(req,res){
        var name = req.body.username;
        var pwd = req.body.password;
        DB.User_login(name,pwd,function(err,user){
            if(err){
                console.log('登录出错:');
                console.log(err);
                req.flash('error',err);
                return res.redirect('/login');
            }
            else{
                req.session.user = user.name;
                req.flash('success','登录成功');
                res.redirect('/aulist');
            }
        });
    });
    app.get('/aulist', checkLogin);
    app.get('/aulist',function(req,res){
        var name = req.session.user;
        DB.Author_get_my_author(name,function(err,docs){
            if(err){
                req.flash('error',err);
                return res.redirect('/aulist');
            }
            res.render('aulist',{
                docs:docs,
                user: req.session.user,
                success: req.flash('success').toString(),
                error:req.flash('error').toString()
            });
        });
    });
    app.get('/author/:id',function(req,res){
        var id = req.params.id;
        DB.Author_get(id,function(err,doc){
            if(err){
                req.flash('error',err);
                return res.redirect('back');
            }
            res.render('author',{
                doc:doc,
                user:req.session.user,
                error:req.flash('error').toString(),
                success:req.flash('success').toString()
            });
        });
    });
    app.post('/add',checkLogin);
    app.post('/add',function(req,res){
        var name = req.body.authorname;
        if(name==''){
            req.flash('error','学者名不能为空');
            return res.redirect('back');
        }
        var user = req.session.user;
        DB.Author_add(name,user,function(err,result){
            if(err){
                req.flash('error',err);
                return res.redirect('back');
            }
            res.redirect('/author/'+result);
        });
    });
    app.get('/del',checkLogin);
    app.get('/del/:id',function(req,res){
        var id= req.params.id;
        DB.Author_get(id,function(err,doc){
            if(err){
                res.send(err);
            }
            else{
                var id = doc._id;
                var name = doc.name;
                res.render('delauthor',{
                    auid:id,
                    auname:name
                });
            }
        });
    });
    app.post('/del',checkLogin);
    app.post('/del/:id',function(req,res){
        var id= req.param('id');
        if(id){
            DB.Author_del(id,function(err){
                if(err){
                    res.send(err);
                }
                res.send('');
            })
        }
        else{
            res.send('没有发现有效的学者id');
        }
    });
    app.post('/addattr',function(req,res){
        var aid = req.body.aid;
        var doc = req.body.doc;
        DB.Author_add_Attr(aid,doc,function(err){
            res.send(err);
        })
    });
    app.post('/delattr',function(req,res){
        var aid = req.body.aid;
        var doc = req.body.doc;
        DB.Author_del_Attr(aid,doc,function(err){
            res.send(err);
        });
    });
    app.get('/editworking/:aid/:workingtime',function(req,res){
        var aid = req.params.aid;
        var time = req.params.workingtime;
        DB.Author_get(aid,function(err,doc){
            if(err){
                res.send(err);
            }
            else{
                if(doc.working){
                    var b = false;
                    var wk = null;
                    doc.working.forEach(function(w,index){
                        if(w.time == time){
                            wk = w;
                        }
                    });
                    var d = {};
                    d.aid = aid;
                    d.working = wk;
                    d.name = doc.name;
                    res.render('att/editworking',d);
                }
                else{
                    res.send('no woking.');
                }
            }
        });
    });
    app.post('/editworking',function(req,res){
        var aid = req.body.aid;
        var doc = req.body.doc;
        DB.Author_edit_Working(aid,doc,function(err){
            res.send(err);
        })
    });
    app.post('/delworking',function(req,res){
        var aid = req.body.aid;
        var time = req.body.time;
        DB.Author_del_working(aid,time,function(err){
            res.send(err);
        });
    });
    app.get('/upload/:id',function(req,res){
        var id = req.params.id;
        res.render('upload',{
            id:id
        });
    });
    app.post('/upload',function(req,res){
        var id = req.body.hdid;
        for (var i in req.files) {
            if (req.files[i].size == 0){
                // 使用同步方式删除一个文件
                fs.unlinkSync(req.files[i].path);
            } else {
                //var target_path = './public/images/' + req.files[i].name;
                // 使用同步方式重命名一个文件
                //fs.renameSync(req.files[i].path, target_path);
                DB.File_save(req.files[i].path,id,function(err,fileInfo){
                    res.redirect('/author/'+id)
                });
            }
        }
    });
    app.get('/img/:fn',function(req,res){
        var fn = req.params.fn;
        DB.File_get(fn,function(err,data){
            if(err){
                res.writeHead('404');
            }
            else{
                res.writeHead('200',{"Content-Type":"image/jpg"});
                res.end(data,'binary');
            };
        });
    });
    app.get('/img/au/:au',function(req,res){
         var au = req.params.au;
         DB.File_getImages(au,function(err,files){
            if(err){
//                res.render('uploadresult',{
//                    imgs:[]
//                });
                res.send([]);
            }
            else{
                var imgs = [];
                for(var i=0;i<files.length;i++){
                    imgs.push(files[i].filename);
                }
                res.send(imgs);
//                res.render('uploadresult',{
//                    imgs:imgs
//                });
            }
        });
    });
    function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', '未登录!');
            res.redirect('/login');
        }
        next();
    }
    function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', '已登录!');
            res.redirect('back');
        }
        next();
    }
}