import { resources } from "./script.js";
import { CONST_STATE } from "./gameState.js";

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
		CONST_STATE.ctx.clearRect(0, 0, CONST_STATE.canvas.width, CONST_STATE.canvas.height);
		this.index += this.animSpeed * delta;
	}

	/**
	 * renders the sprite
	 * @function
	 * @param {CanvasRenderingContext2D} ctx
	 */
	renderSelf(ctx) {

		let frame;

		const ind = Math.floor(this.index);

		const length = this.frames.length;

		frame = this.frames[ind % length];

		if (this.once && ind >= length) {
			this.done = true;
			return;
		}

		let x = this.position[0];
		//let y = this.position[1];

		x = frame * this.size[0];

		CONST_STATE.ctx.drawImage(this.sprite,
						x,
						this.axisShift,
						this.size[0],
						this.size[1],
						this.position[0],
						this.position[1],
						this.size[0],
						this.size[1]);
	}

}

export { Entity };
