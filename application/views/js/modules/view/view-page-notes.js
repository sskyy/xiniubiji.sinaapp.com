define(function(require, exports, module) {
    var Base = require("base");
    var View = require("./view");
    var $ = require("jquery");
    var Router = require("./view-global-router");
    var Robot = require("../robot/robot");
    var Notes_collection_def = require("../note/note-collection-notes");
    require("./plugin-BB-common-list");
    var Global_ajax = require("../global/ajax");

    var Backbone_common_list = View.create_backbone_with_plugin("BB-common-list");

    var notes_def = Backbone_common_list.View.extend({
        el: '#notes_list',
        collection_notes: new Notes_collection_def(),
        common_list_options: {
            item_class: '.note',
            item_tpl_id: '#tpl-note',
            select_event: 'note_select',
            render_event : 'note_render'
        },
        initialize: function() {
            
        },
        get_notes_by_book: function(book) {
            var root = this;
            this.collection_notes.get_notes_by_book(book).done(function(res) {
                var notes = Global_ajax.get_data(res);
                root.render_common_list( notes );
                Base.Events.trigger("notes_list_render_done", notes);
            });
        },
        note_select: function(note) {
            Base.Events.trigger("page_notes_note_select", note);
        },
        note_render : function( note, $el  ){
            console.log( "======================", note, $el);
            Base.Events.trigger("page_notes_note_render", note, $el );
        }

    });
    
    var robot_def = Robot.extend({
        events : {
            "on_notes_list_render_done" : [Base.Events, "notes_list_render_done"]
        },
        initialize : function(){
            this.view = new Backbone_ae.View();
        },
        on_notes_list_render_done : function( notes ){
            var root = this;
            
            if( notes.length == 0 ){
                var $template = root.view.template_event().render_binded_element({
                    selector:"#tpl-note-list-empty",
                    context : root
                });
                this.say("note-list-result", $template );
            }else{
                this.say("note-list-result", '' );
            }
        }
    });



    var Backbone_ae = View.create_backbone_with_plugin('BB-template-event');
    var page_def = Backbone_ae.View.extend({
        el: '#page_note_list',
        initialize: function() {
            this.notes = new notes_def();
            this.template_event().bind_template_event(this.$el);
        },
        render : function(book){
            this.$el.addClass("page_rendered");
            console.log( " hear page_books_book_select");
            this.show_book( book );
            this.get_notes_by_book( book );
        },
        empty : function(){
            this.$el.removeClass("page_rendered");
        },
        show_book: function(book) {
            var root = this;
            var $write_note_btn = $("<div class='ib'><a class='btn '>写笔记</a></div>").bind("click", function() {
                root._e_write_note.call(root ,$(this), book);
            });
            this.$el.find(".note-book")
                .html(this.template_event().template("#tpl-book", book))
                .append( $write_note_btn);
        }, 
        get_notes_by_book : function( book ){
            this.notes.get_notes_by_book( book );
        },
        _e_write_note : function(){
            Base.Events.trigger("create_param");
        }
    });

    exports.init = function() {
        var page = new page_def();
        var robot = new robot_def();
        Base.Events.bind("page_books_book_select", page.render, page);
        Base.Events.bind("search_book_done", page.empty, page);
        Router.register("page_books_book_select", page.el);
        
    }

});