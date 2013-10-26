var mongodb = require('./db');

function Author(user,name,searchname){
    this.name = name;
    this.searchname = searchname;
    this.user = user;
}

module.exports = Author;

Author.prototype.save = function(callback){
    console.log('model author.save start');
    var time = new Date().getTime();
    var au = {
        user: this.user,
        name : this.name,
        searchname : this.searchname.toLowerCase(),
        time: time
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
            collection.count({searchname:au.searchname},function(err,count){
                if(count>0){
                    console.log('model author.save end: exist this author');
                    mongodb.close();
                    return callback('Author exist.');
                }
            });
            collection.insert(au,{safe:true},function(err,author){
                console.log('model author.save end: ok');
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
    console.log('model author.get start');
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('authors',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                name:name
            },function(err,doc){
                console.log('model author.get end: ok');
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,doc);
            });
        });
    });
};
Author.search = function(name,callback){
    console.log('model author.search start.');
    if(name == ''){
        return callback(null,'');
    }
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('authors',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            console.log('start search');
            collection.find({
                "searchname":name
            }).toArray(function(err,docs){
                console.log('model author.search end: '+docs.length);
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,docs);
            });
        });
    });
};
Author.addAttr = function(name,doc,callback){
    console.log('model author.addAttr start.');
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
            },doc,function(err,result){
                console.log('model author.addAttr end: ok');
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback('');
            });
        });
    });
};
Author.delAttr = function(name,doc,callback){
    console.log('model author.delAttr start.');
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('authors',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            console.log('doc:');
            console.log(doc);
            collection.update({
                name:name
            },doc,function(err,result){
                console.log('model author.delAttr end: ok');
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback('');
            });
        });
    });
};
Author.getLastTen = function(user,callback){
    console.log('model author.getLastTen start.');
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
                user:user
            },{
                limit:10
            }).toArray(function(err,docs){
                    mongodb.close();
                    console.log('model author.getLastTen end: '+docs.length);
                    if(err){
                        return callback(err);
                    }
                    return callback(null,docs);
            });
        });
    });
};
Author.getLast = function(user,callback){
    console.log('model author.getLast start.');
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
                user:user
            },{
                limit:10
            }).sort({
                    time:-1
                }).toArray(function(err,doc){
                    console.log('model author.getLast end: ok');
                    mongodb.close();
                    if(err){
                        return callback(err);
                    }
                    return callback(null,doc);

            });
        });
    });
};