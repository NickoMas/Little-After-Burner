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
		this.init();
	}
	/**
	 * initiates audio attributes
	 */
	init() {
		this.sound.setAttribute("preload", "auto");
		this.sound.setAttribute("controls", "none");
		this.sound.style.display = "none";
		document.body.appendChild(this.sound);
	}
	/**
	 * initiates playback
	 */
	play() {
		this.sound.play();
	}
	/**
	 * pauses playback
	 */
	stop() {
		this.sound.pause();
	}
}

export { Sound };
