define(function(require, exports, module) {
    
    var Base = require("base");
    var Backbone = require("backbone");
    var _ = require("underscore");
    var $ = require("jquery");
    var oServer = require("./note-server");
    
    var Server = _.extend({
        get_params_by_note : function(){
            
            return notes;
        }
    }, oServer);
    
    //<--server end
    
    

    
    
    function get_related_book( book_name, data_limit ){
        data_limit = data_limit || {limit:12,offset:0};
        return $.ajax({
            url:'/notes/get_related_book',
            data : {name:book_name, data_limit : data_limit },
            dataType : "json"
        });
    }
    
    function create_new_book(book){
        return $.ajax({
           url : '/notes/add_book',
           data : book,
           dataType : "json"
        });
    }
    
    function create_chapter( chapter ){
        return $.ajax({
            url : "notes/add_chapter",
            data : chapter,
            dataType : "json"
        })
    }
    
    function get_optional_chapters( opt ){
        return $.ajax({
            url : "notes/get_chapters_by_meta",
            data : opt,
            dataType : "json"
        });
    }
    
    function create_param( param ){
        return $.ajax({
            url : "notes/add_param",
            data : param,
            dataType : "json"
        });
    }
    
    exports.get_related_book = get_related_book;
    exports.create_new_book = create_new_book;
    exports.create_chapter = create_chapter;
    exports.get_optional_chapters = get_optional_chapters;
    exports.create_param = create_param;
    
    exports.search_book_in_douban = function( name, data_limit ){
        data_limit = data_limit || {limit:12,offset:0};
        return $.ajax({
            url:'/notes/search_book_in_douban',
            data : {name:name, data_limit : data_limit },
            dataType : "json"
        });
    }
});