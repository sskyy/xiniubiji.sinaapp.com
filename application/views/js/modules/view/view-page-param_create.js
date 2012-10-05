define(function(require, exports, module) {
    var Base = require("base");
    var View = require("./view");
    var $ = require("jquery");
    var _ = require("underscore");
    var Router = require("./view-global-router");
    var Logic_param_create = require("../note/note-logic-param_create");
    var Global_ajax = require("../global/ajax.js");
    

    require("./plugin-BB-template-event");
    require("./plugin-BB-editable-item");
    require("./plugin-BB-common-list");
    var Backbone_editable_select_view = require("./view-com-editable-select");


    var Backbone_ae = View.create_backbone_with_plugin(['BB-template-event', 'BB-editable-item']);


    /**
     * @description the main view , to create param.
     */
    var param_create_def = Backbone_ae.View.extend({
        el: '#param-create-con',
        data: {},
        current_book : false,
        book_search : null,
        default_chapter_data : {
            name:"关联到章节"
        },
        first_add_chatper : null,
        added_chapter_container : ".note-chapter-added",
        param_add_textarea_id : "#param-add-textarea",
        added_chapter : [],
        $added_chapter : [],
        initialize: function() {
            this.template_event().bind_template_event( this.$el );
            this.render();
        },
        refresh : function(){
            this.added_chapter = [];
            _.each( this.$added_chapter, function( $chapter ){
                $chapter.remove();
            });
            this.$el.find(this.added_chapter_container ).addClass("empty");
        },
        render: function() {
            var root = this;
            root.render_first_add_chapter(root.default_chapter_data);

            root.render_editable_item({
                data: {
                    number: 1
                },
                template: '<%=data.number%>页',
                callbacks: {
                    on_edit_done: root.edit_page_done
                }
            }).appendTo(root.$el.find(".note-page"));

            root.render_editable_item({
                data: {
                    number: 1
                },
                template: '<%=data.number%>行',
                callbacks: {
                    on_edit_done: root.edit_line_done
                }
            }).appendTo(root.$el.find(".note-line"));

        },
        render_first_add_chapter : function( data ){
            var root = this;
            this.first_add_chapter = new Backbone_editable_select_view({
                editable_item_options:{
                    template: "<%=data.name || ''%>",
                    data: data,
                    data_edit_names : ["name"]
                },
                on_edit_select_items : root.show_optional_chapter,
                on_edit_done : root.on_first_edit_done,
                validate_edit : root.validate_chapter_create,
                common_list_options : {},
                context : root  
            });
//            console.log(this.first_add_chapter )
            this.first_add_chapter.$el.appendTo(root.$el.find(".note-add-chapter"));
        },
        validate_chapter_create : function(){
            if( !Base.Data.get("user") ){
                Base.Events.trigger("user_need_login");
                return false;
            }
            
            if( this.current_book == false ){
                Base.Events.trigger("book_not_selected");
                return false;
            }
            return true;
        },
        show_optional_chapter : function( selecter){
            console.log( "optional chapter",selecter );
            var _d = $.Deferred();
            var root = this;
            var opt = {
                book : root.get_current_book()
            };
            
            if( "pid" in selecter.options ){
                opt.parent_chapter = {id: selecter.options.pid };
            }else if( root.get_last_chapter() ){
                console.log("last_chapter",root.get_last_chapter());
                opt.parent_chapter = root.get_last_chapter();
            }else{
                opt.parent_chapter = { id:0};
            }
            
            console.log( "parent_chapter", opt.parent_chapter );
            
            Logic_param_create.get_optional_chapters(opt).done( function(res){
                var chapters = Global_ajax.get_data( res );
                _d.resolve( chapters );
                console.log( "optional_chapters", chapters );
            });
            return _d;
        },    
        on_first_edit_done : function(data){
            console.log( "on_first_edit_done", data );
            this.first_add_chapter.refresh( {
                data: this.default_chapter_data
                });
            var root = this;
            if("id" in data){
                this.add_chapter( data );
            }else{
                data.book = this.get_current_book();
                if( this.get_last_chapter() ){
                    data.parent_chapter = this.get_last_chapter();
                }
                Logic_param_create.create_chapter( data ).done(function( res ){
                    var chapter = Global_ajax.get_data( res );
                    root.add_chapter( chapter );
                });
            }
        },
        add_chapter : function( chapter ){
            this.added_chapter.push(chapter);
            var new_select = this.create_editable_select(chapter);
            this.$added_chapter.push( new_select );
            new_select.$el.addClass("added-chapter");
            this.$el.find( this.added_chapter_container ).append( new_select.$el ).removeClass("empty");
        },
        create_editable_select : function( data ){
            var root= this;
            return new Backbone_editable_select_view({
                pid : data.pid,
                name : data.name,
                editable_item_options:{
                    template: "<%=data.name || ''%>",
                    data: data,
                    enables : ["edit","delete"],
                    data_edit_names : ["name"],
                    container_class : "added-chapter"
                },
                on_edit_select_items : root.show_optional_chapter,
                on_edit_done : root.on_edit_done,
                on_delete_done : root.on_delete_done,
                common_list_options : {
                  
                },
                context : root  
            });
        },
        on_edit_done : function( data, select ){
            console.log( "on_normal_edit_done", data, select);
            select.refresh(data);
            var index = _.indexOf( this.$added_chapter, select);
            var child_length = this.added_chapter.length - index - 1;
            this.delete_child_chapter( child_length );
        },
        on_delete_done : function( data ){
            var index = _.indexOf( this.added_chapter, data);
            var child_length = this.added_chapter.length - index;
            this.delete_child_chapter( child_length );
        },
        delete_child_chapter : function( child_length ){
            var last_elements = _.last( this.$added_chapter, child_length );
            _.each( last_elements , function( el_view ){
                el_view.$el.remove();
                delete el_view;
            });
            
            this.added_chapter = _.initial( this.added_chapter, child_length);
            this.$added_chapter = _.initial( this.$added_chapter, child_length);
        },
        on_chapter_edit_done:function( data ){
            var root = this;
            data.book = this.get_current_book();
            if( this.get_last_chapter() ){
                data.parent_chapter = this.get_last_chapter().data;
            }
            Logic_param_create.create_chapter( data ).done(function( res ){
                var chapter = Global_ajax.get_data( res );
                root.add_chapters_to_view( chapter );
            });
        },
        get_last_chapter : function(){
            return _.last( this.added_chapter);
        },
        check_current_book : function(){
            return this.get_current_book();
        },
        edit_page_done: function(data ) {
            console.log("page", data.number);
        },
        edit_line_done: function(data) {
            console.log("line", data.number);
        },
        _e_save_param: function(){
            var root = this;
            var data = {
                content : $(root.param_add_textarea_id).val(),
                book : root.get_current_book(),
                chapter : root.get_last_chapter()
            };
            data.content = data.content.replace(/\n/g, "<br/>");
            console.log( data.content );
            Logic_param_create.create_param( data ).done(function(res){
                var param = Global_ajax.get_data( res );
                if( param ){
                    alert( "保存成功" );
                    Base.Events.trigger("page_books_book_select", root.current_book);
                }
            });
            
        },
        get_current_book : function(){
            return this.current_book ;
        },
        set_current_book : function( book ){
            this.current_book = book;
            this.show_relate_book();
            this.refresh();
        },
        show_relate_book : function(){
            console.log( this.current_book );
            if( this.current_book ){
                var $book = this.template_event().template("#tpl-book", this.current_book);
                this.$el.find(".param-book").html($book);
            }else{
                this.$el.find(".param-book").html("");
            }
        }
    });


    var page_def = Backbone_ae.View.extend({
        el : "#page_note_create",
        initialize: function() {
            this.param_create = new param_create_def();
            Base.Events.bind("page_books_book_select", this.book_selected, this);
            Base.Events.bind("create_param", function( book ){
                if( book ){
                    this.create_param.set_current_book( book );
                }
            }, this );
            Base.Events.bind("search_book_done", function(){
                this.param_create.set_current_book( null );
            }, this);
        },
        book_selected : function( book ){
            this.$el.addClass("page_rendered");
            this.param_create.set_current_book( book );
        }
    });

    exports.init = function() {
        var page = new page_def();
        
        Router.register("create_param", page.el );
    }
});