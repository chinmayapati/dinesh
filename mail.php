<?php

ini_set('track_errors', 1);
require_once 'phpmailer/class.phpmailer.php';
require_once 'phpmailer/class.smtp.php';

function sendVerificationMail($host, $port, $username, $password, $emailTo, $replyTo, $from, $subject, $msg, $altMsg = "")
{
    $mail = new PHPMailer;
    $mail->SMTPDebug = 2;
    $mail->isSMTP();
    $mail->Host = $host;  // 'mx1.hostinger.in'
    $mail->SMTPAuth = true;
    $mail->Username = $username;  // 'no-reply@feedabyte.com';
    $mail->Password = $password;  // 'Feed@byte#20';
    $mail->SMTPSecure = 'ssl';
    $mail->Port = $port;

    $mail->setFrom($username , $from);
    $mail->addAddress($emailTo);
    $mail->addReplyTo($replyTo, "Feedabyte");

    $mail->isHTML(true);

    $mail->Subject = $subject;
    $mail->Body = $msg;

    $mail->AltBody = $altMsg;

    if (!$mail->send()) {

        echo 'FAIL: ' . $mail->ErrorInfo . '<br />';

    } else {

        echo "Mail Sent";

    }
}

sendVerificationMail('mx1.hostinger.in', 465, 'no-reply@feedabyte.com', 'Feed@byte#20', 'chinmaya@gmail.com', 'no-reply@feedabyte.com', 'no-reply@feedabyte.com', 'Test Subject', 'Test Message');
/*
function mailMethodDefinitions()
{
    if (isset($_REQUEST['sendemail'])) {
        $from = $_REQUEST['from'];
        $toemail = $_REQUEST['toemail'];
        $subject = $_REQUEST['subject'];
        $message = $_REQUEST['message'];
        if ($from == "" || $toemail == "") {
            header("HTTP/1.1 500 WhatAreYouDoing");
            header("Content-Type: text/plain");
            echo 'FAIL: You must fill in From: and To: fields.';
            exit;
        }

        if ($_REQUEST['sendmethod'] == "mail") {
            $result = mail($toemail, $subject, $message, "From: $from");
            if ($result) {
                echo 'OK';
            } else {
                echo 'FAIL';
            }
        }
    } elseif ($_REQUEST['sendmethod'] == "sendmail") {
        $cmd = "cat - << EOF | /usr/sbin/sendmail -t 2>&1\nto:$toemail\nfrom:$from\nsubject:$subject\n\n$message\n\nEOF\n";
        $mailresult = shell_exec($cmd);
        if ($mailresult == '') { //A blank result is usually successful
            echo 'OK';
        } else {
            echo "The sendmail command returned what appears to be an error: " . $mailresult . "<br />\n<br />";
        }
    }
}
*/
?>