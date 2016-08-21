"use strict";

class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}


	/* Chainable operations */

	add(vec) {
		this.x += vec.x;
		this.y += vec.y;
		return this;
	}

	sub(vec) {
		this.x -= vec.x;
		this.y -= vec.y;
		return this;
	}

	mul(factor) {
		this.x *= factor;
		this.y *= factor;
		return this;
	}

	rotate(angle) {
		let cos = Math.cos(angle);
		let sin = Math.sin(angle);

		let oldX = this.x;
		let oldY = this.y;

		this.x = oldX * cos - oldY * sin;
		this.y = oldX * sin + oldY * cos;

		return this;
	}


	/* Utilities */

	// Useful for comparison only
	// The returned value is not proportional to either of the two vectors' magnitudes
	compare(vec) {
		return (this.x ** 2 + this.y ** 2) - (vec.x ** 2 + vec.y ** 2);
	}

	// Magnitude of the vector
	length() {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	// Vectors are mutable
	// Therefore explicit copying is needed, e.g. to perform temporary calculations
	copy() {
		return new Vector(this.x, this.y);
	}
}