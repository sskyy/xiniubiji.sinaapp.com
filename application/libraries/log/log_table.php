<?php

/**
 * Description of Log_table.php UTF-8
 *
 * @date 2012-7-17
 * @author xiaowei xw.cht.y@gmail.com
 */

require_once 'log_work_interface.php';

class Log_table implements log_work_interface{
    public $table = 'logs';
    public $db = false ;
    public function __construct( ) {
        $ci = & get_instance();
        $this->db = $ci -> db ;
    }

    /**
     * 
     * @param int $id
     */
    public function delete( $id ) {
        $table = $this-> table ;
        $db = $this->db;
        $db -> trans_start();
        $db -> where( 'id',  $id ) -> delete( $table );
        $status = FALSE;
        if( $db -> trans_complete() && $db -> affected_rows() == 1 ){
            $status =  TRUE ;
        }
        return $status ;
    }

    /**
     * 保存日志到 数据库，成功返回ID，失败返回false
     * @param mixed $data ( array or object )
     * @todo  这里需要事务吗？
     */
    public function save( $data ){
        $table = $this-> table ;
        $db = $this->db;
        echo $db->conn_id;
        $db -> trans_start();
        $db -> insert( $table , (array) $data ) ;
        $result = $db -> trans_complete();
        if( $result ){
            $result = $db -> insert_id();
            if( ! $result ){ // 上面的 语句 不管用
                switch( strtolower($db -> dbdriver) ){
                    case 'mysql' :
                        $result = mysql_insert_id( $db-> conn_id );
                        echo $db-> conn_id;
                        echo '<hr/>';
                        break;
                    case 'mysqli' :
                        // todo
                        break;
                }
                
                // print_r($db  );
            }
            echo $result;
        }
        return $result ;
    }

    public function test(){

        $s1 = $this->save( array() );
        
    }
    
}

/* End of file Log_table.php */