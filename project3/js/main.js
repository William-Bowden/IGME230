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
let gameScene, scoreLabel, gameOverScoreLabel;
let gameOverScene;

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

function createLabelsAndButtons(){
    let buttonStyle = new PIXI.TextStyle({
        fill: 0x00FF00,
        fontSize: 36,
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
    startText.x = 18;
    startText.y = 7.5;
    
    let startRect = new PIXI.Graphics();
    startRect.beginFill(0x3FFF3F); // black color
    // x, y, width, height, radius
    startRect.lineStyle(2, 0x000000, 1);
    startRect.drawRoundedRect(0, 0, 100, 50, 10);
    startRect.endFill();
    
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
        fill: 0xFFFFFF,
        fontSize: 18,
        fontFamily: "Verdana",
        stroke: 0xFF0000,
        strokeThickness: 4
    });
    
    // 2A - make score label
    scoreLabel = new PIXI.Text();
    scoreLabel.style = textStyle;
    scoreLabel.x = 5;
    scoreLabel.y = 5;
    gameScene.addChild(scoreLabel);
    
    // 2B - make life label
    lifeLabel = new PIXI.Text();
    lifeLabel.style = textStyle;
    lifeLabel.x = 5;
    lifeLabel.y = 26;
    gameScene.addChild(lifeLabel);
    
    
    // 3 - set up 'gameOverScene'
    // 3A - make game over text
    let gameOverText = new PIXI.Text("Game Over\n      :-O");
    textStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 64,
        fontFamily: "Verdana",
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    gameOverText.style = textStyle;
    gameOverText.x = 100;
    gameOverText.y = sceneHeight/2 - 160;
    gameOverScene.addChild(gameOverText);
	
	// 3extra - make game over score text
    gameOverScoreLabel = new PIXI.Text("Score: ");
    textStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 28,
        fontFamily: "Verdana",
        stroke: 0xFF0000,
        strokeThickness: 4
    });
    gameOverScoreLabel.style = textStyle;
    gameOverScoreLabel.x = sceneWidth/2 - 80;
    gameOverScoreLabel.y = sceneHeight/2;
    gameOverScene.addChild(gameOverScoreLabel);
    
    // 3B - make "play again?" button
    let playAgainBtn = new PIXI.Text("Play Again?");
    playAgainBtn.style = buttonStyle;
    playAgainBtn.x = 150;
    playAgainBtn.y = sceneHeight - 100;
    playAgainBtn.interactive = true;
    playAgainBtn.buttonMode = true;
    playAgainBtn.on("pointerup", startGame);
    playAgainBtn.on("pointerover", e => e.target.alpha = 0.7);
    playAgainBtn.on("pointerout", e => e.currentTarget.alpha = 1.0);
    gameOverScene.addChild(playAgainBtn);
    
    
}

function setup() {
    stage = app.stage;
    
// #1 - Create the `start` scene
	startScene = new PIXI.Container();
    stage.addChild(startScene);
    
// #2 - Create the main `game` scene and make it invisible
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);
    
// #3 - Create the `gameOver` scene and make it invisible
	gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);
    
// #4 - Create labels for all 3 scenes
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
		let wall1 = new Platform(100, 20, 0xFF0000, 40, sceneHeight - 400);
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
	music = new Howl({
		src: ['sound/music/adventure2.wav'],
		autoplay: true,
		loop: true
	});
	music.play();
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
	
	setLevel();
	
	app.renderer.backgroundColor = 0x5d5d5d;	
}

function startGame(){
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;
	levelNum = 1;
	
	// Animation Loop
    app.ticker.add(gameLoop);
}

function gameLoop(){
    // #1 - Calculate "delta time"
		let dt = 1/app.ticker.FPS;
		if (dt > 1/12) dt=1/12;
		
		// #2 - Check Input
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
		
		// #3 - move avatar
		player.update(dt, sceneWidth, sceneHeight);
		
        
        for(let i = 0; i < platforms.length; i++){
            if(platforms[i].moving){
                platforms[i].update(dt, sceneWidth, sceneHeight);
            }
		}
        
        
        
		// #4 Check collisions
// PLATFORMS
		for(let i = 0; i < platforms.length; i++){
			if(rectsIntersect(player, platforms[i]) && !player.ignorePlatforms && platforms[i].isActive){
				
				// bounce "animation"
				player.collide(player.dy * dt, bounceSounds);
				
				// keep above platform 
				player.y -= 0.6;

				// bounce
				player.dy = -player.dy/2;
				
				player.isGrounded = true;
				
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
				
				// stop vertical movement
				player.dy = 0;
				
				
				// if the future player rectangle (one wall height further up than the current) is not colliding with the wall
				if(!rectsIntersect(player, walls[i], 0, walls[i].height * (2/3))){
					// allow jumping
					player.isGrounded = true;
				}
				
				if(walls[i].moving){
					// move with the platform
					player.x += walls[i].dx * dt;
					player.y += walls[i].dy * dt;
				}
			}
		}
		
// HAZARDS
		for(let i = 0; i < hazards.length; i++){
			if(rectsIntersect(player, hazards[i], 3, 3)){
				
				hitSound.play();
				
				// reset position
				player.resetPos();
				player.die();
			}
		}
        
// KEY
        if(rectsIntersect(player, key)){   
			pickupSound.play();
            currentScore++;
            setLevel();
        }
        
	
}

// randomly lay out the level
function setLevel(){
	
	// reset player position
	player.resetPos();
	
	// place the key somewhere within the key-space
	key.randomPos(sceneWidth, sceneHeight);
	
	if(currentPlatforms.length > 0){
		for(plat of currentPlatforms){
			plat.isActive = false;
			plat.moving = false;
			plat.dx = 0;
			plat.dy = 0;
		}
		
		gameScene.removeChild(plat);
		
		currentPlatforms = [];
	}

	for(let i = 0; i < Math.ceil(getRandom(2, platforms.length-1)); i++){

		let plat = platforms[Math.round(getRandom(0, platforms.length-1))];
		
		plat.relocate();
        
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
			wall.relocate(0,1);
            wall.resize();
		}
		
        // correct intersecting hazards
		for(hazard of hazards){
			hazard.relocate(0, sceneHeight - hazard.height);
            
            for(otherHazard of hazards){
                if(hazard == otherHazard){
                    continue;
                }
                
                // as long as this hazard is intersecting with another, relocate this one
                while(rectsIntersect( hazard, otherHazard )){
                    hazard.relocate(0, sceneHeight - hazard.height);
                }
            }
		}

		currentPlatforms.push(plat);

		plat.isActive = true;
		gameScene.addChild(plat);
		
        // create random chances of the platform moving in x and or y directions
		let chanceX = getRandom(0,10);
		let chanceY = getRandom(0,10);
		
		// chance of moving platform in x direction
		if(chanceX < 5){
			plat.moving = true;
			// randomize speed between 6 intervals of 20
			plat.dx = getRandom(0,5) * 20;
		}
		else{
			chanceY /= 2;
		}
		// chance of moving platform in y direction
		if(chanceY < 5){
			plat.moving = true;
			// randomize speed between 6 intervals of 20
			plat.dy = getRandom(0,5) * 20;
		}
	}
	
    // remove inactive platforms from the scene
	for(plat of platforms){
		if(!plat.isActive){
			gameScene.removeChild(plat);
		}
	}
    
    
    // count the number of platforms that are too low
    let lowPlatCount = 0;
    
    for(plat of currentPlatforms){
        if(plat.y > sceneHeight){
            plat.y -= 100;
        }
    }
}