const blockSize = 25;
const rows = 15;
const columns = 15;

// Snake
let snakeX = blockSize * 5;
let snakeY = blockSize * 5;

// Food
let foodX = blockSize * 10;
let foodY = blockSize * 10;

// Velocity
let velocityX = 0;
let velocityY = 0;

const snakeBody = [];

// main function on page loading
window.onload = function () {
	const board = document.getElementById('canvas'); // canvas element

	// canvas borders
	board.height = rows * blockSize;
	board.width = columns * blockSize;
	const context = board.getContext('2d');

	foodPlace(); // food update

	document.addEventListener('keyup', changeDirection); // on key click

	setInterval(() => snakeUpdate(context, board), 100); // update snake position every 100 ms
};

// function for snake position update
const snakeUpdate = (context, board) => {
	// Update snake position
	snakeX += velocityX * blockSize;
	snakeY += velocityY * blockSize;

	// Reset game if snake crashed into borders
	if (snakeX < 0 || snakeX >= board.width || snakeY < 0 || snakeY >= board.height) {
		resetGame();
	}

	// Reset game if snake crashed into herself
	for (let i = 0; i < snakeBody.length; i++) {
		if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
			resetGame();
		}
	}

	// Add snake size if get food
	if (snakeX === foodX && snakeY === foodY) {
		snakeBody.push([foodX, foodY]);
		foodPlace();
	}

	// Snake move
	for (let i = snakeBody.length - 1; i > 0; i--) {
		snakeBody[i] = snakeBody[i - 1]; // each segment copies latest segment
	}

	// Update the position of the first segment
	if (snakeBody.length) {
		snakeBody[0] = [snakeX, snakeY];
	}

	// board
	context.fillStyle = 'black';
	context.fillRect(0, 0, board.width, board.height);

	context.fillStyle = 'red';
	context.fillRect(foodX, foodY, blockSize, blockSize);

	context.fillStyle = 'greenyellow';
	context.fillRect(snakeX, snakeY, blockSize, blockSize);

	for (let i = 0; i < snakeBody.length; i++) {
		context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
	}
};

// Randomly move food
const foodPlace = () => {
	foodX = Math.floor(Math.random() * columns) * blockSize;
	foodY = Math.floor(Math.random() * rows) * blockSize;
};

// Change direction by user click
const changeDirection = e => {
	switch (e.code) {
		case 'ArrowUp':
			if (velocityY !== 1) {
				velocityX = 0;
				velocityY = -1;
			}
			break;

		case 'ArrowRight':
			if (velocityX !== -1) {
				velocityX = 1;
				velocityY = 0;
			}
			break;

		case 'ArrowDown':
			if (velocityY !== -1) {
				velocityX = 0;
				velocityY = 1;
			}
			break;

		case 'ArrowLeft':
			if (velocityX !== 1) {
				velocityX = -1;
				velocityY = 0;
			}
			break;
	}
};

// Game reset
const resetGame = () => {
	alert(`Game over!\nScore = ${snakeBody.length}`);
	snakeX = blockSize * 5;
	snakeY = blockSize * 5;
	velocityX = 0;
	velocityY = 0;
	snakeBody.length = 0;
	foodPlace();
};
