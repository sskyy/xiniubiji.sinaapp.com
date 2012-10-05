define(function(require, exports, module) {
    var Base = require("base");
    var Backbone = require("backbone");
    var _ = require("underscore");
    var $ = require("jquery");
    var oServer = require("./note-server");
    var Global_ajax = require("../global/ajax");
    
    var Server = _.extend({
        book_get_all_type : function(){
            
            return $.ajax({
                url:'notes/get_categories/',
                dataType:'json'
            });
        }
    }, oServer);
    
    //<--server end
    
    
    var book_types = Backbone.Collection.extend({
        initialize : function(){
        },
        get_all_type : function( ){
            var root = this;
            var _d = $.Deferred();
            Server.connect( 'book_get_all_type' ).done(function( res ){
                var book_types = Global_ajax.get_data(res );
                root.reset_collection( book_types );
                _d.resolve(root.toJSON() );
            });
            return _d;
        },
        reset_collection:function( data ){
            var root = this;
            root.reset( data );
        }
    });
    
    
    
    return book_types;
});