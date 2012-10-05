define(function(require, exports, module) {
    var Base = require("../base");
    
    var Data_obj = {
        data : {},
        set : function( data_name, data ){
            if( data_name in this.data){
                console.log( data_name , "already in data");
                return false;
            }
            this.data[data_name] = data;
            return data;
        },
        get : function( data_name ){
            if( !(data_name in this.data)){
                return false;
            }
            return this.data[data_name];
        },
        remove : function( data_name ){
            if( data_name in this.data ){
                delete this.data[data_name];
            }
            return true;
        }
    }
    
    
    Base.plug( "Data", Data_obj );
});