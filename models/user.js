var mongodb = require('./db');

function User(){

}

module.exports = User;

User.save = function(name,pwd,callback){

};

User.login = function(name,pwd,callback){
    return callback(null,{
        "name":"lls"
    });
};
