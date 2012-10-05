<?php

/**
 *
 * @author jason
 */
class event_module extends Module{
    private $manager;
    private $events;
    
    public function __construct(){
        parent::__construct();
    }
    
    public function on_module_register( $manager ){
        $this -> manager = $manager;
        $this -> _build_event_center();
    }
     
    public function on_upper_module_load( &$upper_module ){
        if( method_exists(  $upper_module, "set_event_handler" )){
            $upper_module -> set_event_handler( $this -> events );
        }
        
        if( method_exists( $upper_module, "listen_events") ){
            $listen_events = $this -> _parse_listen_events( $upper_module -> listen_events(), $upper_module );
            $this -> events -> bind_multi( $listen_events );
        }
        return true;
    }
    
    private function _parse_listen_events( $events, $upper_module ){
        $standard_events = array();
        foreach( $events as $event_name => $callback_name ){
            $standard_events[$event_name] = array( $upper_module, $callback_name );
        }
        return $standard_events;
    }
    
    private function _build_event_center(){
        $this -> manager -> get("require") -> library("Event");
        $this -> events = new Event();
    }
    
    public function trigger(){
        $args = func_get_args();
        return call_user_func_array(  array($this -> events ,'trigger'), $args );
    }
    
    public function trigger_async(){
        $args = func_get_args();
        return call_user_func_array(  array($this ,'trigger'), $args );
    }

}

?>
