<?php
include('connectionData.txt');
//Function to fix up PHP's messing up POST input containing dots, etc.

$con = mysqli_connect($server, $user2, $pass2, $dbname);
if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
} else { 
	//echo "Connected :)";
	//echo "<br />\n"; 
}
//mysql_select_db($dbname);
/* create a prepared statement */
$sql = "SELECT Name, Score FROM score ORDER BY Score DESC LIMIT 5";

if (!($stmt = $con ->prepare($sql))) {
	echo "Prepare failed: (" . $con ->errno . ") " . $mysqli->error;
} else { 
	//echo "Statement Prepared :)";
	//echo "<br />\n"; 
}

if (!$stmt->execute()) {
	echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
}
if (!$stmt->execute()) {
	echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
}


$out_name = NULL;
$out_score = NULL;
if (!$stmt->bind_result($out_name, $out_score)) {
    echo "Binding output parameters failed: (" . $stmt->errno . ") " . $stmt->error;
}
while ($stmt->fetch()) {
    echo"<tr>";
    printf("<td>%16s - %03d</td>", $out_name, $out_score);
    //echo "<br />\n"; // Newlines won't work! :(
    echo"</tr>";
    //print PHP_EOL;
}




?>
<html>
<head>
<style>

table, tr, td {
    padding: 0;
    margin: 0;
    border: 0;
    border-collapse: collapse;
    font-size: 90%;
}

th {text-align: right;}

</style>
</head>
<body>


</body>
</html>