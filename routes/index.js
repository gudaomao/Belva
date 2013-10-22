Author = require('../models/author.js');

module.exports  = function(app){
    app.get('/',function(req,res){
        res.render('index',{});
    });
    app.get('/author',function(req,res){
        var au = req.param("t");
        console.log('search author:'+au);
        Author.get(au,function(err,docs){
            console.log('docs:'+docs);
            if(docs){
                res.send(docs);
            }
        });
    });
    app.post('/save',function(req,res){
        var name = req.param('au');
        var searchname = req.param('searchname');
        var au = new Author(name, searchname,'','');
        au.save(function(err){
            var r = {msg:'ok'};
            if(err){
                r.msg = err;
            }
            console.log('save new author:'+name);
            res.send(r);
        });
    });
    app.post('/saveorgan',function(req,res){
        var name = req.param('au');
        var og = req.param('og');
        console.log(name+"'s new organ:"+og);
        Author.saveorgan(name,og,function(err){
            if(err){
                res.send(err);
            }
            res.send('');
        })
    });
    app.post('/delorgan',function(req,res){
        var name = req.param('name');
        var year = req.param('yr');
        var organ = req.param('og');
        console.log('del organ:'+name+","+year+','+organ);
        Author.delorgan(name,year,organ,function(err){
            if(err){
                res.send(err);
            }
            res.send("");
        });
    });
};