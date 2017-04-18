let CONST_STATE = {
	canvas: document.querySelector('#action');,
	bgcanvas: document.querySelector('#field');,
	ctx: null,
	bgctx: null,
	startButton: null,
	layer: null,
	lastTime: null,
	lastFire: 0,
	lastEnemyCreated: 0,
	lastEnemyFired: 0,
	gameTime: null,
	isGameOver: null,
	mainOST: null,
	boom: null,
	fire: null,
	pressedKey: {cooldown: false},
	toBeAnimated: null
};

export { CONST_STATE };

class gameState {
	constructor(){

	}

	initListeners(){
		document.addEventListener(CONST_KEY_EVENTS.key1, (event) => {
			setKey(event, true);
		});

		document.addEventListener(CONST_KEY_EVENTS.key2, (event) => {
			setKey(event, false);

			if (event.keyCode === CONST_KEYS.key1.keyCode) {
				pressedKey.cooldown = false;
			}
		});
	}

}