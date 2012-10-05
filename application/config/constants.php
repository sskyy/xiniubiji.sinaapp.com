<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| File and Directory Modes
|--------------------------------------------------------------------------
|
| These prefs are used when checking and setting modes when working
| with the file system.  The defaults are fine on servers with proper
| security, but you may wish (or even need) to change the values in
| certain environments (Apache running a separate process for each
| user, PHP under CGI with Apache suEXEC, etc.).  Octal values should
| always be used to set the mode correctly.
|
*/
define('FILE_READ_MODE', 0644);
define('FILE_WRITE_MODE', 0666);
define('DIR_READ_MODE', 0755);
define('DIR_WRITE_MODE', 0777);

/*
|--------------------------------------------------------------------------
| File Stream Modes
|--------------------------------------------------------------------------
|
| These modes are used when working with fopen()/popen()
|
*/

define('FOPEN_READ',							'rb');
define('FOPEN_READ_WRITE',						'r+b');
define('FOPEN_WRITE_CREATE_DESTRUCTIVE',		'wb'); // truncates existing file data, use with care
define('FOPEN_READ_WRITE_CREATE_DESTRUCTIVE',	'w+b'); // truncates existing file data, use with care
define('FOPEN_WRITE_CREATE',					'ab');
define('FOPEN_READ_WRITE_CREATE',				'a+b');
define('FOPEN_WRITE_CREATE_STRICT',				'xb');
define('FOPEN_READ_WRITE_CREATE_STRICT',		'x+b');

//用户名　 :  SAE_MYSQL_USER
//密　　码 :  SAE_MYSQL_PASS
//主库域名 :  SAE_MYSQL_HOST_M
//从库域名 :  SAE_MYSQL_HOST_S
//端　　口 :  SAE_MYSQL_PORT
//数据库名 :  SAE_MYSQL_DB

if( !defined( "SAE_MYSQL_USER" ) ){
    define("SAE_MYSQL_USER", "root");
}
if( !defined( "SAE_MYSQL_PASS") ){
    define("SAE_MYSQL_PASS", "rootroot");
}
if( !defined( "SAE_MYSQL_HOST_M" ) ){
    define("SAE_MYSQL_HOST_M", "localhost");
}
if( !defined( "SAE_MYSQL_DB" ) ){
    define("SAE_MYSQL_DB", "xiniubiji");
}
if( !defined( "SAE_MYSQL_PORT" ) ){
    define("SAE_MYSQL_PORT", 3306);
}

/* End of file constants.php */
/* Location: ./application/config/constants.php */