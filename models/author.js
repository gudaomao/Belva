var mongodb = require('./db');
var settings = require('../settings');

function Author(user,name,searchname){
    this.name = name;
    this.searchname = searchname;
    this.user = user;
}
module.exports = Author;

Author.get_my_author = function(name,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection(settings.authortable,function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.find({
                user:name
            },{
                sort:[['time',-1]],
                limit:10
            }).toArray(function(err,docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,docs);
            });
        });
    });
};
Author.get = function(id,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection(settings.authortable,function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var oid =  new require('mongodb').ObjectID(id);
            collection.findOne({
                "_id":oid
            },function(err,doc){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,doc);
            });
        });
    });
}
Author.add = function(name,user,callback){
    console.log('add author, name:'+name+", user:"+user);
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection(settings.authortable,function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var lname = name.toLowerCase();
            collection.findOne({"searchname":lname},function(err,result){
                if(err){
                    mongodb.close();
                    return callback(err);
                }
                console.log('搜索结果:');
                console.log(result);
                if(result){
                    return callback(null,result._id);
                }
                else{
                    collection.insert({
                        name:name,
                        searchname:lname,
                        user:user,
                        time:new Date().getTime()
                    },{
                        safe:true
                    },function(err,rst){
                        console.log('insert ok.');
                        console.log(rst);
                        mongodb.close();
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
        });
    });
}
Author.addAttr = function(aid,doc,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection(settings.authortable,function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var oid = new require('mongodb').ObjectID(aid);
            collection.update({
                "_id":oid
            },doc,function(err,result){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null);
            });
        });
    });
}
Author.delAttr = function(aid,doc,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection(settings.authortable,function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var oid = new require('mongodb').ObjectID(aid);
            collection.update({
                "_id":oid
            },doc,function(err,result){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null);
            });
        });
    });
}
Author.delAttrSp = function(aid,time,doc,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection(settings.authortable,function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var oid = new require('mongodb').ObjectID(aid);
            collection.update({
                "_id":oid,
                "working.time":time
            },doc,function(err,result){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null);
            });
        });
    });
}