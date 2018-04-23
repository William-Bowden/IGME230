const app = new PIXI.Application(600,500);
document.querySelector("#gameWindow").appendChild(app.view); 
let player;
	
let platforms = [];
let currentPlatforms = [];


window.onload = ()=>{
	player = new Avatar(10,0x00FF00,300,200);
	app.stage.addChild(player);
	
	
	//Math.ceil((Math.random()*10) /3)
	for(let i = 0; i < 2; i++ ){
		newPlat = platforms[Math.floor(Math.random() * platforms.size)];
		
		// if that platform is already in the current platforms, try for a new platform
		for(let j = 0; j < currentPlatforms.length; j++){
			if(currentPlatforms[j] == newPlat){
				console.log("Platform already in currentPlatforms");
				i--;
				continue;
			}
		}
		// otherwise, add the new platform
		currentPlatforms.push();

	}
	
	let platform1 = new Platform(100, 10, 0x476CAD, 100, 150);
	app.stage.addChild(platform1);
	
	let platform2 = new Platform(100, 10, 0x476CAD, 200, 100);
	app.stage.addChild(platform2);
	
	platforms.push(platform1);
	platforms.push(platform2);
	
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
		player.update(dt, app.view.width, app.view.height);
		
		// #4 Check collisions
		for(let i = 0; i < platforms.length; i++){
			if(rectsIntersect(player, platforms[i]) && !player.ignorePlatforms){
				player.y -= 0.6;

				player.dy = -player.dy/2;
				player.isGrounded = true;
			}
		}
	
	});
	
} // end window.onload