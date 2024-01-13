// define HTML elements
const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const failureReason = document.getElementById("failureReason");

// defind game varaibles
const gridSize = 20;
let snake = [{ x: 10, y: 10 }]; // coordinate of snake's start
let food = generateFood();
let highScore = 0;
let direction = "right";
let gameInterval; // gameInterval keeps track of when we are running our game
let gameSpeedDelay = 333;
let gameStarted = false;
let gameTimeout;

// define functions
// draw game map, snake and food
function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
}

// draw snake
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag); // create a <div>
  element.className = className; // assign className 'snake' to the element
  return element;
}

// set the position of snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x; // gridColumn is a CSS property
  element.style.gridRow = position.y;
}

// function that creates food
function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

// randomly generate coordinates for food
function generateFood() {
  let coordinates;
  do {
    coordinates = generateCoordinate();
  } while (
    snake.some(
      (value) => value.x === coordinates.x && value.y === coordinates.y
    )
  );
  return coordinates;
}
// helper function that generates coordinates that will not collide with snake's body
function generateCoordinate() {
  // [0,1), +1 because the grid starts at 1
  const x = Math.floor(Math.random() * gridSize + 1);
  const y = Math.floor(Math.random() * gridSize + 1);
  return { x, y };
}

// moving the snake
function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case "right":
      head.x++;
      break;
    case "left":
      head.x--;
      break;
    case "up":
      head.y--; /* y axis decrement upwards, the uppermost row has a value of 1, that's why we nned to decrement it */
      break;
    case "down":
      head.y++;
      break;
  }

  // unshift(): inserts new elements at the start of an array, and returns the new length of the array.
  snake.unshift(head);

  // when snake hits the food
  if (head.x === food.x && head.y === food.y) {
    // generate a new location for the food
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval); // clear past interval reset the movement and move function
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay); // when snake hit food, increase snake's moving speed
  } else {
    snake.pop(); // keep the length of snake unchanged
  }
}

// increase the speed of the snake when it hits the food
function increaseSpeed() {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

// check collision
function checkCollision() {
  const head = snake[0];
  // reset game when snake is out of bound
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    getFailureInfo("Ah oh, your snake hit the wall T^T");
    resetGame();
  }
  // reset game when snake's head is overlapping with its body
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      getFailureInfo("Ah oh, your snake just ate itself T^T");
      resetGame();
    }
  }
}
function getFailureInfo(failReason) {
  failureReason.textContent = failReason;
  failureReason.style.display = "block";
}

// reset game
function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 333;
  updateScore();
}

// update Score
function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0");
}

// stop game
function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";
  logo.style.display = "block";
}

// update highscore
function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, "0");
  }
  highScoreText.style.display = "block";
}

// keypress event listener
function handleKeyPress(event) {
  // the conditions at both sides of OR operator are able to listen to the pressing space bar event, but works for different browsers
  if (
    (!gameStarted && event.code === "Space") ||
    (!gameStarted && event.key === " ")
  ) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      case "ArrowRight":
        direction = "right";
        break;
    }
  }
}
document.addEventListener("keydown", handleKeyPress);

// start game function
function startGame() {
  gameStarted = true; // keep track of a running game
  instructionText.style.display = "none";
  logo.style.display = "none";
  failureReason.textContent = "";
  failureReason.style.display = "none";
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}
