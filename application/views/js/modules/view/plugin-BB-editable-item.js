define(function( require, exports, module ){
    var View = require("./view");
    var _ = require("underscore");
    var $ = require("jquery");
    var template_event_obj = require("./plugin-BB-template-event");
    
    var editable_item_obj = {
        /*
         * supported options :
         * *template : ''
         * *data : {},
         * container : '#tpl-editable-item-container',
         * data_edit_names : [],
         * enables : ['edit', 'delete'],
         * callbacks : {on_edit_done, on_delete_done, on_edit, on_validate_edit},
         * context闂佹寧绋掗鈺眑l
         */

        render_editable_item : function( options ){
            var _default_options = {
                template : "",
                data :{},
                container : '#tpl-editable-item-container',
                enables : ['edit'],
                callbacks : {},
                data_edit_names : [],
                refresh : true,
                icons : {
                    "edit": "icon-edit",
                    'delete':'icon-remove'
                }
            }
            var root = this;
            options = options || {};
            options = _.extend( _default_options, options);
            if( options.data_edit_names.length == 0 ){
                for( var data_name in options.data ){
                    options.data_edit_names.push( data_name);
                }
            }
            
            var $output = root.editable_item()._build_output( options );
            return $output;
        },
        editable_item : function(){
            var root = this;
            return{
                _build_output : function( options ){
                    var $element = this._build_element( options );
                    var $output = this._add_wrapper( $element );
                    this._delegate_events( $output, options );
                    return  $output;
                },
                _build_element : function( options ){
                    var output_template = this._build_template( options );
                    var input_ids = this._build_input_ids( options );
                
                    var $output = $( _.template( output_template, {
                        data : options.data,
                        input_ids : input_ids,
                        data_edit_names : options.data_edit_names,
                        icons : options.icons
                    } ) );
                    
                    _.each( options.enables, function( enable_act ){
                        $output.addClass("enable_"+enable_act );
                    });
                    this.add_fingerprint( $output );
                    return $output;
                },
                _build_template : function( options ){
                    var template =$(options.container).html().toString() ;
                    
                    if( /^[#.]/.test(options.template)){
                        options.template = $(options.template).html().toString();
                    }
                    
                    template = template.replace( '<div class="editable-item-items"></div>',
                        '<div class="editable-item-items">'+options.template+'</div>');
                    return template;
                },
                _add_wrapper:function( $el ){
                    $el = $("<div></div>").append( $el );
                    return $el;
                },
                _build_input_ids : function( options ){
                    options.input_ids = {};
                    for( var item_name in options.data ){
                        options.input_ids[item_name] = item_name+ Math.round( Math.random() * 100 );
                    }
                    return options.input_ids;
                },
                _delegate_events : function( $output, options ){
                    var opt = {
                        function_prefix : "_e_editable_",
                        data : options
                    };
                    root.template_event().bind_template_event( $output, opt );
                },
                _refresh_data : function( $el, data, options){
                    options.data = data;
                    var $new_el = this._build_element( options );
                    $el.html( $new_el );
                    this._delegate_events( $el, options );
                    $el.data( $new_el.data());
                    this._change_status( $el, "normal");
                    console.log("refreshed editable item", $el , data );
                },
                _change_status : function( $el, status ){
                    switch( status){
                        case  'edit':
                            $el.addClass('edit').find("input").focus().select();
                            break;
                        case 'normal':
                            $el.removeClass("edit");
                            break;
                        default:
                            break;
                    }
                },
                refresh_data : function( $el, data ){
                    return this._refresh_data( $el, data, $el.data()); 
                },
                call_callback : function( callback_name, options , data){
                    var base = options;
                    if( "context" in options ){
                        base = options.context;
                    }
                    if( callback_name in options.callbacks ){
//                        if( !( callback_name in base) ){
//                            console.log("editable-item callback " + callback_name + " not exist" , base, options);
//                        }
                        return options.callbacks[callback_name].call( base, data);
                    }
                    return true;
                },
                refresh : function( $el, data ){
                    this.unbind_hotkey( $el ),
                    this.refresh_data( $el, data );
                },
                bind_hotkey : function( $el , options){
                    $el.bind('keyup.editable_item',function(e){
                        if( e.keyCode ==13){
                            root._e_editable_edit_done( $el, options );
                        }else if( e.keyCode == 27 ){
                            root._e_editable_cancel( $el, options );
                        }else{
                            console.log(e.keyCode);
                        }
                    });

                    $("body").bind('click.editable_item', function(e){
                        console.log('blur');
                        root._e_editable_edit_done( $el, options );
                    });    
                },
                unbind_hotkey : function( $el ){
                    $el.unbind(".editable_item");
                    $("body").unbind(".editable_item");
                },
                add_fingerprint : function( $el ){
                    var fingerprint = Date.parse( new Date );
                    $el.attr( this.finggerprint_name,fingerprint.toString());
                },
                get_fingerprint: function( $el ){
                    return $el.attr( this.finggerprint_name);
                },
                finggerprint_name : "editable-item-finggerprint"
            }
        },
        _e_editable_cancel : function( $el, options, e ){
            if( e ){
                e.stopPropagation();
            }
            this.editable_item()._change_status($el, "normal");
            this.editable_item().call_callback( "on_edit_cancel", options );
        },
        _e_editable_edit : function( $el, options, e ){
            var root = this;
            e.stopPropagation();
            if( !this.editable_item().call_callback( "validate_edit", options, options.data)){
                return false;
            }
            
            this.editable_item().bind_hotkey( $el, options );
            this.editable_item().call_callback( "on_edit", options, options.data);
            this.editable_item()._change_status($el, "edit");
        },
        _e_editable_delete : function( $el, options, e){
            e.stopPropagation();
            this.editable_item().call_callback( "on_delete_done", options, options.data);
        },
        _e_editable_edit_done : function( $el, options, e){
            var root = this;
            if( e ){
                e.stopPropagation();
            }
                    
            this.editable_item()._change_status($el, "normal");

            var new_data = {}
            for( var item_name in options.data ){
                new_data[item_name] = $el.find("#"+ options.input_ids[item_name] ).val();
            }
            
            root.editable_item().unbind_hotkey( $el );
            
            if( options.refresh ){
                console.log("inner refresh", $el );
                root.editable_item()._refresh_data($el, new_data,options);
            }
            this.editable_item().call_callback( "on_edit_done", options, new_data);
        }

    };
    
    editable_item_obj = _.extend(editable_item_obj, template_event_obj);
    View.add_plugin("BB-editable-item", editable_item_obj);
    return editable_item_obj;
});