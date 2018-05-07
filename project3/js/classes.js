class Avatar extends PIXI.Graphics{
	constructor(sounds, radius=10, color=0x00FF00, x=0, y=0, speed=5){
		super();
		this.radius = radius;
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.beginFill(color);
		this.lineStyle(2,0x000000,1);
		this.drawCircle(0,0,radius);
		this.endFill();
		
		// other properties
		this.isGrounded = false;
		this.ignorePlatforms = false;
		this.dx = 0; // per second
		this.dy = 0; // per second
		this.lives = 3;
		this.maxWidth = this.width;
		this.maxHeight = this.height;
		this.maxSpeed = 600;
		this.sounds = sounds;
		this.soundPlaying = false;
	}
	
	update(dt, sceneWidth, sceneHeight){
		
		if(keys[keyboard.UP] && player.isGrounded) {
			player.dy -= clamp(player.dy, 350, 350);
			bounceSounds[Math.floor(getRandom(0,bounceSounds.length))].play();
			this.soundPlaying = true;
		}
		if(this.dy < 0 || keys[keyboard.DOWN]){
			this.ignorePlatforms = true;
		}
		
		else{
			this.ignorePlatforms = false;
		}
		
		// movement
		this.x += this.dx * dt;
		this.y += this.dy * dt;
		
		// vertical stretch
		if(Math.abs(this.dy) > Math.abs(this.dx)){
			this.width -= (Math.abs(this.dy * dt)/2);
			this.height += (Math.abs(this.dy * dt)/2);
		}
		// horizontal stretch
		else{
			this.height -= (Math.abs(this.dx * dt)/2);
			this.width += (Math.abs(this.dx * dt)/2);
		}
		
		this.width += 1;
		this.height += 1;
		
		this.width = clamp(this.width, 12, this.maxWidth);
		this.height = clamp(this.height, 12, this.maxHeight);
		
		this.dx = clamp(this.dx, -this.maxSpeed, this.maxSpeed);
		this.dy = clamp(this.dy, -this.maxSpeed, this.maxSpeed);

		// contain within the playspace
		this.x = clamp(this.x, this.radius, sceneWidth - this.radius);
		this.y = clamp(this.y, this.radius, sceneHeight - this.radius);
		
		// wall bounce
		if( this.x == sceneWidth - this.radius || this.x == this.radius ){
			this.collide(-Math.abs(this.dx * dt));

			this.dx = -this.dx;

		}
		
		// floor/ceiling bounce
		if( this.y == sceneHeight - this.radius || this.y == this.radius ){
			this.collide(Math.abs(this.dy * dt));

			this.dy = -this.dy/2;
						
			if(this.isGrounded){
			   this.dy = 0;
		   	}
			
		}
		else{
			// "gravity"
			this.dy += 9.81;
		}
		
		
		// jumping
		if(this.dy == 0 || this.y == sceneHeight - this.radius){
			this.isGrounded = true;
		}
		else{
			this.isGrounded = false;
		}
		
		this.soundPlaying = false;
		
	}
	
	collide(force){				
		this.height -= force;
		this.width += force;
		
		// check for being against the wall (too many sounds would play)
		if(this.x != 0){
			if( (Math.abs(player.dy)> 100 ) && player.isGrounded == false && !this.soundPlaying){
				let index = Math.floor(getRandom(0,this.sounds.length));
				this.sounds[index].play();
			}
		}
	}
	
	// player death
	die(){
		this.lives -= 1;

		if(this.lives <= 0){
			console.log("Ded");
		}
	}
	
	// reset player position
	resetPos(){
		this.x = 20;
		this.y = sceneHeight - 50;

		this.dx = 0;
		this.dy = 0;
	}
	
}

class Platform extends PIXI.Graphics{
	constructor(width=100, height=10, color=0x476CAD, x=0, y=0, isActive=false, moving=false){
		super();
		this.x = x;
		this.y = y;
		this.beginFill(color);
		this.lineStyle(2,0x000000,1);
		this.drawRect(x, y, width, height);
		this.endFill();
        
		this.isActive = isActive;
        this.moving = moving;
        this.dx = 0;
        this.dy = 0;
		
		if(this.moving && this.isActive){
			this.dx = 100;
			this.dy = 50;
		}
	}
    
    update(dt, sceneWidth, sceneHeight){

		if(this.moving){
            this.x += this.dx * dt;
            this.y += this.dy * dt;
			
			// reverse x direction
            if(this.x >= sceneWidth-(this.width) || this.x <= 0){
               this.dx = -this.dx;
            }
			
			// reverse y direction
			if(this.y >= sceneHeight - this.height || this.y <= 200){
               this.dy = -this.dy;
            }
        }
        
	}
	
	relocate(newX=0, newY=0){
		
		// if the x isn't being set
		if(newX == 0){
			// put the platform somewhere random on the x axis
			this.x = Math.floor(getRandom(2, 7))*25;
		}
		else{
			this.x = newX;
		}
		// if the y isn't being set
		if(newY == 0){
			// put the platform somewhere random on the y axis
			this.y = Math.floor(getRandom(8, 12))*25;
		}
		else{
			this.y = newY;
		}
		
	}
    
    resize(){
        // put the platform somewhere random on the x axis
        this.width = Math.floor(getRandom(5, 20))*10;
	}
}

class Key extends PIXI.Sprite{
    constructor(x = 0, y = 0){
		super(PIXI.loader.resources["media/Key.png"].texture);
		this.anchor.set(0.5, 0.5);
		this.scale.set(0.1);
		this.x = x;
		this.y = y;
	}
	
	randomPos(hazards, sceneWidth, sceneHeight){
		// randomize x pos within screen width
		this.x = getRandom(this.width * 2, sceneWidth - this.width * 3);
		// randomize y pos within top half of the game screen
		this.y = getRandom(30, 175);
        
        // if it's within any hazards, reposition it again
        for(hazard in hazards){
            if(rectsIntersect(hazard, this)){
                this.randomPos(hazards, sceneWidth, sceneHeight);
            }
        }
	}
}