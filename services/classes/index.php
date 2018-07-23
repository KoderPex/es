<?php
@require_once("../../include/functions.php");
$method = $_SERVER['REQUEST_METHOD'];

$arr = array();
if ($method == "GET"):
    $result = CONN::get()->Execute("SELECT * FROM CLASSE WHERE ACTIVE = 'S' ORDER BY CD");
    foreach($result as $l => $f):
        $arr[] = array(
            "_pb" => $f["PUB"],
            "_pr" => $f["PER"],
            "_id" => $f["ID"] * 1,
            "_cd" => $f["CD"],
            "_ds" => $f["DS"],
            "_sq" => $f["SEQ"] * 1,
        );
    endforeach;
    
elseif ($method == "POST"):
    
endif;

header('Access-Control-Allow-Origin: *');
echo json_encode($arr);
?>