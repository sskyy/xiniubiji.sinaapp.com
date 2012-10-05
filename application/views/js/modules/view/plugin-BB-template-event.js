define(function( require, exports, module ){
    var _ = require("underscore");
    var $ = require("jquery");
    var View = require("./view");
   
   
    var template_event_obj = {
        template_event : function(){
            var root = this;
            return {
                render_binded_element : function( opt ){
                    /**
                    * opt example : 
                    * opt = {
                    *  selector : "#id",
                    *  data : data,
                    *  events : events,
                    *  function_prefix : "_e_,
                    *  context : root,
                    *  event_namespace : ""
                    * }
                    */
                    var default_opt = {
                        bind_prefix : "_e_",
                        data : {}
                    }
                    opt = opt || {};
                    opt = _.extend( default_opt, opt );
                    
                    var $element;
                    
                    if( "selector" in opt ){
                        $element = this.template(opt.selector , opt.data)
                    }
            
                    this.bind_template_event( $element, opt );
                    return $element;
                },
                bind_template_event : function( $element, opt ){
                    var self = this;
                    opt  = opt || {};
                    opt.data = opt.data || {};
                    $element.data(opt.data);
                    var default_opt = {
                        events : ['click'],
                        function_prefix : "_e_"
                    };
                    opt = opt || {};
                    opt = _.extend( default_opt, opt);
                    if( $element ){
                        _.each( opt.events, function( event_name ){
                            if( $element.attr("event-"+event_name) ) {
                                var function_name = opt.function_prefix + $element.attr("event-"+event_name);
                                $element.bind(event_name, function(e){
                                    console.log( "--------------", e);
                                    self._call_bind_function( function_name, $element, opt, e);
                                });
                            }
                            
                            $element.find("[event-"+event_name+"]").bind(event_name, function( e ){
                                var function_name = opt.function_prefix + $(this).attr("event-"+event_name);
//                                console.log( this, function_name );
                                self._call_bind_function( function_name, $element, opt, e);
                            });
                        });
                    }
                    return $element;
           
                },
                template : function( selector, data ){
                    var $element ;
                    if( $( selector).length == 0 ){
                        console.log("selector " +selector + " not exist");
                        return false;
                    }
                    
                    if( /^script$/i.test( $( selector).get(0).tagName ) ){
                        $element = $( _.template( $( selector).html(), data) ).data( data);
                    }
                    return $element;
                },
                _call_bind_function:function( function_name, $el, opt, e ){
                    if( "context" in opt &&  function_name in opt.context ){
//                        console.log( "bind function_name in context", function_name, opt.context );
                        opt.context[function_name].call( opt.context, $el,  opt.data, e );
                    }else{
                        var base = root;
                        if( "event_namespace" in opt ){
                            base = root['event_namespace']();
                        }
                        
                        if( function_name in base ){
                            base[function_name]( $el, opt.data,  e);
                        }else{
                            console.log( "function : " + function_name + " : do not exist");
                        }
                        
                    }
                }
                
            }
        }
        
    };
    
    View.add_plugin("BB-template-event",template_event_obj);
    return template_event_obj;
});