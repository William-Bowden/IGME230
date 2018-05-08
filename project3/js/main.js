const app = new PIXI.Application(600,500);
document.querySelector("#gameWindow").appendChild(app.view); 

// pre-load the images
PIXI.loader.
add(["media/Key.png"]).
on("progress",e=>{console.log(`progress=${e.progress}`)}).
load(setup);

let sceneWidth = app.view.width;
let sceneHeight = app.view.height;

let stage;

let startScene;
let gameScene, scoreLabel, gameOverScoreLabel, volumeSlider;
let gameOverScene;

let localHighScore;
let highScore;

// Sounds
let music, bounceSound1, bounceSound2, bounceSound3, bounceSound4, hitSound, pickupSound;
let bounceSounds = [];

// Objects
let player;
let currentScore = 0;
let platforms = [];
let walls = [];
let hazards = [];
let currentPlatforms = [];
let key;
let levelNum = 1;
let paused = true;

// creates the labels and buttons that appear in game menus and ui
function createLabelsAndButtons(){
    let buttonStyle = new PIXI.TextStyle({
        fill: 0x000000,
        fontSize: 28,
        fontFamily: "Share Tech Mono"
    });
    
    // 1 set up 'startScene'
    // 1A - make the top start label
    let startLabel1 = new PIXI.Text("Blobby");
    startLabel1.style = new PIXI.TextStyle({
        fill: 0x00FF00,
        fontSize: 84,
        fontFamily: "Share Tech Mono",
        stroke: 0x000000,
        strokeThickness: 6
    });
    startLabel1.x = 150;
    startLabel1.y = 50;
    startScene.addChild(startLabel1);
    
    //1B - make the middle start label
    let startLabel2 = new PIXI.Text("Get a ton of keys or something!");
    startLabel2.style = new PIXI.TextStyle({
        fill: 0x00FF00,
        fontSize: 28,
        fontFamily: "Share Tech Mono",
        fontStyle: "italic",
        stroke: 0x000000,
        strokeThickness: 3
    });
    startLabel2.x = 75;
    startLabel2.y = 200;
    startScene.addChild(startLabel2);
    
    //1C - make the start game button
    let startButton  = new PIXI.Container();
    let startText = new PIXI.Text("Start!");
    startText.x = 5;
    startText.y = startText.height/3;
    
    let startRect = new PIXI.Graphics();
    startRect.beginFill(0x3FFF3F); // black color
    // x, y, width, height, radius
    startRect.lineStyle(2, 0x000000, 1);
    startRect.drawRoundedRect(0, 0, 100, 50, 10);
    startRect.endFill();
    
	startText.style = buttonStyle;

    startButton.addChild(startRect);
    startButton.addChild(startText);
    startButton.style = buttonStyle;
    startButton.x = 250;
    startButton.y = sceneHeight - 100;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup", startGame);
    startButton.on("pointerover", e => {e.target.alpha = 0.7; e.target.width += 10; e.target.height += 10; e.target.x -= 5; e.target.y -= 5;});
    startButton.on("pointerout", e => {e.currentTarget.alpha = 1.0; e.currentTarget.width -= 10; e.currentTarget.height -= 10; e.currentTarget.x += 5;; e.currentTarget.y += 5;});
    startScene.addChild(startButton);
    
    // 2 - set up 'gameScene'
    let textStyle = new PIXI.TextStyle({
        fill: 0x00FF00,
        fontSize: 18,
        fontFamily:  "Share Tech Mono",
        stroke: 0x000000,
        strokeThickness: 4
    });
    
    // 2A - make score label
    scoreLabel = new PIXI.Text();
    scoreLabel.style = textStyle;
    scoreLabel.x = 10;
    scoreLabel.y = 10;
    gameScene.addChild(scoreLabel);
    
    // 2B - make life label
    lifeLabel = new PIXI.Text();
    lifeLabel.style = textStyle;
    lifeLabel.x = sceneWidth - 80;
    lifeLabel.y = 5;
    gameScene.addChild(lifeLabel);
    
    
    // 3 - set up 'gameOverScene'
    // 3A - make game over text
    let gameOverText = new PIXI.Text("Game Over...");
    textStyle = new PIXI.TextStyle({
        fill: 0x00FF00,
        fontSize: 64,
        fontFamily:  "Share Tech Mono",
        stroke: 0x000000,
        strokeThickness: 6
    });
    gameOverText.style = textStyle;
    gameOverText.x = 100;
    gameOverText.y = sceneHeight/2 - 160;
    gameOverScene.addChild(gameOverText);
	
	// 3extra - make game over score text
    gameOverScoreLabel = new PIXI.Text("Score: ");
    textStyle = new PIXI.TextStyle({
        fill: 0x00FF00,
        fontSize: 28,
        fontFamily:  "Share Tech Mono",
        stroke: 0x000000,
        strokeThickness: 4
    });
    gameOverScoreLabel.style = textStyle;
    gameOverScoreLabel.x = sceneWidth/4;
    gameOverScoreLabel.y = sceneHeight/2;
    gameOverScene.addChild(gameOverScoreLabel);
	
    gameOverHighScore = new PIXI.Text("Score: ");
    textStyle = new PIXI.TextStyle({
        fill: 0x00FF00,
        fontSize: 28,
        fontFamily:  "Share Tech Mono",
        stroke: 0x000000,
        strokeThickness: 4
    });
    gameOverHighScore.style = textStyle;
    gameOverHighScore.x = sceneWidth/4 + 25;
    gameOverHighScore.y = sceneHeight/2 + 50;
    gameOverScene.addChild(gameOverHighScore);
    
	
	
    // 3B - make "play again?" button
	let playAgainBtn  = new PIXI.Container();
    let playAgainText = new PIXI.Text("Play Again?");
    
    let playAgainRect = new PIXI.Graphics();
    playAgainRect.beginFill(0x3FFF3F); // black color
    // x, y, width, height, radius
    playAgainRect.lineStyle(2, 0x000000, 1);
    playAgainRect.drawRoundedRect(0, 0, 175, 50, 10);
    playAgainRect.endFill();
	
    playAgainText.style = buttonStyle;
    playAgainText.x = 5;
    playAgainText.y = playAgainText.height/3;
	
    playAgainBtn.x = sceneWidth/3;
    playAgainBtn.y = sceneHeight - 100;
    playAgainBtn.interactive = true;
    playAgainBtn.buttonMode = true;
    playAgainBtn.on("pointerup", startGame);
    playAgainBtn.on("pointerover", e => e.target.alpha = 0.7);
    playAgainBtn.on("pointerout", e => e.currentTarget.alpha = 1.0);
	
	playAgainBtn.addChild(playAgainRect);
	playAgainBtn.addChild(playAgainText);
	
    gameOverScene.addChild(playAgainBtn);
}

// sets up the game objects and variables
function setup() {
    stage = app.stage;
    
	// look for stored high score value
	highScore = localStorage.getItem(localHighScore);
	
	// grab volume slider and set it to 50%
	volumeSlider = document.querySelector("input");
	volumeSlider.value = 50;
	adjustVolume();
	
	// if there is no high score saved, set it to 0
	if(highScore == null){
		highScore = 0;
	}
	
//  Create the `start` scene
	startScene = new PIXI.Container();
    stage.addChild(startScene);
    
//  Create the main `game` scene and make it invisible
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);
    
//  Create the `gameOver` scene and make it invisible
	gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);
    
//  Create labels for all 3 scenes
	createLabelsAndButtons();
    
    player = new Avatar(bounceSounds, 10,0x00FF00, 20, sceneHeight - 50);
	gameScene.addChild(player);
	
	// Platforms instantiation
	{
		let platform1 = new Platform(100, 20, 0x476CAD);
		platforms.push(platform1);

		let platform2 = new Platform(100, 20, 0x476CAD);
		platforms.push(platform2);

		let platform3 = new Platform(100, 20, 0x476CAD);
		platforms.push(platform3);

		let platform4 = new Platform(100, 20, 0x476CAD);
		platforms.push(platform4);
	}

	// Walls instantiation
	{
		let wall1 = new Platform(100, 20, 0xFF0000, 0, 0);
		gameScene.addChild(wall1);
		walls.push(wall1);
	}
	
	// Hazards instantiation
	{
		let hazard1 = new Platform(50, 50, 0xFFFF00);
		gameScene.addChild(hazard1);
		hazards.push(hazard1);
		
		let hazard2 = new Platform(50, 50, 0xFFFF00);
		gameScene.addChild(hazard2);
		hazards.push(hazard2);
	}
	
    key = new Key(0,100);
	gameScene.addChild(key);
	
	// Load in sounds
	{
		music = new Howl({
			src: ['sound/music/adventure2.wav'],
			autoplay: false,
			loop: true
		});
		bounceSound1 = new Howl({
			src: ['sound/fx/Jump.wav']
		});
		bounceSounds.push(bounceSound1);
		bounceSound2 = new Howl({
			src: ['sound/fx/Jump2.wav']
		});
		bounceSounds.push(bounceSound2);
		bounceSound3 = new Howl({
			src: ['sound/fx/Jump3.wav']
		});
		bounceSounds.push(bounceSound3);
		bounceSound4 = new Howl({
			src: ['sound/fx/Jump4.wav']
		});
		bounceSounds.push(bounceSound4);

		hitSound = new Howl({
			src: ['sound/fx/Damaged.wav']
		});

		pickupSound = new Howl({
			src: ['sound/fx/Pickup.wav']
		});
	}
	
	app.renderer.backgroundColor = 0x5d5d5d;	
}

// starts the game
function startGame(){
	// "enable" game scene and "disable" others
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;
	
	// set level and score properties
	levelNum = 1;
	currentScore = 0;
	player.lives = 3;
	
	// if the music isn't playing yet, start it up
	if(!music.playing()){
	   music.play();
	}
	
	// set UI
	lifeLabel.text = player.lives + " Lives";
	scoreLabel.text = "Level: " + levelNum;

	// "start" the game
	paused = false;
	
	// set up the level
	setLevel();
	
	// Animation Loop
    app.ticker.add(gameLoop);
}

// updates the game and all of the updatable objects within it
function gameLoop(){
	// if the game is in play
    if(!paused){
		// Calculate "delta time"
		let dt = 1/app.ticker.FPS;
		if (dt > 1/12) dt=1/12;
		
		// Check for Input
		if(keys[keyboard.RIGHT]){
			player.dx += player.speed;
		}else if(keys[keyboard.LEFT]) {
			player.dx += -player.speed;
		}else if (player.dx != 0){
			player.dx -= 3 * (player.dx * dt);
			if(Math.abs(player.dx) < 1){
			   player.dx = 0;
			}
		}
		
		// move player
		player.update(dt, sceneWidth, sceneHeight);
		
		// move platforms (that are active/moving)
        for(let i = 0; i < platforms.length; i++){
            if(platforms[i].moving){
                platforms[i].update(dt, sceneWidth, sceneHeight);
            }
		}
        
        
        
		// Check for collisions
// PLATFORMS
		for(let i = 0; i < platforms.length; i++){
			if(rectsIntersect(player, platforms[i]) && !player.ignorePlatforms && platforms[i].isActive){
				
				// bounce "animation"
				player.collide(player.dy * dt);
				
				// keep above platform 
				player.y -= 0.6;

				// reverse vertical movement
				player.dy = -player.dy/2;
				
				// allow jumping
				player.isGrounded = true;
				
				// keep the player along the platform (for the most part)
				if(platforms[i].moving){
					// move with the platform
					player.x += platforms[i].dx * dt;
					player.y += platforms[i].dy * dt;
				}
			}
		}
		
// WALLS
		for(let i = 0; i < walls.length; i++){
			if(rectsIntersect(player, walls[i])){
				
				// bounce "animation"
				player.collide(player.dy * dt, bounceSounds);
				
				// reverse vertical movement
				player.dy = -player.dy/2;
				
				
				// if the future player rectangle (one wall height further up than the current) is not colliding with the wall and is higher than the wall
				if(!rectsIntersect(player, walls[i], 0, walls[i].height) && player.y < walls[i].y){
					//allow jumping
					player.isGrounded = true;
				}
				// otherwise have the player bounce off the bottom of the wall
				else{
					player.y += 1;
					player.dy += 1;
				}
			}
		}
		
// HAZARDS
		for(let i = 0; i < hazards.length; i++){
			// if the player intersects with a hazerd (with a 3 pixel forgiveness in both directions)
			if(rectsIntersect(player, hazards[i], 3, 3)){
				
				hitSound.play();
				
				// reset player position
				player.resetPos();
				
				// call player death (returns true if the player is out of lives)
				if(player.die()){
					gameOver();
				}
				
				// update lives ui
				lifeLabel.text = player.lives + " Lives";
			}
		}
        
// KEY
		// if the player intersects with a hazerd (with a 1 pixel crutch in both directions (the hitbox is just a bit smaller than the image's rect))
        if(rectsIntersect(player, key, 1, 1)){  
			
			// play the pickup sound
			pickupSound.play();
			
			// increase score
            currentScore++;
			
			// set the new level
            setLevel();
			
			// increase the level number and update UI
			levelNum++;
			scoreLabel.text = "Level: " + levelNum;
        }

	}
}

// randomly lay out the level
function setLevel(){
	
	// reset player position
	player.resetPos();
	
	// place the key somewhere within the key-space
	key.randomPos(sceneWidth, sceneHeight);
	
	// if there are currently platforms in the scene
	if(currentPlatforms.length > 0){
		// set them all to inactive, and not moving
		for(plat of currentPlatforms){
			plat.isActive = false;
			plat.moving = false;
			plat.dx = 0;
			plat.dy = 0;
		}
		
		// remove it frm the scene
		gameScene.removeChild(plat);
		
		// empty the array
		currentPlatforms = [];
	}

	// grab anywhere from 2-4 platforms
	for(let i = 0; i < Math.ceil(getRandom(2, platforms.length-1)); i++){
		
		// random platform
		let plat = platforms[Math.round(getRandom(0, platforms.length-1))];
		
		// if the platform is already being used, try for another
		if(currentPlatforms.includes(plat)){
			i--;
			continue;
		}

		// place the platform in a new location
		plat.relocate(sceneWidth, sceneHeight);
        
        // if this platform is intersecting any others, relocate it again
        for(otherPlat of currentPlatforms){
            if(otherPlat == plat){
                continue;
            }
            
            while(rectsIntersect(otherPlat, plat)){
                plat.relocate();
            }
        }
        
        // resize walls
		for(wall of walls){
			wall.relocate(sceneWidth, sceneHeight, 0, 100);
            wall.resize();
		}
		
        // correct intersecting hazards
		for(hazard of hazards){
			hazard.relocate(sceneWidth, sceneHeight, 0, sceneHeight - hazard.height);
			
			// if the hazard is too close to the player spawn, move it
			if(hazard.x <= 100){
				hazard.x += 25;
			}
            
			// check for hazard collisions and correct them
            for(otherHazard of hazards){
                if(hazard == otherHazard){
                    continue;
                }
                
                // as long as this hazard is intersecting with another, relocate this one
                while(rectsIntersect( hazard, otherHazard )){
                    hazard.relocate(sceneWidth, sceneHeight, 0, sceneHeight - hazard.height);
                }
            }
		}

		// add this platform to the array
		currentPlatforms.push(plat);

		// activate it and add it to the scene
		plat.isActive = true;
		gameScene.addChild(plat);
		
        // create random chances of the platform moving in x and or y directions
		let chanceX = getRandom(0,10);
		let chanceY = getRandom(0,10);
		
		// chance of moving platform in x direction
		if(chanceX < 5){
			plat.moving = true;
			// randomize speed between 6 intervals of 20
			plat.dx = getRandom(1,5) * 20;
		}
		// if the platform isnt moving in the x direction, incease the chance of moving in the y direction
		else{
			chanceY /= 2;
		}
		// chance of moving platform in y direction
		if(chanceY < 5){
			plat.moving = true;
			// randomize speed between 6 intervals of 20
			plat.dy = getRandom(1,5) * 20;
		}
	}
	
	// move the key
	let keyIntersecting = true;
	
	// while the key is intersecting with an object, move it to a new location and check for collision again
	while( keyIntersecting ){
		
		keyIntersecting = false;
		key.randomPos(sceneWidth, sceneHeight);

		// platform check
        for(otherPlat of currentPlatforms){
            if(rectsIntersect( hazard, otherPlat )){
				keyIntersecting = true;
				continue;
			}
        }
        
        // wall check
		for(wall of walls){
			if(rectsIntersect( wall, key )){
				keyIntersecting = true;
				continue;
			}
		}
		
        // hazards check
		for(hazard of hazards){
			if(rectsIntersect( hazard, key )){
				keyIntersecting = true;
				continue;
			}
		}
	}
	
    // remove inactive platforms from the scene
	for(plat of platforms){
		if(!plat.isActive){
			gameScene.removeChild(plat);
		}
	}
	
    // loop platforms and if any are beyond the screen, move them upward 100px
    for(plat of currentPlatforms){
        if(plat.y > sceneHeight){
            plat.y -= 100;
        }
    }
}

// wraps up the game and displays the game over screen
function gameOver(){
	// pause the game
	paused = true;
	app.ticker.remove(gameLoop);
	
	// check if the player got a new high score
	if(currentScore > highScore){
		highScore = currentScore;
		localStorage.setItem(localHighScore, highScore);
	}

	// update menu text
	gameOverScoreLabel.text = `Levels completed: ${currentScore}`;
	gameOverHighScore.text = `Highest Score: ${highScore}`;
	
	// show gameover screen, hide game screen
	gameOverScene.visible = true;
	gameScene.visible = false;
}

// adjusts the volume of all howler sounds based on the slider value on the page
function adjustVolume(){
	Howler.volume(volumeSlider.value/100);
}