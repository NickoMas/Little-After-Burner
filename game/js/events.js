import { CONST_KEYS, CONST_KEY_EVENTS } from "./keys";
import { CONST_STATE } from "./gameState.js";
import { setKey, resetGame } from "./script.js";

/**
 * adds all listeners necessary for the game
 */
const initEvents = function init() {
	document.addEventListener(CONST_KEY_EVENTS.key1, (event) => {
		setKey(event, true);
	});

	document.addEventListener(CONST_KEY_EVENTS.key2, (event) => {
		setKey(event, false);

		if (event.keyCode === CONST_KEYS.key1.keyCode) {
			CONST_STATE.pressedKey.cooldown = false;
		}
	});

	CONST_STATE.startButton.addEventListener(CONST_KEY_EVENTS.key3, () => {
		CONST_STATE.layer.style.display = "none";
		resetGame();
	});
};

export { initEvents };
