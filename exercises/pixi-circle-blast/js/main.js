// We will use `strict mode`, which helps us by having the browser catch many common JS mistakes
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";
const app = new PIXI.Application(800,700);

// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;	

// pre-load the images
PIXI.loader.
add(["images/Spaceship.png","images/explosions.png"]).
on("progress",e=>{console.log(`progress=${e.progress}`)}).
load(setup);

// aliases
let stage;

// game variables
let startScene;
let gameScene, ship, scoreLabel, gameOverScoreLabel, lifeLabel, shootSound, hitSound, fireballSound, bulletsPerShot;
let gameOverScene;

let circles = [];
let bullets = [];
let aliens = [];
let explosions = [];
let explosionTextures;
let score = 0;
let life = 100;
let levelNum = 1;
let paused = true;

function setup() {
    
    //
    // Basket of verlet constraints
    //
    Physics(function (world) {

        // bounds of the window
        var viewportBounds = Physics.aabb(0, 0, window.innerWidth, window.innerHeight)
            ,edgeBounce
            ,renderer
            ;

        // create a renderer
        renderer = Physics.renderer('pixi', {
            el: 'viewport'
        });

        // add the renderer
        world.add(renderer);
        // render on each step
        world.on('step', function () {
            world.render();
        });

        // constrain objects to these bounds
        edgeBounce = Physics.behavior('edge-collision-detection', {
            aabb: viewportBounds
            ,restitution: 0.2
            ,cof: 0.8
        });

        // resize events
        window.addEventListener('resize', function () {

            // as of 0.7.0 the renderer will auto resize... so we just take the values from the renderer
            viewportBounds = Physics.aabb(0, 0, renderer.width, renderer.height);
            // update the boundaries
            edgeBounce.setAABB(viewportBounds);

        }, true);

        // for constraints
        var rigidConstraints = Physics.behavior('verlet-constraints', {
            iterations: 6
        });

        // the "basket"
        var basket = [];
        for ( var i = 200; i < Math.min(renderer.width - 200, 400); i += 5 ){

            l = basket.push(
                Physics.body('circle', {
                    x: i
                    ,y: renderer.height / 1.4 + (i/3)
                    ,radius: 1
                    ,restitution: 1
                    ,mass: .5
                    ,hidden: true
                })
            );

            rigidConstraints.distanceConstraint( basket[ l - 1 ], basket[ l - 2 ], 2 );
        }

//        world.on('render', function( data ){
//
//            var renderer = data.renderer;
//            for ( var i = 1, l = basket.length; i < l; ++i ){
//
//                renderer.drawLine(basket[ i - 1 ].state.pos, basket[ i ].state.pos, {
//                    strokeStyle: '#cb4b16'
//                    ,lineWidth: 3
//                });
//            }
//        });

        // fix the ends
        basket[ 0 ].treatment = 'static';
        basket[ l - 1 ].treatment = 'static';

        basket[ 0 ].treatment = 'static';
        basket[ l - 1 ].treatment = 'static';

        // falling boxes
        var boxes = [];
        for ( var i = 0, l = 1; i < l; ++i ){

            boxes.push( Physics.body('circle', {
                radius: 40
                ,x: 60 * (i % 6) + renderer.width / 2 - (180)
                ,y: 60 * (i / 6 | 0) + 50
                ,restitution: 0.9
                ,angle: Math.random()
                ,styles: {
                    fillStyle: '#268bd2'
                    ,angleIndicator: '#155479'
                    ,strokeStyle: '#155479'
                    ,lineWidth: 1
                }
            }));
        }

        world.add( basket );
        world.add( boxes );
        world.add( rigidConstraints );

        // add things to the world
        world.add([
            Physics.behavior('interactive', { el: renderer.el })
            ,Physics.behavior('constant-acceleration')
            ,Physics.behavior('body-impulse-response')
            ,Physics.behavior('body-collision-detection')
            ,Physics.behavior('sweep-prune')
            ,edgeBounce
        ]);

        // subscribe to ticker to advance the simulation
        Physics.util.ticker.on(function( time ) {
            world.step( time );
        });
    });

    
    
    
    
    

    
//	stage = app.stage;
//// #1 - Create the `start` scene
//	startScene = new PIXI.Container();
//    stage.addChild(startScene);
//    
//// #2 - Create the main `game` scene and make it invisible
//    gameScene = new PIXI.Container();
//    gameScene.visible = false;
//    stage.addChild(gameScene);
//    
//// #3 - Create the `gameOver` scene and make it invisible
//	gameOverScene = new PIXI.Container();
//    gameOverScene.visible = false;
//    stage.addChild(gameOverScene);
//    
//// #4 - Create labels for all 3 scenes
//	createLabelsAndButtons();
//    
//// #5 - Create ship
//	ship = new Ship();
//	gameScene.addChild(ship);
//	
//// #6 - Load Sounds
//	shootSound = new Howl({
//		src: ['sounds/shoot.wav']
//	});
//	
//	hitSound = new Howl({
//		src: ['sounds/hit.mp3']
//	});
//	
//	fireballSound = new Howl({
//		src: ['sounds/fireball.mp3']
//	});
//	
//// #7 - Load sprite sheet
//	explosionTextures = loadSpriteSheet();
//	
//// #8 - Start update loop
//	app.ticker.add(gameLoop);
//	
//// #9 - Start listening for click events on the canvas
//	bulletsPerShot = 1;
//	app.view.onclick = fireBullet;
//	
// Now our `startScene` is visible
// Clicking the button calls startGame()
}

function createLabelsAndButtons(){
    let buttonStyle = new PIXI.TextStyle({
        fill: 0xFF0000,
        fontSize: 48,
        fontFamily: "Verdana"
    });
    
    // 1 set up 'startScene'
    // 1A - make the top start label
    let startLabel1 = new PIXI.Text("Circle Blast!");
    startLabel1.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 84,
        fontFamily: "Verdana",
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    startLabel1.x = 50;
    startLabel1.y = 120;
    startScene.addChild(startLabel1);
    
    //1B - make the middle start label
    let startLabel2 = new PIXI.Text("Are you worthy?");
    startLabel2.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 28,
        fontFamily: "Verdana",
        fontStyle: "italic",
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    startLabel2.x = 185;
    startLabel2.y = 300;
    startScene.addChild(startLabel2);
    
    //1C - make the start game button
    let startButton = new PIXI.Text("Start!");
    startButton.style = buttonStyle;
    startButton.x = 225;
    startButton.y = sceneHeight - 100;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup", startGame);
    startButton.on("pointerover", e => e.target.alpha = 0.7);
    startButton.on("pointerout", e => e.currentTarget.alpha = 1.0);
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
    increaseScoreBy(0);
    
    // 2B - make life label
    lifeLabel = new PIXI.Text();
    lifeLabel.style = textStyle;
    lifeLabel.x = 5;
    lifeLabel.y = 26;
    gameScene.addChild(lifeLabel);
    decreaseLifeBy(0);
    
    
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

function startGame(){
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;
	levelNum = 1;
	score = 0;
	life = 100;
	increaseScoreBy(0);
	decreaseLifeBy(0);
	ship.x = 300;
	ship.y = 550;
    bulletsPerShot = 1;
	loadLevel();
}

function gameLoop(){
	if (paused) return;
	
// #1 - Calculate "delta time"
	let deltaTime = 1/app.ticker.FPS;
	if(deltaTime > 1/12) {
		deltaTime = 1/12;
	}
	
// #2 - Move Ship
	let mousePos = app.renderer.plugins.interaction.mouse.global;
	
	let amount = 6 * deltaTime;
	
	// linear interpolation
	let newX = lerp(ship.x, mousePos.x, amount);
	let newY = lerp(ship.y, mousePos.y, amount);
	
	// clamp the ship to the screen
	let w2 = ship.width/2;
	let h2 = ship.height/2;
	ship.x = clamp(newX, 0 + w2, sceneWidth - w2);
	ship.y = clamp(newY, 0 + h2, sceneHeight - h2);
	
// #3 - Move Circles
	for(let c of circles){
		c.move(deltaTime);

		if(c.x <= c.radius || c.x >= sceneWidth - c.radius){
			c.reflectX();
			c.move(deltaTime);
		}
		
		if(c.y <= c.radius || c.y >= sceneHeight - c.radius){
			c.reflectY();
			c.move(deltaTime);
		}
	}
	
	
// #4 - Move Bullets
	for (let b of bullets){
		b.move(deltaTime);
	}
	
// #5 - Check for Collisions
	for(let c of circles){
		
		// 5A - circles & bullets
		for(let b of bullets){
			
			if(rectsIntersect(c, b)){
				fireballSound.play();
				createExplosion(c.x, c.y, 64, 64);
				
				gameScene.removeChild(c);
				c.isAlive = false;
				
				gameScene.removeChild(b);
				b.isAlive = false;
				
				increaseScoreBy(1);
			}
			
			// if the bullet is off screen, 'kill' it
			if(b.y < -10)
				b.isAlive = false;
		}
		
		// 5B - circles & ship
		if(c.isAlive && rectsIntersect(c, ship)){
		   hitSound.play();
			gameScene.removeChild(c);
			c.isAlive = false;
			decreaseLifeBy(20);
		}
	}
	
	
// #6 - Now do some clean up
	bullets = bullets.filter(b => b.isAlive);
	circles = circles.filter(c => c.isAlive);
	explosions = explosions.filter(e => e.playing);
	
	
// #7 - Is game over?
	if(life <= 0){
		end();
		return;
	}
	
	
// #8 - Load next level
	if (circles.length == 0){
		levelNum ++;		
		loadLevel();
	}
	
}

function createCircles(numCircles){
	for(let i = 0; i < numCircles; i++){
		let c = new Circle(10, 0xFFFF00);
		c.x = Math.random() * (sceneWidth - 50) + 25;
		c.y = Math.random() * (sceneHeight - 400) + 25;
		circles.push(c);
		gameScene.addChild(c);
	}
}

function createExplosion(x, y, frameWidth, frameHeight){
	let w2 = frameWidth/2;
	let h2 = frameHeight/2;
	let expl = new PIXI.extras.AnimatedSprite(explosionTextures);
	expl.x = x - w2;
	expl.y = y - h2;
	expl.animationSpeed = 1/7;
	expl.loop = false;
	expl.onComplete = e => gameScene.removeChild(expl);
	explosions.push(expl);
	gameScene.addChild(expl);
	expl.play();
}

function decreaseLifeBy(value){
    life -= value;
    life = parseInt(life);
    lifeLabel.text = `Life    ${life}%`;
}


function end(){
	paused = true;
	
	// clear out the level
	circles.forEach(c => gameScene.removeChild(c));
	circles = [];
	
	bullets.forEach(b => gameScene.removeChild(b));
	bullets = [];
	
	explosions.forEach(e => gameScene.removeChild(e));
	explosions = [];
	
	gameOverScoreLabel.text = `Score ${score}`;
	
	gameOverScene.visible = true;
	gameScene.visible = false;
}

function fireBullet(e){
	if(paused)
		return;
	
	let offset = 10;
    let b;
    
    if(bulletsPerShot == 1){
        offset = 0;
    }
	
    for(let i = 0; i < bulletsPerShot; i++){
        b = new Bullet(0xFFFFFF, ship.x + (offset * i) - offset, ship.y);
        bullets.push(b);
        gameScene.addChild(b);
    }
	
	shootSound.play();
}

function increaseScoreBy(value){
    score += value;
    scoreLabel.text = `Score ${score}`;
}


function loadLevel(){
	if(levelNum > 1){
	   bulletsPerShot = 3;
	}
	
	createCircles(levelNum * 5);
	paused = false;
}

function loadSpriteSheet(){
	let spriteSheet = PIXI.BaseTexture.fromImage("images/explosions.png");
	let width = 64;
	let height = 64;
	let numFrames = 16;
	let textures = [];
	
	for(let i = 0; i < numFrames; i++){
		let frame = new PIXI.Texture(spriteSheet, new PIXI.Rectangle(i * width, 64, width, height));
		textures.push(frame);
	}
	
	return textures;
}

