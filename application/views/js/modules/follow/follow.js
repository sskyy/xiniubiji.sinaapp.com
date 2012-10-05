define( function(require, exports){
    var $ = require("jquery");

    exports.follow = function( object_name, object ){
        var data = {};
        data[object_name] = object;
        data['object_name'] = object_name;
        return $.ajax({
            url:"/follow/follow_object",
            data : data,
            dataType:'json'
        });
    }
    
    exports.unfollow = function( object_name, object ){
        var data = {};
        data[object_name] = object;
        data['object_name'] = object_name;
        return $.ajax({
            url:"/follow/unfollow_object",
            data : data,
            dataType:'json'
        });
    }
});