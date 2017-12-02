<?php

error_reporting(0);
session_start();

if( isset($_POST['name']) && !empty($_POST['email']) ) {
    if( isset($_POST['email']) && !empty($_POST['email']) ) {
        if( isset($_POST['pwd']) && !empty($_POST['pwd']) ) {
            include 'Database.php';
            $name = htmlentities( trim($_POST['name']) );
            $email = htmlentities( trim($_POST['email']) );
            $password = htmlentities( $_POST['pwd'] );
            $mobile = htmlentities( $_POST['mb'] );
            $addr = htmlentities( $_POST['addr'] );
            
            $obj = new Database();
            $res = $obj->signup($name, $email, $password, $mobile, $addr);
            echo $res===true ? "1" : $res;
            unset($obj);
        }
        else echo "Enter a valid password.";
    }
    else echo "Enter a valid email.";
}
else echo "Enter a valid name";

?>