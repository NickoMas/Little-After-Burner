import { Sound } from "./sounds.js";
import { Entity } from "./entities.js";
import { CONST_KEYS, CONST_KEY_EVENTS } from "./keys.js";
import { CONST_CTX_TEXT } from "./ctxText.js";
import { CONST_STATE } from "./gameState.js";
import { initEvents } from "./events.js";
import {
	CONST_PLAYER_FIRE_THRESHOLD,
	CONST_ROCKET_INFRONT,
	CONST_FIELD_VELOCITY,
	CONST_ROCKET_VELOCITY,
	CONST_BULLETS_VELOCITY,
	CONST_ENEMY_VELOCITY,
	CONST_GAME_TIMEINT,
	CONST_ENEMY_SPAWN_THRESHOLD,
	CONST_ENEMY_WIDTH,
	CONST_ENEMY_FIRE_THRESHOLD,
	CONST_BULLETS_SPAWN,
	CONST_EXPLOSION_SPAWN,
	CONST_PLAYER_SPAWN
} from "./fixedValues.js";

initEvents();

const resources = (function () {

	const cache = {};

    /**
     * caches and loads image resources
     * @function
     * @param {string} source
     * @return {object}
     */
	const load = (source) => {
		if (cache[source]) {
			return cache[source];
		} else {
			const entity = new Image();
			entity.src = source;
			cache[source] = entity;
			return entity;
		}
	};

	return { load };
}());

export { resources };

CONST_STATE.field = new Entity("images/terrain.png", [0, 0]);

CONST_STATE.boom = new Sound("sounds/boom.mp3");
CONST_STATE.fire = new Sound("sounds/launch.mp3");

//requiring all resources
CONST_STATE.mainEntities = [resources.load("images/player.png"),
							resources.load("images/terrain.png"),
							resources.load("images/foe.png"),
							resources.load("images/Lizard.jpg"),
							resources.load("images/logo.png")];


/**
 * writes into memory the key being pressed
 * @function
 * @param {object} event
 * @param {boolean} status
 */
const setKey = function (event, status) {
	let key;

	switch (event.keyCode) {
		case CONST_KEYS.key1.keyCode :
			key = CONST_KEYS.key1.keyName;
			break;
		case CONST_KEYS.key2.keyCode :
			key = CONST_KEYS.key2.keyName;
			break;
		case CONST_KEYS.key3.keyCode :
			key = CONST_KEYS.key3.keyName;
			break;
		case CONST_KEYS.key4.keyCode :
			key = CONST_KEYS.key4.keyName;
			break;
		case CONST_KEYS.key5.keyCode :
			key = CONST_KEYS.key5.keyName;
			break;
		default:
			key = String.fromCharCode(event.keyCode);
	}

	CONST_STATE.pressedKey[key] = status;
};

/**
 * assigns parameters to entities
 * @function
 * @param {number} delta
 */
const handleInput = function (delta){

	const playerFireInt = Date.now() - CONST_STATE.lastFire;

	if (CONST_STATE.isGameOver) {
		return;
	}

	if (CONST_STATE.pressedKey[CONST_KEYS.key2.keyName]) {
		CONST_STATE.player.position[0] -= CONST_STATE.player.sprite.speed * delta;
	}

	if (CONST_STATE.pressedKey[CONST_KEYS.key4.keyName]) {
		CONST_STATE.player.position[0] += CONST_STATE.player.sprite.speed * delta;
	}

	if (CONST_STATE.pressedKey[CONST_KEYS.key3.keyName]) {
		CONST_STATE.player.position[1] -= CONST_STATE.player.sprite.speed * delta;
	}

	if (CONST_STATE.pressedKey[CONST_KEYS.key5.keyName]) {
		CONST_STATE.player.position[1] += CONST_STATE.player.sprite.speed * delta;
	}

	// holding space will not help when firing a rocket
	if (CONST_STATE.pressedKey[CONST_KEYS.key1.keyName] &&
		playerFireInt > CONST_PLAYER_FIRE_THRESHOLD &&
		!CONST_STATE.pressedKey.cooldown) {

		CONST_STATE.fire.play();

		CONST_STATE.toBeAnimated.rocket.push(
			{	position: [CONST_STATE.player.position[0],
						CONST_STATE.player.position[1] - CONST_ROCKET_INFRONT],
				sprite: new Entity("images/player.png",
									[0, 0],
									[50, 60],
									false,
									100,
									160)
			});

		//initiates keyup event so that to prevent holding space and firing
		const keyUp = document.createEvent("HTMLEvents");
		keyUp.initEvent(CONST_KEY_EVENTS.key2, true, false);
		document.dispatchEvent(keyUp);

		CONST_STATE.pressedKey.cooldown = true;

		CONST_STATE.lastFire = Date.now();
	}
};

/**
 * renders entities
 * @function
 * @param {object} entity
 */
const renderEntities = function (entity) {
	CONST_STATE.ctx.save();
	CONST_STATE.ctx.translate(entity.position[0], entity.position[1]);
	entity.sprite.renderSelf(CONST_STATE.ctx);
	CONST_STATE.ctx.restore();
};


/**
 * makes background moving infinitely and renders it
 * @function
 */
const fieldRender = function () {
	const translateY = CONST_FIELD_VELOCITY * ((Date.now() - CONST_STATE.lastTime) / 1000);
	const pattern = CONST_STATE.ctx.createPattern(CONST_STATE.field.sprite, "repeat");
	CONST_STATE.bgctx.fillStyle = pattern;
	CONST_STATE.bgctx.rect(translateY, 0, 780, 720);
	CONST_STATE.bgctx.fill();
	CONST_STATE.bgctx.translate(0, translateY);
};

/**
 * renders everything
 * @function
 */
const render = function () {

	fieldRender();

	if (!CONST_STATE.isGameOver && CONST_STATE.player) {
		renderEntities(CONST_STATE.player);
	}

	CONST_STATE.toBeAnimated.rocket.forEach((element) => {
		element.position[1] += CONST_ROCKET_VELOCITY;
		renderEntities(element);
	});

	CONST_STATE.toBeAnimated.bullets.forEach((element) => {
		element.position[1] += CONST_BULLETS_VELOCITY;
		renderEntities(element);
	});

	CONST_STATE.toBeAnimated.enemy.forEach((element) => {
		element.position[1] += CONST_ENEMY_VELOCITY;
		renderEntities(element);
	});

	CONST_STATE.toBeAnimated.explosion.forEach((element) => {
		renderEntities(element);
		if (element.sprite.done) {
			element.toErase = true;
		}
	});

};

/**
 * describes actions on game being over
 * @function
 */
const gameOver = function () {

	CONST_STATE.ctx.font = CONST_CTX_TEXT.font;
	CONST_STATE.ctx.textAlign = CONST_CTX_TEXT.textAlign;
	CONST_STATE.ctx.fillStyle = CONST_CTX_TEXT.fillStyle;
	CONST_STATE.ctx.fillText( CONST_CTX_TEXT.fillText, 
								CONST_STATE.canvas.width / 2, 
								CONST_STATE.canvas.height / 2);

	setTimeout(() => {
		CONST_STATE.layer.style.display = "block";
	}, 1000);

	CONST_STATE.isGameOver = true;
};

/**
 * renders entities
 * @function
 * @param {object} entity
 */
const collide = function (position, size, position2, size2) {
	const rightEdge = position[0] + size[0];
	const rightEdge2 = position2[0] + size2[0];
	const bottomEdge = position[1] + size[1];
	const bottomEdge2 = position2[1] + size2[1];

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

	const enemySpawnInt = Date.now() - CONST_STATE.lastEnemyCreated;

	const enemyFireInt = Date.now() - CONST_STATE.lastEnemyFired;

	if (CONST_STATE.toBeAnimated.player) {
		CONST_STATE.toBeAnimated.player.forEach((element) => {
			element.sprite.updateSelf(delta);
		});
	}

	if (CONST_STATE.toBeAnimated.explosion) {
		CONST_STATE.toBeAnimated.explosion.forEach((element) => {
			element.sprite.updateSelf(delta);
		});
	}

	//creates enemies within time interval
	if (CONST_STATE.gameTime > CONST_GAME_TIMEINT &&
	enemySpawnInt > CONST_ENEMY_SPAWN_THRESHOLD) {

		CONST_STATE.lastEnemyCreated = Date.now();

		CONST_STATE.toBeAnimated.enemy.push(
			{	position: [Math.random() * (CONST_STATE.canvas.width - CONST_ENEMY_WIDTH), 0],
				sprite: new Entity("images/foe.png",
								[0, 0],
								[80, 80],
								false,
								0,
								180)
			});
	}

	//each enemy shoots the bullet
	CONST_STATE.toBeAnimated.enemy.forEach((outerEl) => {

		const enemyBorder = outerEl.position[0] - outerEl.sprite.size[0];

		if (enemyFireInt > CONST_ENEMY_FIRE_THRESHOLD) {

			CONST_STATE.lastEnemyFired = Date.now();

			CONST_STATE.toBeAnimated.bullets.push(
				{	position: [outerEl.position[0], outerEl.position[1] - CONST_BULLETS_SPAWN],
					sprite: new Entity("images/foe.png",
										[0, 0],
										[80, 50],
										false,
										0,
										260)
				});
		}

		if (outerEl.position[1] > CONST_STATE.canvas.height ||
		enemyBorder > CONST_STATE.canvas.width) {
			outerEl.toErase = true;
		}

		//resolves collisions between enemies and rockets
		CONST_STATE.toBeAnimated.rocket.forEach((innerEl) => {

			if (innerEl.position[1] + innerEl.sprite.size[1] < 0) {
				innerEl.toErase = true;
			}

			if (collide(outerEl.position, outerEl.sprite.size, innerEl.position, innerEl.sprite.size)) {
				innerEl.toErase = true;
				outerEl.toErase = true;
				CONST_STATE.boom.play();
				CONST_STATE.toBeAnimated.explosion.push(
					{	position: [outerEl.position[0] + CONST_EXPLOSION_SPAWN, outerEl.position[1]],
						sprite: new Entity("images/player.png",
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
		if (collide(outerEl.position,
					outerEl.sprite.size,
					CONST_STATE.player.position,
					CONST_STATE.player.handicap.size)) {

			if (!CONST_STATE.player.wounded) {

					CONST_STATE.player.handicap = { size: [80, 80] };
					CONST_STATE.player.wounded = true;
					CONST_STATE.player.sprite = new Entity("images/foe.png",
												[0, 0],
												[110, 165],
												false,
												250,
												0,
												10,
												[0, 1, 2, 3, 4, 5]);

			} else {
				CONST_STATE.player.toErase = true;
				gameOver();
				CONST_STATE.boom.play();
				CONST_STATE.toBeAnimated.explosion.push(
					{	position: [CONST_STATE.player.position[0] + 
									CONST_EXPLOSION_SPAWN, CONST_STATE.player.position[1]],
						sprite: new Entity("images/player.png",
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
	CONST_STATE.toBeAnimated.bullets.forEach((outerEl) => {

		if (outerEl.position[1] > CONST_STATE.canvas.height) {
			outerEl.toErase = true;
		}

		if (collide(outerEl.position,
					outerEl.sprite.size,
					CONST_STATE.player.position,
					CONST_STATE.player.handicap.size)) {

			if (!CONST_STATE.player.wounded) {

				CONST_STATE.player.handicap = { size: [80, 80] };
				CONST_STATE.player.wounded = true;
				CONST_STATE.player.sprite = new Entity("images/foe.png",
											[0, 0],
											[110, 165],
											false,
											250,
											0,
											10,
											[0, 1, 2, 3, 4, 5]);
			} else {
				CONST_STATE.player.toErase = true;
				gameOver();
				CONST_STATE.toBeAnimated.explosion.push(
					{	position: [CONST_STATE.player.position[0] + 
									CONST_EXPLOSION_SPAWN, CONST_STATE.player.position[1]],
						sprite: new Entity("images/player.png",
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
	for (const i in CONST_STATE.toBeAnimated){

		CONST_STATE.toBeAnimated[i] = CONST_STATE.toBeAnimated[i].reduce((accumulator, element) => {

			if (!element.sprite.done && !element.toErase) {
				accumulator.push(element);
			}
			return accumulator;

		}, []);
	}

};


/**
 * updates game state
 * @function
 * @param {number} delta
 */
const update = function (delta) {
	CONST_STATE.gameTime += delta;

	handleInput(delta);

	updateEntities(delta);
};

/**
 * describes actions on game being started or reset
 * @function
 */
const resetGame = function () {

	CONST_STATE.gameTime = 0;

	CONST_STATE.isGameOver = false;

	CONST_STATE.toBeAnimated = {
		player: [],
		rocket: [],
		enemy: [],
		bullets: [],
		explosion: []
	};

	CONST_STATE.toBeAnimated.player[0] = {
		handicap: { size: [50, 50] },
		wounded: false,
		position: [CONST_STATE.canvas.width / 2, CONST_STATE.canvas.height - CONST_PLAYER_SPAWN],
		sprite: new Entity("images/player.png",
							[0, 0],
							[110, 165],
							false,
							350,
							0,
							10,
							[0, 1, 2, 3, 4, 5])
	};

	CONST_STATE.player = CONST_STATE.toBeAnimated.player[0];

};

/**
 * loops the whole process
 * @function
 */
const main = function () {

	const now = Date.now();
	const delta = (now - CONST_STATE.lastTime) / 1000;

	update(delta);
	render();

	CONST_STATE.lastTime = now;
	requestAnimationFrame(main);
};


/**
 * initiates the game
 * @function
 */
const comeOn = () => {

	resetGame();

	CONST_STATE.lastTime = Date.now();

	main();

	CONST_STATE.mainOST = new Sound("sounds/Main.mp3");
	CONST_STATE.mainOST.sound.loop = true;
	CONST_STATE.mainOST.play();
};

const promise = new Promise((resolve, reject) => {
	CONST_STATE.mainEntities.forEach((element) => {
		element.onload = () => resolve("ok");
	});
});

// activates the game initiation function when all the resources have been loaded and cached
promise.then(resolve => comeOn());
		//.catch(reject => console.log(reject));

export { setKey, resetGame };
