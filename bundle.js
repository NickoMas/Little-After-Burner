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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.resources = exports.canvas = exports.ctx = undefined;

var _sounds = __webpack_require__(5);

var _keys = __webpack_require__(4);

var _entities = __webpack_require__(2);

var _ctxText = __webpack_require__(1);

var _fixedValues = __webpack_require__(3);

//two canvas are drawn: one for background
// another for game action
var canvas = document.querySelector('#action');
var bgcanvas = document.querySelector('#field');

var ctx = canvas.getContext('2d');
var bgctx = bgcanvas.getContext('2d');

var startButton = document.getElementById("start");
var layer = document.getElementById("layer");

// game state variables
var lastTime = void 0;
var lastFire = 0;
var player = void 0;
var lastEnemyCreated = 0;
var lastEnemyFired = 0;
var gameTime = void 0;
var isGameOver = void 0;
var mainOST = void 0;

//pressed keys memoized in object, cooldown is for rocket fire limit
var pressedKey = { cooldown: false };

//buffer for all animations
var toBeAnimated = void 0;

var boom = new _sounds.Sound("sounds/boom.mp3");
var fire = new _sounds.Sound("sounds/launch.mp3");

var resources = function () {

	var cache = {};

	/**
  * caches and loads image resources
  * @function
  * @param {string} source
  * @return {object}
  */
	var load = function load(source) {
		if (cache[source]) {
			return cache[source];
		} else {
			var entity = new Image();
			entity.src = source;
			cache[source] = entity;
			return entity;
		}
	};

	return {
		load: load
	};
}();

exports.ctx = ctx;
exports.canvas = canvas;
exports.resources = resources;

/**
 * writes into memory the key being pressed
 * @function
 * @param {object} event
 * @param {boolean} status
 */

var setKey = function setKey(event, status) {
	var key = void 0;

	switch (event.keyCode) {
		case _keys.CONST_KEYS.key1.keyCode:
			key = _keys.CONST_KEYS.key1.keyName;
			break;
		case _keys.CONST_KEYS.key2.keyCode:
			key = _keys.CONST_KEYS.key2.keyName;
			break;
		case _keys.CONST_KEYS.key3.keyCode:
			key = _keys.CONST_KEYS.key3.keyName;
			break;
		case _keys.CONST_KEYS.key4.keyCode:
			key = _keys.CONST_KEYS.key4.keyName;
			break;
		case _keys.CONST_KEYS.key5.keyCode:
			key = _keys.CONST_KEYS.key5.keyName;
			break;
		default:
			key = String.fromCharCode(event.keyCode);
	}

	pressedKey[key] = status;
};

document.addEventListener(_keys.CONST_KEY_EVENTS.key1, function (event) {
	setKey(event, true);
});

document.addEventListener(_keys.CONST_KEY_EVENTS.key2, function (event) {
	setKey(event, false);

	if (event.keyCode === _keys.CONST_KEYS.key1.keyCode) {
		pressedKey.cooldown = false;
	}
});

startButton.addEventListener(_keys.CONST_KEY_EVENTS.key3, function (event) {
	layer.style.display = "none";
	resetGame();
});

/**
 * assigns parameters to entities
 * @function
 * @param {number} delta
 */
var handleInput = function handleInput(delta) {

	var playerFireInt = Date.now() - lastFire;

	if (isGameOver) {
		return;
	}

	if (pressedKey[_keys.CONST_KEYS.key2.keyName]) {
		player.position[0] -= player.sprite.speed * delta;
	}

	if (pressedKey[_keys.CONST_KEYS.key4.keyName]) {
		player.position[0] += player.sprite.speed * delta;
	}

	if (pressedKey[_keys.CONST_KEYS.key3.keyName]) {
		player.position[1] -= player.sprite.speed * delta;
	}

	if (pressedKey[_keys.CONST_KEYS.key5.keyName]) {
		player.position[1] += player.sprite.speed * delta;
	}

	// holding space will not help when firing a rocket
	if (pressedKey[_keys.CONST_KEYS.key1.keyName] && playerFireInt > _fixedValues.CONST_PLAYER_FIRE_THRESHOLD && !pressedKey.cooldown) {

		fire.play();

		toBeAnimated.rocket.push({ position: [player.position[0], player.position[1] - _fixedValues.CONST_ROCKET_INFRONT],
			sprite: new _entities.Entity('images/player.png', [0, 0], [50, 60], false, 100, 160)
		});

		//initiates keyup event so that to prevent holding space and firing
		var keyUp = document.createEvent('HTMLEvents');
		keyUp.initEvent(_keys.CONST_KEY_EVENTS.key2, true, false);
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
var renderEntities = function renderEntities(entity) {
	ctx.save();
	ctx.translate(entity.position[0], entity.position[1]);
	entity.sprite.renderSelf(ctx);
	ctx.restore();
};

var field = new _entities.Entity('images/terrain.png', [0, 0]);

/**
 * makes background moving infinitely and renders it
 * @function
 */
var fieldRender = function fieldRender() {
	var translateY = _fixedValues.CONST_FIELD_VELOCITY * ((Date.now() - lastTime) / 1000);
	var pattern = ctx.createPattern(field.sprite, 'repeat');
	bgctx.fillStyle = pattern;
	bgctx.rect(translateY, 0, 780, 720);
	bgctx.fill();
	bgctx.translate(0, translateY);
};

/**
 * renders everything
 * @function
 */
var render = function render() {

	fieldRender();

	if (!isGameOver && player) {
		renderEntities(player);
	}

	toBeAnimated.rocket.forEach(function (element) {
		element.position[1] += _fixedValues.CONST_ROCKET_VELOCITY;
		renderEntities(element);
	});

	toBeAnimated.bullets.forEach(function (element) {
		element.position[1] += _fixedValues.CONST_BULLETS_VELOCITY;
		renderEntities(element);
	});

	toBeAnimated.enemy.forEach(function (element) {
		element.position[1] += _fixedValues.CONST_ENEMY_VELOCITY;
		renderEntities(element);
	});

	toBeAnimated.explosion.forEach(function (element) {
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
var collide = function collide(position, size, position2, size2) {
	var rightEdge = position[0] + size[0];
	var rightEdge2 = position2[0] + size2[0];
	var bottomEdge = position[1] + size[1];
	var bottomEdge2 = position2[1] + size2[1];

	return !(rightEdge <= position2[0] || position[0] > rightEdge2 || bottomEdge <= position2[1] || position[1] > bottomEdge2);
};

/**
 * updates entities
 * @function
 * @param {number} delta
 */
var updateEntities = function updateEntities(delta) {

	var enemySpawnInt = Date.now() - lastEnemyCreated;

	var enemyFireInt = Date.now() - lastEnemyFired;

	if (toBeAnimated.player) {
		toBeAnimated.player.forEach(function (element) {
			element.sprite.updateSelf(delta);
		});
	}

	if (toBeAnimated.explosion) {
		toBeAnimated.explosion.forEach(function (element) {
			element.sprite.updateSelf(delta);
		});
	}

	//creates enemies within time interval
	if (gameTime > _fixedValues.CONST_GAME_TIMEINT && enemySpawnInt > _fixedValues.CONST_ENEMY_SPAWN_THRESHOLD) {

		lastEnemyCreated = Date.now();

		toBeAnimated.enemy.push({ position: [Math.random() * (canvas.width - _fixedValues.CONST_ENEMY_WIDTH), 0],
			sprite: new _entities.Entity('images/foe.png', [0, 0], [80, 80], false, 0, 180)
		});
	}

	//each enemy shoots the bullet
	toBeAnimated.enemy.forEach(function (outerEl) {

		var enemyBorder = outerEl.position[0] - outerEl.sprite.size[0];

		if (enemyFireInt > _fixedValues.CONST_ENEMY_FIRE_THRESHOLD) {

			lastEnemyFired = Date.now();

			toBeAnimated.bullets.push({ position: [outerEl.position[0], outerEl.position[1] - _fixedValues.CONST_BULLETS_SPAWN],
				sprite: new _entities.Entity('images/foe.png', [0, 0], [80, 50], false, 0, 260)
			});
		}

		if (outerEl.position[1] > canvas.height || enemyBorder > canvas.width) {
			outerEl.toErase = true;
		}

		//resolves collisions between enemies and rockets
		toBeAnimated.rocket.forEach(function (innerEl) {

			if (innerEl.position[1] + innerEl.sprite.size[1] < 0) {
				innerEl.toErase = true;
			}

			if (collide(outerEl.position, outerEl.sprite.size, innerEl.position, innerEl.sprite.size)) {
				innerEl.toErase = true;
				outerEl.toErase = true;
				boom.play();
				toBeAnimated.explosion.push({ position: [outerEl.position[0] + _fixedValues.CONST_EXPLOSION_SPAWN, outerEl.position[1]],
					sprite: new _entities.Entity('images/player.png', [0, 0], [51, 60], true, 0, 240, 10, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
				});
			}
		});

		//resolves collisions between enemies and player
		if (collide(outerEl.position, outerEl.sprite.size, player.position, player.handicap.size)) {

			if (!player.wounded) {

				player.handicap = { size: [80, 80] };
				player.wounded = true;
				player.sprite = new _entities.Entity('images/foe.png', [0, 0], [110, 165], false, 250, 0, 10, [0, 1, 2, 3, 4, 5]);
			} else {
				player.toErase = true;
				gameOver();
				boom.play();
				toBeAnimated.explosion.push({ position: [player.position[0] + _fixedValues.CONST_EXPLOSION_SPAWN, player.position[1]],
					sprite: new _entities.Entity('images/player.png', [0, 0], [51, 60], true, 0, 240, 10, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
				});
			}
		}
	});

	//resolves colllisions between player and bullets
	toBeAnimated.bullets.forEach(function (outerEl) {

		if (outerEl.position[1] > canvas.height) {
			outerEl.toErase = true;
		}

		if (collide(outerEl.position, outerEl.sprite.size, player.position, player.handicap.size)) {

			if (!player.wounded) {

				player.handicap = { size: [80, 80] };
				player.wounded = true;
				player.sprite = new _entities.Entity('images/foe.png', [0, 0], [110, 165], false, 250, 0, 10, [0, 1, 2, 3, 4, 5]);
			} else {
				player.toErase = true;
				gameOver();
				toBeAnimated.explosion.push({ position: [player.position[0] + _fixedValues.CONST_EXPLOSION_SPAWN, player.position[1]],
					sprite: new _entities.Entity('images/player.png', [0, 0], [51, 60], true, 0, 240, 10, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
				});
			}
		}
	});

	//rebuilds animation buffer, discarding elements with done animation and marked "toErase"
	for (var i in toBeAnimated) {

		toBeAnimated[i] = toBeAnimated[i].reduce(function (accumulator, element) {

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
var gameOver = function gameOver() {

	ctx.font = _ctxText.CONST_CTX_TEXT.font;
	ctx.textAlign = _ctxText.CONST_CTX_TEXT.textAlign;
	ctx.fillStyle = _ctxText.CONST_CTX_TEXT.fillStyle;
	ctx.fillText(_ctxText.CONST_CTX_TEXT.fillText, canvas.width / 2, canvas.height / 2);

	setTimeout(function () {
		layer.style.display = "block";
	}, 1000);

	isGameOver = true;
};

/**
 * updates game state
 * @function
 * @param {number} delta
 */
var update = function update(delta) {
	gameTime += delta;

	handleInput(delta);

	updateEntities(delta);
};

/**
 * describes actions on game being started or reset
 * @function
 */
var resetGame = function resetGame() {

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
		position: [canvas.width / 2, canvas.height - _fixedValues.CONST_PLAYER_SPAWN],
		sprite: new _entities.Entity('images/player.png', [0, 0], [110, 165], false, 350, 0, 10, [0, 1, 2, 3, 4, 5])
	};

	player = toBeAnimated.player[0];
};

/**
 * loops the whole process
 * @function
 */
var main = function main() {

	var now = Date.now();
	var delta = (now - lastTime) / 1000;

	update(delta);
	render();

	lastTime = now;
	requestAnimationFrame(main);
};

//requiring all resources
var mainEntities = [resources.load('images/player.png'), resources.load('images/terrain.png'), resources.load('images/foe.png'), resources.load('images/Lizard.jpg'), resources.load('images/logo.png')];

/**
 * initiates the game
 * @function
 */
var comeOn = function comeOn() {

	resetGame();

	lastTime = Date.now();

	main();

	mainOST = new _sounds.Sound("sounds/Main.mp3");
	mainOST.sound.loop = true;
	mainOST.play();
};

var promise = new Promise(function (resolve, reject) {
	mainEntities.forEach(function (element) {
		element.onload = function () {
			return resolve('ok');
		};
	});
});

// activates the game initiation function when all the resources have been loaded and cached
promise.then(function (resolve) {
	return comeOn();
}).catch(function (reject) {
	return console.log(reject);
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//parameters for styling text on canvas
var CONST_CTX_TEXT = {
    font: "30px Comic Sans MS",
    textAlign: "center",
    fillStyle: "red",
    fillText: "GAME OVER"
};

exports.CONST_CTX_TEXT = CONST_CTX_TEXT;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Entity = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _script = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// const resources = (function () {

// 	let cache = {};

//     /**
//      * caches and loads image resources
//      * @function
//      * @param {string} source
//      * @return {object}
//      */
// 	const load = (source) => {
// 		if(cache[source]) {
// 			return cache[source];
// 		} else {
// 			let entity = new Image();
// 			entity.src = source;
// 			cache[source] = entity;
// 			return entity;
// 		}
// 	};

// 	return {
// 		load : load
//     };
// })();


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
var Entity = function () {
	function Entity(url, pos, size, once) {
		var speed = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
		var axis = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
		var animSpeed = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
		var frames = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : [0];

		_classCallCheck(this, Entity);

		this.sprite = _script.resources.load(url);
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


	_createClass(Entity, [{
		key: "updateSelf",
		value: function updateSelf(delta) {
			_script.ctx.clearRect(0, 0, _script.canvas.width, _script.canvas.height);
			this.index += this.animSpeed * delta;
		}

		/**
   * renders the sprite
   * @function
   * @param {CanvasRenderingContext2D} ctx
   */

	}, {
		key: "renderSelf",
		value: function renderSelf(ctx) {
			var now = Date.now();
			var frame = void 0;

			var ind = Math.floor(this.index);

			var length = this.frames.length;

			frame = this.frames[ind % length];

			if (this.once && ind >= length) {
				this.done = true;
				return;
			}

			var x = this.position[0];
			var y = this.position[1];

			x = frame * this.size[0];

			ctx.drawImage(this.sprite, x, this.axisShift, this.size[0], this.size[1], this.position[0], this.position[1], this.size[0], this.size[1]);
		}
	}]);

	return Entity;
}();

exports.Entity = Entity;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//general fixed values through the whole game

//shows the least difference between two player shots
var CONST_PLAYER_FIRE_THRESHOLD = exports.CONST_PLAYER_FIRE_THRESHOLD = 600;

//shows point from where rocket should be drawn when fired
var CONST_ROCKET_INFRONT = exports.CONST_ROCKET_INFRONT = 5;

//shows coefficient for background translateY appropriate value
var CONST_FIELD_VELOCITY = exports.CONST_FIELD_VELOCITY = 350;

//shows coefficient for rocket entity being moved  velocity 
var CONST_ROCKET_VELOCITY = exports.CONST_ROCKET_VELOCITY = -10;

//shows coefficient for bullets entity being moved  velocity 
var CONST_BULLETS_VELOCITY = exports.CONST_BULLETS_VELOCITY = 7;

//shows coefficient for enemy entity being moved  velocity 
var CONST_ENEMY_VELOCITY = exports.CONST_ENEMY_VELOCITY = 3;

//shows game interval for enemy spawn
var CONST_GAME_TIMEINT = exports.CONST_GAME_TIMEINT = 3;

//shows the least difference between two enemies spawn
var CONST_ENEMY_SPAWN_THRESHOLD = exports.CONST_ENEMY_SPAWN_THRESHOLD = 1500;

//shows enemy sprite width
var CONST_ENEMY_WIDTH = exports.CONST_ENEMY_WIDTH = 80;

//shows the least difference between two enemy shots
var CONST_ENEMY_FIRE_THRESHOLD = exports.CONST_ENEMY_FIRE_THRESHOLD = 1400;

//shows Y coordinate coefficient for a bullet spawn
var CONST_BULLETS_SPAWN = exports.CONST_BULLETS_SPAWN = 5;

//shows X coordinate coefficient for an explosion spawn
var CONST_EXPLOSION_SPAWN = exports.CONST_EXPLOSION_SPAWN = 20;

//shows Y coordinate coefficient for player spawn
var CONST_PLAYER_SPAWN = exports.CONST_PLAYER_SPAWN = 150;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//predefined active keys for the game
var CONST_KEYS = {
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

var CONST_KEY_EVENTS = {
    key1: 'keydown',
    key2: 'keyup',
    key3: 'click'
};

exports.CONST_KEYS = CONST_KEYS;
exports.CONST_KEY_EVENTS = CONST_KEY_EVENTS;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * constructs all sounds in game
 * @constructor
 * @param {string} src - sound source
 *
 */
var Sound = function () {
	function Sound(src) {
		_classCallCheck(this, Sound);

		this.sound = document.createElement("audio");
		this.sound.src = src;
		this.sound.setAttribute("preload", "auto");
		this.sound.setAttribute("controls", "none");
		this.sound.style.display = "none";
		document.body.appendChild(this.sound);
	}

	_createClass(Sound, [{
		key: "play",
		value: function play() {
			this.sound.play();
		}
	}, {
		key: "stop",
		value: function stop() {
			this.sound.pause();
		}
	}]);

	return Sound;
}();

exports.Sound = Sound;

/***/ })
/******/ ]);