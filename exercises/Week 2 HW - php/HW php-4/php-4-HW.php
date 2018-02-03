<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<title>Contact Us</title>
	<style>
	
	label {
		display:block;
		margin-top:20px;
		letter-spacing:2px;
	}
	
	#submit {
		display:block;
		margin-top:20px;
	}
	
	</style>
</head>
<body>
  	<h1>get in touch</h1>
 	<form method="post" action="<?php echo $_SERVER["PHP_SELF"];?>">
        
            <label>Subject</label>
            <input name="subject" placeholder="Type Here">
        
            <label>First Name</label>
            <input name="name" placeholder="Type Here">
        
            <label>Last Name</label>
            <input name="lastName" placeholder="Type Here">
            
            <label>Email</label>
            <input name="email" type="email" placeholder="person@sample.com">
            
            <label>Message</label>
            <textarea name="message" placeholder="Type Here"></textarea>
            
            <label>*What is 2+2? (Anti-spam)</label>
            <input name="human" placeholder="Type Here">
            
            <input id="submit" name="submit" type="submit" value="Submit">
        
        </form>
 <?php   
 	// ** Form validation code **
 	// We will use the $_POST "super global" associative array to extract the values of the form fields
    if (isset($_POST["submit"])){ // #1 - was the submit button pressed?
    	$to = "wjb5377@rit.edu"; // REPLACE WITH YOUR EMAIL
    	
    	// #2 - if a value for the `email` from field is missing, give a default value
    	// else, use the value from the form field
			$from = empty(trim($_POST["email"])) ? "noemail@sample.com" : sanitize_string($_POST["email"]);
			
			$subject = empty(trim($_POST["subject"])) ?  "Empty Subject" : sanitize_string($_POST["subject"]);
			
			// #3 - same as above, except with the `message` form field
			$message = empty(trim($_POST["message"])) ?  "No message" : sanitize_string($_POST["message"]);
			
			// #4 - same as above, except with the `name` form field
			$name = empty(trim($_POST["name"])) ? "No name" : sanitize_string($_POST["name"]);
        
            $lastName = empty(trim($_POST["lastName"])) ? "" : sanitize_string($_POST["lastName"]);
			
			// #5 - same as above, except with the `human` form field
			$human = empty(trim($_POST["human"])) ? "0" : sanitize_string($_POST["human"]);
			
			$headers = "From: $from" . "\r\n";
			
			// #6 - add the user's name to the end of the message
			$message .= "\n\n - $name $lastName";
			
			// #7 - if they know what 2+2 is, send the message
			if (intval($human) == 4){
			
				// #8 - mail returns false if the mail can't be sent
				$sent = mail($to,$subject,$message,$headers);
				if ($sent){
					echo "<p><b>You sent:</b> $message</p>";
				}else{
					echo "<p>Mail not sent!</p>";
				}
			}else{
				echo "<p>You are either a 'bot, or bad at arithmetic!</p>";
			}

    }
    
    // #9 - this handy helper function is very necessary whenever
    // we are going to put user input onto a web page or a database
    // For example, if the user entered a <script> tag, and we added that <script> tag to our HTML page
    // they could perform an XSS attack (Cross-site scripting)
    function sanitize_string($string){
	$string = trim($string);
	$string = strip_tags($string);
	return $string;
    }
?>
</body>
</html>