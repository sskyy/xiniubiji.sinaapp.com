define(function(require, exports){
    var $ = require("jquery");
    var _ = require("underscore");
    var Base = require("base");
    var Robot = require("../robot/robot");
    var View  = require("./view");
    require("../global/element/portamento");
    require("../global/router/jstween-1.1");
    require("./plugin-BB-template-event");
    
    
    function get_clientHeight(){
        return document.documentElement.clientHeight;
    }
    
    var gap = 35; 
    var current_page;
    function scroll_to_page( page_id, duration, position  ){
        console.log( "scroll_to_page", page_id);
        position = position || "top";
        var $page =  $(page_id) ;
        var end;
        if( position == "top"){
            if( !$page.offset() ) {
                end = gap;
            }else{
                end = $page.offset().top - gap;
            }
        }else if( position =='middle'){
            end = ( get_clientHeight() - $page.height() ) / 2
        }

        my_scroll_to( end );
        current_page = $page;
        console.log( "current_page" ,current_page );
        Base.Events.trigger("page_change_done", $page );
    }
    
    var my_scroll_to = function ( end  ){
        console.log( end );
        $( window ).tween({
            scroll:{
                stop: '0px ' + end +"px",
                time: 0,
                duration: 1,
                effect:'easeInOut'
            }
        });
        $.play();
    }

    
    var registered_events = {};
    
    exports.register = function( event_names, page_id ){
        if( !_.isArray( event_names ) ){
            event_names  = [event_names];
        }
        
        _.each( event_names, function(  event_name ){
            if(  event_name in registered_events ){
                console.log( event_name , "has been registered to" ,registered_events[event_name] );
            }else{
                Base.Events.bind( event_name , function(){
                    scroll_to_page(page_id);
                    
                });
                registered_events[event_name] = page_id;
            }

        });
    }
    
    
    var Backbone_ae = View.create_backbone_with_plugin(['BB-template-event']);
    var robot_def = Robot.extend({
        view : new Backbone_ae.View(),
        $els : {},
        current_page : null,
        events : {
            "on_page_change_done" : [Base.Events, "page_change_done"]
        },
        initialize : function(){
            var root = this;
            var $prev = this.view.template_event().render_binded_element({
                selector : "#tpl-nav-btn-top",
                context : root
            });
            root.$els.prev = $prev;
            this.say("global-nav-btn-top", $prev );
        },
        _e_prev_page : function(){
            var $prev = $( this.current_page ).prevAll(".page_rendered").first();
            console.log( "prev page", $prev );
            if( $prev ){
                scroll_to_page( $prev );
            }
        },
        on_page_change_done : function( page_id ){
            this.current_page = page_id;
            if( $(".page").index( page_id ) == 0 ){
                this.$els.prev.hide();
            }else{
                this.$els.prev.show();
            }
        }
    });
    
    
    var inited = false;
    exports.init = function(){
        if( inited ){
            return false
        }
        
        inited = true;
        new robot_def();
        
    }
    
    exports.scroll_to = my_scroll_to;
});


