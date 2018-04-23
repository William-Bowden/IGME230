class Player extends PIXI.Sprite{
	constructor(x = 0, y = 0){
		super(PIXI.loader.resources["images/Spaceship.png"].texture);
		this.anchor.set(0.5,0.5);
		this.scale.set(0.1);
		this.x = x;
		this.y = y;
	}
	
	function moveup() {
		this.y -= 1; 
	}

	function movedown() {
		this.y += 1; 
	}

	function moveleft() {
		this.x -= 1;
	}

	function moveright() {
		this.x += 1;
	}
	
}