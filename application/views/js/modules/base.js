define(function(require, exports, module) {
    
    
    seajs.config({
        alias: {
            'base': 'modules/base'
        }
    });
    
    
    exports.plug = function( plugin_name, plugin_instant ){
        if( plugin_name in exports ){
            console.log( plugin_name + " already exist .");
        }
        exports[plugin_name] = plugin_instant;
    }
    
});