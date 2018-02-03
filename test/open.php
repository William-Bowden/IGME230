<?php
	$data = file_get_contents("http://www.cia.gov"); // or any other URL you want to use
	echo "<h1>Here's your data!!</h1>";
	echo $data;
 ?>