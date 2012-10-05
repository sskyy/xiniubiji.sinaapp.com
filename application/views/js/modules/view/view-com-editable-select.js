define(function(require, exports, module) {
    var Base = require("base");
    var _ = require("underscore");
    var $ = require("jquery");
    var View = require("./view");
    require("../view/plugin-BB-common-list");
    var editable_item_obj  = require("../view/plugin-BB-editable-item");

    var Backbone_common_list = View.create_backbone_with_plugin(['BB-common-list']);
    var common_list_def = Backbone_common_list.View.extend({
        common_list_options : {
            item_class: 'item',
            item_tpl_id: '#tpl-common-list-item',
            items_per_page: 9,
            select_event: 'common_list_select'
        },
        initialize : function( options ){
            this.plugin_initialize( options );
        }
    });

    var Backbone_editable_item = View.create_backbone_with_plugin(['BB-editable-item']);
    var editable_select_def = Backbone_editable_item.View.extend({
        el : $("#tpl-editable-select").html(),
        $editable_item : '',
        common_list : null,
        context : null,
        initialize : function( options ){
            console.log( "editable_select_def initialize")
            /*
             * options:{
             *      editable_item_options:{
             *          template: "<%=data.name || ''%>",
                        data: {
                            id: 1,
                        },
                        data_edit_names : ["id"],
             *      },
             *      on_edit_done : function(){},
             *      on_edit_select_items : function(){},
             *      validate_edit : function(){},
             *      common_list_options : {
             *      
             *      },
             *      context : root
             *      class : ""
             * }
             */
            var root = this;
            this.context = options.context;
            
            options.editable_item_options.callbacks = options.editable_item_options.callbacks || {};
            options.editable_item_options.callbacks.on_edit = root._on_edit;
            options.editable_item_options.callbacks.on_delete_done = root._on_delete_done;
            options.editable_item_options.callbacks.on_edit_done = root._on_edit_done;
            options.editable_item_options.callbacks.on_edit_cancel = root._on_edit_cancel;
            if( "validate_edit" in options ){
                options.editable_item_options.callbacks.validate_edit = options.validate_edit;
            }
            options.editable_item_options.context = root;
            this.$editable_item = this.render_editable_item( options.editable_item_options )
            .appendTo( root.$el.find(".editable-item-container"));
            
            options.common_list_options.select_event = root._on_select;
            options.common_list_options.context = root;
            this.common_list = new common_list_def({
                el : "<div></div>",
                common_list_options : options.common_list_options
            });
            
            this.common_list.$el.appendTo( root.$el.find(".common-list-container"))
            
            if( "class" in options){
                this.$el.addClass( options['class']);
            }
            console.log( this.$el);
        },
        _on_edit : function(){
            var base = this;
            var root = this;
            if( "context" in this && this.context ){
                base = this.context;
            }
            if( "on_edit_select_items" in this.options ){
                console.log( root.common_list.$el );
                root.common_list.empty().$el.addClass("loading").show();
                var items = this.options.on_edit_select_items.call( base, this );
                console.log( "on_edit_select_items",items );
                if( !_.isArray( items) ){
                    items.done( function( data ){
                        root.common_list.render_common_list( data );
                        root.common_list.$el.removeClass("loading");
                    });
                }else{
                    this.common_list.render_common_list( items ).$el.show();
                }
            }
        },
        _on_edit_cancel : function(){
            console.log( "here", this.common_list.$el );
            this.common_list.$el.hide();
        },
        _on_edit_done : function( data ){
            this.common_list.$el.hide();
            this._on_total_edit_done( data );
        },
        _on_select : function( data, e ){
            e.stopPropagation();
            this.editable_item().refresh( this.$editable_item , data );
            this.common_list.$el.hide();
            this._on_total_edit_done( data );
        },
        _on_delete_done : function( data ){
            var base = this;
            if( "context" in this ){
                base = this.context;
            }
            if( "on_delete_done" in this.options ){
                this.options.on_delete_done.call( base, data );
            }
            
            this.$editable_item.remove();
            delete this.$editable_item;
            this.common_list.$el.remove();
            delete this.common_list;
            this.$el.remove();
            

            delete this;
        },
        _on_total_edit_done : function(data){
            var base = this;
            if( "context" in this ){
                base = this.context;
            }
            
            this.options.on_edit_done.call( base, data, this );
        },
        refresh : function( data ){
            if( "data" in data ){
                this.editable_item().refresh( this.$editable_item, data.data );
                delete data.data;
            }
            for( var i in data ){
                this[i] = data[i];
            }
        }
    });
    
    return editable_select_def;
});