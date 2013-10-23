var mongodb = require('./db');

function Author(name,searchname){
    this.name = name;
    this.searchname = searchname;
}

module.exports = Author;

Author.prototype.save = function(callback){
    var au = {
        name : this.name,
        searchname : this.searchname.toLowerCase()
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
            var n = name.toLowerCase();
            collection.find({
                searchname:n
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
Author.delAttr = function(name,doc,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('authors',function(err,collection){
            if(err){
                mongod.close();
                return callback(err);
            }
            console.log('doc:');
            console.log(doc);
            collection.update({
                name:name
            },doc,function(err,result){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback('');
            });
        });
    });
}