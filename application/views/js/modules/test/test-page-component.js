define(function(require, exports, module) {
    var Base = require("base");
    var $ = jQuery = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var View = require("../view/view");

    require("../view/plugin-BB-template-event");
    require("../view/plugin-BB-editable-item");
    require("../view/plugin-BB-common-list");
    

    var Backbone_template_event = View.create_backbone_with_plugin(['BB-template-event']);
    var template_event_def = Backbone_template_event.View.extend({
        el : '#template_event',
        initialize : function(){
            var opt = {
                selector:"#tpl-template-event"
            };
            var $element = this.template_event().render_binded_element(opt);
            this.$el.append( $element );
           
            var opt_with_e_name = {
                selector:"#tpl-template-event", 
                function_prefix:"_e_name_"
            }
            var $element_with_e_name = this.template_event().render_binded_element(opt_with_e_name);
            this.$el.append( $element_with_e_name );
           
            var opt_with_functions = {
                selector:"#tpl-template-event", 
                functions : {
                    _e_alert:this._e_binding_function
                }
            };
            var $element_with_binding_function = this.template_event().render_binded_element(opt_with_functions);
            this.$el.append( $element_with_binding_function);
        },
        _e_alert : function( $el, data, e ){
            alert("dianwo");
            console.log( $el );
            console.log( data );
            console.log( e );
        },
        _e_name_alert : function( $el, data, e){
            alert("with_e_name");
        },
        _e_binding_function: function( $el, data, e){
            alert("binding_function");
        }
    });
    
    var Backbone_editable_item = View.create_backbone_with_plugin(['BB-editable-item']);
    var editable_item_def = Backbone_editable_item.View.extend({
        el : '#editable_item',
        initialize : function(){
            var $editable_item1 = this.render_editable_item1();
            var $editable_item2 = this.render_editable_item2();
            this.$el.append($editable_item1).append($editable_item2);
            var root = this;
            
            $("#editable_item_controller").bind("click",function(){
                var data = {
                    number:9,
                    name:Math.random()
                };
                //                $editable_item1 = root.editable_item().refresh_data( $editable_item1,data);
                root.editable_item().refresh_data( $editable_item1,data);
            });
        },
        render_editable_item1: function() {
            var root = this;
            var $editable_item = root.render_editable_item({
                template: "<%=data.name || ''%>",
                data: {
                    number: 1,
                    name: '关联到章节'
                },
                data_edit_names : ["name"],
                callbacks: {
                    on_edit_done: root.edit_done
                }
            });
            return $editable_item;
        },
        render_editable_item2: function() {
            var root = this;
            
            var $editable_item2 = root.render_editable_item({
                data: {
                    number: 1,
                    name: '关联到章节2'
                },
                template: "<%=data.name || ''%>",
                callbacks: {
                    on_edit_done: root.edit_done2
                }
            });
            return $editable_item2;
        },
        edit_done : function( param ){
            console.log( "edit_done" ,param);
        },
        edit_done2 : function(param){
            console.log( "edit_done2",param);
        }
    });
    
    
    var Backbone_common_list = View.create_backbone_with_plugin(['BB-common-list']);
    var common_list_def = Backbone_common_list.View.extend({
        el : "#common_list",
        common_list_options : {
            item_class: '.item',
            item_tpl_id: '#tpl-common-list-item',
            items_per_page: 9,
            select_event: 'common_list_select'
        },
        initialize : function( options ){
            console.log( options );
            this.plugin_initialize( options );
            console.log( this.common_list_options);
        },
        common_list_select : function( data ){
        },
        show_items : function(items){
            this.render_common_list( items );
        }
    });
    
        
    var Backbone_editable_select_view = require("../view/view-com-editable-select");;
//    var editable_select_com_def = Backbone_editable_select.View.extend({
//        el : $("#tpl-editable-select").html(),
//        $editable_item : '',
//        common_list : null,
//        context : null,
//        on_edit_done : null,
//        initialize : function( options ){
//            /*
//             * options:{
//             *      editable_item_options:{
//             *          template: "<%=data.name || ''%>",
//                        data: {
//                            id: 1,
//                        },
//                        data_edit_names : ["id"],
//             *      },
//             *      on_edit_done : function(){},
//             *      on_edit_select_items : function(){},
//             *      common_list_options : {
//             *      
//             *      },
//             *      context : root
//             * }
//             */
//            var root = this;
//            this.context = options.context;
//            
//            options.editable_item_options.callbacks = options.editable_item_options.callbacks || {};
//            options.editable_item_options.callbacks.on_edit = root._on_edit;
//            options.editable_item_options.callbacks.on_delete_done = root._on_delete_done;
//            options.editable_item_options.callbacks.on_edit_done = root._on_edit_done;
//            options.editable_item_options.context = root;
//            this.$editable_item = this.render_editable_item( options.editable_item_options )
//            .appendTo( root.$el.find(".editable-item"));
//            
//            options.common_list_options.select_event = root._on_select;
//            options.common_list_options.context = root;
//            this.common_list = new common_list_def({
//                el : "<div></div>",
//                common_list_options : options.common_list_options
//            });
//            
//            this.common_list.$el.appendTo( root.$el.find(".common-list"))
//        },
//        _on_edit : function(){
//            var base = this;
//            if( "context" in this && this.context ){
//                base = this.context;
//            }
//            if( "on_edit_select_items" in this.options ){
//                var items = this.options.on_edit_select_items.call( base, this );
//                this.common_list.render_common_list( items ).$el.show();
//            }
//        },
//        _on_edit_done : function( data ){
//            this.common_list.$el.hide();
//            var base = this;
//            this._on_total_edit_done( data );
//        },
//        _on_select : function( data ){
//            this.editable_item().refresh_data( this.$editable_item , data );
//            this.common_list.$el.hide();
//            this._on_total_edit_done( data );
//        },
//        _on_delete_done : function( data ){
//            var base = this;
//            if( "context" in this ){
//                base = this.context;
//            }
//            if( "on_delete_done" in this.options ){
//                this.options.on_delete_done.call( base, data );
//            }
//            
//            this.$editable_item.remove();
//            delete this.$editable_item;
//            this.common_list.$el.remove();
//            delete this.common_list;
//            this.$el.remove();
//            
//
//            delete this;
//        },
//        _on_total_edit_done : function(data){
//            var base = this;
//            if( "context" in this ){
//                base = this.context;
//            }
//            
//            this.options.on_edit_done.call( base, data, this );
//        },
//        refresh : function( data ){
//            if( "data" in data ){
//                this.editable_item().refresh_data( this.$editable_item, data.data );
//                delete data.data;
//            }
//            for( var i in data ){
//                this[i] = data[i];
//            }
//        }
//    });
    
    var editable_select_def = Backbone_template_event.View.extend({
        el :"#editable_select_con",
        first_select : null,
        editable_select: [],
        initialize : function(){
            var root = this;
            this.first_select = new Backbone_editable_select_view({
                editable_item_options:{
                    template: "<%=data.id || ''%>",
                    data: {
                        id: 1
                    },
                    data_edit_names : ["id"]
                },
                on_edit_select_items : root.on_edit_select_items,
                on_edit_done : root.on_edit_done,
                common_list_options : {
                  
                },
                context : root  
            });
//            console.log( this.first_select.$el );
            this.$el.append( this.first_select.$el );
        },
        on_edit_select_items : function( editable_select ){
            var items =[];
            var id = 0;
            
            if( "id" in editable_select ){
                console.log(editable_select.id )
                id = editable_select.id;
            }
            for( var i = 0; i<5;i++){
                items.push( {id:id + i});
            }
            return items;
        },
        on_delete_done : function( data ){
            console.log( "delete", data);
        },
        on_edit_done : function(data){
            this.first_select.refresh( {data:{id:1}, id:1});
            var new_select = this.create_editable_select(data);
            this.$el.prepend( new_select.$el );
        },
        create_editable_select : function( data ){
            var root= this;
            return new Backbone_editable_select_view({
                id : data.id,
                editable_item_options:{
                    template: "<%=data.id || ''%>",
                    data: {
                        id: data.id
                    },
                    enables : ["edit","delete"],
                    data_edit_names : ["id"]
                },
                on_edit_select_items : root.on_edit_select_items,
                on_edit_done : root.on_normal_edit_done,
                on_delete_done : root.on_delete_done,
                common_list_options : {
                  
                },
                context : root  
            });
        },
        on_normal_edit_done : function( data, select ){
            console.log( "on_normal_edit_done", data);
            select.refresh({id:data.id});
//            this.first_select.refresh( {data:{id:1}, id:1});
        }
    })
    

    //    var Backbone_ae = View.create_backbone_with_plugin(['BB-auto-event', 'BB-editable-select']);
    //    var editable_select_def = Backbone_ae.View.extend({
    //        el: '#editable_select',
    //        data: {},
    //        initialize: function() {
    //            this.bind_template_event();
    //            this.render();
    //        },
    //        render: function() {
    //            var root = this;
    //            root.render_editable_select({
    //                container : "#tpl-editable-select",
    //                data: {
    //                    number: 1,
    //                    name: '关联到章节'
    //                },
    //                select_items: [
    //                    {number:2,name:"2"},
    //                    {number:3,name:"3"},
    //                    {number:4,name:"4"},
    //                    {number:5,name:"5"},
    //                ],
    //                
    //                template: "<%=data.name || ''%>",
    //                callbacks: {
    //                    edit_done_callback: root.edit_param_done
    //                }
    //            }).appendTo(root.$el);
    //
    //        },
    //        add_sub_param_done: function(data) {
    //            console.log(data);
    //            var root = this;
    //            root.render_editable_item({
    //                data: data,
    //                template: "<%= data.number  %>  <%=data.name || ''%>",
    //                callbacks: {
    //                    edit_done_callback: root.edit_param_done
    //                }
    //            }).appendTo(root.$el.find(".note-sub-params"));
    //
    //        },
    //        edit_page_done: function(data) {
    //            console.log("page", data.number);
    //        },
    //        edit_line_done: function(data) {
    //            console.log("line", data.number);
    //        },
    //        edit_param_done: function(data) {
    //            console.log(data);
    //        }
    //    });
    
    var page_def = Backbone.View.extend({
        initialize: function() {
            new template_event_def();
            new editable_item_def();
            
            var common_list = new common_list_def();
            var items = [{
                id:1
            },{
                id:2
            },{
                id:3
            },{
                id:3
            },{
                id:3
            },{
                id:3
            },{
                id:3
            },{
                id:3
            },{
                id:3
            },{
                id:3
            },{
                id:3
            }];
            common_list.show_items(items);
            
            var editable_select = new editable_select_def();
            
            
            $("#test-textarea").val();
            
        }
    });
    
    
    $.ajax({
        url : 'http://api.douban.com/book/subject/2000006',
        data : {alt:'json'},
        dataType : 'json',
        success: function( res ){
            console.log( res );
        }
    })
    
    exports.init = function() {
        new page_def();
    };
});