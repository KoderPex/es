<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST');
@require_once("../../include/functions.php");

$method = $_SERVER['REQUEST_METHOD'];

$arr = array();
if ($method == "GET"):
    
elseif ($method == "POST"):
    $param = json_decode(trim(file_get_contents("php://input")), true);
    
    foreach($param as $k => $ap):
        CONN::get()->Execute("
            INSERT LOG_CLASSE_PESSOA(
                ID_LOG_CLASSE,
                ID_PESSOA,
                PR,
                ES
            ) VALUES (?,?,?,?)
        ", array($ap["_il"], $ap["_id"], $ap["_pr"], $ap["_es"]));
    endforeach;
    
    $arr["result"] = true;
endif;
echo json_encode($arr);
?>