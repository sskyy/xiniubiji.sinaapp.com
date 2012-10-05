define(function(require, exports, module) {
    var Logic_param_create = require("../note/note-logic-param_create");
    var Base = require("base");
    var $ = require("jquery");
    var Global_ajax = require("../global/ajax");
    //for navbar
    require("../global/element/portamento.js");
    
    var limit_number = 12;
    var search_book= function( name, page, $el ){
        var offset = limit_number * page;
        var limit = {
            limit:limit_number, 
            offset:offset
        };
        $el.addClass("searching");
        
        Logic_param_create.get_related_book( name,limit ).done(function( res ){
            var books = Global_ajax.get_data( res );
            
            if( books.length !=  0 ){
                Base.Events.trigger("search_book_done",books, function change_page_handler( page ){
                    search_book( name, page, $el );
                }, {
                    name:name, 
                    page:page, 
                    limit:limit
                } );
                $el.removeClass("searching");
            }else{
                search_book_in_douban( name, page, $el );
            }
           
        });
    } 
    
    var search_book_in_douban = function( name, page, $el ){
        var offset = limit_number * page;
        var limit = {
            limit:limit_number, 
            offset:offset
        };
        Logic_param_create.search_book_in_douban( name,limit ).done(function( res ){
            var books = Global_ajax.get_data( res );
            
            Base.Events.trigger("search_book_done",books, function change_page_handler( page ){
                search_book_in_douban( name, page, $el );
            }, {
                name:name, 
                page:page, 
                limit:limit
            } );
            $el.removeClass("searching");
        });
    }
    
    function createCSS(cssText,id) {
        var elem = document.getElementById(id)
        if (elem) return

        
        elem = document.createElement('style')
        elem.id=id;
        document.getElementsByTagName('head')[0].appendChild(elem)

        if (elem.styleSheet) { // IE
            elem.styleSheet.cssText = cssText
        } else { // W3C
            elem.appendChild(document.createTextNode(cssText))
        }
    }
    
    var inited = false;
    exports.init = function(){
        if( inited  ){
            return false;
        }else{
            console.log( $("#container-head").width() );
            for( var i in $("#container-head").get(0) ){
                console.log(i, $("#container-head").get(0)[i]);
            }
//            console.log( $("#container-head").get(0) );
            $("#container-navbar").portamento({
                gap:0
            });
            
            $("input[data-action=book-search]").keyup(function(e){
                if( e.keyCode ==13){
                    var name = $(this).val();
                    search_book( name, 0, $(this) );
                }
            });
            
            
            var clientHeight = document.documentElement.clientHeight;
            var cssText = ".min-clientHeight {min-height:"+clientHeight+"px}";
            createCSS( cssText,"style_for_page_rendered" );
            
            inited = true;
        }
    }
    
});