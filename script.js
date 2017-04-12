
let startButton = document.getElementById("start");
let layer = document.getElementById("layer");

//two canvas are drawn: one for background
// another for game action
const canvas = document.querySelector('#action');
const bgcanvas = document.querySelector('#field');

let ctx = canvas.getContext('2d');
let bgctx = bgcanvas.getContext('2d');

// game state variables are identified
let lastTime;
let lastFire=0;

let player;

let lastEnemyCreated=0;

let lastEnemyFired = 0;

let gameTime;

let isGameOver;

//pressed keys memoized in object, cooldown is for rocket fire limit
let pressedKey = {cooldown:false};

//buffer for all animations
let toBeAnimated;

//few code for requiring and caching images
const resources = (function () {

	let cache = {};

	const load = (source) => {
		if(cache[source]) {
			return cache[source];
		} else {
			let entity = new Image();
			entity.src = source;
			cache[source] = entity;
			return entity;
		}
	}

	return {
		load : load };
})();

//constructor of all entities
//pos - position on canvas
//size - position on sprite map
//once - animation, if true - infinite
//speed - multiplier for sprite movement speed on canvas
//axis - additional position shift on sprite map
//animSpeed - animation frames shifting speed
//frames - nnumber of frames in animation
class Entity {
	constructor(url, pos, size, once, speed=0, axis=0,animSpeed=0,frames=[0]) {
		this.sprite = resources.load(url);
		this.position = pos;
		this.size = size;
		this.once = once;
		this.speed = speed;
		this.frames = frames;
		this.axisShift = axis;
		this.animSpeed = animSpeed;
		this.index = 0;
	}
	//updates animation
	updateSelf (delta) {
		ctx.clearRect(0,0, canvas.width, canvas.height)
		this.index += this.animSpeed*delta;
	}
	//renders the entity sprite
	renderSelf (ctx) {
		let now = Date.now();
		let frame;

		let ind = Math.floor(this.index);

		let length = this.frames.length;

		frame = this.frames[ind % length];

		if(this.once && ind >= length) {
			this.done = true;
			return;
		}

		let x = this.position[0];
		let y = this.position[1];

		x = frame * this.size[0];

		ctx.drawImage(this.sprite, x, this.axisShift,
					this.size[0], this.size[1],
					this.position[0], this.position[1],
					this.size[0], this.size[1]);
	}

}

//catches the key being pressed and writes into memory
const setKey = function (event, status) {
	let key;

	switch(event.keyCode) {
		case 32 :
			key = 'SPACE'; break;
		case 37 :
			key = 'LEFT'; break;
		case 38 :
			key = 'UP'; break;
		case 39 :
			key = 'RIGHT'; break;
		case 40 :
			key = 'DOWN'; break;
		default:
			key = String.fromCharCode(event.keyCode);
	}

	pressedKey[key] = status;
}



document.addEventListener('keydown', (event)=>{
	setKey(event, true);
})

document.addEventListener('keyup', (event)=>{
	setKey(event, false);

	if (event.keyCode === 32) {
		pressedKey.cooldown = false;
	}
})

startButton.addEventListener('click', (e)=>{
	layer.style.display = "none";
	resetGame();
})

//checks what has been pressed and assigns parameters to entities according to it
const handleInput = function (delta) {
	if(isGameOver) return;

	if(pressedKey['LEFT']) player.position[0] -= player.sprite.speed * delta;

	if(pressedKey['RIGHT']) player.position[0] += player.sprite.speed * delta;

	if(pressedKey['UP']) player.position[1] -= player.sprite.speed * delta;

	if(pressedKey['DOWN']) player.position[1] += player.sprite.speed * delta;


	// holding space will not help when firing a rocket
	if(pressedKey['SPACE'] && Date.now()-lastFire > 600 && !pressedKey.cooldown) {

		toBeAnimated.rocket.push({position:[player.position[0], player.position[1]-5],
								sprite: new Entity('images/player.png',
													[0,0],[50,60],
													false, 100, 160)});

		//initiates keyup event so that to prevent holding space and firing
		let keyUp = document.createEvent('HTMLEvents');
		keyUp.initEvent('keyup',true,false);
		document.dispatchEvent(keyUp);

		pressedKey.cooldown = true;

		lastFire = Date.now();
	}
}

//render entities
const renderEntities = function (entity) {
	ctx.save();
	ctx.translate(entity.position[0], entity.position[1]);
	entity.sprite.renderSelf(ctx);
	ctx.restore();
}

let field = new Entity('images/terrain.png',
						[0,0]);

//render moving background
const fieldRender = function () {
	let translateY = 350 *((Date.now() - lastTime)/1000.0);
	//ctx.clearRect(0,0,canvas.width,canvas.height);
	let pattern = ctx.createPattern(field.sprite, 'repeat');
	bgctx.fillStyle = pattern;
	bgctx.rect(translateY,0,780,720);
	bgctx.fill();
	bgctx.translate(0,translateY);
}

//general rendering function, summing up all particles
const render = function () {

	fieldRender()

	if (!isGameOver && player) {
		renderEntities(player);
	}

	toBeAnimated.rocket.forEach((a,b,c)=>{
		a.position[1] -= 10;
		renderEntities(a);
	})

	toBeAnimated.bullets.forEach((a,b)=>{
		a.position[1] += 7;
		renderEntities(a);
	})

	toBeAnimated.enemy.forEach((a,b,c)=>{
		a.position[1] += 3;
		renderEntities(a);
	})

	toBeAnimated.explosion.forEach((a,b,c)=>{
		renderEntities(a);
		if(a.sprite.done) {
			a.toErase = true;
		}
	})

}


//resolves collisions
const collide = function (position,size,position2,size2) {
	return !(position[0]+size[0] <= position2[0]  ||
			position[0] > position2[0] + size2[0] ||
			position[1]+size[1] <= position2[1]   ||
			position[1] > position2[1]+size2[1])
}

//updates elements from toBeAnimated Buffer
const updateEntities = function (delta) {

	if(toBeAnimated.player) {
		toBeAnimated.player.forEach((a)=>{
			a.sprite.updateSelf(delta)
		})
	}

	if(toBeAnimated.explosion) {
		toBeAnimated.explosion.forEach((a)=>{
			a.sprite.updateSelf(delta)
		})
	}

	//creates enemies within time interval
	if(gameTime > 3 && Date.now()-lastEnemyCreated > 1500) {

		lastEnemyCreated = Date.now();

		toBeAnimated.enemy.push({position:[Math.random()*(canvas.width-39),0],
								sprite: new Entity('images/foe.png',
													[0, 0],[80,80],
													 false, 0, 180)});
	}

	//each enemy shoots the bullet
	toBeAnimated.enemy.forEach((a,b,c)=>{

		if(Date.now()-lastEnemyFired > 1400) {

			lastEnemyFired = Date.now();

			toBeAnimated.bullets.push({position:[a.position[0], a.position[1]-5],
										sprite: new Entity('images/foe.png',
															[0,0], [80,50],
															false, 0, 260)})
		}

		if(a.position[1] > canvas.height ||
		a.position[0]-a.sprite.size[0] > canvas.width) {
			a.toErase = true;
		}

		//resolves collisions between enemies and rockets
		toBeAnimated.rocket.forEach((d,e,f)=>{

			if(d.position[1]+d.sprite.size[1] < 0) {
				d.toErase = true;
			}

			if(collide(a.position,a.sprite.size,d.position,d.sprite.size)) {
				d.toErase = true;
				a.toErase = true;

				toBeAnimated.explosion.push({position:[a.position[0]+20,a.position[1]],
												sprite: new Entity('images/player.png',
												[0,0],[51,60],
												true, 0, 240, 10,
												[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])})
			}

		})

		//resolves collisions between enemies and player
		if(collide(a.position, a.sprite.size, player.position, player.handicap.size)) {

			if(!player.wounded) {

					player.handicap = {size:[80,80]};
					player.wounded = true;
					player.sprite = new Entity('images/foe.png',
										[0,0],[110,165],
										false, 250, 0, 10,
										[0,1,2,3,4,5]);

			} else {
				player.toErase = true;
				gameOver();
				toBeAnimated.explosion.push({position:[player.position[0]+20,player.position[1]],
												sprite: new Entity('images/player.png',
												[0,0],[51,60],
												true, 0, 240, 10,
												[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])})
			}

		}

	})

	//resolves colllisions between player and bullets
	toBeAnimated.bullets.forEach((a,b)=>{

		if(a.position[1] > canvas.height) {
			a.toErase = true;
		}

		if(collide(a.position, a.sprite.size, player.position, player.handicap.size)) {

			if(!player.wounded) {

				player.handicap = {size:[80,80]};
				player.wounded = true;
				player.sprite = new Entity('images/foe.png',
									[0,0],[110,165],
									false, 250, 0, 10,
									[0,1,2,3,4,5]);

				console.log('fire!');

			} else {
				player.toErase = true;
				gameOver();
				toBeAnimated.explosion.push({position:[player.position[0]+20,player.position[1]],
												sprite: new Entity('images/player.png',
												[0,0],[51,60],
												true, 0, 240, 10,
												[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])})
			}

		}
	})

	//rebuilds animation buffer, discarding elements with done animation and marked "toErase"
	for(let i in toBeAnimated){

		toBeAnimated[i] = toBeAnimated[i].reduce((a,b,c,d)=>{

			if(!b.sprite.done && !b.toErase) {
				a.push(b);
			}
			return a;

		},[]);
	}

}

// "onGameOver" function
const gameOver = function () {

	ctx.font = "30px Comic Sans MS";
	ctx.textAlign = "center";
	ctx.fillStyle = "red";
	ctx.fillText("GAME OVER",canvas.width/2,canvas.height/2);

	setTimeout(()=>{
		layer.style.display = "block";
	}, 1000);

	isGameOver = true;
}

//general updating function
const update = function (delta) {
	gameTime += delta;

	handleInput(delta);

	updateEntities(delta);
}

// "onReset"/"onStart" function
const resetGame = function () {

	gameTime = 0;

	isGameOver = false;

	toBeAnimated = {
		player: [],
		rocket: [],
		enemy: [],
		bullets: [],
		explosion: []
	}

	toBeAnimated.player[0] = {
	handicap: {size: [50,50]},
	wounded : false,
	position: [canvas.width/2,canvas.height-150],
	sprite: new Entity('images/player.png',
						[0,0],[110,165],
						false, 350, 0, 10,
						[0,1,2,3,4,5])
	};

	player = toBeAnimated.player[0];

}

// function for game loop
const main = function () {

	let now = Date.now();
	let delta  = (now - lastTime) / 1000;

	update(delta);
	render();

	lastTime = now;
	requestAnimationFrame(main);
}


//requiring all resources
let mainEntities = [resources.load('images/player.png'), resources.load('images/terrain.png'), resources.load('images/foe.png')];

// function to initiate game
const comeOn = () => {

	resetGame();

	lastTime = Date.now();

	main()
}

//initiates game
let promise = new Promise((resolve,reject)=>{
	mainEntities.forEach((a)=>{
		a.onload = ()=>resolve('ok');
	})
})

// starting our game when all the resources have been loaded
promise.then(res=>comeOn())
		.catch(reject=>console.log(reject));
