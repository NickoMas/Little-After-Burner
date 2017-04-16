/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sounds_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__keys_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__entities_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ctxText_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__fixedValues_js__ = __webpack_require__(3);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ctx", function() { return ctx; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "canvas", function() { return canvas; });







//two canvas are drawn: one for background
// another for game action
const canvas = document.querySelector('#action');
const bgcanvas = document.querySelector('#field');

let ctx = canvas.getContext('2d');
let bgctx = bgcanvas.getContext('2d');



let startButton = document.getElementById("start");
let layer = document.getElementById("layer");

// game state variables
let lastTime;
let lastFire = 0;
let player;
let lastEnemyCreated = 0;
let lastEnemyFired = 0;
let gameTime;
let isGameOver;
let mainOST;

//pressed keys memoized in object, cooldown is for rocket fire limit
let pressedKey = { cooldown: false };

//buffer for all animations
let toBeAnimated;

let boom = new __WEBPACK_IMPORTED_MODULE_0__sounds_js__["a" /* Sound */]("sounds/boom.mp3");
let fire = new __WEBPACK_IMPORTED_MODULE_0__sounds_js__["a" /* Sound */]("sounds/launch.mp3");

/**
 * writes into memory the key being pressed
 * @function
 * @param {object} event
 * @param {boolean} status
 */
const setKey = function (event, status) {
	let key;

	switch (event.keyCode) {
		case __WEBPACK_IMPORTED_MODULE_1__keys_js__["a" /* keys */].key1.keyCode:
			key = __WEBPACK_IMPORTED_MODULE_1__keys_js__["a" /* keys */].key1.keyName;
			break;
		case __WEBPACK_IMPORTED_MODULE_1__keys_js__["a" /* keys */].key2.keyCode:
			key = __WEBPACK_IMPORTED_MODULE_1__keys_js__["a" /* keys */].key2.keyName;
			break;
		case __WEBPACK_IMPORTED_MODULE_1__keys_js__["a" /* keys */].key3.keyCode:
			key = __WEBPACK_IMPORTED_MODULE_1__keys_js__["a" /* keys */].key3.keyName;
			break;
		case __WEBPACK_IMPORTED_MODULE_1__keys_js__["a" /* keys */].key4.keyCode:
			key = __WEBPACK_IMPORTED_MODULE_1__keys_js__["a" /* keys */].key4.keyName;
			break;
		case __WEBPACK_IMPORTED_MODULE_1__keys_js__["a" /* keys */].key5.keyCode:
			key = __WEBPACK_IMPORTED_MODULE_1__keys_js__["a" /* keys */].key5.keyName;
			break;
		default:
			key = String.fromCharCode(event.keyCode);
	}

	pressedKey[key] = status;
};

document.addEventListener(__WEBPACK_IMPORTED_MODULE_1__keys_js__["b" /* keyEvents */].key1, event => {
	setKey(event, true);
});

document.addEventListener(__WEBPACK_IMPORTED_MODULE_1__keys_js__["b" /* keyEvents */].key2, event => {
	setKey(event, false);

	if (event.keyCode === __WEBPACK_IMPORTED_MODULE_1__keys_js__["a" /* keys */].key1.keyCode) {
		pressedKey.cooldown = false;
	}
});

startButton.addEventListener(__WEBPACK_IMPORTED_MODULE_1__keys_js__["b" /* keyEvents */].key3, event => {
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

	if (isGameOver) {
		return;
	}

	if (pressedKey[__WEBPACK_IMPORTED_MODULE_1__keys_js__["a" /* keys */].key2.keyName]) {
		player.position[0] -= player.sprite.speed * delta;
	}

	if (pressedKey[__WEBPACK_IMPORTED_MODULE_1__keys_js__["a" /* keys */].key4.keyName]) {
		player.position[0] += player.sprite.speed * delta;
	}

	if (pressedKey[__WEBPACK_IMPORTED_MODULE_1__keys_js__["a" /* keys */].key3.keyName]) {
		player.position[1] -= player.sprite.speed * delta;
	}

	if (pressedKey[__WEBPACK_IMPORTED_MODULE_1__keys_js__["a" /* keys */].key5.keyName]) {
		player.position[1] += player.sprite.speed * delta;
	}

	// holding space will not help when firing a rocket
	if (pressedKey[__WEBPACK_IMPORTED_MODULE_1__keys_js__["a" /* keys */].key1.keyName] && playerFireInt > __WEBPACK_IMPORTED_MODULE_4__fixedValues_js__["a" /* playerFireThreshold */] && !pressedKey.cooldown) {

		fire.play();

		toBeAnimated.rocket.push({ position: [player.position[0], player.position[1] - __WEBPACK_IMPORTED_MODULE_4__fixedValues_js__["b" /* rocketInFront */]],
			sprite: new __WEBPACK_IMPORTED_MODULE_2__entities_js__["a" /* Entity */]('images/player.png', [0, 0], [50, 60], false, 100, 160)
		});

		//initiates keyup event so that to prevent holding space and firing
		let keyUp = document.createEvent('HTMLEvents');
		keyUp.initEvent(__WEBPACK_IMPORTED_MODULE_1__keys_js__["b" /* keyEvents */].key2, true, false);
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

let field = new __WEBPACK_IMPORTED_MODULE_2__entities_js__["a" /* Entity */]('images/terrain.png', [0, 0]);

/**
 * makes background moving infinitely and renders it
 * @function
 */
const fieldRender = function () {
	let translateY = __WEBPACK_IMPORTED_MODULE_4__fixedValues_js__["c" /* fieldVelocity */] * ((Date.now() - lastTime) / 1000);
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

	toBeAnimated.rocket.forEach(element => {
		element.position[1] += __WEBPACK_IMPORTED_MODULE_4__fixedValues_js__["d" /* rocketVelocity */];
		renderEntities(element);
	});

	toBeAnimated.bullets.forEach(element => {
		element.position[1] += __WEBPACK_IMPORTED_MODULE_4__fixedValues_js__["e" /* bulletsVelocity */];
		renderEntities(element);
	});

	toBeAnimated.enemy.forEach(element => {
		element.position[1] += __WEBPACK_IMPORTED_MODULE_4__fixedValues_js__["f" /* enemyVelocity */];
		renderEntities(element);
	});

	toBeAnimated.explosion.forEach(element => {
		renderEntities(element);
		if (element.sprite.done) {
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

	return !(rightEdge <= position2[0] || position[0] > rightEdge2 || bottomEdge <= position2[1] || position[1] > bottomEdge2);
};

/**
 * updates entities
 * @function
 * @param {number} delta
 */
const updateEntities = function (delta) {

	let enemySpawnInt = Date.now() - lastEnemyCreated;

	let enemyFireInt = Date.now() - lastEnemyFired;

	if (toBeAnimated.player) {
		toBeAnimated.player.forEach(element => {
			element.sprite.updateSelf(delta);
		});
	}

	if (toBeAnimated.explosion) {
		toBeAnimated.explosion.forEach(element => {
			element.sprite.updateSelf(delta);
		});
	}

	//creates enemies within time interval
	if (gameTime > __WEBPACK_IMPORTED_MODULE_4__fixedValues_js__["g" /* gameTimeInt */] && enemySpawnInt > __WEBPACK_IMPORTED_MODULE_4__fixedValues_js__["h" /* enemySpawnThreshold */]) {

		lastEnemyCreated = Date.now();

		toBeAnimated.enemy.push({ position: [Math.random() * (canvas.width - __WEBPACK_IMPORTED_MODULE_4__fixedValues_js__["i" /* enemyWidth */]), 0],
			sprite: new __WEBPACK_IMPORTED_MODULE_2__entities_js__["a" /* Entity */]('images/foe.png', [0, 0], [80, 80], false, 0, 180)
		});
	}

	//each enemy shoots the bullet
	toBeAnimated.enemy.forEach(outerEl => {

		let enemyBorder = outerEl.position[0] - outerEl.sprite.size[0];

		if (enemyFireInt > __WEBPACK_IMPORTED_MODULE_4__fixedValues_js__["j" /* enemyFireThreshold */]) {

			lastEnemyFired = Date.now();

			toBeAnimated.bullets.push({ position: [outerEl.position[0], outerEl.position[1] - __WEBPACK_IMPORTED_MODULE_4__fixedValues_js__["k" /* bulletsSpawn */]],
				sprite: new __WEBPACK_IMPORTED_MODULE_2__entities_js__["a" /* Entity */]('images/foe.png', [0, 0], [80, 50], false, 0, 260)
			});
		}

		if (outerEl.position[1] > canvas.height || enemyBorder > canvas.width) {
			outerEl.toErase = true;
		}

		//resolves collisions between enemies and rockets
		toBeAnimated.rocket.forEach(innerEl => {

			if (innerEl.position[1] + innerEl.sprite.size[1] < 0) {
				innerEl.toErase = true;
			}

			if (collide(outerEl.position, outerEl.sprite.size, innerEl.position, innerEl.sprite.size)) {
				innerEl.toErase = true;
				outerEl.toErase = true;
				boom.play();
				toBeAnimated.explosion.push({ position: [outerEl.position[0] + __WEBPACK_IMPORTED_MODULE_4__fixedValues_js__["l" /* explosionSpawn */], outerEl.position[1]],
					sprite: new __WEBPACK_IMPORTED_MODULE_2__entities_js__["a" /* Entity */]('images/player.png', [0, 0], [51, 60], true, 0, 240, 10, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
				});
			}
		});

		//resolves collisions between enemies and player
		if (collide(outerEl.position, outerEl.sprite.size, player.position, player.handicap.size)) {

			if (!player.wounded) {

				player.handicap = { size: [80, 80] };
				player.wounded = true;
				player.sprite = new __WEBPACK_IMPORTED_MODULE_2__entities_js__["a" /* Entity */]('images/foe.png', [0, 0], [110, 165], false, 250, 0, 10, [0, 1, 2, 3, 4, 5]);
			} else {
				player.toErase = true;
				gameOver();
				boom.play();
				toBeAnimated.explosion.push({ position: [player.position[0] + __WEBPACK_IMPORTED_MODULE_4__fixedValues_js__["l" /* explosionSpawn */], player.position[1]],
					sprite: new __WEBPACK_IMPORTED_MODULE_2__entities_js__["a" /* Entity */]('images/player.png', [0, 0], [51, 60], true, 0, 240, 10, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
				});
			}
		}
	});

	//resolves colllisions between player and bullets
	toBeAnimated.bullets.forEach(outerEl => {

		if (outerEl.position[1] > canvas.height) {
			outerEl.toErase = true;
		}

		if (collide(outerEl.position, outerEl.sprite.size, player.position, player.handicap.size)) {

			if (!player.wounded) {

				player.handicap = { size: [80, 80] };
				player.wounded = true;
				player.sprite = new __WEBPACK_IMPORTED_MODULE_2__entities_js__["a" /* Entity */]('images/foe.png', [0, 0], [110, 165], false, 250, 0, 10, [0, 1, 2, 3, 4, 5]);
			} else {
				player.toErase = true;
				gameOver();
				toBeAnimated.explosion.push({ position: [player.position[0] + __WEBPACK_IMPORTED_MODULE_4__fixedValues_js__["l" /* explosionSpawn */], player.position[1]],
					sprite: new __WEBPACK_IMPORTED_MODULE_2__entities_js__["a" /* Entity */]('images/player.png', [0, 0], [51, 60], true, 0, 240, 10, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
				});
			}
		}
	});

	//rebuilds animation buffer, discarding elements with done animation and marked "toErase"
	for (let i in toBeAnimated) {

		toBeAnimated[i] = toBeAnimated[i].reduce((accumulator, element) => {

			if (!element.sprite.done && !element.toErase) {
				accumulator.push(element);
			}
			return accumulator;
		}, []);
	}
};

/**
 * describes actions on game being over
 * @function
 */
const gameOver = function () {

	ctx.font = __WEBPACK_IMPORTED_MODULE_3__ctxText_js__["a" /* ctxText */].font;
	ctx.textAlign = __WEBPACK_IMPORTED_MODULE_3__ctxText_js__["a" /* ctxText */].textAlign;
	ctx.fillStyle = __WEBPACK_IMPORTED_MODULE_3__ctxText_js__["a" /* ctxText */].fillStyle;
	ctx.fillText(__WEBPACK_IMPORTED_MODULE_3__ctxText_js__["a" /* ctxText */].fillText, canvas.width / 2, canvas.height / 2);

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
		handicap: { size: [50, 50] },
		wounded: false,
		position: [canvas.width / 2, canvas.height - __WEBPACK_IMPORTED_MODULE_4__fixedValues_js__["m" /* playerSpawn */]],
		sprite: new __WEBPACK_IMPORTED_MODULE_2__entities_js__["a" /* Entity */]('images/player.png', [0, 0], [110, 165], false, 350, 0, 10, [0, 1, 2, 3, 4, 5])
	};

	player = toBeAnimated.player[0];
};

/**
 * loops the whole process
 * @function
 */
const main = function () {

	let now = Date.now();
	let delta = (now - lastTime) / 1000;

	update(delta);
	render();

	lastTime = now;
	requestAnimationFrame(main);
};

//requiring all resources
let mainEntities = [__WEBPACK_IMPORTED_MODULE_2__entities_js__["b" /* resources */].load('images/player.png'), __WEBPACK_IMPORTED_MODULE_2__entities_js__["b" /* resources */].load('images/terrain.png'), __WEBPACK_IMPORTED_MODULE_2__entities_js__["b" /* resources */].load('images/foe.png'), __WEBPACK_IMPORTED_MODULE_2__entities_js__["b" /* resources */].load('images/Lizard.jpg'), __WEBPACK_IMPORTED_MODULE_2__entities_js__["b" /* resources */].load('images/logo.png')];

/**
 * initiates the game
 * @function
 */
const comeOn = () => {

	resetGame();

	lastTime = Date.now();

	main();

	mainOST = new __WEBPACK_IMPORTED_MODULE_0__sounds_js__["a" /* Sound */]("sounds/Main.mp3");
	mainOST.sound.loop = true;
	mainOST.play();
};

let promise = new Promise((resolve, reject) => {
	mainEntities.forEach(element => {
		element.onload = () => resolve('ok');
	});
});

// activates the game initiation function when all the resources have been loaded and cached
promise.then(resolve => comeOn()).catch(reject => console.log(reject));

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ctxText; });
const ctxText = {
    font: "30px Comic Sans MS",
    textAlign: "center",
    fillStyle: "red",
    fillText: "GAME OVER"
};



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__script_js__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return resources; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Entity; });


const resources = function () {

	let cache = {};

	const load = source => {
		if (cache[source]) {
			return cache[source];
		} else {
			let entity = new Image();
			entity.src = source;
			cache[source] = entity;
			return entity;
		}
	};

	return {
		load: load };
}();

/**
 * constructs all entities in game
 * @constructor
 * @param {string} url - image url source
 * @param {array} pos - coordinates of entity on canvas
 * @param {array} size - coordinates of entity on sprite map
 * @param {boolean} once - makes animation either infinite or not
 * @param {number} speed - entity movement on canvas
 * @param {number} axis - additional position shift on sprite map
 * @param {number} animSpeed - animation frames shifting speed
 * @param {array} frames - number of frames within animation
 */
class Entity {
	constructor(url, pos, size, once, speed = 0, axis = 0, animSpeed = 0, frames = [0]) {
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

	/**
  * updates sprite
  * @function
  * @param {number} delta
  */
	updateSelf(delta) {
		__WEBPACK_IMPORTED_MODULE_0__script_js__["ctx"].clearRect(0, 0, __WEBPACK_IMPORTED_MODULE_0__script_js__["canvas"].width, __WEBPACK_IMPORTED_MODULE_0__script_js__["canvas"].height);
		this.index += this.animSpeed * delta;
	}

	/**
  * renders the sprite
  * @function
  * @param {CanvasRenderingContext2D} ctx
  */
	renderSelf(ctx) {
		let now = Date.now();
		let frame;

		let ind = Math.floor(this.index);

		let length = this.frames.length;

		frame = this.frames[ind % length];

		if (this.once && ind >= length) {
			this.done = true;
			return;
		}

		let x = this.position[0];
		let y = this.position[1];

		x = frame * this.size[0];

		ctx.drawImage(this.sprite, x, this.axisShift, this.size[0], this.size[1], this.position[0], this.position[1], this.size[0], this.size[1]);
	}

}



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const playerFireThreshold = 600;
/* harmony export (immutable) */ __webpack_exports__["a"] = playerFireThreshold;


const rocketInFront = 5;
/* harmony export (immutable) */ __webpack_exports__["b"] = rocketInFront;


const fieldVelocity = 350;
/* harmony export (immutable) */ __webpack_exports__["c"] = fieldVelocity;


const rocketVelocity = -10;
/* harmony export (immutable) */ __webpack_exports__["d"] = rocketVelocity;


const bulletsVelocity = 7;
/* harmony export (immutable) */ __webpack_exports__["e"] = bulletsVelocity;


const enemyVelocity = 3;
/* harmony export (immutable) */ __webpack_exports__["f"] = enemyVelocity;


const gameTimeInt = 3;
/* harmony export (immutable) */ __webpack_exports__["g"] = gameTimeInt;


const enemySpawnThreshold = 1500;
/* harmony export (immutable) */ __webpack_exports__["h"] = enemySpawnThreshold;


const enemyWidth = 80;
/* harmony export (immutable) */ __webpack_exports__["i"] = enemyWidth;


const enemyFireThreshold = 1400;
/* harmony export (immutable) */ __webpack_exports__["j"] = enemyFireThreshold;


const bulletsSpawn = 5;
/* harmony export (immutable) */ __webpack_exports__["k"] = bulletsSpawn;


const explosionSpawn = 20;
/* harmony export (immutable) */ __webpack_exports__["l"] = explosionSpawn;


const playerSpawn = 150;
/* harmony export (immutable) */ __webpack_exports__["m"] = playerSpawn;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return keys; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return keyEvents; });
const keys = {
    key1: {
        keyCode: 32,
        keyName: 'SPACE'
    },
    key2: {
        keyCode: 37,
        keyName: 'LEFT'
    },
    key3: {
        keyCode: 38,
        keyName: 'UP'
    },
    key4: {
        keyCode: 39,
        keyName: 'RIGHT'
    },
    key5: {
        keyCode: 40,
        keyName: 'DOWN'
    }
};

const keyEvents = {
    key1: 'keydown',
    key2: 'keyup',
    key3: 'click'
};



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Sound; });
/**
 * constructs all sounds in game
 * @constructor
 * @param {string} src - sound source
 *
 */
class Sound {
	constructor(src) {
		this.sound = document.createElement("audio");
		this.sound.src = src;
		this.sound.setAttribute("preload", "auto");
		this.sound.setAttribute("controls", "none");
		this.sound.style.display = "none";
		document.body.appendChild(this.sound);
	}

	play() {
		this.sound.play();
	}

	stop() {
		this.sound.pause();
	}
}



/***/ })
/******/ ]);