<!DOCTYPE html>
<?php
include('connectionData.txt');

//Function to fix up PHP's messing up POST input containing dots, etc.
function getRealPOST() {
    $pairs = explode("&", file_get_contents("php://input"));
    $vars = array();
    foreach ($pairs as $pair) {
        $nv = explode("=", $pair);
        $name = urldecode($nv[0]);
        $value = urldecode($nv[1]);
        $vars[$name] = $value;
    }
    return $vars;
}

$con = mysqli_connect($server, $user2, $pass2, $dbname);
if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
} else { 
	//echo "Connected :)";
	//echo "<br />\n"; 
}
//mysql_select_db($dbname);
/* create a prepared statement */
$sql = "INSERT INTO score (Session, Name, Score) VALUES (?, ?, ?)";

if (!($stmt = $con ->prepare($sql))) {
	echo "Prepare failed: (" . $con ->errno . ") " . $mysqli->error;
} else { 
	//echo "Statement Prepared :)";
	//echo "<br />\n"; 
}

/* Prepared statement, stage 2: bind and execute */

$realPOST = getRealPOST();
/**
echo $realPOST;
echo "<br />\n"; 
echo $realPOST["score_name"];
echo "<br />\n"; 
echo $realPOST["score_score"];
echo "<br />\n";
echo "$_POST =" . $_POST;
echo "<br />\n"; 
echo "$_GET =" . $_GET;
echo "<br />\n"; 
echo "variables = ". $name . $score . $ai;
echo "<br />\n";
**/

$name = $realPOST["score_name"];
$score = $realPOST["score_score"];
$ai = "";

if (!$stmt->bind_param("isi", $ai, $name, $score)) { // bind variables
    echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
}
 
if (!$stmt->execute()) {
	echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
}
$stmt->close();
$con ->close();


?>
<html>
<head>
<style>
table {
    width: 100%;
    border-collapse: collapse;
}

table, td, th {
    border: 1px solid black;
    padding: 5px;
}

th {text-align: left;}
</style>
</head>
<body>


</body>
</html>