<!DOCTYPE html>
<html lang="en">
    
     <style>
        
        body{
            margin: auto;
            width: 33%;
            padding: 30px;
            background-color: lightgrey;
        }
        
        div{
            margin: auto;
            width: 100%;
            padding-bottom: inherit;            
            padding-top: inherit;
            background-color: grey;
         }
        
        h1{
            text-align: center;
            font-size: 2em;
        }
         
        h2{
            text-align: center;
            font-family: sans-serif;
            font-size: 1.2em;
        }
        
        p{
            color: ghostwhite;
            text-align: center;
            font-family: sans-serif;
            font-size: 1em;
        }
    
    </style>
    
    <head>

        <meta charset="utf-8" />
        <title>Random Fact</title>

    </head>

    <body>

        <h1>Random Fact:</h1>

        <div>
            
            <h2> Welcome to my random fact page! Below is a random fact!</p>

            <?PHP

                $facts = ["If you have 3 quarters, 4 dimes, and 4 pennies, you have $1.19. You also have the                    largest amount of money in coins without being able to make change for a dollar.",
                         "The numbers '172' can be found on the back of the U.S. $5 dollar bill in the bushes at the base of the Lincoln Memorial. ",
                         "President Kennedy was the fastest random speaker in the world with upwards of 350 words per minute.",
                         "In the average lifetime, a person will walk the equivalent of 5 times around the equator.",
                         "Odontophobia is the fear of teeth.",
                         "The 57 on Heinz ketchup bottles represents the number of varieties of pickles the company once had.",
                         "The surface area of an average-sized brick is 79 cm squared. "];

                $fact = array_rand($facts, 1);

                echo "<p>$facts[$fact]</p>";

            ?>
            
            <form action="HW-random-fact.php" method="post">
                <input type="submit" value="Get another fact!">
            </form>
            
        </div>

    </body>
    
</html>