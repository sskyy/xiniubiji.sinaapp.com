<?php

/**
 * Description of log_test.php UTF-8
 * 该测试类 使用 CI 的 单元测试类
 *
 *
 * @todo
 *  目前 测出 insert_id 不能 正确得到 总是 返回0
 *  
 *
 * 
 * @date 2012-7-17
 * @author xiaowei xw.cht.y@gmail.com
 */
class Log_test {
    public $ci ;
    public $db ;
    public $unit ;
    public $log ;
    public function __construct() {
        $this->ci = & get_instance();

        $this->ci->load->database();
        $this->ci->load->library( array('unit_test','log/log_table') );
        $this->ci->load->library( 'log/log' );

        $this->ci->log->setWork( $this->ci->log_table );
        
        $this->db = $this->ci->db;
        $this->unit = $this->ci->unit;
        $this->log = $this->ci->log;
    }

    public function run( $case_name ){
        if( method_exists($this, $case_name) ){
            $this -> $case_name();
            $data = $this->unit->report();
        } else {
            $data = '<h2 style="color:red">No this case:'
            .$case_name.'in '.__FILE__.'</h2>' ;
        }
        return $data ;
    }

    /**
     *  测试 日志 正确 保存,返回日志 状态
     */
    public function case1(){

        $rows = $this->db->get('logs')->num_rows();
        
        $data = $this->log->save('log_test test library log, log level 4',4) ;

        if( $data === FALSE ){
            $rows_check = $this->db->get('logs')->num_rows();
            $this->unit->run( ($rows === $rows_check),TRUE,' 数据库插入失败，检查数据库记录不变和Result 为 Success' );
        } else {
            $data_check = $this->db->where('id',$data)->get('logs')->num_rows();
            $this->unit->run( (1 === $data_check),TRUE,' 数据库插入成功，检查数据库记录加1和Result 为 Success' );
        }
        

    }


    
    
}

/* End of file log_test.php */