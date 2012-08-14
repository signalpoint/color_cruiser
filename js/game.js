// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

// Set canvas width and height.
canvas.width = 800;
canvas.height = 600;

// Center coordinates.
center_x = canvas.width/2;
center_y = canvas.height/2;

// Add canvas to document body.
document.body.appendChild(canvas);

// Frank image
var frankReady = false;
var frankImage = new Image();
frankImage.onload = function () {
	frankReady = true;
};
frankImage.src = "images/frank.png";

// Basket image
var basketReady = false;
var basketImage = new Image();
basketImage.onload = function () {
	basketReady = true;
};
basketImage.src = "images/basket.png";

// Game objects
var frank = {
	speed: 256 // movement in pixels per second
};
var basket = {};
var basketsCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a basket.
var reset = function () {
  
  // Place the player back in the center of the canvas.
  frank.x = canvas.width / 2;
	frank.y = canvas.height / 2;
	
	// Throw the basket somewhere on the screen randomly
	basket.x = 32 + (Math.random() * (canvas.width - 64));
	basket.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		frank.y -= frank.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		frank.y += frank.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		frank.x -= frank.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		frank.x += frank.speed * modifier;
	}
	
	// Gravity...
	// If there is nothing below Frank, make him drop.
	//ctx.rect(frank.x,frankImage.width,frank.y,frankImage.height);
	
	// Is Frank touching the basket?
	if (
		frank.x <= (basket.x + basketImage.width)
		&& basket.x <= (frank.x + frankImage.width)
		&& frank.y <= (basket.y + basketImage.height)
		&& basket.y <= (frank.y + frankImage.height)
	) {
		++basketsCaught;
		reset();
	}
	
};

// Draw everything
var render = function () {
  
  // Set canvas background color.
  ctx.fillStyle="#FFFFFF";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  
  // Draw a line at the center of the canvas, below Frank.
  ctx.moveTo(center_x, center_y+frankImage.height);
  ctx.lineTo(center_x+128,center_y+frankImage.height);
  ctx.stroke();

	if (frankReady) {
		ctx.drawImage(frankImage, frank.x, frank.y);
	}
	
	if (basketReady) {
		ctx.drawImage(basketImage, basket.x, basket.y);
	}

	// Score
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("frankenDrupal Aces: " + basketsCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible