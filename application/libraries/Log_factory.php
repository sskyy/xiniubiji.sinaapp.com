<?php
/**
 * Description of Log_factory
 *
 * @author jason
 */
require_once 'Entity_class.php';
require_once 'Table.php';

class Log_factory{
    //put your code here
}

class Log extends Entity{
    public function __construct(){
        parent::__construct();
    }
    
    public function save(){
        $table = new Table("logs");
        $table -> insert( $this -> to_array() );
    }
}
?>
