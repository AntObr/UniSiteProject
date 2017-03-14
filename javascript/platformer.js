var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Variables

var time = Date.now();

// Canvas size
var width = 800;
var height = 600;
canvas.width = width;
canvas.height = height;

// The player
var player = {
	x: 200,
	y: 200,
	xVel: 0,
	yVel: 0,
	width: 50,
	height: 50,
	speed: 250,
	color: '#c00',
	jumping: false,
	jumpHeight: 19
};

var gravity = 0.3;

// The Level
function Platform(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

var level = [
	new Platform(200, 500, 200, 10),
    new Platform(300, 400, 200, 10)
];

// The key handler
var keyDown = {
	38: false, // up
	40: false, // down
	37: false, // left
	39: false // right
};

window.addEventListener('keydown', function (keyPushed) {
    keyPushed.preventDefault();
	keyDown[keyPushed.keyCode] = true;
});
window.addEventListener('keyup', function (keyPushed) {
    keyPushed.preventDefault();
	keyDown[keyPushed.keyCode] = false;
});

// Collision detection
function checkCollision(object1, object2) {
    
    // Holds the direction of collision
    var collDir = null;
    
    for (var i in object2) {
        // Finds the X and Y vectors
        var xVector = (object1.x + (object1.width / 2)) - (object2[i].x + (object2[i].width / 2));
        var yVector = (object1.y + (object1.height / 2)) - (object2[i].y + (object2[i].height / 2));
	
        // The distance between the two objects centres at collision
        var collWidth = (object1.width / 2) + (object2[i].width / 2);
        var collHeight = (object1.height / 2) + (object2[i].height / 2);
	
        // Checks for the actual collisions
        if (yVector < 0) {
            if (Math.abs(yVector) < collHeight && Math.abs(xVector) < collWidth) {
                collDir = "top";
                object1.y = object2[i].y - object1.height;
            }
        } else {
            if (Math.abs(yVector) < collHeight && Math.abs(xVector) < collWidth) {
                collDir = "bottom";
                object1.y = object2[i].y + object2[i].height;
            }
        }
    }
    
    return collDir;
}

// Draws everything
function render() {
	// Background
	ctx.fillStyle = '#FFFFFF'; // white
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	// Draws the level
	ctx.fillStyle = '#000000'; // black
	
    for (var i in level) {
        ctx.fillRect(level[i].x, level[i].y, level[i].width, level[i].height);
    }
	
	// Draws the player
	ctx.fillStyle = player.color;
	ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Updates player positions
function update(delta) {
	// Movement
	// Jumping
	if (keyDown[38] === true) {
		if (!player.jumping) {
			player.jumping = true;
			player.yVel -= player.jumpHeight;
		}
	}
	
	// Left Right
	if (keyDown[37] === true && keyDown[39] === true) {
		player.xVel = 0;
	}
	else if (keyDown[37] === true) {
		if (player.xVel > -1) {
			player.xVel -= 1;
		}
	}
	else if (keyDown[39] === true) {
		if (player.xVel < 1) {
			player.xVel += 1;
		}
	} else {
		player.xVel = 0;
	}
	
	player.y += player.yVel * player.jumpHeight * delta;
	player.x += player.xVel * player.speed * delta;
	
	player.yVel += gravity;
	
	collisionDirection = checkCollision(player, level)
	
	if (collisionDirection === "top") {
		player.jumping = false;
		player.yVel = 0;
		//console.log("top");
	}
	
	if (collisionDirection === "bottom") {
		player.jumping = true;
		console.log("before: " + player.yVel);
		player.yVel = 0;
		console.log("after: " + player.yVel);
	}
	
	// Stops from falling out of screen
	if (Math.floor(player.y + player.height) >= height) {
		player.jumping = false;
		player.yVel = 0;
	}
}

function gameLoop() {
	var delta = (Date.now() - time) / 1000;
	update(delta);
	render();
	//console.log("main: " + player.yVel);
	time = Date.now();
}

setInterval(gameLoop, 10);