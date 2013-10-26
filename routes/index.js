Author = require('../models/author.js');

module.exports  = function(app){
    app.get('/',function(req,res){
        console.log('/');
        res.render('index',{});
    });
    app.get('/author',function(req,res){
        console.log('/author');
        var au = req.param("t");
        Author.get(au,function(err,doc){
            if(doc){
                res.send(doc);
            }
        });
    });
    app.post('/save',function(req,res){
        console.log('/save');
        var user = req.param('user');
        var name = req.param('au');
        var searchname = req.param('searchname');
        var au = new Author(user,name, searchname,'','');
        au.save(function(err){
            var r = {msg:'ok'};
            if(err){
                r.msg = err;
            }
            res.send(r);
        });
    });
    app.post('/delattr',function(req,res){
        console.log('route - /delattr');
        var name = req.param('name');
        var p = req.param('con');
        Author.delAttr(name, p,function(err){
            console.log('del over.');
            console.log(err);
            if(err){
                res.send(err);
            }
            res.send('');
        });
    });
    app.post('/addattr',function(req,res){
        console.log('route - /addattr');
        var name = req.param('name');
        var con = req.param('con');
        console.log('route - con:');
        console.log(con);
        Author.addAttr(name,con,function(err){
            if(err){
                res.send(err);
            }
            res.send('');
        });
    });
    app.get('/getlast',function(req,res){
        console.log('route - /getlast');
        var user = req.param('user');
        Author.getLast(user,function(err,doc){
            if(err){
                res.send(null);
            }
            else{
                res.send(doc);
            }
        });
    });
    app.get('/search',function(req,res){
        console.log('route - /search');
        var t = req.param('t');
        Author.search(t,function(err,docs){
            console.log('search result:');
            console.log(err);
            if(err){
                res.send(null);
            }
            res.send(docs);
        });
    });
    app.get('/getlastten',function(req,res){
        console.log('route - /getlastten');
        var user = req.param('user');
        Author.getLastTen(user,function(err,docs){
            if(err){
                res.send(null);
            }
            res.send(docs);
        })
    })
};