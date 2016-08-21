"use strict";

class SceneMap {
	// ImageData object obtained from an image source such as CanvasRenderingContext2D#getImageData
	constructor(imageData) {
		this.image = imageData;
	}

	// Constructs a scene map given a CanvasImageSource
	// The image is snapshotted at invocation; therefore, it should already be loaded
	static fromImage(image) {
		let canvas = document.createElement('canvas');
		canvas.width = image.width;
		canvas.height = image.height;

		let ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0);
		return new SceneMap(ctx.getImageData(0, 0, image.width, image.height));
	}


	_getIndex(pos) {
		return Math.trunc(pos.y) * this.image.width * 4 + Math.trunc(pos.x) * 4;
	}

	// Pixels are considered walls if they are fully opaque
	isWall(pos) {
		return this.image.data[this._getIndex(pos) + 3] === 255;
	}

	colorAt(pos) {
		let start = this._getIndex(pos);
		return new Color(this.image.data[start],
			this.image.data[start + 1],
			this.image.data[start + 2]);
	}

	// Rectangular boundary checking
	within(pos) {
		return pos.x > 0 && pos.x < this.image.width && pos.y > 0 && pos.y < this.image.height;
	}
}