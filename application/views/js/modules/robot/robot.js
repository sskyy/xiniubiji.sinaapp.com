define( function(require, exports){
    var _ = require("underscore");
    var Base = require("base");
    var $ = require("jquery");
    
    var ctor = function(){};
    var inherits = function(parent, protoProps, staticProps) {
        var child;

        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call the parent's constructor.
        if (protoProps && protoProps.hasOwnProperty('constructor')) {
            child = protoProps.constructor;
        } else {
            child = function(){
                parent.apply(this, arguments);
            };
        }

        // Inherit class (static) properties from parent.
        _.extend(child, parent);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) _.extend(child.prototype, protoProps);

        // Add static properties to the constructor function, if supplied.
        if (staticProps) _.extend(child, staticProps);

        // Correctly set child's `prototype.constructor`.
        child.prototype.constructor = child;

        // Set a convenience property in case the parent's prototype is needed later.
        child.__super__ = parent.prototype;

        return child;
    };
    
    var robot = function( options ){
//        console.log("robot construct", options);
        this._construct.apply( this, options);
        this._delegate_events.apply(this);
        this.initialize.apply( this, options);
        
    };
    
    //TODO 仿造一个view
    _.extend( robot.prototype, {
        el : null,
        $el : null,
        _construct : function( options ){
            if( options ){
                for( var i in this ){
                    if( i in options ){
                        this[i] = options[i];
                    }
                }
            }
            
        },
        initialize : function( options){},
        _delegate_events : function(){
//            console.log( "delegate event ",this.events, this )

            var root = this;
            if( !( "events" in this ) ){
                return;
            }
            _.each( this.events, function( event_array,callback_name ){
                var event_obj = event_array[0];
                var event_name = event_array[1];
//                console.log( "event bind", event_name );
                event_obj.bind(event_name,function(){
                    var event_args = arguments;
                    var args = [ event_name, callback_name, event_args ];
                    root._event_handler.apply( root, args );
                });
            });
        },
        _event_handler : function( event_name,event_callback, event_args ){
            var root = this;
            console.log(event_name, event_callback, event_args );
            if( ! (event_callback in root) ){
                console.log( event_callback ," not exist");
                return;
            }
            
            var result = root[event_callback].apply( root, event_args );
            console.log( "callback_result", result);
            if( result ){
                var condition = event_name.replace(/_/g,"-");
                Base.Events.trigger( "robot-say" , result , condition);
            }
        },
        say : function( condition, message ){
            Base.Events.trigger( "robot-say" , message , condition);
        }
    });
    
    var extend = function (protoProps, classProps) {
        var child = inherits(this, protoProps, classProps);
        child.extend = this.extend;
        return child;
    };

    // Set up inheritance for the model, collection, and view.
    robot.extend = extend;
    
    return robot;
});


