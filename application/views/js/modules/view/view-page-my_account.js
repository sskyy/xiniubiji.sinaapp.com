define( function(require, exports){
    var Base = require("base");
    var View = require("./view");
    var _ = require("underscore");
    var Router = require("./view-global-router");
    var User_logic = require("../global/user/user-logic-my_account");
    var Global_ajax = require("../global/ajax");
    var Backbone_ae = View.create_backbone_with_plugin('BB-template-event')
        
    var page_def = Backbone_ae.View.extend({
        el: '#page_my_account',
        el_my_notes : '#my_note_list',
        el_my_follows : '#my_follow_list',
        logic : null,
        notes : [],
        initialize: function() {
            this.logic = User_logic;
        },
        render : function(){
            this.$el.addClass("page_rendered");
            Base.Events.trigger("page_rendered");
            this.render_my_notes();
            this.render_my_follows();
        }, 
        render_my_notes : function(){
            var root = this;
            this.logic.my_notes().done(function( res ){
                var notes = Global_ajax.get_data( res );
                root.notes = notes;
                if( notes ){
                    var $books = $();
                    _.each( notes, function( note ){
                        if( ("length" in note.book) &&  note.book.length == 0 ){
                            return;
                        }
                        var $book = root.template_event().render_binded_element({
                            selector: "#tpl-book", 
                            data : note.book,
                            context : root
                        });
                        $books = $books.add( $book );
                        
                    } );
                    
                    root.$el.find( root.el_my_notes ).html( $books );
                }
            });
        },
        render_my_follows : function(){
            var root = this;
            this.logic.my_follows().done(function( res ){
                var notes = Global_ajax.get_data( res );
                root.notes = notes;
                if( notes ){
                    var $notes = $();
                    _.each( notes, function( note ){
                        if( ("length" in note.book) &&  note.book.length == 0 ){
                            return;
                        }
                        var $note = root.template_event().render_binded_element({
                            selector: "#tpl-note-followed", 
                            data : note,
                            context : root
                        });
                        $notes = $notes.add( $note );
                        
                    } );
                    console.log( notes, $notes );
                    
                    root.$el.find( root.el_my_follows ).html( $notes );
                }
            });
        },
        _e_note_click : function( $el ){
            Base.Events.trigger("page_my_account_note_select", $el.data() );
        },
        _e_book_click : function( $el ){
            var book = $el.data();
            _.each( this.notes, function( note ){
                console.log( note.book.id, book.id );
                if( note.book.id == book.id ){
                    Base.Events.trigger("page_my_account_note_select", note );
                } 
            });
        }
    });
    
    exports.init = function(){
        var page = new page_def();
        Base.Events.bind("view_my_account", page.render, page );
        
        Router.register("view_my_account", page.el );
    }
});