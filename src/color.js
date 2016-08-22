"use strict";

class Color {
	constructor(red, green, blue) {
		this.red = red;
		this.green = green;
		this.blue = blue;
	}

	// Interpolates between two colors within a clamped range
	static lerp(from, to, pos) {
		if (pos < 0) {
			pos = 0;
		} else if (pos > 1) {
			pos = 1;
		}

		return new Color(from.red + (to.red - from.red) * pos,
			from.green + (to.green - from.green) * pos,
			from.blue + (to.blue - from.blue) * pos);
	}

	trunc() {
		this.red = Math.trunc(this.red);
		this.green = Math.trunc(this.green);
		this.blue = Math.trunc(this.blue);

		return this;
	}

	// CSS color format
	toString() {
		return `rgb(${this.red}, ${this.green}, ${this.blue})`;
	}
}