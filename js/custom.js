// Global Variables
method="manual";

function validateSignup(){
    
    var uname = $("#su-inp-username").val(), email = $("#su-inp-email").val(), pwd = $("#su-inp-pwd").val();
    var mb = $("#su-inp-mb").val(), addr = $("#su-inp-addr").val();
    
    var validemail=false, validpwd=false, validcnfpwd=false, validmb=false, validaddr=false;

    //email
    var patt = new RegExp("^[a-z][a-z0-9\.\-\_\+]{2,20}@(gmail|yahoo|outlook|hotmail).(com|in|org|xyz|co)$");
    var res = patt.test(email);
    document.getElementById("su-email").className = res==true ? "icon ticker" : "icon into";
    validemail = res;
    
    //pwd
    var patt = new RegExp("[A-Za-z0-9\@\#\-\_\+\=\*]{6,15}");
    var res = patt.test(pwd);
    document.getElementById("su-pwd").className = res==true ? "icon ticker" : "icon into";
    validpwd = res;
    
    //mobile
    var patt = new RegExp("[0-9]{10}");
    var res = patt.test(mb);
    document.getElementById("su-mb").className = res==true ? "icon ticker" : "icon into";
    validmb = res;

    //Address
    validaddr = addr.length>10;
    document.getElementById("su-addr").className = validaddr ? "icon ticker" : "icon into";
    
    $("#su-err-email").css("display", validemail ? "none" : "block");
    $("#su-err-pwd").css("display", validpwd ? "none" : "block");
    $("#su-err-mb").css("display", validmb ? "none" : "block");
    $("#su-err-addr").css("display", validaddr ? "none" : "block");

    if (validemail && validpwd && validmb && validaddr) {
        $("#process-label").css({"display":"block", "color": "#3F51B5"}).html("Please wait. Processing signup...");
        $.ajax({
            type: "post",
            url: "signup.php",
            data: {"name":uname, "email":email, "pwd": pwd, "mb": mb, "addr": addr},
            statusCode: {
                500: function(){
                    $("#process-label").css("color", "tomato").html("Internal Server Error Occurred!");
                },
                404: function(){
                    $("#process-label").css("color", "tomato").html("Page Not Found!");
                }
            },
            success: function(res) {
                console.log([res, typeof res]);
                if(res==1) {
                    $('#process-label').css("color", "#558B2F").html("Signup Success. Please login to continue");
                }
                else {
                    $("#process-label").css("color", "tomato").html(res);
                }
            },
            error: function(err) {
                $("$process-label").css("color", "tomato").html("Some error occurred. Please try after sometimes.");
            }
        });
        //window.setTimeout(function(){ $("#process-label").css("display", "none"); }, 2500);
    }
}

function validateLogin() {
    $("#li-process-label").css("display","none");
    
    var email=$("#li-inp-email").val(), pwd=$("#li-inp-pwd").val();
    var validemail=false, validpwd=false;
    
    //email
    var patt = new RegExp("^[a-z][a-z0-9\.\-\_\+]{2,20}@(gmail|yahoo|outlook|hotmail|mail).(com|in|org|xyz|co)$");
    validemail = patt.test(email);
    
    //pwd
    var patt = new RegExp("[A-Za-z0-9\@\#\-\_\+\=\*]{6,15}");
    validpwd = patt.test(pwd);
    
    if(validemail && validpwd) {
        $("#li-process-label").css({"display":"block", "color":"#3F51B5"}).html("Authenticating.. Please wait");
        $.ajax({
           type: "post",
           url: "login.php",
           data: {"email":email, "pwd":pwd},
           statusCode: {
               500: function(){ $("#li-process-label").css("color", "tomato").html("Internal Server Error. Try after sometime."); }
           },
           success: function(res) {
               if(res==1 || res==0) {
                   window.location.href = "dashboard.php";
               } else {
                   $("#li-process-label").css("color","tomato").html(res);
               }
           },
           error: function(res) {
               
           }
        });
    } else {
        $("#li-process-label").css({"display":"block", "color":"tomato"}).html("Invalid Credentials.");
    }
}

function update() {
    $("#loading").css("display","inline-block");
    $.ajax({
       type: "get",
       url: "update.php",
       async: "false",
       success: function(res) {
           res = jQuery.parseJSON(res);
           
            // Failsafe for no records
        console.log([res, typeof res]);
           if(res==-2) {
                console.log("No Records in DB.");
                res = 0;
                $("#recordcount").val("-2");
                $("#records tr:gt(0)").remove();
                st = "<tr><td colspan='2'>No Records Yet.</td></tr>";
                $("#records tr:first").after(st);
           }
           else if(res==0) {
                console.log("No Updates");
           }
           else if(res==-1){
               console.log("Server issues! Please Try after sometime.");
               alert("Server Issues! Try after sometime");
           }
           else {
                var st = "";
                for(var i in res){
                   st+="<tr><td>"+res[i].daydream+"</td>";
                   st+="<td>"+res[i].time+"</td></tr>";
                }
                if( $("#recordcount").val()=="-2" ) {
                    $("#records tr:eq(1)").remove();
                    $("#recordcount").val("1");
                }
                $("#records tr:first").after(st);
           }
           
           $("#updatecount").html(res.length || res);
           $("#loading").css("display","none");
           updateTime();
       },
       error: function(err) {
           $("#loading").css("display","none");
      }
    //   ,
    //   onDone: function() {
    //         if(method=="auto") setUpdateInterval();    
    //   }
    });
}

function setUpdateInterval() {
    var val = $("#interval").val();
    switch(val) {
        case "1":
            if(typeof updateObj == "number") { clearInterval(updateObj); }
            updateObj = setInterval(update, 1000);
            break;
        case "3":
            if(typeof updateObj == "number") { clearInterval(updateObj); }
            updateObj = setInterval(update, 3000);
            break;
        case "5":
            if(typeof updateObj == "number") { clearInterval(updateObj); }
            updateObj = setInterval(update, 5000);
            break;
        case "10":
            if(typeof updateObj == "number") { clearInterval(updateObj); }
            updateObj = setInterval(update, 10000);
            break;
        default:
            method="manual";
            clearInterval(updateObj);
    }
}

function updateTime() {
    var d = new Date();
    var time = "Last updated on " + zfill(d.getDate()) + "/" + zfill(d.getMonth()+1) + "/" + d.getFullYear() + " at ";
    time += zfill(d.getHours()) + ":" + zfill(d.getMinutes()) + ":" + zfill(d.getSeconds());
    $("#timestamp").html(time);
}

function logout() {
    window.location.href = "logout.php";
}

function zfill(num) {
    return num<10 ? "0"+num : num ;
}