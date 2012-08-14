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

/*
 * Game objects
*/ 
var frank = {
	speed: 256, // movement in pixels per second
	force: 0,
	mass: 0,
	acceleration: 9.8,
	direction: 0,
	modifier:0,
	hangTime:0
};
// Draw a line at the center below Frank.
var line = {
  x1:0,
  y1:0,
  x2:0,
  y2:0,
  ready:false,
  init:function(){
    this.x1 = center_x-128,
    this.y1 = center_y+frankImage.height;
    this.x2 = center_x+128;
    this.y2 = center_y+frankImage.height;
    this.ready = true;
  }
};

var basket = {
};
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
  
  // Place the player back in the center of the canvas and reset his acceleration.
  frank.x = canvas.width / 2;
	frank.y = canvas.height / 2;
	frank.acceleration = 9.8;
	frank.hangTime = 0;
	
	// Throw the basket somewhere on the screen randomly, below the line.
	basket.x = 32 + (Math.random() * (canvas.width - 64));
	basket.y = 32 + (Math.random() * (canvas.height - 64));
	if (basket.y < canvas.height/2) {
	  basket.y = basket.y*2;
	}
};

// Update game objects
var update = function (modifier,now,then) {
	/*if (38 in keysDown) { // Player holding up
		frank.y -= frank.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		frank.y += frank.speed * modifier;
	}*/
	if (37 in keysDown) { // Player holding left
		frank.x -= frank.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		frank.x += frank.speed * modifier;
	}
	
	// Gravity...
	// If there is nothing below Frank, make him drop.
	//ctx.rect(frank.x,frankImage.width,frank.y,frankImage.height);
	//frank.y += modifier;
	
	// Is Frank above the line?
	if (
	  frank.x >= line.x1 && 
	  frank.x <= line.x2 && 
	  frank.y <= line.y1) {
	  // Frank is above the line.
	}
	else {
	  // Frank is not above the line, is he above the bottom of the canvas?
	  if (frank.y >= canvas.height) {
	    reset();
	  }
    else {
      
      // Initiate gravity booster.
      frank.y += modifier*frank.acceleration;
      
      // Record Frank's now and then time.
      frank.now = now;
      frank.then = then;
      
      // Accumulate Frank's hang time, when it reaches 1000, reset it and increase
      // his acceleration.
      /*frank.hangTime += frank.now-frank.then;
      if (frank.hangTime >= 500) {
        frank.hangTime = 0;
        frank.acceleration += frank.acceleration;
      }*/
      frank.acceleration += frank.now-frank.then;
	  }
	}
	
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
  if (!line.ready) {
    line.init();
  }
  ctx.moveTo(line.x1,line.y1);
  ctx.lineTo(line.x2,line.y1);
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
	
	// Frank's GEO Location
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	/*ctx.fillText("(" + 
	  frank.x + "," + 
	  frank.y + ", " + 
	  frank.acceleration + ", " +
	  frank.now + ", " +
	  frank.then + ", " +
	  frank.hangTime + ", " +
	")", 32, 92);*/
	
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000,now,then);
	render();

	then = now;
};

// Let's play this stupid game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible