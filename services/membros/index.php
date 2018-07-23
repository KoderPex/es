<?php
@require_once("../../include/functions.php");
$method = $_SERVER['REQUEST_METHOD'];

$arr = array();
if ($method == "GET"):
    $result = CONN::get()->Execute("SELECT * FROM PESSOA ORDER BY ID_CLASSE, NM");
    foreach($result as $l => $f):
        $arr[] = array(
            "_id" => $f["ID"] * 1,
            "_ic" => $f["ID_CLASSE"] * 1,
            "_nm" => $f["NM"],
            "_ns" => $f["NS"] * 1
        );
    endforeach;
    
elseif ($method == "POST"):
    
endif;

header('Access-Control-Allow-Origin: *');
echo json_encode($arr);
?>