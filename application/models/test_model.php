<?php

class Test_model extends MY_Model {
    
    public function __construct() {
        parent::__construct();
    }
    
    public function listen_events(){
        return array(
            'test asynch event' => 'react_asynch_event'
        );
    }
    
    public function set_event_handler( &$event ){
        $this -> event = $event;
    }
    
    public function react_asynch_event(){
        return "<p>This message come from Test_model react_asynch_event.</p>";
    }
    
    public function test_trigger_asynch_event(){
        print_r( $this -> event -> trigger_asynch("test asynch event"));
    }
    
    public function access_rule_function_a(){
        echo "<p>This message come from test_model accee_rule_function_a.</p>";
        return false;
    }
    
    public function access_rules(){
        return array(
            'test/test_trigger_asynch_event' => array(
                'test_model access_rule_a' => array(
                    'validate' => array('access_rule_function_a'),
                    'ignore' => array('log_model access_rule_a')
                ),
            )
        );
    }
}

?>
