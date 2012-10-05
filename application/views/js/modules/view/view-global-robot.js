define(function(require, exports, module) {
    var Base  = require("base");
    var $ = require("jquery");
            

    function robot_say( message, condition ){
        console.log( "view robot say", message, condition );
        var $well = $("[data-condition="+condition+"]");
//        if( $well.children().length ){
//            $well.children().remove();
//        }
        $well.html( message );
    }
    
    var inited = false;
    exports.init = function(){
        if(  inited ){
            return false;
        }

        inited = true;
        Base.Events.bind("robot-say", robot_say);
    }
});