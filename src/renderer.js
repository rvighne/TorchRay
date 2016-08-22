"use strict";

class Renderer {
	constructor(ctx, camera, opts) {
		this.ctx = ctx;
		this.camera = camera;
		this.opts = opts;
	}

	render() {
		/* Precompute values for critical loop */
		let rect = this.opts.rect;
		this.ctx.clearRect(0, 0, rect.width, rect.height);

		let dblInvWidth = 2 / rect.width;

		let sliceWidth = this.ctx.lineWidth = this.opts.slice;
		let halfSlice = sliceWidth / 2;

		// wallHeight represents the height in pixels of a wall that is 1 map unit from the camera
		let halfHeight = rect.height / 2;
		let halfUnitWallHeight = this.opts.wallHeight / 2;

		let halfPlaneLength = this.camera.plane.length();

		let shading = this.opts.shading;

		/* Critical loop */
		let rectRight = rect.x + rect.width;
		for (let x = rect.x; x < rectRight; x += sliceWidth) {
			// Maps x-value from [left, right) into [-1, +1)
			let planeOffset = (x - rect.x) * dblInvWidth - 1;

			let hit = this.camera.castRay(
				this.camera.planeOffsetRay(planeOffset));

			let sliceCenter = x + halfSlice;

			// "Fisheye effect" correction
			// Straight lines in the scene map are projected onto a chord that represents the FOV
			let halfWallHeight;
			if (this.opts.fisheye) {
				halfWallHeight = halfUnitWallHeight / hit.dist;
			} else {
				halfWallHeight = halfUnitWallHeight / (hit.dist / Math.sqrt((halfPlaneLength * planeOffset) ** 2 + 1));
			}

			// Draw the vertical slice
			this.ctx.beginPath();
			this.ctx.moveTo(sliceCenter, halfHeight - halfWallHeight);
			this.ctx.lineTo(sliceCenter, halfHeight + halfWallHeight);
			this.ctx.strokeStyle = shading ? Color.lerp(hit.color, shading.color, hit.dist / shading.maxDist).trunc() : hit.color;
			this.ctx.stroke();
			this.ctx.closePath();
		}
	}
}