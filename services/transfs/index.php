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
            UPDATE PESSOA(
                ID_CLASSE = ?,
                NS = ?
            WHERE ID = ?
        ", array($ap["_cd"], $ap["_cd"] !== $ap["_co"], $ap["_id"]));
    endforeach;
    
    $arr["result"] = true;
endif;
echo json_encode($arr);
?>