const app = new PIXI.Application(600,500);
document.querySelector("#gameWindow").appendChild(app.view); 

// pre-load the images
PIXI.loader.
add(["media/Key.png"]).
on("progress",e=>{console.log(`progress=${e.progress}`)}).
load(setup);

let sceneWidth = app.view.width;
let sceneHeight = app.view.height;
let player;
	
let platforms = [];
let walls = [];
let hazards = [];
let currentPlatforms = [];
let key;

function setup() {
    player = new Avatar(10,0x00FF00, 0, sceneHeight - 50);
	app.stage.addChild(player);
	
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
		app.stage.addChild(wall1);
		walls.push(wall1);
	}
	
	// Hazards instantiation
	{
		let hazard1 = new Platform(50, 50, 0xFFFF00);
		app.stage.addChild(hazard1);
		hazards.push(hazard1);
	}
	
    key = new Key();
    key.x = 100;
    key.y = 100;
	app.stage.addChild(key);
	
	setLevel();
	
	
	app.renderer.backgroundColor = 0x5d5d5d;

	// Animation Loop
	app.ticker.add(()=>{
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
		
		if(keys[keyboard.UP] && player.isGrounded) {
			player.dy -= clamp(player.dy, 350, 350);
		}
		
		if(keys[keyboard.DOWN]) {
			player.ignorePlatforms = true;
		}
		else{
			player.ignorePlatforms = false;
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
				player.collide(player.dy * dt);
				
				// keep above platform 
				player.y -= 0.6;

				// bounce
				player.dy = -player.dy/2;
				
				player.isGrounded = true;
				
				// move with the platform
				player.x += platforms[i].dx * dt;
				player.y += platforms[i].dy * dt;
			}
		}
		
// WALLS
		for(let i = 0; i < walls.length; i++){
			if(rectsIntersect(player, walls[i])){
				
				// bounce "animation"
				player.collide(player.dy * dt);
				
				// stop vertical movement
				player.dy = 0;
				
				
				// if the future player rectangle (one wall height further up than the current) is not colliding with the wall
				if(!rectsIntersect(player, walls[i], 0, walls[i].height * (2/3))){
					// allow jumping
					player.isGrounded = true;
				}
				
				// move with the platform
				player.x += walls[i].dx * dt;
				player.y += walls[i].dy * dt;
				
			}
		}
		
// HAZARDS
		for(let i = 0; i < hazards.length; i++){
			if(rectsIntersect(player, hazards[i], 3, 3)){
				
				// reset position
				player.resetPos();
				player.die();
			}
		}
        
// KEY
        if(rectsIntersect(player, key)){           
            setLevel();
        }
        
	
	});
	
}

function setLevel(){
	
	player.resetPos();
	key.randomPos(sceneWidth, sceneHeight);
	
	if(currentPlatforms.length > 0){
		for(plat of currentPlatforms){
			plat.isActive = false;
			plat.moving = false;
			plat.dx = 0;
			plat.dy = 0;
		}
		
		app.stage.removeChild(plat);
		
		currentPlatforms = [];
	}

	for(let i = 0; i < Math.floor(2,4); i++){

		let plat = platforms[Math.round(getRandom(0, platforms.length-1))];

		while(currentPlatforms.indexOf(plat) != -1){
			plat = platforms[Math.floor(getRandom(0, platforms.length-1))];
		}
		
		plat.relocate();
		
		for(wall of walls){
			while(rectsIntersect(plat, wall)){
				plat.relocate();
			}
			while(rectsIntersect(key, wall)){
				key.randomPos(sceneWidth, sceneHeight);
			}
		}
		
		for(otherPlat of platforms){
			if(plat == otherPlat){
				continue;
			}
			else{
				while(rectsIntersect(plat, otherPlat, 20, 20)){
					plat.relocate();
				}
				while(rectsIntersect(key, plat, 10, 10)){
					key.randomPos(sceneWidth, sceneHeight);
				}
			}
		}
		
		for(hazard of hazards){
			while(rectsIntersect(plat, hazard)){
				plat.relocate();
			}
			while(rectsIntersect(key, hazard)){
				key.randomPos(sceneWidth, sceneHeight);
			}
		}

		currentPlatforms.push(plat);

		plat.isActive = true;
		app.stage.addChild(plat);

		if(getRandom(0,10) < 2){
			plat.moving = true;
			plat.dx = getRandom(0,20) * 4;
			plat.dy = getRandom(0,20) * 4;
		}

	}
	
	for(hazard of hazards){
		hazard.relocate();
	}
	
	for(plat of platforms){
		if(!plat.isActive){
			app.stage.removeChild(plat);
		}
	}
}