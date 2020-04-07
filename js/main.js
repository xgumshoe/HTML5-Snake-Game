var stage = new createjs.Stage('game');
var GRID = 20;
var POINTS = 0;
var started = false;

// Title
var title = stage.addChild(new createjs.Text("SNAKE", "Bold 20px Arial", "white"));
title.textAlign = "center";
title.textBaseline = "middle";
title.x = stage.canvas.width/2;
title.y = 100;

// Score
var score = stage.addChild(new createjs.Text(`SCORE: ${POINTS}`, "Bold 20px Arial", "white"));
score.textAlign = "left";
score.textBaseline = "middle";
score.x = 50;
score.y = 180;

// Game screen
var screen = stage.addChild(new createjs.Container());
screen.x = 50;
screen.y = 200;

// Background
var bg = screen.addChild(new createjs.Shape());
bg.graphics
	.beginStroke('rgba(255, 255, 255, 1)').setStrokeStyle(2)
	.beginFill('rgba(0, 0, 0, 1)').drawRect(0, 0, GRID * 20, GRID * 20);
	
// Controls
var guide = stage.addChild(new createjs.Text("Use arrow keys", "Bold 20px Arial", "white"));
guide.textAlign = "center";
guide.textBaseline = "middle";
guide.x = stage.canvas.width/2;
guide.y = 300;

var keys = stage.addChild(new createjs.Shape());
keys.x = 250;
keys.y = 610;
keys.graphics
	// Left
	.beginStroke('rgba(0, 0, 0, 1)').setStrokeStyle(1)
	.beginFill('rgba(255, 255, 255, 1)').drawRoundRect(0, 40, 40, 40, 5).endStroke()
	.beginFill('rgba(0, 0, 0, 1)').moveTo(10, 60).lineTo(20, 50).lineTo(20, 70).closePath()
	// Up
	.beginStroke('rgba(0, 0, 0, 1)').setStrokeStyle(1)
	.beginFill('rgba(255, 255, 255, 1)').drawRoundRect(40, 0, 40, 40, 5).endStroke()
	.beginFill('rgba(0, 0, 0, 1)').moveTo(60, 10).lineTo(70, 20).lineTo(50, 20).closePath()
	// Right
	.beginStroke('rgba(0, 0, 0, 1)').setStrokeStyle(1)
	.beginFill('rgba(255, 255, 255, 1)').drawRoundRect(80, 40, 40, 40, 5).endStroke()
	.beginFill('rgba(0, 0, 0, 1)').moveTo(110, 60).lineTo(100, 50).lineTo(100, 70).closePath()
	// Down
	.beginStroke('rgba(0, 0, 0, 1)').setStrokeStyle(1)
	.beginFill('rgba(255, 255, 255, 1)').drawRoundRect(40, 40, 40, 40, 5).endStroke()
	.beginFill('rgba(0, 0, 0, 1)').moveTo(60, 70).lineTo(70, 60).lineTo(50, 60).closePath()
keys.regX = 60;

// Snake
var snake = {
	x: 0, // x coordinate
	y: 0, // y coordinate
	
	// velocity, moves one grid at a time
	dx: GRID,
	dy: 0,
	
	cells: [], // snake body
	maxCells: 4, // length of snake
	body: screen.addChild(new createjs.Shape()) // display object
};

// Apple
var apple = { 
	x: 0, // x coordinate
	y: 0, // y coordinate
	
	body: screen.addChild(new createjs.Shape()), // display object
	create: function() { // Creates apple to unoccupied coordinate
		do {
			// Randoms (0 to Grid) * GRID
			var x = Math.floor(Math.random() * GRID) * GRID;
			var y = Math.floor(Math.random() * GRID) * GRID;
			
			var occupied = snake.cells.find(c => { snake.x === x && snake.y === y })
			if(occupied === undefined) {
				apple.x = x;
				apple.y = y;
				break;
			}
		} while(true)
	}
};

// Update game
function update() {
	if(started) {
		// Move snake by it's velocity
		snake.x += snake.dx;
		snake.y += snake.dy;
		
		// Wrap snake position horizontally
		if(snake.x < 0) {
			snake.x = bg.graphics.command.w - GRID;
		} else if(snake.x >= bg.graphics.command.w) {
			snake.x = 0;
		}
		
		// Wrap snake position vertically
		if(snake.y < 0) {
			snake.y = bg.graphics.command.h - GRID;
		} else if(snake.y >= bg.graphics.command.h) {
			snake.y = 0;
		}
		
		// Adds cell in front
		snake.cells.unshift({x: snake.x, y: snake.y });
		
		// Remove last cell if exceeds the body
		if(snake.cells.length > snake.maxCells) {
			snake.cells.pop();
		}
		
		// Draw apple
		apple.body.graphics.clear().beginFill('rgba(255, 0, 0, 1)').drawRoundRect(apple.x, apple.y, GRID-1, GRID-1, GRID/2);
		
		// Clear snake body
		snake.body.graphics.clear();
		// Draw snake body
		snake.cells.map((cell, i) => {
			// snake body cell
			snake.body.graphics.beginFill('rgba(255, 255, 255, 1)').drawRect(cell.x, cell.y, GRID-1, GRID-1);
		
			// Eats apple if apple coordinates is within the snake body
			if(cell.x === apple.x && cell.y === apple.y) {
				score.text = `SCORE: ${++POINTS}`; // Increase score
				snake.maxCells++; // Increase snake cell count
				
				apple.create();
			}
			
			// Head collides with body
			if(i !== 0 && snake.x === cell.x && snake.y === cell.y) {
				started = false;
				snake.body.alpha = 0.1;
				setTimeout(() => { restart(); }, 2000);
			}
		});
	}
	
	stage.update();
}

function restart() {
	started = true;
	POINTS = 0;
	score.text = `SCORE: ${POINTS}`;
	
	snake.x = 0;
	snake.y = 0;
	snake.dx = GRID;
	snake.dy = 0;
	snake.cells = [];
	snake.maxCells = 4;
	snake.body.alpha = 1;
	
	guide.visible = false;
	
	apple.create();
}
setTimeout(() => { restart(); }, 2000);
	
window.addEventListener('keydown', (e) => {
	if (e.keyCode === 37 && snake.dx === 0) { // Left arrow key
		snake.dx = -GRID;
		snake.dy = 0;
	} else if (e.keyCode === 38 && snake.dy === 0) { // Up arrow key
		snake.dy = -GRID;
		snake.dx = 0;
	} else if (e.keyCode === 39 && snake.dx === 0) { // Right arrow key
		snake.dx = GRID;
		snake.dy = 0;
	} else if (e.keyCode === 40 && snake.dy === 0) { // Down arrow key
		snake.dy = GRID;
		snake.dx = 0;
	}
});

createjs.Ticker.on('tick', update);