/**
 * stores game state data
 * @return {object}
 */
const CONST_STATE = (function () {
	const canvas = document.querySelector("#action");
	const bgcanvas = document.querySelector("#field");
	const ctx = canvas.getContext("2d");
	const bgctx = bgcanvas.getContext("2d");

	const startButton = document.getElementById("start");
	const layer = document.getElementById("layer");

	const lastTime = null;
	const lastFire = 0;
	const lastEnemyCreated = 0;
	const lastEnemyFired = 0;
	const player = null;
	const field = null;

	const gameTime = null;
	const isGameOver = null;

	const mainOST = null;
	const boom = null;
	const fire = null;

	const pressedKey = { cooldown: false };

	const toBeAnimated = null;

	const mainEntities = null;

	return {
		canvas,
		bgcanvas,
		ctx,
		bgctx,
		startButton,
		layer,
		lastTime,
		lastFire,
		lastEnemyCreated,
		lastEnemyFired,
		player,
		field,
		gameTime,
		isGameOver,
		mainOST,
		boom,
		fire,
		pressedKey,
		toBeAnimated,
		mainEntities
	};

}());

export { CONST_STATE };
