define(function(require, exports, module) {
    var $ = require("jquery");
    exports.register = function( data ){
        return $.ajax({
            url : 'users/register',
            data : data,
            dataType :'json'
        });
    }
    
    exports.login = function( data){
        return $.ajax({
            url : 'users/login',
            data : data,
            dataType :'json'
        });
    }
    
    exports.logout = function( data){
        return $.ajax({
            url : 'users/logout',
            data : data,
            dataType :'json'
        });
    }
    
    exports.check_login = function(){
        return   $.ajax({
            url : "users/who_am_i",
            dataType :'json'
        })
    }
});


