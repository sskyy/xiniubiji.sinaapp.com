define(function(require, exports, module) {
    var Base = require("base");
    var $ = jQuery = require("jquery");
    var _ = require("underscore");
    var View = require("./view");
    require("./plugin-BB-common-list");
    require("./plugin-BB-template-event");


    var collection_book_types_def = require("../note/note-collection-book_types");

    var Backbone_common_list = View.create_backbone_with_plugin("BB-common-list");

    var book_types_def = Backbone_common_list.View.extend({
        collection_book_types: new collection_book_types_def(),
        el: '#catagories_con',
        common_list_options: {
            item_class: '.catagory',
            item_tpl_id: '#tpl-book_type',
            select_event: 'book_type_select'
        },

        get_all_book_types: function() {
            var root = this;
            this.collection_book_types.get_all_type().done(function( data ) {
                root.render_common_list(data);
            });
        },
        book_type_select: function(type) {
            Base.Events.trigger("page_index_book_type_select",type);
        }
    });


    var Backbone_ae = View.create_backbone_with_plugin('BB-template-event');
    var page_index_def = Backbone_ae.View.extend({
        views: {},
        el: $('#page_index'),
        initialize: function() {
            this.views.book_types = new book_types_def();
            this.views.book_types.get_all_book_types();
            this.template_event().bind_template_event( this.$el);
        }
    });


    exports.init = function() {
        new page_index_def();
    };
});