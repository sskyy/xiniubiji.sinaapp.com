
define(function(require, exports, module) {
    
    var Base = require("base");
    var _ = require("underscore");
    var $ = require("jquery");
    var oServer = require("./note-server");
    var Backbone = require("backbone");
    
    var Server = _.extend({
        get_books_by_type : function( cid ){
            return $.ajax({
               url :"/notes/get_books_by_category",
               data : {cid : cid},
               dataType :"json"
            });
        }
        
    }, oServer);
    
    var books_def = Backbone.Collection.extend({
        initialize : function(){
            
        },
        get_books_by_type : function( type ){
            var _d = $.Deferred();
            var root = this;
            Server.connect( 'get_books_by_type', type.id ).then(function(books){
                root.reset_collection( books );
                _d.resolve( books );
            });
            return _d;
        },
        search : function( name ){
            var root = this;
            Server.connect( 'search_books_by_name', name ).then(function(books){
                root.reset_collection( books );
            });
        },
        next_page : function(){
            
        },
        reset_collection:function( data ){
            var root = this;
            root.reset(data);
            
        }
    });
    
    return books_def;
});