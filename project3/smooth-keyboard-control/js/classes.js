class Avatar extends PIXI.Graphics{
	constructor(radius=10, color=0xFF0000, x=0, y=0,speed=5){
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
	}
	
	update(dt, sceneWidth, sceneHeight){
		

		this.x += this.dx * dt;
		this.y += this.dy * dt;

		this.x = clamp(this.x, this.radius, sceneWidth - this.radius);
		this.y = clamp(this.y, this.radius, sceneHeight - this.radius);
		
		// wall bounce
		if( this.x == sceneWidth - this.radius || this.x == this.radius ){
			this.dx = -this.dx;
		}
		
		// floor/ceiling bounce
		if( this.y == sceneHeight - this.radius || this.y == this.radius ){
			this.dy = -this.dy/2;
			
			if(this.isGrounded){
			   this.dy = 0;
		   	}
			
		}
		else{
			this.dy += 9.81;
		}
		
		
		// jumping
		if(this.dy == 0 || this.y == sceneHeight - this.radius){
			this.isGrounded = true;
		}
		else{
			this.isGrounded = false;
		}
		
		
	}
}

class Platform extends PIXI.Graphics{
	constructor(width=100, height=10, color=0xFF0000, x=0, y=0){
		super();
		this.x = x;
		this.y = y;
		this.beginFill(color);
		this.lineStyle(2,0x000000,1);
		this.drawRect(x, y, width, height);
		this.endFill();
	}
}