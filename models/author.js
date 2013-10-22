var mongodb = require('./db');

function Author(name,searchname){
    this.name = name;
    this.searchname = searchname;
}

module.exports = Author;

Author.prototype.save = function(callback){
    var au = {
        name : this.name,
        searchname : this.searchname
    };
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('authors',function(err,collection){
            if(err){
                mongodb.close();
                callback(err);
            }
            collection.insert(au,{safe:true},function(err,author){
                mongodb.close();
                if(err){
                    callback(err);
                }
                callback(null);
            });
        });
    });
};

Author.get = function(name,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('authors',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.find({
                searchname:name
            },{
                limit:20
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
Author.saveorgan = function(name,organ,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('authors',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.count({name:name, "organ.og":organ},function(err,count){
                if(count>0){
                    mongodb.close();
                    callback('机构已存在');
                }
                else{
                    collection.update({name:name},{$addToSet:{organ:{og:organ,tm:"0"}}},function(err,result){
                        mongodb.close();
                        if(err){
                            return callback(err);
                        }
                        return callback(null);
                    });
                }
            });
        });
    });
};
Author.delorgan = function(name,tm,organ,callback){
    console.log("name:"+name);
    console.log("year:"+tm);
    console.log("organ:"+organ);
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('authors',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.update({
                name:name
            },{
                "$pull":{
                    organ:{
                        "og":organ,
                        "tm":tm+""
                    }
                }
            },function(err,result){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null);
            });
        });
    });
};
Author.editorgantime = function(name,tm,og,ntm,callback){
   mongodb.open(function(err,db){
       if(err){
           return callback(err);
       }
       db.collection('authors',function(err,collection){
           if(err){
               mongodb.close();
               return callback(err);
           }
           collection.update({
               name:name,
               "organ.og":og,
               "organ.tm":""+tm
           },{
                "$set":{
                    "organ.$.tm":ntm+""
                }
           },function(err,result){
               mongodb.close();
               if(err){
                   return callback(err);
               }
               return callback(null);
           })
       })
   })
}