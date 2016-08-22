"use strict";

class Player {
	// `dir` argument must be a unit vector
	constructor(pos, dir, plane, map, opts) {
		this.pos = pos;
		this.dir = dir;
		this.plane = plane;
		this.map = map;
		this.opts = opts;
	}


	/* Ray casting */

	// Generate DDA points with whole-numbered x values
	*traceRayVert(dir) {
		let right = dir.x > 0;

		let ray = this.pos.copy();
		ray.x = (right ? Math.ceil : Math.floor)(ray.x);
		ray.y += (ray.x - this.pos.x) * (dir.y / dir.x);

		let step = new Vector(right ? 1 : -1, dir.y / Math.abs(dir.x));
		for (;; ray.add(step)) {
			yield ray;
		}
	}

	// Generate DDA points with whole-numbered y values
	*traceRayHoriz(dir) {
		let down = dir.y > 0;

		let ray = this.pos.copy();
		ray.y = (down ? Math.ceil : Math.floor)(ray.y);
		ray.x += (ray.y - this.pos.y) * (dir.x / dir.y);

		let step = new Vector(dir.x / Math.abs(dir.y), down ? 1 : -1);
		for (;; ray.add(step)) {
			yield ray;
		}
	}

	castRay(dir) {
		let wall = null;
		let wallOffset = null;

		// Checks wall intersections at whole-numbered x values
		if (dir.x !== 0) {
			let vertWallOffset = new Vector(dir.x < 0, 0);
			for (let ray of this.traceRayVert(dir)) {
				if (this.map.isWall(ray.copy().sub(vertWallOffset)) || !this.map.within(ray)) {
					wall = ray;
					wallOffset = vertWallOffset;
					break;
				}
			}
		}

		// Checks wall intersections at whole-numbered y values
		if (dir.y !== 0) {
			let horizWallOffset = new Vector(0, dir.y < 0);
			for (let ray of this.traceRayHoriz(dir)) {
				if (this.map.isWall(ray.copy().sub(horizWallOffset)) || !this.map.within(ray)) {
					// Prefer the closest wall
					if (!wall || ray.copy().sub(this.pos).compare(wall.copy().sub(this.pos)) < 0) {
						wall = ray;
						wallOffset = horizWallOffset;
					}
					break;
				}
			}
		}

		return {
			wall,
			dist: wall.copy().sub(this.pos).length(),
			color: this.map.colorAt(wall.copy().sub(wallOffset))
		};
	}

	// Given a position along the viewing "plane" in the -1 to +1 range,
	// returns an arrow pointing from the camera to that point
	planeOffsetRay(offset) {
		return this.dir.copy().add(this.plane.copy().mul(offset));
	}


	/* Movement */

	// Performs continuous collision detection
	// and collision avoidance via a minimum margin distance
	move(dir, dist) {
		let ray = this.castRay(dir);
		if (ray.dist < dist) {
			this.pos = ray.wall.sub(dir.copy().mul(this.opts.minWallDist));
		} else {
			this.pos.add(dir.copy().mul(dist));
		}
	}

	rotate(angle) {
		this.dir.rotate(angle);
		this.plane.rotate(angle);
	}
}