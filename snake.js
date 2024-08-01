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

// Audio files
const backgroundMusic = new Audio('./audio/sounds_effects_background.mp3');
const eatSound = new Audio('./audio/sounds_effects_snake_eat.wav');
const looseSound = new Audio('./audio/sounds_effects_snake_looses.wav');

// Loop background music
backgroundMusic.loop = true;

// Variable to track if music has started
let musicStarted = false;

// Main function on page loading
window.onload = function () {
	const board = document.getElementById('canvas'); // Canvas element

	// Canvas borders
	board.height = rows * blockSize;
	board.width = columns * blockSize;
	const context = board.getContext('2d');

	foodPlace(); // Food update

	// Listen for any interaction to start the music
	document.addEventListener('keydown', startBackgroundMusic);
	document.addEventListener('click', startBackgroundMusic);

	document.addEventListener('keyup', changeDirection); // On key click

	setInterval(() => snakeUpdate(context, board), 100); // Update snake position every 100 ms
};

// Function to start the background music
function startBackgroundMusic() {
	if (!musicStarted) {
		backgroundMusic.play().catch(error => {
			console.log('Background music play failed:', error);
		});
		musicStarted = true;

		// Remove event listeners after music starts
		document.removeEventListener('keydown', startBackgroundMusic);
		document.removeEventListener('click', startBackgroundMusic);
	}
}

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
		eatSound.play();
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
	function drawBoard() {
		context.fillStyle = 'black'; // background color of the board
		context.fillRect(0, 0, canvas.width, canvas.height);

		context.strokeStyle = 'white'; // color of the grid lines
		context.lineWidth = 1;

		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < columns; col++) {
				// Draw each cell with a rectangle
				context.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);
			}
		}
	}

	drawBoard();

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
	looseSound.play();
	alert(`Game over!\nScore = ${snakeBody.length}`);
	snakeX = blockSize * 5;
	snakeY = blockSize * 5;
	velocityX = 0;
	velocityY = 0;
	snakeBody.length = 0;
	foodPlace();
};
