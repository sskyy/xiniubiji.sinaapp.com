define( function( require, exports){
    var _ = require("underscore");
    var $ = require("jquery");
    var Global_ajax = require("../global/ajax");
    var message = function(){
        this.initialize.apply( this );
    };
    
    _.extend( message.prototype, {
        el : "#leave_message",
        $el : null,
        initialize : function(){
            var root = this;
            this.$el = $(this.el);
            this.bind_event();
        },
        bind_event : function(){
            var root = this;
            this.$el.find(".btn").click(function(){
                var message = $("#leave_message_textarea").val();
                message = $.trim( message );
                if( !message ){
                    alert("不能提交空内容， 谢谢");
                    return ;
                }
                
                root.submit_message( message).done(function(res){
                    if( Global_ajax.get_data( res ) ){
                        root.$el.find(".message_info").html("已提交，谢谢。");
                    }
                });
            });
        }, 
        submit_message : function( message ){
            this.$el.find(".message_info").html("正在提交...");
            return $.ajax({
                "url":"users/leave_message",
                data:{message:message},
                dataType:"json"
            });
        }
    });
    
    var inited = false;
    exports.init = function(){
        if( inited ){
            return;
        }
        
        new message();
    }
});