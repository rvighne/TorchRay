"use strict";


/* Constants and utilities */

const TURN_SPEED = Math.PI / 2048;
const MOVE_SPEED = 0.0075;

function loadImage(url) {
	return new Promise(function (fulfill, reject) {
		let img = new Image;
		img.addEventListener('load', function () {
			fulfill(img);
		});
		img.addEventListener('error', function () {
			reject({
				msg: "Unable to load image",
				url
			});
		});
		img.src = url;
	});
}


/* Initialization */

let canvas = document.getElementById('game');
let ctx = canvas.getContext('2d');

let player = new Player(
	new Vector(16, 16),	// position
	new Vector(0, -1),	// direction
	new Vector(1, 0),	// camera plane
	null /* map will be initialized asynchronously */, {
		minWallDist: 0.1
	});

let renderer = new Renderer(ctx, player, {
	rect: {
		x: 0, y: 0,
		width: canvas.width, height: canvas.height
	},

	textures: (function () {
		let textures = {
			0: "texture_tilewall.jpg",
			255: "texture_brickwall.jpg"
		};

		for (let idx in textures) {
			let img = new Image;
			img.src = textures[idx];
			textures[idx] = img;
		}

		return textures;
	})(),

	slice: 2,
	wallHeight: canvas.height
});

loadImage("level.png").then(function (img) {
	player.map = SceneMap.fromImage(img);

	// Start the game
	renderer.render();
	prevTime = performance.now();
	requestAnimationFrame(update);
});


/* Keyboard input */

let keys = {
	up: false,
	down: false,
	left: false,
	right: false
};

document.addEventListener('keydown', e => {
	switch (e.keyCode) {
	case 38: // up
		keys.up = true;
		e.preventDefault();
		break;

	case 40: // down
		keys.down = true;
		e.preventDefault();
		break;

	case 37: // left
		keys.left = true;
		e.preventDefault();
		break;

	case 39: // right
		keys.right = true;
		e.preventDefault();
		break;
	}
});

document.addEventListener('keyup', e => {
	switch (e.keyCode) {
	case 38: // up
		keys.up = false;
		e.preventDefault();
		break;

	case 40: // down
		keys.down = false;
		e.preventDefault();
		break;

	case 37: // left
		keys.left = false;
		e.preventDefault();
		break;

	case 39: // right
		keys.right = false;
		e.preventDefault();
		break;
	}
});


/* Game loop */

let prevTime; // Initialized when game starts

function update(timestamp) {
	requestAnimationFrame(update);

	// Repaint only if state changed, i.e. via player movement
	let repaint = false;

	if (keys.up) {
		let dist = (timestamp - prevTime) * MOVE_SPEED;
		player.move(player.dir, dist);

		repaint = true;
	} else if (keys.down) {
		let dist = (timestamp - prevTime) * MOVE_SPEED;
		player.move(player.dir.copy().mul(-1), dist);

		repaint = true;
	}

	if (keys.left) {
		player.rotate(-TURN_SPEED * (timestamp - prevTime));

		repaint = true;
	} else if (keys.right) {
		player.rotate(TURN_SPEED * (timestamp - prevTime));

		repaint = true;
	}

	if (repaint) {
		renderer.render();
	}

	prevTime = timestamp;
}