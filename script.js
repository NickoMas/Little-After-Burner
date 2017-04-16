
import {Sound} from "./sounds.js";
import {keys, keyEvents} from "./keys.js";
import {resources, Entity} from "./entities.js";
import {ctxText} from "./ctxText.js";
import {
	playerFireThreshold,
	rocketInFront,
	fieldVelocity,
	rocketVelocity,
	bulletsVelocity,
	enemyVelocity,
	gameTimeInt,
	enemySpawnThreshold,
	enemyWidth,
	enemyFireThreshold,
	bulletsSpawn,
	explosionSpawn,
	playerSpawn
} from "./fixedValues.js";


//two canvas are drawn: one for background
// another for game action
const canvas = document.querySelector('#action');
const bgcanvas = document.querySelector('#field');

let ctx = canvas.getContext('2d');
let bgctx = bgcanvas.getContext('2d');

export {ctx, canvas};

let startButton = document.getElementById("start");
let layer = document.getElementById("layer");


// game state variables
let lastTime;
let lastFire=0;
let player;
let lastEnemyCreated = 0;
let lastEnemyFired = 0;
let gameTime;
let isGameOver;
let mainOST;

//pressed keys memoized in object, cooldown is for rocket fire limit
let pressedKey = {cooldown:false};

//buffer for all animations
let toBeAnimated;

let boom = new Sound("sounds/boom.mp3");
let fire = new Sound("sounds/launch.mp3");

/**
 * writes into memory the key being pressed
 * @function
 * @param {object} event
 * @param {boolean} status
 */
const setKey = function (event, status) {
	let key;

	switch(event.keyCode) {
		case keys.key1.keyCode :
			key = keys.key1.keyName;
			break;
		case keys.key2.keyCode :
			key = keys.key2.keyName;
			break;
		case keys.key3.keyCode :
			key = keys.key3.keyName;
			break;
		case keys.key4.keyCode :
			key = keys.key4.keyName;
			break;
		case keys.key5.keyCode :
			key = keys.key5.keyName;
			break;
		default:
			key = String.fromCharCode(event.keyCode);
	}

	pressedKey[key] = status;
}



document.addEventListener(keyEvents.key1, (event) => {
	setKey(event, true);
});

document.addEventListener(keyEvents.key2, (event) => {
	setKey(event, false);

	if (event.keyCode === keys.key1.keyCode) {
		pressedKey.cooldown = false;
	}
});

startButton.addEventListener(keyEvents.key3, (event) => {
	layer.style.display = "none";
	resetGame();
});

/**
 * assigns parameters to entities
 * @function
 * @param {number} delta
 */
const handleInput = function (delta) {

	let playerFireInt = Date.now() - lastFire;

	if(isGameOver) {
		return;
	}

	if(pressedKey[keys.key2.keyName]) {
		player.position[0] -= player.sprite.speed * delta;
	}

	if(pressedKey[keys.key4.keyName]) {
		player.position[0] += player.sprite.speed * delta;
	}

	if(pressedKey[keys.key3.keyName]) {
		player.position[1] -= player.sprite.speed * delta;
	}

	if(pressedKey[keys.key5.keyName]) {
		player.position[1] += player.sprite.speed * delta;
	}

	// holding space will not help when firing a rocket
	if(pressedKey[keys.key1.keyName] &&
		playerFireInt > playerFireThreshold &&
		!pressedKey.cooldown) {

		fire.play();

		toBeAnimated.rocket.push({	position: [player.position[0], player.position[1] - rocketInFront],
									sprite: new Entity('images/player.png',
														[0,0],
														[50,60],
														false,
														100,
														160)
								});

		//initiates keyup event so that to prevent holding space and firing
		let keyUp = document.createEvent('HTMLEvents');
		keyUp.initEvent(keyEvents.key2, true, false);
		document.dispatchEvent(keyUp);

		pressedKey.cooldown = true;

		lastFire = Date.now();
	}
};

/**
 * renders entities
 * @function
 * @param {object} entity
 */
const renderEntities = function (entity) {
	ctx.save();
	ctx.translate(entity.position[0], entity.position[1]);
	entity.sprite.renderSelf(ctx);
	ctx.restore();
};

let field = new Entity('images/terrain.png',
						[0,0]);

/**
 * makes background moving infinitely and renders it
 * @function
 */
const fieldRender = function () {
	let translateY = fieldVelocity * ((Date.now() - lastTime) / 1000);
	let pattern = ctx.createPattern(field.sprite, 'repeat');
	bgctx.fillStyle = pattern;
	bgctx.rect(translateY, 0, 780, 720);
	bgctx.fill();
	bgctx.translate(0, translateY);
};

/**
 * renders everything
 * @function
 */
const render = function () {

	fieldRender();

	if (!isGameOver && player) {
		renderEntities(player);
	}

	toBeAnimated.rocket.forEach((element)=>{
		element.position[1] += rocketVelocity;
		renderEntities(element);
	});

	toBeAnimated.bullets.forEach((element)=>{
		element.position[1] += bulletsVelocity;
		renderEntities(element);
	});

	toBeAnimated.enemy.forEach((element)=>{
		element.position[1] += enemyVelocity;
		renderEntities(element);
	});

	toBeAnimated.explosion.forEach((element)=>{
		renderEntities(element);
		if(element.sprite.done) {
			element.toErase = true;
		}
	});

};

/**
 * renders entities
 * @function
 * @param {object} entity
 */
const collide = function (position, size, position2, size2) {
	let rightEdge = position[0] + size[0];
	let rightEdge2 = position2[0] + size2[0];
	let bottomEdge = position[1] + size[1];
	let bottomEdge2 = position2[1] + size2[1];

	return !(rightEdge <= position2[0] ||
			position[0] > rightEdge2   ||
			bottomEdge <= position2[1] ||
			position[1] > bottomEdge2);
};

/**
 * updates entities
 * @function
 * @param {number} delta
 */
const updateEntities = function (delta) {

	let enemySpawnInt = Date.now() - lastEnemyCreated;

	let enemyFireInt = Date.now() - lastEnemyFired;

	if(toBeAnimated.player) {
		toBeAnimated.player.forEach((element)=>{
			element.sprite.updateSelf(delta);
		});
	}

	if(toBeAnimated.explosion) {
		toBeAnimated.explosion.forEach((element)=>{
			element.sprite.updateSelf(delta);
		});
	}

	//creates enemies within time interval
	if(gameTime > gameTimeInt && enemySpawnInt > enemySpawnThreshold) {

		lastEnemyCreated = Date.now();

		toBeAnimated.enemy.push({	position:[Math.random() * (canvas.width - enemyWidth), 0],
									sprite: new Entity('images/foe.png',
													[0, 0],
													[80, 80],
													false,
													0,
													180)
								});
	}

	//each enemy shoots the bullet
	toBeAnimated.enemy.forEach((outerEl) => {

		let enemyBorder = outerEl.position[0] - outerEl.sprite.size[0];

		if(enemyFireInt > enemyFireThreshold) {

			lastEnemyFired = Date.now();

			toBeAnimated.bullets.push({	position:[outerEl.position[0], outerEl.position[1] - bulletsSpawn],
										sprite: new Entity('images/foe.png',
															[0, 0],
															[80, 50],
															false,
															0,
															260)
										});
		}

		if(outerEl.position[1] > canvas.height ||
		enemyBorder > canvas.width) {
			outerEl.toErase = true;
		}

		//resolves collisions between enemies and rockets
		toBeAnimated.rocket.forEach((innerEl)=>{

			if(innerEl.position[1] + innerEl.sprite.size[1] < 0) {
				innerEl.toErase = true;
			}

			if(collide(outerEl.position, outerEl.sprite.size, innerEl.position, innerEl.sprite.size)) {
				innerEl.toErase = true;
				outerEl.toErase = true;
				boom.play();
				toBeAnimated.explosion.push({	position: [outerEl.position[0] + explosionSpawn, outerEl.position[1]],
												sprite: new Entity('images/player.png',
												[0, 0],
												[51, 60],
												true,
												0,
												240,
												10,
												[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
											});
			}

		});

		//resolves collisions between enemies and player
		if(collide(outerEl.position, outerEl.sprite.size, player.position, player.handicap.size)) {

			if(!player.wounded) {

					player.handicap = {size:[80, 80]};
					player.wounded = true;
					player.sprite = new Entity('images/foe.png',
												[0, 0],
												[110, 165],
												false,
												250,
												0,
												10,
												[0, 1, 2, 3, 4, 5]);

			} else {
				player.toErase = true;
				gameOver();
				boom.play();
				toBeAnimated.explosion.push({	position: [player.position[0] + explosionSpawn, player.position[1]],
												sprite: new Entity('images/player.png',
																	[0, 0],
																	[51, 60],
																	true,
																	0,
																	240,
																	10,
																	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
											});
			}

		}

	});

	//resolves colllisions between player and bullets
	toBeAnimated.bullets.forEach((outerEl) => {

		if(outerEl.position[1] > canvas.height) {
			outerEl.toErase = true;
		}

		if(collide(outerEl.position, outerEl.sprite.size, player.position, player.handicap.size)) {

			if(!player.wounded) {

				player.handicap = {size:[80, 80]};
				player.wounded = true;
				player.sprite = new Entity('images/foe.png',
											[0, 0],
											[110, 165],
											false,
											250,
											0,
											10,
											[0, 1, 2, 3, 4, 5]);
			} else {
				player.toErase = true;
				gameOver();
				toBeAnimated.explosion.push({	position: [player.position[0] + explosionSpawn, player.position[1]],
												sprite: new Entity('images/player.png',
																	[0, 0],
																	[51, 60],
																	true,
																	0,
																	240,
																	10,
																	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
											});
			}

		}
	});

	//rebuilds animation buffer, discarding elements with done animation and marked "toErase"
	for(let i in toBeAnimated){

		toBeAnimated[i] = toBeAnimated[i].reduce((accumulator,element) => {

			if(!element.sprite.done && !element.toErase) {
				accumulator.push(element);
			}
			return accumulator;

		},[]);
	}

};

/**
 * describes actions on game being over
 * @function
 */
const gameOver = function () {

	ctx.font = ctxText.font;
	ctx.textAlign = ctxText.textAlign;
	ctx.fillStyle = ctxText.fillStyle;
	ctx.fillText(ctxText.fillText, canvas.width / 2, canvas.height / 2);

	setTimeout(() => {
		layer.style.display = "block";
	}, 1000);

	isGameOver = true;
};

/**
 * updates game state
 * @function
 * @param {number} delta
 */
const update = function (delta) {
	gameTime += delta;

	handleInput(delta);

	updateEntities(delta);
};

/**
 * describes actions on game being started or reset
 * @function
 */
const resetGame = function () {

	gameTime = 0;

	isGameOver = false;

	toBeAnimated = {
		player: [],
		rocket: [],
		enemy: [],
		bullets: [],
		explosion: []
	};

	toBeAnimated.player[0] = {
		handicap: {size: [50, 50]},
		wounded : false,
		position: [canvas.width / 2, canvas.height - playerSpawn],
		sprite: new Entity('images/player.png',
							[0, 0],
							[110, 165],
							false,
							350,
							0,
							10,
							[0, 1, 2, 3, 4, 5])
	};

	player = toBeAnimated.player[0];

};

/**
 * loops the whole process
 * @function
 */
const main = function () {

	let now = Date.now();
	let delta  = (now - lastTime) / 1000;

	update(delta);
	render();

	lastTime = now;
	requestAnimationFrame(main);
};


//requiring all resources
let mainEntities = [resources.load('images/player.png'),
					resources.load('images/terrain.png'),
					resources.load('images/foe.png'),
					resources.load('images/Lizard.jpg'),
					resources.load('images/logo.png')];

/**
 * initiates the game
 * @function
 */
const comeOn = () => {

	resetGame();

	lastTime = Date.now();

	main();

	mainOST = new Sound("sounds/Main.mp3");
	mainOST.sound.loop = true;
	mainOST.play();
};

let promise = new Promise((resolve,reject) => {
	mainEntities.forEach((element) => {
		element.onload = () => resolve('ok');
	});
});

// activates the game initiation function when all the resources have been loaded and cached
promise.then(resolve => comeOn())
		.catch(reject => console.log(reject));
