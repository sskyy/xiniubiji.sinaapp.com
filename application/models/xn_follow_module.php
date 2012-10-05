<?php

class xn_follow_module extends Module{
    private $manager;
    private $event;
    private $entity_handler;
    private $session;
    public function __construct(){
    }
    
    public function set_event_handler( &$event ){
        $this -> event = $event;
    }
    
    public function declare_dependence(){
        return array( "event_module", "entity_module" );
    }

    public function on_module_register(  &$manager ){
        $this -> manager = $manager;
        $this -> entity_handler = $manager -> get("entity_module");
        $this -> session = $manager -> get("require") -> library("session");
    }
    
    public function user_follow( $object_name,  $data ){
        $user = $this -> manager -> get("xn_user_module") -> get_current_user();
        if( !$user ){
            return ERROR_USER_NOT_LOGIN;
        }
        
        return $this -> follow( $object_name, $data, $user );
    }
    
    public function listen_events(){
        return array(
            "get_notes_by_book_mixin_output" => "mixin_note_follow_mark"
        );
    }
    private function follow( $object_name, $data, $user ){
        $record = array(
            'user_id' => $user -> id, 
            'object_name' => $object_name,
            'object_id' => $data['id'],
        );
        
        $is_exist = $this -> event -> trigger_async("db request", 'search record', "follow", $record );
        if( $is_exist ){
            return true;
        }
        
        $record['modified'] = time();
        $insert_result = $this -> event -> trigger_async( "db request", 'write record', "follow", $record );
        if( $insert_result ){
            return true;
        }
        
        return false;
    }
    
    private function unfollow( $object_name, $data, $user ){
        $record = array(
            'user_id' => $user -> id, 
            'object_name' => $object_name,
            'object_id' => $data['id'],
        );
        $is_exist = $this -> event -> trigger_async("db request", 'search record', "follow", $record );
        if( !$is_exist ){
            return true;
        }
        
        $delete_result = $this -> event -> trigger_async( "db request", 'delete record', "follow", $record );
        if( $delete_result ){
            return true;
        }
        
        return false;
    }
    
    public function user_unfollow( $object_name,  $data ){
        $user = $this -> manager -> get("xn_user_module") -> get_current_user();
        if( !$user ){
            return ERROR_USER_NOT_LOGIN;
        }
        
        return $this -> unfollow( $object_name, $data, $user );
    }
    
    public function user_my_follow_notes(){
        $user = $this -> manager -> get("xn_user_module") -> get_current_user();
        if( !$user ){
            return ERROR_USER_NOT_LOGIN;
        }
        
        return $this -> get_user_follow_notes( $user );
    }
    
    private function get_user_follow_notes( $user ){
        $record = array(
            'user_id' => $user -> id, 
            'object_name' => 'note'
        );
        
        $follows = $this -> event -> trigger_async("db request", 'search record', "follow", $record );
        if( !$follows ){
            return true;
        }
        
        if( !is_array( $follows )){
            $follows = array( $follows );
        }
        $note_ids = array();
        foreach( $follows as $follow ){
            $note_ids[] = $follow -> object_id;
        }
        
        $notes = $this -> manager -> get("entity_module") -> create_collection( "Note",array(
            'meta' => array('id'=>$note_ids),
            'with_related_entities' => array("book",'last_param','user')
        ));
        
        return $notes;
    }
    

    public function mixin_note_follow_mark( $note_collection ){
        $current_user = $this -> manager -> get("xn_user_module") -> get_current_user();
        if ( !$current_user ){
            return false;
        }
        
        foreach( $note_collection as $key => $note ){
            $note_id = is_a($note, 'Entity') ? $note -> get("id") : $note -> id;
            $record = array("user_id" => $current_user -> id, "object_id" => $note_id, "object_name" => "note" );
            if( $this -> event -> trigger("db request","search record", "follow",$record )){
                if( is_a( $note, 'Entity')){
                    $note -> set("followed", true );
                }else{
                    $note -> followed = true;
                }
            }else{
                if( is_a( $note, 'Entity')){
                    $note -> set("followed", false );
                }else{
                    $note -> followed = false;
                }
                $note -> followed = false;
            }
            $note_collection -> set( $key, $note );
        }
        
        return $note_collection;
    }
}
?>
