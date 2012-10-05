define(function(require, exports, module) {
    var Base = require("base");
    var _ = require("underscore");
    var $ = require("jquery");
    var View = require("./view");
    var aotu_event_obj = require("./plugin-BB-template-event");

    var common_list_obj ={
        el :'',
        _common_list_options : {
            container_class : 'common-list',
            item_class : 'item',
            item_tpl_id : '',
            select_event : '',
            unselect_event : '',
            render_event : '',
            multi_select : false,
            common_list_items : [],
            current_page : 0,
            total_pages : 1,
            items_per_page : 0,
            context : null
        },
        _initialize : function( options ){
            this.common_list_options = $.extend({}, this._common_list_options, this.common_list_options );
            console.log("_initailize",this.common_list_options)
            if( options && "common_list_options" in options ){
                this.common_list_options = $.extend({}, this.common_list_options, options.common_list_options );
            }
        },
        common_list : function(){
            var root = this;
            var root_options = root.common_list_options;
            return {
                empty : function(){
                    if( root_options.common_list_items.length  ){
                        console.log( )
                        root_options.common_list_items.each(function(){
                           $(this).remove(); 
                        })
                    }

                    root_options.current_page = 0;
                    root_options.total_pages = 1;
                    root_options.items_per_page = 0;
                },
                _build_data_to_view : function( items ){
                    var $items = this._build_and_bind_items( items );
                    this._calculate_statics( items );
                    this._show_items( $items );
                    this.stylize();
                },
                _calculate_statics : function( items ){
                    if( root_options.items_per_page > 0 ){
                        root_options.total_pages = Math.ceil( items.length / root_options.items_per_page );
                    }
                },
                _build_and_bind_items : function( items ){
                    var self = this;
                    var $items = $();
                    _.each( items, function( item ){
                        var $item;
                        $item = root.template_event()
                            .template( root_options.item_tpl_id , item )
                            .addClass(root_options.item_class)
                            .data(item);
                            
                         self._call_callback("render_event", item, $item);
                            
                        $items = $items.add( $item);
                
                        self._bind_item_event(  $item, item );
                    });
            
                    return $items;
                },
                _show_items :function( $items ){
                    root_options.common_list_items = $items;
                    this._set_items_visibility( $items );
                    
                    if( "container_selector" in root_options  ){
                        $( root_options.container_selector ).html($items);
                    }else{
                        root.$el.html( $items );
                    }
                    
                },
                _set_items_visibility : function( $items ){
                    $items = $items || root_options.common_list_items; 
                    if( root_options.items_per_page > 0 && $items.length > root_options.items_per_page ){
                        var item_start = root_options.current_page * root_options.items_per_page;
                        var item_end = (root_options.current_page + 1) * root_options.items_per_page;
                        $items.hide().slice(  item_start, item_end ).show();
                    }
                },
                _bind_item_event : function( $item, item ){
                    $item.bind("click",function(){
                        if( !root_options.multi_select ){
                            root.$el.find( root_options.item_class ).removeClass("selected");
                        }
                        $(this).toggleClass("selected");
                    });
            
                    $item.bind("click",function(e){
                        if( $(this).hasClass('selected') && root_options.select_event ){
                            if( root_options.context ){
                                root_options.select_event.call( root_options.context, item , e);
                            }else{
                                root[root_options.select_event](item, e);
                            }
                        }else if( !$(this).hasClass('selected') && root.unselect_event) {
                            root[root_options.unselect_event](item, e);
                        }
                    })
                },
                stylize : function(){
                    root.$el.addClass( root_options.container_class );
                },
                _call_callback: function(){
                    var event_name = arguments[0];
                    var context = root_options.context ? root_options.context : root;
                    if( root_options[event_name] && root_options[event_name] in context ){
                        return context[ root_options[event_name]  ].apply( context, _.rest( arguments  ) );
                    }
                }
            }
        },
        render_common_list : function( items ){
            this.common_list_options = $.extend({}, this._common_list_options, this.common_list_options );
            this.common_list()._build_data_to_view( items );
            return this;
        },
        
        next_page : function(){
            var root = this;
            if( root.common_list_options.current_page < root.common_list_options.total_pages -1  ){
                root.common_list_options.current_page ++;
                root._set_items_visibility();
                return root.common_list_options.current_page;
            }
            return false;
        },
        prev_page : function(){
            var root = this;
            if( root.common_list_options.current_page > 0 ){
                root.common_list_options.current_page --;
                root._set_items_visibility();
                return root.common_list_options.current_page;
            }
            return false;
        },
        empty : function(){
            this.common_list().empty();
            return this;
        }
    };

    common_list_obj = _.extend(common_list_obj, aotu_event_obj);

    View.add_plugin("BB-common-list", common_list_obj);
    return common_list_obj;
});