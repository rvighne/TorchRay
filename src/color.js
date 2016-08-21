"use strict";

class Color {
	constructor(red, green, blue) {
		this.red = red;
		this.green = green;
		this.blue = blue;
	}

	// Interpolates between two colors within a clamped range
	static lerp(from, to, pos) {
		if (pos <= 0) {
			return from;
		} else if (pos >= 1) {
			return to;
		} else {
			return new Color(Math.trunc(from.red + (to.red - from.red) * pos),
				Math.trunc(from.green + (to.green - from.green) * pos),
				Math.trunc(from.blue + (to.blue - from.blue) * pos));
		}
	}

	// CSS color format
	toString() {
		return `rgb(${this.red}, ${this.green}, ${this.blue})`;
	}
}