define( function( require, exports){
    var Base = require("base");
    var $ =require("jquery");
    var _ = require("underscore");
    var View = require("./view");
    var Follow = require("../follow/follow");
    var Ajax = require("../global/ajax");
    require("./plugin-BB-template-event");
    var Backbone_ae = View.create_backbone_with_plugin(['BB-template-event']);


    var follow_view_def = Backbone_ae.View.extend({
        initialize : function() {
            Ajax.register_mixin( "get_notes_by_book", function( request_data ){
                return _.extend( request_data, {
                    "follow_mark":true
                });
            });
        },
        bind_note_follow_btn : function( note, $note ){
            var root = this;
            this.template_event().bind_template_event( $note, {
                context: root,
                data : note
            });
        },
        _e_follow : function( $el, note, e ){
            e.stopPropagation();
            if( !Base.Data.get("user" ) ){
                return Base.Events.trigger("user_need_login");
            }
            var root = this;
           
            if( note.followed ){
                root.unfollow( $( e.target ),note);
            }else{
                $( e.target ).addClass("loading");
                Follow.follow( "note", note ).done( function( res){
                    $(e.target ).removeClass("loading");
                    if( Ajax.get_data(res) ){
                        console.log( e.target );
                        $(e.target).html("取消关注");
                        root.bind_unfollow_event( $(e.target), note );
                    } 
                });
            }
        },
        bind_unfollow_event: function( $el, note ){
            var root =this;
            $el.unbind("click");
            $el.bind("click",function( e ){
                e.stopPropagation();
                root.unfollow.call( root, $el, note );
            });
        },
        unfollow : function( $el, note ){
            if( !Base.Data.get("user" ) ){
                return Base.Events.trigger("user_need_login");
            }
           
            $el.addClass("loading");
            var root = this;
            Follow.unfollow( "note", note ).done( function( res ){
                $el.removeClass("loading");

                if( Ajax.get_data(res) ){
                    $el.html("加关注");
                    root.bind_follow_event( $el, note );
                } 
            });
        },
        bind_follow_event : function( $el, note ){
            var root =this;
            $el.unbind("click");
            $el.bind("click",function( e ){
                root._e_follow( $el, note, e ); 
            });
        }

    });
    
    
    exports.init = function( ){
        var follow_view = new follow_view_def();
        Base.Events.bind("page_notes_note_render", follow_view.bind_note_follow_btn, follow_view );
    }
});