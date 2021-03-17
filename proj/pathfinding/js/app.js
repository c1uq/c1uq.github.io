let squareSize = 20;
let gridWidth = 30;
let gridHeight = 30;

var grid;
var startNode;
var endNode;
var boulders = [];
var getSave = function () {
	let blocks = [];
	for (let i = 0; i < gridWidth; i++) {
		for (var i2 = 0; i2 < gridHeight; i2++) {
			if (grid[i][i2].blocked) {
				blocks.push("[" + [i, i2].toString() + "]");
			}
		}
	}
	return "[" + ["[" + blocks.toString() + "]", "[" + [startNode.x, startNode.y].toString() + "]", "[" + [endNode.x, endNode.y].toString() + "]"].toString() + "]";
};
var loadSave;
//JSON.stringify();
//.toString()
var sketchProc = function(processingInstance) { with (processingInstance) {
	size(600, 600);
	
	loadSave = function (array) {
		startNode = grid[array[1][0]][array[1][1]];
		endNode = grid[array[2][0]][array[2][1]];
		for (let i = 0; i < array[0].length; i++) {
			grid[array[0][i][0]][array[0][i][1]].blocked = true;
		}
		for (let i = 0; i < grid.length; i++) {
			for (let ii = 0; ii < grid[i].length; ii++) {
				grid[i][ii].draw();
			}
		}
		fill(0, 255, 0);
		ellipse(startNode.x * squareSize + squareSize / 2, startNode.y * squareSize + squareSize / 2, squareSize / 2, squareSize / 2);
		fill(255, 0, 0);
		ellipse(endNode.x * squareSize + squareSize / 2, endNode.y * squareSize + squareSize / 2, squareSize / 2, squareSize / 2);
	};
	
	//create grid
	let gridNode = function (x, y) {
		this.x = x;
		this.y = y;
		this.prevNode = null;
		this.blocked = false;
		this.visited = false;
		this.adjacentNodes = [];
		this.draw = function () {
			fill(230, 230, 230);
			if (this.blocked === true) {
				fill(150, 150, 150);
			}
			rect(x * squareSize, y * squareSize, squareSize, squareSize);
		}
	};
	grid = [];
	for (let i = 0; i < gridWidth; i++) {
		grid.push([]);
		for (var i2 = 0; i2 < gridHeight; i2++) {
			grid[i].push(new gridNode(i, i2));
		}
	}
	
	//set boulders
	for (let i = 0; i < boulders.length; i++) {
		boulders[i].blocked = true;
	}
	
	//draw grid
	for (let i = 0; i < grid.length; i++) {
		for (let ii = 0; ii < grid[i].length; ii++) {
			grid[i][ii].draw();
		}
	}
	
	
	console.log(grid);
	
	//start pathfinding
	startNode = grid[0][0];
	endNode = grid[29][29];
	let timed = true;
	let ran = false;
	
	document.getElementById("run").addEventListener("click", function () {
		let queue = [startNode];
		//create adjacent list
		//north east south west
		let dx = [0, 1, 0, -1];
		let dy = [-1, 0, 1, 0];
		for (let i = 0; i < grid.length; i++) {
			for (let ii = 0; ii < grid[i].length; ii++) {
				//find adjacent nodes
				for (let iii = 0; iii < 4; iii++) {
					if (grid[i + dx[iii]] !== undefined) {
						if (grid[i + dx[iii]][ii + dy[iii]] !== undefined && grid[i + dx[iii]][ii + dy[iii]].blocked === false) {
							grid[i][ii].adjacentNodes.push(grid[i + dx[iii]][ii + dy[iii]]);
						}
					}
				}
			}
		}
		if (ran === false) {
			ran = true;
			if (timed) {
				let i = 0;
				let interval = setInterval(function () {
					fill(0, 0, 255);
					ellipse(queue[0].x * squareSize + squareSize / 2, queue[0].y * squareSize + squareSize / 2, squareSize / 2, squareSize / 2);
					for (let i = 0; i < queue[0].adjacentNodes.length; i++) {
						if (!(queue[0].adjacentNodes[i].visited === true || queue.includes(queue[0].adjacentNodes[i] ) )) {
							queue.push(queue[0].adjacentNodes[i]);
							queue[0].adjacentNodes[i].prevNode = queue[0];
							fill(0, 255, 255);
							ellipse(queue[0].adjacentNodes[i].x * squareSize + squareSize / 2, queue[0].adjacentNodes[i].y * squareSize + squareSize / 2, squareSize / 2, squareSize / 2);
						}
					}
					queue[0].visited = true;
					queue.splice(0, 1);
					if (queue[0] === endNode || queue.length < 1) {
						clearInterval(interval);
						let currNode = queue[0];
						let dist = 0;
						interval = setInterval(function () {
							if (currNode === startNode || queue.length < 1) {
								clearInterval(interval);
								console.log(dist);
							}
							fill(255, 255, 0);
							ellipse(currNode.x * squareSize + squareSize / 2, currNode.y * squareSize + squareSize / 2, squareSize / 2, squareSize / 2);
							currNode = currNode.prevNode;
							dist++;
							fill(0, 255, 0);
							ellipse(startNode.x * squareSize + squareSize / 2, startNode.y * squareSize + squareSize / 2, squareSize / 2, squareSize / 2);
							fill(255, 0, 0);
							ellipse(endNode.x * squareSize + squareSize / 2, endNode.y * squareSize + squareSize / 2, squareSize / 2, squareSize / 2);
						}, 75)
					}
					i++;
					
				}, 15);
			} else {
				for (let i = 0; !(queue[0] === endNode || queue.length < 1); i++) {
					fill(0, 0, 255);
					ellipse(queue[0].x * squareSize + squareSize / 2, queue[0].y * squareSize + squareSize / 2, squareSize / 2, squareSize / 2);
					for (let i = 0; i < queue[0].adjacentNodes.length; i++) {
						if (!(queue[0].adjacentNodes[i].visited === true || queue.includes(queue[0].adjacentNodes[i] ) )) {
							queue.push(queue[0].adjacentNodes[i]);
							queue[0].adjacentNodes[i].prevNode = queue[0];
							fill(0, 255, 255);
							ellipse(queue[0].adjacentNodes[i].x * squareSize + squareSize / 2, queue[0].adjacentNodes[i].y * squareSize + squareSize / 2, squareSize / 2, squareSize / 2);
						}
					}
					queue[0].visited = true;
					queue.splice(0, 1);
				}
				let currNode = queue[0];
				let dist = 0;
				while (!(currNode === startNode || queue.length < 1)) {
					fill(255, 255, 0);
					ellipse(currNode.x * squareSize + squareSize / 2, currNode.y * squareSize + squareSize / 2, squareSize / 2, squareSize / 2);
					currNode = currNode.prevNode;
					dist++;
				}
				fill(0, 255, 0);
				ellipse(startNode.x * squareSize + squareSize / 2, startNode.y * squareSize + squareSize / 2, squareSize / 2, squareSize / 2);
				fill(255, 0, 0);
				ellipse(endNode.x * squareSize + squareSize / 2, endNode.y * squareSize + squareSize / 2, squareSize / 2, squareSize / 2);
				console.log(dist);
			}
		}
	});
	fill(0, 255, 0);
	ellipse(startNode.x * squareSize + squareSize / 2, startNode.y * squareSize + squareSize / 2, squareSize / 2, squareSize / 2);
	fill(255, 0, 0);
	ellipse(endNode.x * squareSize + squareSize / 2, endNode.y * squareSize + squareSize / 2, squareSize / 2, squareSize / 2);
	let currType = 1;
	document.getElementById("mycanvas").addEventListener("click", function () {
		if (ran === false) {
			let clickedSquare = grid[Math.floor(mouseX / squareSize)][Math.floor(mouseY / squareSize)];
			if (clickedSquare === startNode) {
				currType = 2;
				startNode.draw();
				startNode = null;
				console.log("moving start node");
			} else if (clickedSquare === endNode) {
				currType = 3;
				endNode.draw();
				endNode = null;
				console.log("moving end node");
			} else {
				if (currType === 1) {
					if (clickedSquare.blocked) {
						clickedSquare.blocked = false;
					} else {
						clickedSquare.blocked = true;
					}
				} else if (currType === 2) {
					startNode = clickedSquare;
					currType = 1;
				} else if (currType === 3) {
					endNode = clickedSquare;
					currType = 1;
				}
			}
			clickedSquare.draw();
			fill(0, 255, 0);
			ellipse(startNode.x * squareSize + squareSize / 2, startNode.y * squareSize + squareSize / 2, squareSize / 2, squareSize / 2);
			fill(255, 0, 0);
			ellipse(endNode.x * squareSize + squareSize / 2, endNode.y * squareSize + squareSize / 2, squareSize / 2, squareSize / 2);
		}
		
	})
}}; //sketchProc


//finalize
var canvas = document.getElementById("mycanvas"); 
var processingInstance = new Processing(canvas, sketchProc); 
document.getElementById("load").remove();