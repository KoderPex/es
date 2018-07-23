<?php
ini_set('memory_limit','200M');
error_reporting (E_ALL); // & ~ E_NOTICE & ~ E_DEPRECATED
setlocale(LC_ALL, 'pt_BR', 'pt_BR.utf-8', 'pt_BR.utf-8', 'portuguese');
date_default_timezone_set('America/Sao_Paulo');
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');
mb_http_input('UTF-8');
@require_once(__DIR__ ."/../vendor/autoload.php");

@require_once("classes/entity.php");

@require_once("classes/patterns.php");

@require_once("classes/profile.php");


function zeroSizeID(){
	if (!isset($_SESSION['USER']['sizeID'])):
		session_start();
		$rs = CONN::get()->Execute("SELECT COUNT(*) AS qtd FROM CAD_MEMBRO WHERE ID_CLUBE = ?", array( PATTERNS::getBars()->getClubeID() ) );
		if (!$rs->EOF):
			$_SESSION['USER']['sizeID'] = strlen($rs->fields['qtd']);
		endif;
	endif;
	return $_SESSION['USER']['sizeID'];
}

function responseMethod(){
	error_reporting(E_ALL & ~ E_NOTICE); //& ~ E_DEPRECATED
	ini_set('display_errors', TRUE);
	ini_set('display_startup_errors', TRUE);
    header('Content-type: application/json');
	// Getting the json data from the request
	$response = '';

	$json_data = json_decode( json_encode( empty($_POST) ? $_GET : $_POST ) );
	// Checking if the data is null..
	if ( is_null( $json_data ) ):
		$response = json_encode( array( "status" => -1, "message" => "Insufficient paramaters!") );
	elseif ( empty( $json_data->{'MethodName'} ) ):
		$response = json_encode( array( "status" => 0, "message" => "Invalid function name!" ) );
	else:
		$methodName = $json_data->MethodName;
		if ( isset( $json_data->{'data'} ) ):
			$response = $methodName( objectToArray( $json_data->{'data'} ) );
		else:
			$response = $methodName();
		endif;
	endif;
	echo json_encode($response);
}

function fRequest($pVar){
	if (isset($_GET[$pVar])) return $_GET[$pVar];
	if (isset($_POST[$pVar])) return $_POST[$pVar];
	return "";
}


function fDescMes($cMes){
	return (array("Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro")[$cMes-1]);
}

function fStrZero($n,$q){
	return str_pad($n, $q, "0", STR_PAD_LEFT);
}

function fStrToDate($pValue, $pic = "Y-m-d H:i") {
	$pValue = str_replace("/","-",$pValue);
	return date($pic, strtotime($pValue) );
}

function fConcatNoEmpty($sStr, $sSep, $sNew){
	return ( !empty($sStr) ? $sStr . $sSep : "" ) . $sNew;
}

function fReturnStringNull($s,$default = null){
	if ( isset($s) && trim($s) !== "" ):
		return $s;
	endif;
	return $default;
}

function fReturnNumberNull($n,$default = null){
	if ( isset($n) && is_numeric($n) ):
		return $n;
	endif;
	return $default;
}

function getDateNull($vl){
	if ( !isset($vl) || empty($vl) || is_null($vl) ):
		return null;
	endif;
	return fStrToDate($vl,"Y-m-d");
}

function fDomain($a){
	$arr = array();
	$id = "";
	$ds = "";

	$query = "SELECT ";
	if ( isset( $a['id'] ) ):
		$id = $a['id'];
		$query .= $a['id'];
	endif;
	if ( isset( $a['ds'] ) ):
		$ds = $a['ds'];
		if ( isset( $a['id'] ) ):
			$query .= ", ";
		endif;
		$query .= $a['ds'];
	else:
		$ds = $a['id'];
	endif;
	$query .= " FROM ".$a['table'];
	$query .= isset( $a['where'] ) ? " WHERE ".$a['where'] : "";
	$query .= isset( $a['order'] ) ? " ORDER BY ".$a['order'] : "";
	$dom = CONN::get()->Execute($query);
	while (!$dom->EOF):
		$arr[] = array("id" => $dom->fields[$id], "ds" => $dom->fields[$ds]);
		$dom->MoveNext();
	endwhile;
	return $arr;
}

function fDomainStatic($a,$lWrite = true){
	$arr = fDomain($a);
	if ( $lWrite ):
		$strDomain = "<option value=\"\">(NENHUM)</option>";
		foreach ($arr as $key => $value):
			$strDomain .= "<option value=\"".$value["id"]."\">".$value["ds"]."</option>";
		endforeach;
		echo $strDomain;
	endif;
}

function fIdadeAtual($dData1){
	return datediff("yyyy", $dData1, date('Y-m-d'));
}

function datediff($interval, $datefrom, $dateto, $using_timestamps = false) {
    /*
    $interval can be:
    yyyy - Number of full years
    q - Number of full quarters
    m - Number of full months
    y - Difference between day numbers
        (eg 1st Jan 2004 is "1", the first day. 2nd Feb 2003 is "33". The datediff is "-32".)
    d - Number of full days
    w - Number of full weekdays
    ww - Number of full weeks
    h - Number of full hours
    n - Number of full minutes
    s - Number of full seconds (default)
    */

    if (!$using_timestamps) {
        $datefrom = strtotime($datefrom, 0);
        $dateto = strtotime($dateto, 0);
    }
    $difference = $dateto - $datefrom; // Difference in seconds

    switch($interval) {

    case 'yyyy': // Number of full years
        $years_difference = floor($difference / 31536000);
        if (mktime(date("H", $datefrom), date("i", $datefrom), date("s", $datefrom), date("n", $datefrom), date("j", $datefrom), date("Y", $datefrom)+$years_difference) > $dateto) {
            $years_difference--;
        }
        if (mktime(date("H", $dateto), date("i", $dateto), date("s", $dateto), date("n", $dateto), date("j", $dateto), date("Y", $dateto)-($years_difference+1)) > $datefrom) {
            $years_difference++;
        }
        $datediff = $years_difference;
        break;
    case "q": // Number of full quarters
        $quarters_difference = floor($difference / 8035200);
        while (mktime(date("H", $datefrom), date("i", $datefrom), date("s", $datefrom), date("n", $datefrom)+($quarters_difference*3), date("j", $dateto), date("Y", $datefrom)) < $dateto) {
            $months_difference++;
        }
        $quarters_difference--;
        $datediff = $quarters_difference;
        break;
    case "m": // Number of full months
        $months_difference = floor($difference / 2678400);
        while (mktime(date("H", $datefrom), date("i", $datefrom), date("s", $datefrom), date("n", $datefrom)+($months_difference), date("j", $dateto), date("Y", $datefrom)) < $dateto) {
            $months_difference++;
        }
        $months_difference--;
        $datediff = $months_difference;
        break;
    case 'y': // Difference between day numbers
        $datediff = date("z", $dateto) - date("z", $datefrom);
        break;
    case "d": // Number of full days
        $datediff = floor($difference / 86400);
        break;
    case "w": // Number of full weekdays
        $days_difference = floor($difference / 86400);
        $weeks_difference = floor($days_difference / 7); // Complete weeks
        $first_day = date("w", $datefrom);
        $days_remainder = floor($days_difference % 7);
        $odd_days = $first_day + $days_remainder; // Do we have a Saturday or Sunday in the remainder?
        if ($odd_days > 7) { // Sunday
            $days_remainder--;
        }
        if ($odd_days > 6) { // Saturday
            $days_remainder--;
        }
        $datediff = ($weeks_difference * 5) + $days_remainder;
        break;
    case "ww": // Number of full weeks
        $datediff = floor($difference / 604800);
        break;
    case "h": // Number of full hours
        $datediff = floor($difference / 3600);
        break;
    case "n": // Number of full minutes
        $datediff = floor($difference / 60);
        break;
    default: // Number of full seconds (default)
        $datediff = $difference;
        break;
    }
    return $datediff;
}

function objectToArray($d) {
	if (is_object($d)) {
		// Gets the properties of the given object
		// with get_object_vars function
		$d = get_object_vars($d);
	}

	if (is_array($d)) {
		/*
		* Return array converted to object
		* Using __FUNCTION__ (Magic constant)
		* for recursive call
		*/
		return array_map(__FUNCTION__, $d);
	}
	else {
		// Return array
		return $d;
	}
}

function array_msort($array, $cols){
    $colarr = array();
    foreach ($cols as $col => $order) {
        $colarr[$col] = array();
        foreach ($array as $k => $row) { $colarr[$col]['_'.$k] = strtolower($row[$col]); }
    }
    $eval = 'array_multisort(';
    foreach ($cols as $col => $order) {
        $eval .= '$colarr[\''.$col.'\'],'.$order.',';
    }
    $eval = substr($eval,0,-1).');';
    eval($eval);
    $ret = array();
    foreach ($colarr as $col => $arr) {
        foreach ($arr as $k => $v) {
            $k = substr($k,1);
            if (!isset($ret[$k])) $ret[$k] = $array[$k];
            $ret[$k][$col] = $array[$k][$col];
        }
    }
    return $ret;
}

function titleCase($string,
			$delimiters = array(" ", "-", ".", "'", "O'", "Mc"),
			$exceptions = array("a", "e", "da", "de", "do", "na", "no", "em", "das", "dos", "ao", "aos", "com", "I", "II", "III", "IV", "V", "VI") ){
	$string = mb_convert_case(($string), MB_CASE_TITLE, "UTF-8");
	foreach ($delimiters as $dlnr => $delimiter):
		$words = explode($delimiter, $string);
		$newwords = array();
		foreach ($words as $wordnr => $word):
			if (in_array(mb_strtoupper($word, "UTF-8"), $exceptions)):
				$word = mb_strtoupper($word, "UTF-8");
			elseif (in_array(mb_strtolower($word, "UTF-8"), $exceptions)):
				$word = mb_strtolower($word, "UTF-8");
			elseif (!in_array($word, $exceptions)):
				$word = ucfirst($word);
			endif;
			array_push($newwords, $word);
		endforeach;
		$string = join($delimiter, $newwords);
   endforeach;
   return $string;
}

function arrayToObject($d) {
	if (is_array($d)) {
		/*
		* Return array converted to object
		* Using __FUNCTION__ (Magic constant)
		* for recursive call
		*/
		return (object) array_map(__FUNCTION__, $d);
	}
	else {
		// Return object
		return $d;
	}
}

function fArrayStr($d){
	return("'".$d."'");
}

function fStrStartWith($str,$s){
	return (strpos($str, $s, 0) === 0);
}

function fAbrevia($nome) {
	$nome = explode(" ", $nome);
	$num = count($nome);

	if ($num == 2) {
		return $nome;
	} else {
		$count = 0;
		$novo_nome = '';
		foreach ($nome as $var){
			if ($count == 0) {
				$novo_nome .= $var.' ';
			}
			$count++;
			if (count($var) > 1){
				if (($count >= 2) && ($count < $num)) {
					$array = array('da', 'de', 'di', 'do', 'das', 'dos');
					if (!in_array(strtolower($var), $array) ) {
						$novo_nome .= substr($var, 0, 1).'. ';
					}
				}
			}
			if ($count > 1 && $count == $num){
				$novo_nome .= $var;
			}
		}
		return $novo_nome;
	}
}

function fDescHora($dtHora){
	$time = strtotime($dtHora);
	$cHor = strftime("%H",$time);
	$cMin = strftime("%M",$time);
	$cRetorno = "";
	if ($cHor == "00"):
		if ($cMin > "00"):
			$cRetorno = $cHor. "h" . $cMin;
		endif;
	elseif ($cHor > "00"):
		$cRetorno = $cHor . "h";
		if ($cMin > "00"):
			$cRetorno = $cRetorno . $cMin;
		endif;
	endif;
	return $cRetorno;
}

function fDtHoraEvento($dhI, $dhF, $fmt = "%d de %B"){

	$D1 = date("Y-m-d", strtotime("+1 day"));
	$NOW = strtotime("now");
	$DHOJE = date("Y-m-d",$NOW);
	$HHOJE = date("H:i",$NOW);

	$timeI = strtotime($dhI);
	$timeF = strtotime($dhF);

	$DATA_EVENTO_INI = date("Y-m-d",$timeI);
	$HORA_EVENTO_INI = date("H:i",$timeI);
	$DATA_EVENTO_FIM = date("Y-m-d",$timeF);
	$HORA_EVENTO_FIM = date("H:i",$timeF);

	$sDataHora = "";

	//******************************************************************
	// SE TIVER SE DATA INICIO
	// SE DATA INICIO E FIM SAO IGUAIS
	//******************************************************************
	if (empty($dhF) || $DATA_EVENTO_INI == $DATA_EVENTO_FIM):
		if ($DATA_EVENTO_INI == $DHOJE):
			$sDataHora = "Hoje";
		elseif ($DATA_EVENTO_INI == $D1):
			$sDataHora = "Amanh&atilde;";
		else:
			$dif = datediff("d",$DHOJE,$DATA_EVENTO_INI);
			if ($dif > 0 && $dif <= 7):
				$DIA_SEMANA = strftime("%w",$timeI);
				if ($DIA_SEMANA == 0 || $DIA_SEMANA == 6):
					$sDataHora .= "Pr&oacute;ximo ";
				else:
					$sDataHora .= "Pr&oacute;xima ";
				endif;
				$sDataHora .= strftime("%A",$timeI);
			else:
				$sDataHora .= strftime($fmt,$timeI);
			endif;
		endif;

	//******************************************************************
	// SE DATAS INICIO E FIM SAO DIFERENTES
	//******************************************************************
	elseif ($DHOJE >= $DATA_EVENTO_INI && $DHOJE <= $DATA_EVENTO_FIM):
		if ($HHOJE <= $HORA_EVENTO_INI || $HHOJE <= $HORA_EVENTO_FIM):
			$sDataHora .= "Hoje";
		elseif ($HHOJE >= $HORA_EVENTO_FIM):
			$sDataHora .= "Amanh&aacute;";
		endif;
	else:
		//Dentro do mes
		if (strftime("%m",$timeI) == strftime("%m",$timeF)):
			$sDataHora .= strftime("%d",$timeI);
		else:
			$sDataHora .= strftime($fmt,$timeI);
		endif;
		//se dia consecutivo
		if ($D1 == $DATA_EVENTO_FIM):
			$sDataHora .= " e ";
		else:
			$sDataHora .= " a ";
		endif;
		$sDataHora .= strftime($fmt,$timeF);
	endif;

	//******************************************************************
	// SE O HORARIO FOR DIFERENTE ENTRE AS DATAS
	//******************************************************************
	if ($HORA_EVENTO_INI != $HORA_EVENTO_FIM):
		if ($DHOJE >= $DATA_EVENTO_INI && $DHOJE <= $DATA_EVENTO_FIM && $HHOJE >= $HORA_EVENTO_INI && $HHOJE <= $HORA_EVENTO_FIM):
			$sDataHora .= " at&eacute; ";
		else:
			$sDataHora = fConcatNoEmpty($sDataHora, " das ", fDescHora($dhI));
		endif;
		$sDataHora = fConcatNoEmpty($sDataHora, " &agrave;s ", fDescHora($dhF));
	else:
		$sDataHora = fConcatNoEmpty($sDataHora, " &agrave;s ", fDescHora($dhI));
	endif;
	return utf8_encode($sDataHora);
}

function fStrFormat($mask, $str, $ch = '#') {
    $c = 0;
    $rs = '';
    for ($i = 0; $i < strlen($mask); $i++) {
        if ($mask[$i] == $ch) {
            $rs .= $str[$c];
            $c++;
        } else {
            $rs .= $mask[$i];
        }
    }
    return $rs;
}

function fClearBN($bn){
	return preg_replace('/[.-]/i', "", $bn);
}

?>
