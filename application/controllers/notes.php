<?php

if( !defined( 'BASEPATH' ) )
    exit( 'No direct script access allowed' );

/**
 * @date 2012-7-17
 */
class Notes extends MY_Controller {

    public function __construct() {
        parent::__construct();
        $this -> xn_note = $this -> load -> module( "xn_note_module" );
        $this -> entity_handler = $this -> load -> module( "entity_module" );
        $this -> xn_output = $this -> load -> module( "xn_output_module" );
        $this -> event = $this -> load -> module( "event_module" );
        $this -> xn_input = $this -> load -> module( "xn_input_module" );
        $this -> xn_follow = $this -> load -> module( "xn_follow_module" );
    }

    public function index() {
        $this -> load -> view( "index" );
    }

    public function get_category( $id ) {
        $module = $this -> mm -> get_module( "entity_model" );
        $category = $module -> create_entity( "Category", $id );
        echo json_encode( $category -> to_object() );
    }

    public function get_categories( $pid = null ) {
        $category_collection = $this -> entity_handler -> create_collection( "Category" );
        $this -> xn_output -> output( "data", $category_collection -> to_array() );
    }

    public function add_book() {
        $data = $this -> xn_input -> fetch_data( array( "name", "author", "publisher" ) );

        $book = $this -> xn_note -> user_add_book( $data );

        if( is_object( $book ) ) {
            $this -> xn_output -> output( "data", $book -> to_object() );
        } else if( $book == ERROR_NOTE_USER_NOT_LOGIN ) {
            $this -> xn_output -> output( "error", "user not login" );
        } else {
            $this -> xn_output -> output( "error", "book save failed" );
        }
    }

    public function add_chapter() {
        $data = $this -> xn_input -> fetch_data( array( "name", "book", "parent_chapter" ) );

        $added_chapter = $this -> xn_note -> add_chapter( $data );

        if( is_object( $added_chapter ) ) {
            $this -> xn_output -> output( "data", $added_chapter -> to_object() );
        } else if( $added_chapter == ERROR_NOTE_USER_NOT_LOGIN ) {
            $this -> xn_output -> output( "error", "user not login" );
        } else {
            $this -> xn_output -> output( "error", "chapter save failed" );
        }
    }

    public function get_related_book() {
        $book_name = array_pop( $this -> xn_input -> fetch_data( "name" ) );
        $data_limit = array_pop( $this -> xn_input -> fetch_data( "data_limit" ) );
        $books = $this -> xn_note -> search_book_by_name( $book_name, $data_limit );
        $this -> xn_output -> output( "data", $books -> to_array() );
    }

    public function get_chapters_by_meta() {
        $meta = $this -> xn_input -> fetch_data( array( "book", "parent_chapter" ) );

        $chapters = $this -> xn_note -> get_chapters_by_meta( $meta );
        $this -> xn_output -> output( "data", $chapters -> to_array() );
    }

    public function add_param() {
        $param_data = $this -> xn_input -> fetch_data( array( "content", "book", "chapter" ) );

        $added_param = $this -> xn_note -> add_param( $param_data );

        if( is_object( $added_param ) ) {
            $this -> xn_output -> output( "data", $added_param -> to_object() );
        } else if( $added_param == ERROR_NOTE_USER_NOT_LOGIN ) {
            $this -> xn_output -> output( "error", "user not login" );
        } else {
            $this -> xn_output -> output( "error", "param save failed" );
        }
    }

    public function get_books_by_category() {
//        $meta = $this -> xn_input -> fetch_data(array("tid"));
        $meta = $this -> xn_input -> fetch_data( array( ) );

        $entity_handler = $this -> mm -> get( "xn_entity_model" );

        $data = array( "meta" => $meta );

        $books = $entity_handler -> create_collection( "Book", $data );
        $this -> xn_output -> output( "data", $books -> to_array() );
    }

    public function get_notes_by_book() {
        $meta = $this -> xn_input -> fetch_data( array( "book" ) );
        $notes = $this -> xn_note -> get_notes_by_book( $meta['book'] );
        $this -> xn_output -> output( "data", $notes -> to_array() );
    }

    public function get_params_by_note() {
        $meta = $this -> xn_input -> fetch_data( array( "note" ) );
        $params = $this -> xn_note -> get_params_by_note( $meta['note'] );
        $this -> xn_output -> output( "data", $params -> to_array() );
    }

    public function my_notes() {
        $books = $this -> xn_note -> my_notes();
        $this -> xn_output -> output( "data", $books -> to_array() );
    }

    public function search_book_in_douban() {
        $book_name = array_pop( $this -> xn_input -> fetch_data( "name" ) );
        $data_limit = array_pop( $this -> xn_input -> fetch_data( "data_limit" ) );
        
        $books = $this -> xn_note -> search_book_in_douban( $book_name, $data_limit );
        $this -> xn_output -> output( "data", $books);
    }

}

/* End of file Test.php */