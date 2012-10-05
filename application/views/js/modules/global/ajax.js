define(function(require, exports, module) {
    var Base = require("base");
    var _ = require("underscore");
    
    function get( type, res ){
        if( !(type in res ) ){
            return false;
        }
        return res[type];
    }
    
    var Ajax_def = {
        registered_mixin : {},
        parse_response : function( res ){
            return res;
        },
        get_data :function( res ){
            return get( "data", res );
        },
        get_error :function( res ){
            return get( "error", res );
        },
        mixin_request : function( ajax_name, request_data ){
            if( ajax_name in this.registered_mixin){
                _.each(this.registered_mixin[ajax_name], function( callback ){
                    request_data = callback( request_data );
                });
            }
            
            return request_data;
        },
        register_mixin : function( ajax_name, callback ){
            if( !( ajax_name in this.registered_mixin)){
                this.registered_mixin[ajax_name] = [];
            }
            this.registered_mixin[ajax_name].push( callback );
        }
    };

    
    
    return Ajax_def;
});