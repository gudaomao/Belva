
var settings = require('../settings');
var mongo = require('mongodb');
var mongodb = mongo.Db;
var Server = mongo.Server;
var fs = require('fs');
var ObjectID = mongo.ObjectID;

var db = new mongodb(
    settings.db,
    new Server(
        settings.host,
        settings.port,
        {
            auto_reconnect:true
        }
    ),
    {
        w:1
    }
);
db.open(function(e,d){
    if(e){
        console.log(e);
    }
    else{
        console.log('connected to database :: '+settings.db);
    }
});

var authors = db.collection(settings.authortable);
var users = db.collection(settings.usertable);
var files = db.collection('fs.files');

exports.Author_get_my_author = function(name,callback){
    authors.find({
        user:name
    },{
        sort:[['time',-1]],
        limit:10
    }).toArray(function(err,docs){
            if(err){
                return callback(err);
            }
            return callback(null,docs);
        });
};
exports.Author_get = function(id,callback){
    var oid = new require('mongodb').ObjectID(id);
    authors.findOne({
        "_id":oid
    },function(err,doc){
        if(err){
            return callback(err);
        }
        return callback(null,doc);
    });
};
exports.Author_add = function(name,user,callback){
    var lname = name.toLowerCase();
    authors.findOne({"searchname":lname},function(err,result){
        if(err){
            return callback(err);
        }
        if(result){
            return callback(null,result._id);
        }
        else{
            authors.insert({
                name:name,
                searchname:lname,
                user:user,
                time:new Date().getTime()
            },{
                safe:true
            },function(err,rst){
                if(err){
                    return callback(err);
                }
                if(rst[0]){
                    return callback(null,rst[0]._id);
                }
                return callback(null,'');
            });
        };
    });
};
exports.Author_del = function(id,callback){
    var oid = new require('mongodb').ObjectID(id);
    authors.remove({
        "_id":oid
    },function(err,result){
        if(err){
            return callback(err);
        }
        return callback('');
    });
}
exports.Author_add_Attr = function(aid,doc,callback){
    var oid = new require('mongodb').ObjectID(aid);
    authors.update({
        "_id":oid
    },doc,function(err,result){
        if(err){
            return callback(err);
        }
        return callback(null);
    });
};
exports.Author_del_Attr = function(aid,doc,callback){
    var oid = new require('mongodb').ObjectID(aid);
    authors.update({
        "_id":oid
    },doc,function(err,result){
        if(err){
            return callback(err);
        }
        return callback(null);
    });
};
exports.Author_edit_Working = function(aid,doc,callback){
    var oid = new require('mongodb').ObjectID(aid);
    authors.update({
        "_id":oid,
        "working.time": doc.time
    },{
        "$set":{
            "working.$":doc
        }
    },function(err,result){
        return callback(err);
    })
};
exports.Author_del_working = function(aid,time,callback){
    var oid = new require('mongodb').ObjectID(aid);
    authors.update({
        "_id":oid
    },{
        "$pull":{
            "working":{
                "time":time
            }
        }
    },function(err,result){
        return callback(err);
    });
};
exports.File_save = function(file,auid,callback){
    var extname = file.substring(file.lastIndexOf('.'));
    var gridStore = new mongo.GridStore(db,new ObjectID()+extname,'w',{
        "metadata":{
            "auid":auid
        }
    });
    gridStore.open(function(err,gridStore){
        gridStore.writeFile(file,function(err,fileInfo){
            if(err){
                return callback(err);
            }
            else{
                return callback(null,fileInfo);
            }
        });
    });
};
exports.File_get = function(name,callback){
    var gs = new mongo.GridStore(db,name,'r');
    gs.open(function(err,gs){
        if(err){
            console.log(err);
        }
        else{
            gs.read(function(err,data){
                if(err){
                    return callback(err);
                }
                return callback(null,data);
            });
        }
    });
};
exports.File_getImages = function(au,callback){
    files.find({
        "metadata.auid":au
    }).toArray(function(err,imgs){
            if(err){
                return callback(err);
            }
            return callback(null,imgs);
        });
};

exports.User_save = function(name,pwd,callback){
};
exports.User_login = function(name,pwd,callback){
    return callback(null,{
        "name":name
    });
};

