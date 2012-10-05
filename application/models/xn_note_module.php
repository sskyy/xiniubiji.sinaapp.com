<?php

define( "ERROR_NOTE_USER_NOT_LOGIN", 1 );

class xn_note_module {

    private $manager;
    private $event;
    private $entity_handler;

    public function __construct() {
        
    }

    public function declare_dependence() {
        return array( "event_module", "entity_module", "xn_user_module");
    }

    public function set_event_handler( &$event ) {
        $this -> event = $event;
    }

    public function on_module_register( &$manager ) {
        $this -> manager = $manager;
        $this -> entity_handler = $manager -> get( "entity_module" );
        $this -> session = $manager -> get( "require" ) -> library( "session" );
    }

    public function search_book_by_name( $name, $data_limit ) {
        $data = array(
            "meta" => array(
                "like" => array( "name" => $name )
            ),
            "params" => array( "limit" => $data_limit )
        );
        $books = $this -> entity_handler -> create_collection( "Book", $data );
        return $books;
    }

    public function search_book_in_douban( $name, $data_limit ) {
        $output = array( );
        $this -> db = $this -> manager -> get( "require" ) -> utility( "db" );
        $url = "http://api.douban.com/book/subjects?q={$name}&start-index={$data_limit['offset']}&max-results={$data_limit['limit']}&alt=json";
        if( class_exists( "SaeFetchurl" ) ) {
            $f = new SaeFetchurl();
            $data = $f -> fetch( $url );
        } else {
            $data = file_get_contents( $url );
        }

        if( $data ) {
            $data = json_decode( $data );
            if( is_object( $data ) ) {
                foreach( $data -> entry as $book ) {
                    if( $this -> db -> get_where( "book", array( "link" => "douban:" . $book -> id -> {'$t'} ) ) -> row() ) {
                        continue;
                    }
                    $param_names = array( 'author', 'publisher', 'translator', 'cover', 'isbn10', 'isbn13', 'price', 'pubdate' );
                    $insert_data = array(
                        'name' => $book -> title -> {'$t'},
                        'link' => "douban:" . array_pop( explode( "/", $book -> id -> {'$t'} ) ),
                        'tag' => $name,
                    );

                    foreach( $book -> link as $link ) {
                        if( $link -> {"@rel"} == "image" ) {
                            $insert_data['cover'] = $link -> {"@href"};
                            break;
                        }
                    }

                    $attr_name = "db:attribute";
                    foreach( $book -> $attr_name as $attr ) {
                        if( in_array( $attr -> {"@name"}, $param_names ) ) {
                            $insert_data[$attr -> {"@name"}] = $attr -> {'$t'};
                        }
                    }

                    $added_book = $this -> add_book( $insert_data );
                    if( is_object( $added_book ) ) {
                        $output[] = $added_book -> to_object();
                    }
                }
            }
        }

        return $output;
    }

    public function user_add_book( $data ) {
        if( !$this -> get_current_user() ) {
            return ERROR_NOTE_USER_NOT_LOGIN;
        }else{
            $data['user'] = $this -> get_current_user() ;
        }

        return $this -> add_book( $data );
    }

    private function add_book( $data ) {
        $book = $this -> entity_handler -> create_entity( "Book", $data );
        $book -> set( "created", time() );
        $book -> save();
        return $book;
    }

    public function add_chapter( $data ) {
        $user = $this -> manager -> get( "xn_user_module" ) -> get_current_user();
        if( !$user ) {
            return ERROR_NOTE_USER_NOT_LOGIN;
        }

        $data['name'] = trim( $data['name'] );
        $chapter_exist = $this -> entity_handler -> search_entity( "Chapter", $data );
        if( $chapter_exist ) {
            return $chapter_exist;
        }

        $chapter = $this -> entity_handler -> create_entity( "Chapter", $data );
        $chapter -> set( "user", $user );
        $chapter -> save();
        return $chapter;
    }

    public function add_param( $param_data ) {
        if( !$this -> get_current_user() ) {
            return ERROR_NOTE_USER_NOT_LOGIN;
        }

        $note_data = array( "book" => $param_data['book'] );
        $note = $this -> entity_handler -> search_entity( "Note", $note_data );
        if( !$note ) {
            $note_data['created'] = time();
            $note_data['user'] = $this -> get_current_user();
            $note = $this -> entity_handler -> create_entity( "Note", $note_data );
            $note -> save();
        }

        $param_data['note'] = $note -> to_object();
        $param_data['created'] = time();
        $param_data['user'] = $this -> get_current_user();
        $param = $this -> entity_handler -> create_entity( "Param", $param_data );

        if( $param -> save() ) {
            $note -> set( "last_param", $param -> to_object() );
            $note -> save();
            return $param;
        } else {
            return false;
        }
    }

    private function get_current_user() {
        return $this -> manager -> get( "xn_user_module" ) -> get_current_user();
    }

    public function get_notes_by_book( $book ) {
        $data = array(
            "meta" => array( 'book' => $book ),
            "with_related_entities" => array( "last_param", "user" )
        );
        
        $collection = $this -> entity_handler -> create_collection( "Note", $data );
        $mixined_collection = $this -> event -> trigger_async( "get_notes_by_book_mixin_output", $collection );
        return $mixined_collection ? $mixined_collection : $collection;
    }

    public function get_params_by_note( $note ) {
        $data = array(
            "meta" => array( "note" => $note ),
            "with_related_entities" => array( "chapter" )
        );

        return $this -> entity_handler -> create_collection( "Param", $data );
    }

    public function get_chapters_by_meta( $meta ) {

        $params = array( "meta" => $meta, "with_related_entities" => array( "book", "parent_chapter" ) );
        return $this -> entity_handler -> create_collection( "Chapter", $params );
    }

    public function my_notes() {
        $me = $this -> get_current_user();
        $data = array(
            "meta" => array( "user" => $me ),
            'with_related_entities' => array( "book" )
        );
        return $this -> entity_handler -> create_collection( "Note", $data );
    }

}

?>
