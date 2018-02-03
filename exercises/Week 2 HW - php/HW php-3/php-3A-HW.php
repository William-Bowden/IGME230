<!DOCTYPE html>
<html lang="en">
    
    <head>
        
        <meta charset="utf-8" />
        <title>php-3A-HW</title>
        
    </head>
    
    <body>
        
        <h1>php-3A-HW</h1>
        
        <ol>
            <?php

                $colors = ["red","green","blue"];

                foreach($colors as $value){

                        echo "<li>$value</li>";

                }

            ?>
        </ol>
        
        <ul>
        
            <?PHP
                $links = ["RIT"=>"http://www.rit.edu", 
                          "RPI"=>"http://www.rpi.edu", 
                          "MCC"=>"http://www.monroecc.edu"];
            
                foreach($links as $key=>$value){
                    echo "<li> <a href = $value>$key</a> </li>";
                }
            ?>
            
        </ul>


    </body>
    
</html>