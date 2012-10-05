define(function(require, exports, module) {
    var _  = require("underscore");
    var Backbone = require("backbone");
    var $ = require("jquery");
    var Base = require("base");
    
    require('../global/css/style.less');

    var Backbone_base =  _.extend( {}, Backbone );
    Backbone_base.View = Backbone_base.View.extend({
        plugin_init_funs : [],
        plugin_initialize : function(options){
            for( var fun in this.plugin_init_funs ){
                this.plugin_init_funs[fun].call(this, options );
            }
        }
    });

    var require_plugin = function(plugin_name){
        var _d = $.Deferred();
        require.async(plugin_name, function(){
            _d.resolve(plugin_name);
        });
        return _d;
    }

    var plugins_cache = {};
    var view_with_plugin_cache = {};
    exports.create_backbone_with_plugin  = function( plugin_names ){
        if( /^s/.test( typeof(plugin_names ) ) ){
            var plugin_names = [ plugin_names ];
        }

        plugin_names = plugin_names.sort();
        var view_with_plugin_cache_index = plugin_names.join(",");
        
        if( view_with_plugin_cache_index in view_with_plugin_cache ){
            console.log( "returning cache" , view_with_plugin_cache_index);
            return _.extend({},view_with_plugin_cache[view_with_plugin_cache_index]);
        }

        if( _.intersection( plugin_names, _.keys( plugins_cache ) ).length != plugin_names.length ){
            
            return false;
        }

        var new_backbone = _.extend( {}, Backbone_base );
        for( var i in plugin_names ){
            
            new_backbone.View = new_backbone.View.extend(plugins_cache[plugin_names[i]]);
            
        } 
        
        var _initialize_funs = [];
        for( var i in plugin_names ){
            if( "_initialize" in plugins_cache[plugin_names[i]] ){
                _initialize_funs.push( plugins_cache[plugin_names[i]]._initialize );
            }
        }
        new_backbone.View = new_backbone.View.extend({
            plugin_init_funs : _initialize_funs
        });
        
        view_with_plugin_cache[view_with_plugin_cache_index] = new_backbone;
            
        return new_backbone;
    }

    exports.add_plugin = function( plugin_name, plugin_instant ){
        plugins_cache[plugin_name] = plugin_instant;
    }
    
    
    function init_module( module ){
        if( "init" in module ){
            module.init();
        }
        return module;
    }
    
});