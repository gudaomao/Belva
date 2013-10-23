Author = require('../models/author.js');

module.exports  = function(app){
    app.get('/',function(req,res){
        console.log('/');
        res.render('index',{});
    });
    app.get('/author',function(req,res){
        console.log('/author');
        var au = req.param("t");
        Author.get(au,function(err,docs){
            if(docs){
                res.send(docs);
            }
        });
    });
    app.post('/save',function(req,res){
        console.log('/save');
        var name = req.param('au');
        var searchname = req.param('searchname');
        var au = new Author(name, searchname,'','');
        au.save(function(err){
            var r = {msg:'ok'};
            if(err){
                r.msg = err;
            }
            res.send(r);
        });
    });
    app.post('/add/:item',function(req,res){
        console.log('/add/'+req.params.item);
        console.log('param name:'+req.param('name'));
        console.log('param value:'+req.param('v2'));

        var item = req.params.item;
        var name = req.param('name');
        var v1 = req.param('v1');
        var v2 = req.param('v2');
        switch(item){
            case "tel":
                Author.addtel(name,v1,v2,function(err){
                    console.log('add tel server ok');
                    if(err){
                        res.send(err);
                    }else{
                        res.send('');
                    }
                });
                break;
        }
    });
    app.post('/delattr',function(req,res){
        console.log('common delete ...');
        var name = req.param('name');
        console.log("name:"+name);
        var p = req.param('con');
        console.log('con:');
        console.log(p);
        Author.delAttr(name, p,function(err){
            console.log('del over.');
            console.log(err);
            if(err){
                res.send(err);
            }
            res.send('');
        });
    });
};