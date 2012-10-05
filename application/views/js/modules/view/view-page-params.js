define(function(require, exports, module) {
    var Base = require("base");
    var View = require("./view");
    var Robot = require("../robot/robot");
    var Router = require("./view-global-router");
    var $ = require("jquery");
    var _ = require("underscore");
    var Logic_param_create = require("../note/note-logic-param_create");
    var Global_ajax = require("../global/ajax.js");

    require("./plugin-BB-common-list");
    var Params_collection_def = require("../note/note-collection-params");

    var Backbone_common_list = View.create_backbone_with_plugin("BB-common-list");
    var Backbone_ae = View.create_backbone_with_plugin('BB-template-event');

    var params_def = Backbone_common_list.View.extend({
        el: '#param_list',
        note : {},
        collection_params : new Params_collection_def(),
        common_list_options: {
            item_class: 'param',
            item_tpl_id: '#tpl-param',
            select_event: 'param_selected'
        },
        initialize : function(  ){
            this.plugin_initialize();
            this.collection_params.bind("reset", this.show_params, this);
        },
        get_params_by_note : function( note ){
            this.note = note;
            this.collection_params.get_params_by_note( note );
        },
        param_selected : function( param ){
            console.log( "param selected", param );
        },
        show_params : function(){
            console.log(' show_params ' );
            this.render_common_list( this.collection_params.toJSON());
            Base.Events.trigger("params_render_done" , 
                this.$el, this.common_list_options,
                this.get_current_note()
            );
        }, 
        get_current_note : function(){
            return this.note;
        }
    });



    var position_map_def = function( $el, item_class, data_name ){
        this.refresh(  $el, item_class, data_name ); 
        console.log( "position map init", this.data );
        
        this.bind_scroll_event();
        Base.Events.bind("read_chapter", this.scroll_to_chapter , this);
    }
    
    _.extend( position_map_def.prototype, {
        data : [],
        statics : {},
        current_item_index : null,
        is_in_range_flag : false,
        refresh : function($el, item_class, data_name){
            this.calculate_data( $el, item_class , data_name);
        },
        get_clientHeight : function(){
            return document.documentElement.clientHeight;  
        },
        calculate_data : function( $el, item_class, data_name ){
            var root = this;
            $el.find("."+item_class).each(function(){
                var data = {};
                data.top = $(this).offset().top;
                data.bottom = data.top + $(this).height();
                data.item = $(this).data()[data_name];
                data.$el = $(this);
                root.data.push( data );
                
                if( "top" in root.statics ){
                    root.statics.top = data.top < root.statics.top ? data.top : root.statics.top;
                }else{
                    root.statics.top = data.top;
                }
                
                if( "bottom" in root.statics ){
                    root.statics.bottom = data.bottom > root.statics.bottom ? data.bottom : root.statics.bottom;
                }else{
                    root.statics.bottom = data.bottom;
                }
            });
            root.statics.boundary = {
                top : root.statics.top - root.get_clientHeight() /2,
                bottom : root.statics.bottom + root.get_clientHeight() /2
            }
        //            console.log(  root.statics );
        },
        bind_scroll_event : function(){
            var root = this;
            $(window).unbind("scroll.position_map");
            
            $(window).bind("scroll.position_map",function(){
                if( !root.is_in_range() ){
                    if( root.is_in_range_flag ){
                        root.is_in_range_flag = false;
                        Base.Events.trigger("not_reading_param" );
                    }
                    return;
                }else{
                    if( !root.is_in_range_flag ){
                        root.is_in_range_flag = true;
                        Base.Events.trigger("reading_param" );
                    }
                }
                //                console.log( "check_current_range");
                root.check_current_range();
            });
        },
        is_in_range : function(){
            var root = this;
            if( root.statics.boundary.top< document.body.scrollTop
                && document.body.scrollTop < root.statics.boundary.bottom ){
                //                  console.log( " in range",root.statics.boundary.top, document.body.scrollTop, root.statics.boundary.bottom );
                return true;
            } 
             
            //            console.log( "is not in range",root.statics.boundary.top, root.statics.boundary.bottom,document.body.scrollTop   );

            return false;
        },
        check_current_range : function(){
            var root = this;
            var index = root.current_item_index == null ? 0 : root.current_item_index;
            var current_range = root.data[index];
            var sight_line = document.body.scrollTop + root.get_clientHeight() / 2;
            if(  current_range.top < sight_line  && sight_line< current_range.bottom ){
                //                console.log(" still the same range");
                if( root.current_item_index == null ){
                    Base.Events.trigger("get_current_reading_done",  current_range.item );
                    root.current_item_index = index;
                }
                return;
            }
            
            while( -1< index && index< root.data.length ){
                //                console.log( index, root.current_item_index);
                var min = root.data[index].top;
                var max = /^u/.test( typeof( root.data[index+1] ) ) ? root.data[index].bottom : root.data[index+1].top
                if( min <= sight_line &&  sight_line<= max ){
                    //                    console.log(" find the range !", root.data[index].item);
                    root.current_item_index = index;
                    Base.Events.trigger("get_current_reading_done",  root.data[index].item );
                    break;
                }
                
                if( sight_line < root.data[index].top){
                    index --;
                }else{
                    index ++;
                }
            }
            
        },
        scroll_to_chapter : function(  chapter ){
            var root = this;
            for( var i in  root.data){
                if( root.data[i].item.id == chapter.id ){
                    var end = root.data[i].top - ( root.get_clientHeight() - root.data[i].$el.height() )/2 ;
                    Router.scroll_to( end );
                    break;
                }
            }
            console.log( chapter );
        }
        
    });
    
    
    var chapter_map_def = function(chapters){
        this.build_el.call( this, chapters );
        this.bind_event.call( this);
        return this;
    }
    
    _.extend( chapter_map_def.prototype, {
        
        map : {},
        view : new Backbone_ae.View(),
        build_el : function( chapters ){
            
            var root = this;
            root.$el = $("<div id='auto-chapter-nav'></div>");
            root.map[0] = root.$el;
            
            var waited_map = {};
            _.each( chapters, function( chapter ){
                var $chapter = root.view.template_event().render_binded_element({
                    context : root,
                    data : chapter, 
                    selector : "#tpl-auto-chapter-nav-item"
                });
                
                if( chapter.pid in root.map ){
                    root.map[chapter.pid].append( $chapter );
                }else{
                    if( chapter.pid in waited_map ){
                        waited_map = waited_map[chapter.pid].add( $chapter );
                    }else{
                        waited_map[chapter.pid] = $().add($chapter);
                    }
                }
                
                if( chapter.id in waited_map ){
                    $chapter.append( waited_map[chapter.id]);
                    delete waited_map[chapter.id];
                }
                
                root.map[chapter.id] = $chapter;
            });
        },
        _e_chapter_click : function( el, opt, e ){
            console.log( el, opt,e ,"================");
            e.stopPropagation();
            $(el).addClass("open");
            Base.Events.trigger("read_chapter",  $(el).data() );
        },
        bind_event : function(){
            Base.Events.bind("get_current_reading_done", this.light_chapter, this);
        },
        chapter_for_el : function( chapter ){
            return this.map[chapter.id];
        },
        light_chapter : function( chapter ){
            var root = this
            var $el = root.chapter_for_el( chapter );
            //            console.log("find el!", $el );
            root.light_el( $el );
            root.open_el( $el, true );
        },
        light_el : function( $el ){
            var root = this;
            
            _.each( root.map, function($el){
                $el.removeClass("light") ;
            });
            $el.addClass("light");
        },
        open_el : function( $el, close_others ){
            counter--;
            if( !counter ){
                return;
            }
            var root = this;
            if( close_others ){
                _.each( root.map, function($el){
                    $el.removeClass("open") ;
                });
            }

            var $parent = $el.parent(".chapter");
            if( $parent.length ){
                $parent.addClass("open");
                
                root.open_el( $parent, false);
            }
        }
    });
    var counter = 10;
    //TODO 
    var robot_def = Robot.extend({
        events : {
            "on_params_render_done" : [Base.Events, "params_render_done"],
            "on_reading_param" : [Base.Events, "reading_param"],
            "on_not_reading_param" : [Base.Events, "not_reading_param"],
            "on_page_books_book_select" : [Base.Events, "page_books_book_select"],
            "on_page_rendered" : [Base.Events, "page_rendered"]
        },
        current_book : {},
        //item example : {top:100, bottom:200, chapter.id : 1 }
        position_map : null,
        chapter_map : null,
        current_chapter_index : null,
        initialize : function(){
            
        },
        on_page_books_book_select : function(book){
            this.current_book = book;
        },
        on_params_render_done : function( $el, options, note  ){
            var root = this;
            if( root.position_map ==null ){
                root.position_map = new position_map_def( $el, options.item_class , "chapter");
            }else{
                root.position_map.refresh( $el, options.item_class , "chapter" );
            }
            
            if( "book" in note ){
                this.current_book = note.book;
            }
            
            Logic_param_create.get_optional_chapters({
                book: root.current_book
            }).done(function( res ){
                var chapters = Global_ajax.get_data(res );
                root.chapter_map = new chapter_map_def( chapters );
                root.bind_to_view( root.chapter_map.$el );
            });
            return;
        },
        bind_to_view : function( $el ){
            var root = this;
            if( !("chapter_container" in root) ){
                root.origin_chapter_container = root.get_container( "auto-chapter-nav").clone();
                root.chapter_container_parent = root.get_container( "auto-chapter-nav").parent();
            }else{
                root.chapter_container.remove();
            }
            
            root.chapter_container = root.origin_chapter_container.clone();
            root.chapter_container_parent.append( root.chapter_container );
            
            root.chapter_container.html($el);
            root.stylize_container( root.chapter_container );
        },
        get_container : function( condition ){
            return $("[data-condition="+condition+"]");
        },
        stylize_container : function( $con ){
            var gap = ( document.documentElement.clientHeight - $con.height() )/2;
            $con.portamento({
                gap:gap, 
                container_id : "portamento_auto_chapter", 
                wrapper:$("#page_param_list")
                });
            $con.addClass("stylized");
        },
        on_reading_param : function(){
            console.log( this.chapter_map );
            if( this.chapter_map !=null && "$el"in this.chapter_map ){
                this.chapter_map.$el.show();
            }
            
        },
        on_note_reading_param : function(){
            if( "$el"in this.chapter_map ){
                this.chapter_map.$el.hide();
            }
        }
    });


    
    var page_def = Backbone_ae.View.extend({
        el: '#page_param_list',
        initialize: function() {
            this.params = new params_def();
            this.template_event().bind_template_event(this.$el);
            this.robot = new robot_def();
            Base.Events.bind("page_notes_note_select", this.get_params_by_note, this);
            Base.Events.bind("page_my_account_note_select", this.get_params_by_note, this);
        },
        get_params_by_note: function( note ) {
            this.$el.addClass("page_rendered");
            this.params.get_params_by_note( note );
        }
    });


    exports.init = function(){
        var page = new page_def();
        Router.register("page_notes_note_select", page.el );
        Router.register("page_my_account_note_select", page.el );
        
    }
});