// We will use `strict mode`, which helps us by having the browser catch many common JS mistakes
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";
const app = new PIXI.Application(600,600);
document.querySelector("#gameWindow").appendChild(app.view);

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
let gameScene, ship, scoreLabel, gameOverScoreLabel, lifeLabel;
let gameOverScene;
let movement = {"x": 0, "y": 0};

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
    
// #5 - Create character
	ship = new Ship();
	gameScene.addChild(ship);
	
// #8 - Start update loop
	app.ticker.add(gameLoop);
}

function createLabelsAndButtons(){
    let buttonStyle = new PIXI.TextStyle({
        fill: 0xFF0000,
        fontSize: 48,
        fontFamily: "Verdana"
        
    });
    
    // 1 set up 'startScene'
    // 1A - make the top start label
    let startLabel1 = new PIXI.Text("JumpyMan");
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
    let startLabel2 = new PIXI.Text("Do you even jump?");
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
	ship.x = 300;
	ship.y = 550;
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
	movement = {"x": 0, "y": 0};
    	
	let amount = 6 * deltaTime;
	
	// linear interpolation
	let newX = lerp(ship.x, mousePos.x, amount);
	let newY = lerp(ship.y, mousePos.y, amount);
	
	// clamp the ship to the screen
	let w2 = ship.width/2;
	let h2 = ship.height/2;
	ship.x = clamp(newX, 0 + w2, sceneWidth - w2);
	ship.y = clamp(newY, 0 + h2, sceneHeight - h2);
	
// #5 - Check for Collisions
	
};


function end(){
	paused = true;
	
	gameOverScoreLabel.text = `Score ${score}`;
	
	gameOverScene.visible = true;
	gameScene.visible = false;
}

function increaseScoreBy(value){
    score += value;
    scoreLabel.text = `Score ${score}`;
}


function loadLevel(){
	paused = false;
}

