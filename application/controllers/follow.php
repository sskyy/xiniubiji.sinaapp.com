<?php

class Follow extends MY_Controller {

    public function __construct() {
        parent::__construct();
        $this -> xn_output = $this -> load -> module( "xn_output_module" );
        $this -> xn_input = $this -> load -> module( "xn_input_module" );
        $this -> xn_follow = $this -> load -> module( "xn_follow_module" );
        $this -> xn_user = $this -> load -> module( "xn_user_module" );
    }

    public function follow_object() {
        $object_name = array_pop( $this -> xn_input -> fetch_data( array( 'object_name' ) ) );
        $object = array_pop( $this -> xn_input -> fetch_data( array( $object_name ) ) );
        $follow_result = $this -> xn_follow -> user_follow( $object_name, $object );

        $this -> output_with_user_check( $follow_result );
    }

    public function unfollow_object() {
        $object_name = array_pop( $this -> xn_input -> fetch_data( array( 'object_name' ) ) );
        $object = array_pop( $this -> xn_input -> fetch_data( array( $object_name ) ) );
        $follow_result = $this -> xn_follow -> user_unfollow( $object_name, $object );

        $this -> output_with_user_check( $follow_result );
    }

    public function my_follows() {
        $follows = $this -> xn_follow -> user_my_follow_notes();
        $this -> output_with_user_check( $follows );
        
    }

    private function output_with_user_check( $result_obj ) {
        if( $result_obj === ERROR_USER_NOT_LOGIN ) {
            $this -> xn_output -> output( "error", "user not login" );
        } else if( $result_obj === false ) {
            $this -> xn_output -> output( "error", "follow failed" );
        } else {
            if( is_a( $result_obj, 'Entity') ){
                $result_obj = $result_obj -> to_object();
            }elseif( is_a( $result_obj, 'Entity_collection')){
                $result_obj = $result_obj -> to_array();
            }
            
            $this -> xn_output -> output( "data", $result_obj );
        }
    }

}

?>
