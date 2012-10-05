define(function(require, exports, module) {
    var Base = require("../base");

    var Helper = {
        init_views: function( views_to_be_load ) {
            for (var i in views_to_be_load) {
                require.async(views_to_be_load[i],function( view){
                    if( "init" in view ){
                        view.init();
                    }
                });
            }
        }
    }
    
    window.Util = {
        formatDate : function(date, separator) {
            if(/^\d{10}$/.test(date)) date *= 1000;
            if (/^\d+$/.test(date)) date = +date;
            date = date ? new Date(date) : new Date();
            separator = separator || "$1-$2-$3 $4:$5:$6";
            return String([
                date.getFullYear(),
                (date.getMonth() + 101),
                (date.getDate() + 100),
                (date.getHours() + 100),
                (date.getMinutes() + 100),
                (date.getSeconds() + 100)]
                ).replace(/^(\d+),\d*(\d{2}),\d*(\d{2}),\d*(\d{2}),\d*(\d{2}),\d*(\d{2})$/g, separator);
        },
        value_var : function(  variable ){
            if( typeof( variable) == 'undefined' ){
                return '';
            }
            if( variable == null ){
                return '';
            }
            if( variable == 'null'){
                return '';
            }
            if( variable == 'true'){
                return true;
            }
            if( variable == 'false'){
                return false;
            }
            return variable;
        }
    }


    Base.plug("Helpers", Helper);

});