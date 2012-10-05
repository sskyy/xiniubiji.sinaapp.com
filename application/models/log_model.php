<?php

class Log_model extends MY_Model {
    private $eid;
    private $event;
    
    public function __construct() {
        parent::__construct();
        $this -> load->library("Log_factory");
    }

    public function listen_events(){
        return array(
            "book_save" => "react_book_save",
            "system_init" => "react_system_init",
        );
    }
    
    public function set_event_handler( &$event ){
        $this -> event = $event;
    }
    
    public function react_system_init(){
        $this -> eid = $this -> _get_max_log_eid() + 1;
    }
    
    public function react_book_save( $args ){
        $data = array(
            'eid' => $this -> eid,
            'content' => "book_saved : ". $args -> name,
        );
        $log = new Log( $data );
        $log -> save();
    }
    
    private function _get_max_log_eid(){
        $this -> db -> select_max("eid");
        return $this -> db -> get("logs") -> row() -> eid;
    }

    
    public function access_rule_function_a(){
        echo "<p>This message come from log_model accee_rule_function_a.</p>";
        return true;
    }
    
    public function access_rules(){
        return array(
            'test/test_trigger_asynch_event' => array(
                'log_model access_rule_a' => array(
                    'validate' => array('access_rule_function_a')
                )
            )
        );
    }
}

/* End of file log_model.php */