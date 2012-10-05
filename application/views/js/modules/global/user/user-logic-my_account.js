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
    
    exports.check_login = function(){
        return   $.ajax({
            url : "users/who_am_i",
            dataType :'json'
        })
    }
    
    exports.my_notes = function(){
        return $.ajax({
            url : 'notes/my_notes',
            dataType : 'json'
            
        });
    }
    
    exports.my_follows = function(){
        return $.ajax({
            url : 'follow/my_follows',
            dataType : 'json'
            
        });
    }
});


