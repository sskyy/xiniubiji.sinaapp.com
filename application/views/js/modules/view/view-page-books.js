define(function(require, exports, module) {
    var Base = require("base");
    var View = require("./view");
    var Robot = require("../robot/robot");
    var Router = require("./view-global-router");
    var View_ajax = require("./view-global-ajax");
    var Logic_param_create  = require("../note/note-logic-param_create");
    var Global_ajax = require("../global/ajax");
    
    require("./plugin-BB-common-list");
    require("./plugin-BB-template-event");
    require("./plugin-BB-editable-item");
    var $ = require("jquery");
    
    var collection_books_def = require("../note/note-collection-books");

    var Backbone_common_list = View.create_backbone_with_plugin("BB-common-list");

    /**
     *  view book_list
     */
    var books_def = Backbone_common_list.View.extend({
        collection_book: new collection_books_def(),
        current_page : 0,
        common_list_options: {
            item_class: 'book',
            item_tpl_id: '#tpl-book',
            select_event: 'book_select',
            container_selector : "#books-list-container"
        },
        initialize: function() {
            
        },
        render : function( books, change_page_handler, param ){
            this.hide_loading();
            console.log( "render", books , change_page_handler, param);
            this.render_books( books );
            this.render_page_controller( books,change_page_handler, param );
            
        },
        render_books : function( books ){
            if( books.length == 0 ){
                var book_name = "book_name";
                Base.Events.trigger("create_book",book_name);
            }else{
                this.render_common_list( books );
                this.$el.show();
            }
        },
        render_page_controller : function( books,change_page_handler, param ){
            var root = this;
            var $right_controller = this.$el.find(".page-controller.controller-right");
            var $left_controller = this.$el.find(".page-controller.controller-left");
            $left_controller.unbind("click");
            $right_controller.unbind("click");
            
            if( param.page != 0 ){
                $left_controller.html( param.page).click(function(){
                    root.show_loading();
                    change_page_handler( param.page -1 );
                }).show();
            }else{
                $left_controller.hide();
            }
            
            if( "limit" in param && books.length == param.limit.limit ){
                $right_controller.html( param.page + 2).click(function(){
                    root.show_loading();
                    change_page_handler( param.page +1 );
                }).show();
            }else{
                $right_controller.hide();
            }
        },
        show_loading:function(){
            var $el = $(this.common_list_options.container_selector);
            View_ajax.show_loading( $el );
        },
        hide_loading : function(){
            var $el = $(this.common_list_options.container_selector);
            View_ajax.hide_loading( $el );
        },
            
        book_select: function(book) {
            Base.Events.trigger("page_books_book_select",book);
        },
        hide : function(){
            this.$el.hide();
        }


    });
    
    var Backbone_ae = View.create_backbone_with_plugin(['BB-template-event', 'BB-editable-item']);

    /**
     *  @description the view to add book
     */
    var book_create_def = Backbone_ae.View.extend({
        initialize: function() {
        },
        new_book_data: {},
        $book : null,
        create_book: function() {
            this.$book = this.build_editable_book();
            this.$btns = this.build_book_btns();
            this.$el.show();
            this.$el.html(this.$book).append( this.$btns );
        },
        hide : function(){
            this.$el.hide();
        },
        build_editable_book: function() {
            var root = this;
            var $name = this.render_editable_item({
                data: {
                    name: '点我填书名'
                },
                template: "<%=data.name || ''%>",
                callbacks: {
                    on_edit_done: root._new_book_name_done
                },
                context : root
            });
            var $author = this.render_editable_item({
                data: {
                    name: '点我填作者'
                },
                template: "<%=data.name || ''%>",
                callbacks: {
                    on_edit_done: root._new_book_author_done
                },
                context : root
            });
            var $publisher = this.render_editable_item({
                data: {
                    name: '点我填出版社'
                },
                template: "<%=data.name || ''%>",
                callbacks: {
                    on_edit_done: root._new_book_publisher_done
                },
                context:root
            });


            var $book = $($("#tpl-book").html().toString().replace(/<%(.*?)%>/g, ''));
            $book.find(".book-name").html($name);
            $book.find(".book-author").html($author);
            $book.find(".book-publisher").html($publisher);

            return $book;
        },
        build_book_btns : function( ){
            var root = this;
            var $btns = $("<div class='book-btns' ></div>");
            
            var $write_note_btn = $("<div class='tr'><a class='btn '>写笔记</a></div>").bind("click", function() {
                root._e_write_note.call(root ,$(this), root.new_book_data);
            }).hide();
            
            var  $save_btn = $("<div class='tr'><a class='btn '>保存</a></div>").bind("click", function() {
                root._e_save_book.call(root ,$(this), $write_note_btn);
            });
            
            $btns.append( $save_btn ).append( $write_note_btn );
            
            return $btns;
        },
        _new_book_name_done: function(data) {
            this.new_book_data.name = data.name;
        },
        _new_book_author_done: function(data) {
            this.new_book_data.author = data.name;
        },
        _new_book_publisher_done: function(data) {
            this.new_book_data.publisher = data.name;
        },
        _e_save_book: function( $el, $write_note_btn ) {
            if( !Base.Data.get("user")){
                Base.Events.trigger("user_need_login");
                return false;
            }
            
            var root = this;
            console.log( "new book data", this,this.new_book_data );
            Logic_param_create.create_new_book( this.new_book_data).done(function( data ){
                var book  = Global_ajax.get_data( data );
                if( book ){
                    
                    Base.Events.trigger("create_book_done",book );
                    root.new_book_data = book;
                    root.change_btn_status( $el, 'disabled', "已保存");
                    $write_note_btn.show();
                }
            });
        },
        change_btn_status : function( $btn, status, text ){
            if( !$btn.hasClass("btn" ) ){
                $btn = $btn.find(".btn");
            }
            $btn.html( text ).addClass( status );
        },
        _e_write_note : function( $el, book_data ){
            Base.Events.trigger("create_param", book_data);
            console.log(" go write a note for", book_data );
        }
    });

    //TODO 
    var robot_def = Robot.extend({
        events : {
            "on_search_book_done" : [Base.Events, "search_book_done"],
            "on_create_book_done" : [Base.Events, "create_book_done"]
        },
        initialize : function(){
            
        },
        on_search_book_done : function( books,chang_page_handler,param ){
            var root = this;
            var $template;
            var view = new Backbone_ae.View();
            console.log( "on_search_book_done", books)
            if( books.length == 0 ){
                $template = view.template_event().render_binded_element({
                    selector:"#tpl-search-result-empty",
                    context : root
                });
                this.say("search-result", $template );
                root._e_create_book();
                
            }else{
                var $saying = $();
                $saying = $saying.add("<span>搜索 " + param.name + " 结果如下：</span>");
                
                $template = view.template_event().render_binded_element({
                    selector:"#tpl-search-result-then",
                    context : root
                });
                $saying = $saying.add( $template );
                this.say("search-result",$template);
            }
            return false;
            
        },
        on_create_book_done : function( book ){
            
        },
        _e_create_book : function(){
            Base.Events.trigger("create_book");
        }
            
    });
    
    var page_books_def = Backbone_ae.View.extend({
        views : {},
        el: '#page_books',
        books_el : '#books-container',
        book_create_el : '#book-create-container',
        initialize: function() {
            this.views.books = new books_def({el:this.books_el});
            this.views.book_create = new book_create_def({el:this.book_create_el});
            this.views.robot = new robot_def({el : this.el});
            this.template_event().bind_template_event(this.$el);
            this.delegate_events();
        },
        delegate_events : function(){
            Base.Events.bind("search_book_done", this.render_books, this);
            Base.Events.bind("create_book", this.create_book, this);
        },
        render_books : function(){
            this.$el.addClass("page_rendered");
            this.views.book_create.hide();
            this.views.books.render.apply(this.views.books, arguments );
            Base.Events.trigger("page_rendered");
        },
        create_book : function(){
            this.$el.addClass("page_rendered");
            this.views.books.hide();
            this.views.book_create.create_book();
            Base.Events.trigger("page_rendered");
        }
        
    });

    exports.init = function(){
        var page = new page_books_def();
        Router.register("search_book_done", page.el);
    }
});