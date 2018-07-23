<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST');
@require_once("../../include/functions.php");

$method = $_SERVER['REQUEST_METHOD'];

$arr = array();
if ($method == "GET"):

    //apontamentos
    $result = CONN::get()->Execute("
        SELECT  lc.*
          FROM LOG_CLASSE lc
         WHERE lc.ID_CLASSE = ? 
      ORDER BY lc.FG, lc.DT_LOG DESC
    ", array(fRequest("id")) );
    foreach($result as $l => $f):
        $arr[] = array(
            "_id" => $f["ID"] * 1,
            "_dt" => $f["DT_LOG"],
            "_sq" => $f["SEQ"] * 1,
            "_vo" => $f["VL_OF"] * 1,
            "_mb" => $f["QT_MB"] * 1,
            "_ms" => $f["QT_MS"] * 1,
            "_es" => $f["QT_ES"] * 1,
            "_pr" => $f["QT_PR"] * 1,
            "_rl" => $f["QT_RL"] * 1,
            "_pg" => $f["QT_PG"] * 1,
            "_vs" => $f["QT_VS"] * 1,
            "_fg" => $f["FG"]
        );
    endforeach;
    
elseif ($method == "POST"):
    $param = json_decode(trim(file_get_contents("php://input")), true);
    
    foreach($param as $k => $ap):
        if ( empty($ap["_id"]) || is_null($ap["_id"]) ):
            //insert
            $arr["ap"]["insert"][] = $ap;
        else:
            //update
            CONN::get()->Execute("
                UPDATE LOG_CLASSE SET
                  	QT_MB = ?, VL_OF = ?,
                  	QT_ES = ?, QT_PR = ?,
                  	QT_MS = ?, QT_RL = ?,
                  	QT_PG = ?, QT_VS = ?,
                  	FG = ?  WHERE ID = ? 
            ", array(
                $ap["_mb"], $ap["_vo"],
                $ap["_es"], $ap["_pr"],
                $ap["_ms"], $ap["_rl"],
                $ap["_pg"], $ap["_vs"],
                "2",        $ap["_id"]
            )   );
        endif;
    endforeach;
    
    $arr["result"] = true;
endif;
echo json_encode($arr);
?>