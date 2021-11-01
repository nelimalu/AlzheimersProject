var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');
var grd = c.createLinearGradient(0, 0, innerWidth, innerHeight);
grd.addColorStop(0, "red");
grd.addColorStop(1, "blue");

function randint(min, max) {
	return Math.floor(Math.random() * Math.floor(max - min)) + min;
}

function choice(iterable) {
	return iterable[randint(0, iterable.length)];
}

function get_distance(x1, y1, x2, y2) {
	xdist = Math.abs(x1 - x2);
	ydist = Math.abs(y1 - y2);
	dist = Math.sqrt((xdist ** 2) + (ydist ** 2));

	return dist
}

function text(text, font, x, y, colour) {
	c.font = font;
	c.fillStyle = colour;
	c.textAlign = "center";
	c.fillText(text, x, y);
}


function Dot(x, y, radius, xdirection, ydirection) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.xdirection = xdirection;
	this.ydirection = ydirection;
	this.infected = false;

	this.draw = function() {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.fillStyle = "white";
		c.fill();

		for (var i = 0; i < dots.length; i++) {
			var dist = get_distance(this.x, this.y, dots[i].x, dots[i].y);
			if (dist < 100) {
				var opacity = (Math.abs(100 - dist) * 0.01).toString();

				c.strokeStyle = "rgba(255,255,255," + opacity + ")";
				if (this.infected) {
					if (infect) {
						dots[i].infected = true;
					}
					c.strokeStyle = "rgba(0,0,0," + opacity + ")";
					// c.strokeStyle = "rgba(" + randint(0, 255).toString() + "," + randint(0, 255).toString() + "," + randint(0, 255).toString() + "," + opacity + ")";
				}

				c.beginPath();
				c.moveTo(this.x, this.y);
				c.lineTo(dots[i].x, dots[i].y);
				c.stroke();
			}
		}
	}

	this.move = function() {
		this.x += this.xdirection;
		this.y += this.ydirection;

		if (this.x <= 0 || this.x >= innerWidth) {
			this.xdirection = -this.xdirection;
		}
		if (this.y <= 0 || this.y >= innerHeight) {
			this.ydirection = -this.ydirection;
		}
	}
}

mouse = {
	x: undefined,
	y: undefined
}
var infect = false;
var can_infect_public = true;
var can_infect = true;

window.addEventListener('mousedown', function(event) {window.open("index.html")});

window.addEventListener('keydown', function(event) {
	if (event.key == " ") {
		infect = true;
		can_infect_public = false;
	}
});

window.addEventListener('mousemove', function(event) {mouse.x = event.x; mouse.y = event.y});

dots = [];
for (var i = 0; i < 400; i++) {
	var x = randint(0, innerWidth);
	var y = randint(0, innerHeight);
	var radius = randint(0, 0);
	var xdirection = choice([-2, -1.5, -1, 1, 1.5, 2]);
	var ydirection = choice([-2, -1.5, -1, 1, 1.5, 2]);
	dots.push(new Dot(x, y, radius, xdirection, ydirection));
}

function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, innerWidth, innerHeight);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	c.fillStyle = grd;
	c.fillRect(0, 0, innerWidth, innerHeight);

	for (var i = 0; i < dots.length; i++) {
		dots[i].draw();
		dots[i].move();

		if (can_infect) {
			var dist = get_distance(mouse.x, mouse.y, dots[i].x, dots[i].y);
			if (dist < 100) {
				var opacity = (Math.abs(100 - dist) * 0.01).toString();
				if (infect) {
					dots[i].infected = true;
				}

				c.beginPath();
				c.moveTo(mouse.x, mouse.y);
				c.lineTo(dots[i].x, dots[i].y);
				c.strokeStyle = "rgba(0,0,0," + opacity + ")";
				c.stroke();
			}
		}
	}
	if (!can_infect_public) {
		can_infect = false;
	}

	for (var i = 0; i < 15; i++) {
		text("Alzheimer's Disease", "bold 100px calibri", (innerWidth / 2) - i, (innerHeight / 2) + i, "gainsboro");
	}
	for (var i = 0; i < 5; i++) {
		text("Click Anywhere to Continue", "bold 30px calibri", (innerWidth / 2) - i, (innerHeight * 0.6) + i, "gainsboro");
	}
	text("Click Anywhere to Continue", "bold 30px calibri", innerWidth / 2, innerHeight * 0.6, "white");
	text("Alzheimer's Disease", "bold 100px calibri", innerWidth / 2, innerHeight / 2, "white");

	infect = false;
}
animate();
