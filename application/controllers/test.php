<?php

if( !defined( 'BASEPATH' ) )
    exit( 'No direct script access allowed' );

class Test extends MY_Controller {

    public function __construct() {
        parent::__construct();

        $this -> entity_handler = $this -> load -> module( "entity_module" );
    }

//    public function index(){
//    $this->load->library('log/log_test');
//        
//    echo $this->log_test->run('case1');
//        
//    }

    public function test_trigger_asynch_event() {
        $validate_result = $this -> access_validate();
        if( $validate_result ) {
            echo "validated true";
        } else {
            echo "validated false";
        }
        $this -> test_model -> test_trigger_asynch_event();
        echo "<pre>";
        print_r( $this -> get_access_validate_info() );
        echo "</pre>";
    }

    public function test_add_category() {
        $data = array(
            'name' => "new category"
        );
        $event_handler = $this -> mm -> get( "event_model" );
        $result = $event_handler -> trigger_async( "add entity", 'Category', $data );
        echo json_encode( $result );
    }

    public function test_collection_load() {
        $entity_handler = $this -> mm -> get( "xn_entity_model" );
        $category_collection = $entity_handler -> create_collection( "Category" );
        echo json_encode( $category_collection -> to_array() );
    }

    public function test_view_component() {
        $this -> load -> view( "test.php" );
    }

    public function test_like() {
        $entity_handler = $this -> mm -> get( "xn_entity_model" );
        $book_name = "";
        $data = array( "meta" => array( "like" => array( "name" => $book_name ) ) );
        $book = $entity_handler -> create_collection( "Book", $data );
        echo json_encode( $book -> to_array() );
    }

    public function test_create_collection_by_meta() {
        $meta = array( );
        $key_to_be_load = array( "name", "bid", "pid" );
        foreach( $key_to_be_load as $key ) {
            if( $this -> input -> get_post( $key ) ) {
                $meta[$key] = $this -> input -> get_post( $key );
            }
        }

        $entity_handler = $this -> mm -> get( "xn_entity_model" );

        $data = array( "meta" => $meta );

        $chapters = $entity_handler -> create_collection( "Chapter", $data );
        echo json_encode( $chapters -> to_array() );
    }

    public function test_array() {
        $array = array(
            1,
            "a" => "b",
            "c"
        );
        print_r( $array );
    }

    public function test_create_entity_with_related_entity() {
        $entity_handler = $this -> mm -> get( "xn_entity_model" );
        $note = $entity_handler -> create_entity( "Note", 1, array( "with_related_entities" => array( "book", "last_param" ) ) );
        print_r( $note -> to_object() );
    }

    public function test_get_entities_by_related_entity() {
        $meta = array( "last_param" => array( "id" => 14 ), "book" => array( "id" => 13 ) );
//        $meta = array("last_param"=>array("id"=>14));

        $entity_handler = $this -> mm -> get( "xn_entity_model" );

        $data = array( "meta" => $meta, "with_related_entities" => array( "last_param" ) );

        $notes = $entity_handler -> create_collection( "Note", $data );
        print_r( $notes -> to_array() );
    }

    public function test_search_entity() {
        $note_data = array( "book" => array( "id" => 13 ) );
        $note = $this -> entity_handler -> search_entity( "Note", $note_data );
        print_r( $note -> to_object() );
    }

    public function test_douban_book() {
        //
        //����� ���(11825)  ���(12510) ����(12606) IT(13871) python(13927) php(14055) javascript(14173)
        //q �����(22017) ���(25682) ���(30184) ����(38487) python(38687) php(39053) javascript(39353) C++(43987)
        $start = 1;
        $increase = 10;
        $q = 'C++';
        while( $start < 20000 ) {
            $data = file_get_contents( "http://api.douban.com/book/subjects?q={$q}&start-index={$start}&max-result={$increase}&alt=json" );
            if( $data ) {
                $data = json_decode( $data );
                if( is_object( $data ) ) {
                    foreach( $data -> entry as $book ) {
                        if( $this -> db -> get_where( "book", array( "id" => $book -> id -> {'$t'} ) ) -> row() ) {
                            continue;
                        }
                        $param_names = array(
                            'author',
                            'publisher',
                            'translator',
                            'cover',
                            'isbn10',
                            'isbn13',
                            'price',
                            'pubdate'
                        );
                        $insert_data = array(
                            'name' => $book -> title -> {'$t'},
                            'id' => $book -> id -> {'$t'},
                            'tag' => $q
                        );
                        $attr_name = "db:attribute";
                        foreach( $book -> $attr_name as $attr ) {
                            if( in_array( $attr -> {"@name"}, $param_names ) ) {
                                $insert_data[$attr -> {"@name"}] = $attr -> {'$t'};
                            }
                        }

                        $this -> db -> insert( "book", $insert_data );
                    }
                } else {
                    echo "data is not object<br>";
                }
            } else {
                echo "data not right<br>";
            }
            $start += $increase;
        }
    }

    public function douban_book_get_cover() {
        $offset = 0;
        $increace = 10;
        while( $offset < 10 ) {
//            $rows = $this -> db->limit(  $increace, $offset) 
//                    ->where("cover",null)-> get("book")->result();
            $rows = $this -> db -> query( "select * from book where cover is null" ) -> result();
            foreach( $rows as $row ) {

                if( !$row -> cover ) {
                    $book_data = file_get_contents( $row -> id . "?alt=json" );
                    $book_data = json_decode( $book_data );
                    foreach( $book_data -> link as $link ) {
                        if( $link -> {"@rel"} == "image" ) {
                            echo $link -> {"@href"};
                            $row -> cover = $link -> {"@href"};
                            break;
                        }
                    }
                    if( $row -> cover ) {
                        $this -> db -> where( "id", $row -> id );
                        unset( $row -> id );
                        $this -> db -> update( "book", $row );
                    }
                }
            }
            $offset += $increace;
        }
    }

    public function change_book_id() {
        $limit = 5000;
        $offset = 0;
        while( $offset < 45000 ) {
            $rows = $this -> db -> limit( $limit, $offset ) -> get( "book" ) -> result();
            foreach( $rows as $row ) {
                $this -> db -> where( "id", $row -> id );

                $book_id = $offset + 1;
                $row -> id = $book_id;
                $this -> db -> update( "book", $row );
            }
            $offset += $limit;
        }
    }
    
    public function change_book_link(){
        $limit = 5000;
        $offset = 0;
        while( $offset < 45000 ) {
            $rows = $this -> db -> limit( $limit, $offset ) -> get( "book" ) -> result();
            foreach( $rows as $row ) {
                $this -> db -> where( "id", $row -> id );
                $row -> link = "douban:" .$row -> id;
                $this -> db -> update( "book", $row );
            }
            $offset += $limit;
        }
    }

}

/* End of file Test.php */