/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * stores game state data
 * @return {object}
 */
var CONST_STATE = function () {
	var canvas = document.querySelector("#action");
	var bgcanvas = document.querySelector("#field");
	var ctx = canvas.getContext("2d");
	var bgctx = bgcanvas.getContext("2d");

	var startButton = document.getElementById("start");
	var layer = document.getElementById("layer");

	var lastTime = null;
	var lastFire = 0;
	var lastEnemyCreated = 0;
	var lastEnemyFired = 0;
	var player = null;
	var field = null;

	var gameTime = null;
	var isGameOver = null;

	var mainOST = null;
	var boom = null;
	var fire = null;

	var pressedKey = { cooldown: false };

	var toBeAnimated = null;

	var mainEntities = null;

	return {
		canvas: canvas,
		bgcanvas: bgcanvas,
		ctx: ctx,
		bgctx: bgctx,
		startButton: startButton,
		layer: layer,
		lastTime: lastTime,
		lastFire: lastFire,
		lastEnemyCreated: lastEnemyCreated,
		lastEnemyFired: lastEnemyFired,
		player: player,
		field: field,
		gameTime: gameTime,
		isGameOver: isGameOver,
		mainOST: mainOST,
		boom: boom,
		fire: fire,
		pressedKey: pressedKey,
		toBeAnimated: toBeAnimated,
		mainEntities: mainEntities
	};
}();

exports.CONST_STATE = CONST_STATE;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.resetGame = exports.setKey = exports.resources = undefined;

var _sounds = __webpack_require__(7);

var _entities = __webpack_require__(4);

var _keys = __webpack_require__(2);

var _ctxText = __webpack_require__(3);

var _gameState = __webpack_require__(0);

var _events = __webpack_require__(5);

var _fixedValues = __webpack_require__(6);

(0, _events.initEvents)();

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

	return { load: load };
}();

exports.resources = resources;


_gameState.CONST_STATE.field = new _entities.Entity("images/terrain.png", [0, 0]);

_gameState.CONST_STATE.boom = new _sounds.Sound("sounds/boom.mp3");
_gameState.CONST_STATE.fire = new _sounds.Sound("sounds/launch.mp3");

//requiring all resources
_gameState.CONST_STATE.mainEntities = [resources.load("images/player.png"), resources.load("images/terrain.png"), resources.load("images/foe.png"), resources.load("images/Lizard.jpg"), resources.load("images/logo.png")];

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

	_gameState.CONST_STATE.pressedKey[key] = status;
};

/**
 * assigns parameters to entities
 * @function
 * @param {number} delta
 */
var handleInput = function handleInput(delta) {

	var playerFireInt = Date.now() - _gameState.CONST_STATE.lastFire;

	if (_gameState.CONST_STATE.isGameOver) {
		return;
	}

	if (_gameState.CONST_STATE.pressedKey[_keys.CONST_KEYS.key2.keyName]) {
		_gameState.CONST_STATE.player.position[0] -= _gameState.CONST_STATE.player.sprite.speed * delta;
	}

	if (_gameState.CONST_STATE.pressedKey[_keys.CONST_KEYS.key4.keyName]) {
		_gameState.CONST_STATE.player.position[0] += _gameState.CONST_STATE.player.sprite.speed * delta;
	}

	if (_gameState.CONST_STATE.pressedKey[_keys.CONST_KEYS.key3.keyName]) {
		_gameState.CONST_STATE.player.position[1] -= _gameState.CONST_STATE.player.sprite.speed * delta;
	}

	if (_gameState.CONST_STATE.pressedKey[_keys.CONST_KEYS.key5.keyName]) {
		_gameState.CONST_STATE.player.position[1] += _gameState.CONST_STATE.player.sprite.speed * delta;
	}

	// holding space will not help when firing a rocket
	if (_gameState.CONST_STATE.pressedKey[_keys.CONST_KEYS.key1.keyName] && playerFireInt > _fixedValues.CONST_PLAYER_FIRE_THRESHOLD && !_gameState.CONST_STATE.pressedKey.cooldown) {

		_gameState.CONST_STATE.fire.play();

		_gameState.CONST_STATE.toBeAnimated.rocket.push({ position: [_gameState.CONST_STATE.player.position[0], _gameState.CONST_STATE.player.position[1] - _fixedValues.CONST_ROCKET_INFRONT],
			sprite: new _entities.Entity("images/player.png", [0, 0], [50, 60], false, 100, 160)
		});

		//initiates keyup event so that to prevent holding space and firing
		var keyUp = document.createEvent("HTMLEvents");
		keyUp.initEvent(_keys.CONST_KEY_EVENTS.key2, true, false);
		document.dispatchEvent(keyUp);

		_gameState.CONST_STATE.pressedKey.cooldown = true;

		_gameState.CONST_STATE.lastFire = Date.now();
	}
};

/**
 * renders entities
 * @function
 * @param {object} entity
 */
var renderEntities = function renderEntities(entity) {
	_gameState.CONST_STATE.ctx.save();
	_gameState.CONST_STATE.ctx.translate(entity.position[0], entity.position[1]);
	entity.sprite.renderSelf(_gameState.CONST_STATE.ctx);
	_gameState.CONST_STATE.ctx.restore();
};

/**
 * makes background moving infinitely and renders it
 * @function
 */
var fieldRender = function fieldRender() {
	var translateY = _fixedValues.CONST_FIELD_VELOCITY * ((Date.now() - _gameState.CONST_STATE.lastTime) / 1000);
	var pattern = _gameState.CONST_STATE.ctx.createPattern(_gameState.CONST_STATE.field.sprite, "repeat");
	_gameState.CONST_STATE.bgctx.fillStyle = pattern;
	_gameState.CONST_STATE.bgctx.rect(translateY, 0, 780, 720);
	_gameState.CONST_STATE.bgctx.fill();
	_gameState.CONST_STATE.bgctx.translate(0, translateY);
};

/**
 * renders everything
 * @function
 */
var render = function render() {

	fieldRender();

	if (!_gameState.CONST_STATE.isGameOver && _gameState.CONST_STATE.player) {
		renderEntities(_gameState.CONST_STATE.player);
	}

	_gameState.CONST_STATE.toBeAnimated.rocket.forEach(function (element) {
		element.position[1] += _fixedValues.CONST_ROCKET_VELOCITY;
		renderEntities(element);
	});

	_gameState.CONST_STATE.toBeAnimated.bullets.forEach(function (element) {
		element.position[1] += _fixedValues.CONST_BULLETS_VELOCITY;
		renderEntities(element);
	});

	_gameState.CONST_STATE.toBeAnimated.enemy.forEach(function (element) {
		element.position[1] += _fixedValues.CONST_ENEMY_VELOCITY;
		renderEntities(element);
	});

	_gameState.CONST_STATE.toBeAnimated.explosion.forEach(function (element) {
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
var gameOver = function gameOver() {

	_gameState.CONST_STATE.ctx.font = _ctxText.CONST_CTX_TEXT.font;
	_gameState.CONST_STATE.ctx.textAlign = _ctxText.CONST_CTX_TEXT.textAlign;
	_gameState.CONST_STATE.ctx.fillStyle = _ctxText.CONST_CTX_TEXT.fillStyle;
	_gameState.CONST_STATE.ctx.fillText(_ctxText.CONST_CTX_TEXT.fillText, _gameState.CONST_STATE.canvas.width / 2, _gameState.CONST_STATE.canvas.height / 2);

	setTimeout(function () {
		_gameState.CONST_STATE.layer.style.display = "block";
	}, 1000);

	_gameState.CONST_STATE.isGameOver = true;
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

	var enemySpawnInt = Date.now() - _gameState.CONST_STATE.lastEnemyCreated;

	var enemyFireInt = Date.now() - _gameState.CONST_STATE.lastEnemyFired;

	if (_gameState.CONST_STATE.toBeAnimated.player) {
		_gameState.CONST_STATE.toBeAnimated.player.forEach(function (element) {
			element.sprite.updateSelf(delta);
		});
	}

	if (_gameState.CONST_STATE.toBeAnimated.explosion) {
		_gameState.CONST_STATE.toBeAnimated.explosion.forEach(function (element) {
			element.sprite.updateSelf(delta);
		});
	}

	//creates enemies within time interval
	if (_gameState.CONST_STATE.gameTime > _fixedValues.CONST_GAME_TIMEINT && enemySpawnInt > _fixedValues.CONST_ENEMY_SPAWN_THRESHOLD) {

		_gameState.CONST_STATE.lastEnemyCreated = Date.now();

		_gameState.CONST_STATE.toBeAnimated.enemy.push({ position: [Math.random() * (_gameState.CONST_STATE.canvas.width - _fixedValues.CONST_ENEMY_WIDTH), 0],
			sprite: new _entities.Entity("images/foe.png", [0, 0], [80, 80], false, 0, 180)
		});
	}

	//each enemy shoots the bullet
	_gameState.CONST_STATE.toBeAnimated.enemy.forEach(function (outerEl) {

		var enemyBorder = outerEl.position[0] - outerEl.sprite.size[0];

		if (enemyFireInt > _fixedValues.CONST_ENEMY_FIRE_THRESHOLD) {

			_gameState.CONST_STATE.lastEnemyFired = Date.now();

			_gameState.CONST_STATE.toBeAnimated.bullets.push({ position: [outerEl.position[0], outerEl.position[1] - _fixedValues.CONST_BULLETS_SPAWN],
				sprite: new _entities.Entity("images/foe.png", [0, 0], [80, 50], false, 0, 260)
			});
		}

		if (outerEl.position[1] > _gameState.CONST_STATE.canvas.height || enemyBorder > _gameState.CONST_STATE.canvas.width) {
			outerEl.toErase = true;
		}

		//resolves collisions between enemies and rockets
		_gameState.CONST_STATE.toBeAnimated.rocket.forEach(function (innerEl) {

			if (innerEl.position[1] + innerEl.sprite.size[1] < 0) {
				innerEl.toErase = true;
			}

			if (collide(outerEl.position, outerEl.sprite.size, innerEl.position, innerEl.sprite.size)) {
				innerEl.toErase = true;
				outerEl.toErase = true;
				_gameState.CONST_STATE.boom.play();
				_gameState.CONST_STATE.toBeAnimated.explosion.push({ position: [outerEl.position[0] + _fixedValues.CONST_EXPLOSION_SPAWN, outerEl.position[1]],
					sprite: new _entities.Entity("images/player.png", [0, 0], [51, 60], true, 0, 240, 10, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
				});
			}
		});

		//resolves collisions between enemies and player
		if (collide(outerEl.position, outerEl.sprite.size, _gameState.CONST_STATE.player.position, _gameState.CONST_STATE.player.handicap.size)) {

			if (!_gameState.CONST_STATE.player.wounded) {

				_gameState.CONST_STATE.player.handicap = { size: [80, 80] };
				_gameState.CONST_STATE.player.wounded = true;
				_gameState.CONST_STATE.player.sprite = new _entities.Entity("images/foe.png", [0, 0], [110, 165], false, 250, 0, 10, [0, 1, 2, 3, 4, 5]);
			} else {
				_gameState.CONST_STATE.player.toErase = true;
				gameOver();
				_gameState.CONST_STATE.boom.play();
				_gameState.CONST_STATE.toBeAnimated.explosion.push({ position: [_gameState.CONST_STATE.player.position[0] + _fixedValues.CONST_EXPLOSION_SPAWN, _gameState.CONST_STATE.player.position[1]],
					sprite: new _entities.Entity("images/player.png", [0, 0], [51, 60], true, 0, 240, 10, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
				});
			}
		}
	});

	//resolves colllisions between player and bullets
	_gameState.CONST_STATE.toBeAnimated.bullets.forEach(function (outerEl) {

		if (outerEl.position[1] > _gameState.CONST_STATE.canvas.height) {
			outerEl.toErase = true;
		}

		if (collide(outerEl.position, outerEl.sprite.size, _gameState.CONST_STATE.player.position, _gameState.CONST_STATE.player.handicap.size)) {

			if (!_gameState.CONST_STATE.player.wounded) {

				_gameState.CONST_STATE.player.handicap = { size: [80, 80] };
				_gameState.CONST_STATE.player.wounded = true;
				_gameState.CONST_STATE.player.sprite = new _entities.Entity("images/foe.png", [0, 0], [110, 165], false, 250, 0, 10, [0, 1, 2, 3, 4, 5]);
			} else {
				_gameState.CONST_STATE.player.toErase = true;
				gameOver();
				_gameState.CONST_STATE.toBeAnimated.explosion.push({ position: [_gameState.CONST_STATE.player.position[0] + _fixedValues.CONST_EXPLOSION_SPAWN, _gameState.CONST_STATE.player.position[1]],
					sprite: new _entities.Entity("images/player.png", [0, 0], [51, 60], true, 0, 240, 10, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
				});
			}
		}
	});

	//rebuilds animation buffer, discarding elements with done animation and marked "toErase"
	for (var i in _gameState.CONST_STATE.toBeAnimated) {

		_gameState.CONST_STATE.toBeAnimated[i] = _gameState.CONST_STATE.toBeAnimated[i].reduce(function (accumulator, element) {

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
var update = function update(delta) {
	_gameState.CONST_STATE.gameTime += delta;

	handleInput(delta);

	updateEntities(delta);
};

/**
 * describes actions on game being started or reset
 * @function
 */
var resetGame = function resetGame() {

	_gameState.CONST_STATE.gameTime = 0;

	_gameState.CONST_STATE.isGameOver = false;

	_gameState.CONST_STATE.toBeAnimated = {
		player: [],
		rocket: [],
		enemy: [],
		bullets: [],
		explosion: []
	};

	_gameState.CONST_STATE.toBeAnimated.player[0] = {
		handicap: { size: [50, 50] },
		wounded: false,
		position: [_gameState.CONST_STATE.canvas.width / 2, _gameState.CONST_STATE.canvas.height - _fixedValues.CONST_PLAYER_SPAWN],
		sprite: new _entities.Entity("images/player.png", [0, 0], [110, 165], false, 350, 0, 10, [0, 1, 2, 3, 4, 5])
	};

	_gameState.CONST_STATE.player = _gameState.CONST_STATE.toBeAnimated.player[0];
};

/**
 * loops the whole process
 * @function
 */
var main = function main() {

	var now = Date.now();
	var delta = (now - _gameState.CONST_STATE.lastTime) / 1000;

	update(delta);
	render();

	_gameState.CONST_STATE.lastTime = now;
	requestAnimationFrame(main);
};

/**
 * initiates the game
 * @function
 */
var comeOn = function comeOn() {

	resetGame();

	_gameState.CONST_STATE.lastTime = Date.now();

	main();

	_gameState.CONST_STATE.mainOST = new _sounds.Sound("sounds/Main.mp3");
	_gameState.CONST_STATE.mainOST.sound.loop = true;
	_gameState.CONST_STATE.mainOST.play();
};

var promise = new Promise(function (resolve, reject) {
	_gameState.CONST_STATE.mainEntities.forEach(function (element) {
		element.onload = function () {
			return resolve("ok");
		};
	});
});

// activates the game initiation function when all the resources have been loaded and cached
promise.then(function (resolve) {
	return comeOn();
});
//.catch(reject => console.log(reject));

exports.setKey = setKey;
exports.resetGame = resetGame;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//predefined active keys for the game
var CONST_KEYS = {
    key1: {
        keyCode: 32,
        keyName: "SPACE"
    },
    key2: {
        keyCode: 37,
        keyName: "LEFT"
    },
    key3: {
        keyCode: 38,
        keyName: "UP"
    },
    key4: {
        keyCode: 39,
        keyName: "RIGHT"
    },
    key5: {
        keyCode: 40,
        keyName: "DOWN"
    }
};

var CONST_KEY_EVENTS = {
    key1: "keydown",
    key2: "keyup",
    key3: "click"
};

exports.CONST_KEYS = CONST_KEYS;
exports.CONST_KEY_EVENTS = CONST_KEY_EVENTS;

/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Entity = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _script = __webpack_require__(1);

var _gameState = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
			_gameState.CONST_STATE.ctx.clearRect(0, 0, _gameState.CONST_STATE.canvas.width, _gameState.CONST_STATE.canvas.height);
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

			var frame = void 0;

			var ind = Math.floor(this.index);

			var length = this.frames.length;

			frame = this.frames[ind % length];

			if (this.once && ind >= length) {
				this.done = true;
				return;
			}

			var x = this.position[0];
			//let y = this.position[1];

			x = frame * this.size[0];

			_gameState.CONST_STATE.ctx.drawImage(this.sprite, x, this.axisShift, this.size[0], this.size[1], this.position[0], this.position[1], this.size[0], this.size[1]);
		}
	}]);

	return Entity;
}();

exports.Entity = Entity;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.initEvents = undefined;

var _keys = __webpack_require__(2);

var _gameState = __webpack_require__(0);

var _script = __webpack_require__(1);

/**
 * adds all listeners necessary for the game
 */
var initEvents = function init() {
	document.addEventListener(_keys.CONST_KEY_EVENTS.key1, function (event) {
		(0, _script.setKey)(event, true);
	});

	document.addEventListener(_keys.CONST_KEY_EVENTS.key2, function (event) {
		(0, _script.setKey)(event, false);

		if (event.keyCode === _keys.CONST_KEYS.key1.keyCode) {
			_gameState.CONST_STATE.pressedKey.cooldown = false;
		}
	});

	_gameState.CONST_STATE.startButton.addEventListener(_keys.CONST_KEY_EVENTS.key3, function () {
		_gameState.CONST_STATE.layer.style.display = "none";
		(0, _script.resetGame)();
	});
};

exports.initEvents = initEvents;

/***/ }),
/* 6 */
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
/* 7 */
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
		this.init();
	}
	/**
  * initiates audio attributes
  */


	_createClass(Sound, [{
		key: "init",
		value: function init() {
			this.sound.setAttribute("preload", "auto");
			this.sound.setAttribute("controls", "none");
			this.sound.style.display = "none";
			document.body.appendChild(this.sound);
		}
		/**
   * initiates playback
   */

	}, {
		key: "play",
		value: function play() {
			this.sound.play();
		}
		/**
   * pauses playback
   */

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