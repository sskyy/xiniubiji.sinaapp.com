define(function(require, exports, module) {
    
    exports.show_loading = function( $el ){
        $el.height( $el.height() ).width( $el.width() ).html("").addClass("loading");
    }
    
    exports.hide_loading = function( $el ){
        $el.height("auto").width("auto").removeClass("loading");
    }
    
});