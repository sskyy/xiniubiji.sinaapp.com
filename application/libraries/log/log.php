<?php

/**
 * Description of Log.php UTF-8
 *
 * @date 2012-7-16
 * @author xiaowei xw.cht.y@gmail.com
 */

require_once __DIR__.'/../Entity_class.php';

/**
 *  鏃ュ織瀹炰綋锛屼笉鍦ㄤ箮 瀹炵幇鏂瑰紡锛屽彲浠ユ槸鏁版嵁搴擄紝涔熷彲浠ユ槸鏂囦欢绯荤粺
 *  鏃ュ織 璁板綍 绾у埆 鏃堕棿 鍐呭
 *  @todo 閲嶆瀯锛岄粯璁ゅ�涓�鍏抽棴鏃ュ織 鐢�static 鏄惁 浼氬ソ涓�簺 锛� */
class Log extends Entity{
    // 瀹為檯鏃ュ織宸ヤ綔鑰�    public $work;
    // 鏃ユ湡鏍煎紡, CI 閰嶇疆涓篃鏈�鑰冭檻缁撳悎涓�鎴�鍏煎涓�    public $date_fmt = 'Y-m-d H:i:s';
    //鏃ュ織绾у埆
    public $levels	 = array('ERROR' => 1, 'DEBUG' => 2,
        'INFO' => 3, 'ALL' => 4);
    //鏃ュ織涓庣幆澧冨彉閲忓搴�    public $env_levels= array('DEVELOPMENT' => 'ALL' ,
        'TESTING' => 'DEBUG'  ,'PRODUCTION' => 'ERROR' );

    // 鐜瀹氫箟鐨勭骇鍒�    public $env_level = FALSE;

    // 榛樿鐜
    public $default_env = 'TESTING' ;
    
    // 榛樿鏃ュ織绾у埆
    public $default_level = 'DEBUG' ;
    
    // 鍏抽棴鏃ュ織
    public $enabled  = true;
    
    
    public function __construct( $work = false ) {
        parent::__construct();
        $this->work = $work;

        if( defined('ENVIRONMENT') ){
            $env = strtoupper( ENVIRONMENT ) ;
        } else {
            $env = $this -> default_env ;
        }
        if( array_key_exists( $env , $this->env_levels) ){
            $log_level = $this->env_levels[$env];
        } else {
            $log_level = $this->env_levels[ $this -> default_env ];
        }
        
        $this->env_level = $this->levels[$log_level];
        
    }

    /**
     * 涓嶅枩娆�CI 鐨�浼犲弬鍟� 涓嶅ソ鐢ㄥ晩
     * @param type $work
     */
    public function setWork( $work ){
        $this->work = $work;
    }

    public function delete(){
        if( ( $id = $this->get('id') ) === false ){
            return false ;
        }
        $status = $this -> work -> delete($id);
        if( $status ){
            parent::delete();
        }
        return $status;
    }

    /**
     * 淇濆瓨鏃ュ織
     * @param mixed $msg 鏃ュ織鍐呭 
     * @param mixed $level 1-4绾�ERROR,DEBUG,INFO,ALL.榛樿涓篋EBUG<br/>
     * ENVIRONMENT 甯搁噺 涓�鏃ュ織绛夌骇瀵瑰簲鍊煎涓�<br/>
     * development => ALL ,testing => DEBUG  ,production => ERROR
     */
    public function save( $msg, $level = 'default' ) {
        $date  = date( $this -> date_fmt );
        $level == 'default' && $level = FALSE ;
        if( ! $this->enabled 
            || ( ( $level = $this ->checkLevel($level) ) === FALSE )
            || ( $data = $this->formateMsg($msg) ) === FALSE ){
            return FALSE;
        }

        $all = array('date'=> $date,'level' =>$level ,'msg' =>$data) ;
        
        $this->set( $all );

        $id = $this -> work -> save( $all ) ;

        if( $id !== FALSE ){
            $this->set( 'id' , $id );
        }

        parent::save(); // nothing

        return $id ;
    }

    // 妫�煡寰呰褰曠殑鏃ュ織绾у埆 涓�褰撳墠鐨勬棩蹇楃幆澧�    
    private function checkLevel( $level ){
        if( $level === FALSE ){
            $level = $this->default_level;
        }
        $level = strtoupper( $level );
        if( array_key_exists( $level, $this->levels ) ){
            $int_level = $this->levels[$level] ;
        } else {
            $int_level = intval( $level );
            $level = array_search( $int_level, $this->levels ) ;
            if( $level === FALSE  ){
                $level = $this->default_level;
                $int_level = $this->levels[$level] ;
            }
        }
        
        $log_level = $this->env_level;
        
        if( $log_level < $int_level ){ // 鐜涓嶈褰曡绾у埆鐨勬棩蹇�            return FALSE;
        }
        return $level ;
    }

    // 鏍煎紡鍖栧緟璁板綍鐨勬棩蹇楀唴瀹�    private function formateMsg( $msg ){
        if( is_object( $msg) ){
            $msg = get_object_vars( $msg);
        }
        if( ! $msg){ // 鍐呭涓虹┖
            return FALSE;
        }
        $data = json_encode($msg);
        if( $data === false){
            $data = print_r($msg, TRUE);
        }
        return strval($data);
    }

    /**
     * 杞Щ鍒�鍗曠嫭鐨�绫讳腑
     */
    public function test(){
        
    }

}

/* End of file Log.php */