define(function(require, exports, module) {
    
    var Base = require("base");
    var Backbone = require("backbone");
    var _ = require("underscore");
    var $ = require("jquery");
    var oServer = require("./note-server");
    var Ajax = require("../global/ajax");
    
    var Server = _.extend({
        get_notes_by_book : function( book ){
            console.log( "get_notes_by_book",book );
            var data = Ajax.mixin_request( "get_notes_by_book", {book:book});
            return $.ajax({
               url :"/notes/get_notes_by_book",
               data : data,
               dataType :"json"
            });
        }
    }, oServer);
    
    //<--server end
    
    
    var notes = Backbone.Collection.extend({
        initialize : function(){
        },
        get_notes_by_book : function( book ){
            var _d = $.Deferred();
            var root = this;
            Server.connect( 'get_notes_by_book', book ).then(function(notes ){
                root.reset_collection( notes );
                _d.resolve( notes );
            });
            return _d;
        },
        reset_collection:function( data ){
            var root = this;
            root.reset( data );
        }
    });
    
    
    
    return notes;
    
});