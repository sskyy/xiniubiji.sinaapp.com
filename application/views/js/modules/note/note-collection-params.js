define(function(require, exports, module) {
    
    var Base = require("base");
    var Backbone = require("backbone");
    var _ = require("underscore");
    var $ = require("jquery");
    var oServer = require("./note-server");
    var Global_ajax = require("../global/ajax");
    
    var Server = _.extend({
        get_params_by_note : function( note ){
            console.log( "get_params_by_note",note );
            return $.ajax({
               url :"/notes/get_params_by_note",
               data : { note : note },
               dataType :"json"
            });
        }
    }, oServer);
    
    //<--server end
    
    
    var params = Backbone.Collection.extend({
        initialize : function(){
        },
        get_params_by_note : function( note ){
            var root = this;
            Server.connect( 'get_params_by_note', note ).then(function( res ){
                var params = Global_ajax.get_data(res);
                root.reset_collection( params );
            });
        },
        reset_collection:function( data ){
            var root = this;
            root.reset( data );
        }
    });
    
    
    
    return params;
    
});