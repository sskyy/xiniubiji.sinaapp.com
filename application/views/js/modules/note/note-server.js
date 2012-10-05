define(function(require, exports, module) {
    var $ = require('jquery');
    
    var Server = {
        connect : function( act_name, $args ){
            var _D = $.Deferred();
            if( act_name in this ){
                this[act_name]( $args ).done(function( result ){
                    _D.resolve(result);
                }).fail(function(){
                    _D.reject();
                });
            }else{
                console.log( act_name + " not exsist.");
            }
            return _D;
        }
    };
    
    module.exports = Server;
    
});