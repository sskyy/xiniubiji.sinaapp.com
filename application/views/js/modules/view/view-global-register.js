define(function(require, exports, module) {
    var $ = require("jquery");
    var _ = require("underscore");
    var Base = require("base");
    var Global_ajax = require("../global/ajax");
    var Logic_register = require("../global/user/user-logic-register");
    var View = require("./view");
    require("./plugin-BB-template-event");
    
    
    var Backbone_ae = View.create_backbone_with_plugin('BB-template-event')
    console.log(Backbone_ae );

    var ele_def =  Backbone_ae.View.extend({
        views: {},
        el: $('#user-container'),
        initialize: function() {
            this.render();
            this.logic = Logic_register;
            this.check_login();
        },
        get_data : function(){
            var data = {};
            data.email = this.$el.find("#login-email").val();
            data.password = this.$el.find("#login-password").val();
            return data;
        },
        _e_login : function(){
            var root = this;
            var data = this.get_data();
            if( root.check_data( data ) ){
                this.logic.login( data ).done(function(data){
                    if( Global_ajax.get_error( data ) ){
                        alert( Global_ajax.get_error( data ))
                    }else if(Global_ajax.get_data( data )) {
                        alert("登录成功"); 
                    }
                    
                    root.save_current_user( Global_ajax.get_data( data ) );
                })
            }

        },
        _e_register : function(){
            var root = this;
            var data = this.get_data();
            if( root.check_data( data ) ){
                
                this.logic.register( data ).done(function(data){
                    if( Global_ajax.get_error( data ) ){
                        alert( Global_ajax.get_error( data ))
                    }else if(Global_ajax.get_data( data )) {
                        alert("注册成功"); 
                        console.log( data );
                        root.save_current_user( Global_ajax.get_data( data ) );
                    }
                })
            }
        },
        check_data : function( data ){
            for( var i in data){
                if( !data[i]){
                    return false;
                }
            }
            return true;
        },
        save_current_user : function( data){
            Base.Data.set("user", data);
            this.refresh();
        }, 
        refresh : function( ){
            this.render();
        },
        render : function(){
            var root   = this;
            var $view;
            var user = root.is_logged_in()
            if( user ){
                $view = root.template_event()
                .render_binded_element({
                    selector:"#tpl-current-user", 
                    context:root, 
                    data:user
                });
            }else{
                $view = root.template_event()
                .render_binded_element({
                    selector:"#tpl-login", 
                    context:root
                });
            }
            root.$el.html( $view );
        },
        _e_view_my_account : function(){
           Base.Events.trigger("view_my_account") ;
        },
        _e_logout : function( $el, options, e ){
            e.stopPropagation();
            this.logout();
        },
        logout : function(){
            var root = this;
            this.logic.logout().done(function( res ){
                var user = Global_ajax.get_data( res );
                if(  !Global_ajax.get_error( res )){
                    root.remove_current_user();
                }
            });
        },
        remove_current_user : function(){
            Base.Data.remove("user");
            this.refresh();
        },
        is_logged_in : function(){
            return Base.Data.get("user");
        },
        check_login : function(){
            var root = this;
            this.logic.check_login().done(function( res ){
                var user = Global_ajax.get_data( res );
                if(  user &&  _.isObject( user )){
                    root.save_current_user( user );
                }
            });
        },
        warn : function( message ){
            this.message( message );
            this.$el.find("#login-container").addClass("warn");
            console.log("user not logged in");
            if( !this.is_logged_in() ){
                this.focus();
            }
        },
        focus : function(){
            console.log("focus");
            $("#login-email").focus();
        },
        message : function( message ){
            this.$el.find(".register-message").html(message);
        }
    });
    
    var inited = false;
    
    
    exports.init = function(){
        if( inited ){
            return ;
        }
        var ele_register = new ele_def();
        Base.Events.bind("user_need_login", function(){
            ele_register.warn("您还没有登陆");
        }, ele_register  );
        
        inited = true;
    }
});