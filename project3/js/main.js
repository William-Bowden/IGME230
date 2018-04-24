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
let currentPlatforms = [];
let key;

function setup() {
    player = new Avatar(10,0x00FF00, 0, sceneHeight);
	app.stage.addChild(player);
	
	let platform1 = new Platform(100, 20, 0x476CAD, 100, 150, true);
	app.stage.addChild(platform1);
	platforms.push(platform1);

	let platform2 = new Platform(100, 20, 0x476CAD, 200, 100);
	app.stage.addChild(platform2);
	platforms.push(platform2);

	let wall1 = new Platform(100, 20, 0xFF0000, 40, 60);
	app.stage.addChild(wall1);
	walls.push(wall1);
	
    key = new Key();
    key.x = 100;
    key.y = 100;
	app.stage.addChild(key);
	
	
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
		for(let i = 0; i < platforms.length; i++){
			if(rectsIntersect(player, platforms[i]) && !player.ignorePlatforms){
				
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
		
		for(let i = 0; i < walls.length; i++){
			if(rectsIntersect(player, walls[i])){
				
				console.log("Player Y = " + player.y);
				console.log("Wall Y = " + walls[i].y);
				
				// bounce "animation"
				player.collide(player.dy * dt);
				
				// bounce
				player.dy = -player.dy/2;
				
				player.isGrounded = true;
				
				// move with the platform
				player.x += walls[i].dx * dt;
				player.y += walls[i].dy * dt;
			}
		}
        
        if(rectsIntersect(player, key)){
            console.log("Key Touched");
            key.x += 30;
            
            
            //create new platforms
        }
        
	
	});
	
}