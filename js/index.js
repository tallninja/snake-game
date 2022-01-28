let canvas = document.querySelector('#canvas');
let restartButton = document.querySelector('#restart-button');
let scoreDisplay = document.querySelector('#score');
let highScoreDisplay = document.querySelector('#high-score');

restartButton.addEventListener('click', () => {
  stopGame();
  startGame();
});

const ROWS = 40;
const COLS = 50;
const PIXEL = 10; // number of cells row and cols in canvas
const SPEED = 7;

let errorColor = 'orange';

let pixels = new Map();

const moveRight = ([x, y]) => [x, y + 1];
const moveLeft = ([x, y]) => [x, y - 1];
const moveUp = ([x, y]) => [x - 1, y];
const moveDown = ([x, y]) => [x + 1, y];

let snake;
let currentFoodPosition;
let currentDirection;
let directionQueue;
let snakePositionSet;
let score;
let highScore;
let paused = false;

// create a grid inside the canvas
function createGrid() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      let pixel = document.createElement('div');
      pixel.setAttribute('class', 'pixel');
      pixel.style.border = '1px solid #eee';
      pixel.style.left = `${j * PIXEL}px`;
      pixel.style.top = `${i * PIXEL}px`;
      pixel.style.width = `${PIXEL}px`;
      pixel.style.height = `${PIXEL}px`;
      //   pixel.addEventListener('click', (event) => {
      //     event.target.style.backgroundColor = '#1d1f33';
      //   });
      let key = toKeyString([i, j]);
      pixels.set(key, pixel);
      canvas.appendChild(pixel);
    }
  }
}
createGrid();

// draw snake
function drawSnake() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      let position = `${i}-${j}`;
      let pixel = pixels.get(position);
      pixel.style.backgroundColor = snakePositionSet.has(position)
        ? 'black'
        : '#d4d4d4';
    }
  }
  renderFoodItem(currentFoodPosition);
}

function moveSnake() {
  let nextDirection = currentDirection;

  while (directionQueue.length > 0) {
    let candidateDirection = directionQueue.shift();

    if (!keysAreOpposite(candidateDirection, nextDirection)) {
      nextDirection = candidateDirection;
      break;
    }
  }
  let tail = snake[0];
  let head = snake[snake.length - 1];

  currentDirection = nextDirection;
  let nextHead = currentDirection(head);

  if (!checkValidHead(nextHead)) {
    stopGame();
    return;
  }

  snake.push(nextHead);

  if (toKeyString(nextHead) === toKeyString(currentFoodPosition)) {
    moveFood();
    score += 1;
    scoreDisplay.innerHTML = `Score: ${score}`;
  } else {
    snake.shift();
  }
  snakePositionSet = getSnakePositionSet(snake);
  drawSnake();
}

function renderFoodItem([x, y]) {
  let foodPosition = toKeyString([x, y]);
  let pixel = pixels.get(foodPosition);
  pixel.style.backgroundColor = 'blue';
}

function moveFood() {
  let newFoodPosition = spawnFood();
  currentFoodPosition = newFoodPosition;
}

function checkValidHead([x, y]) {
  if (x < 0 || y < 0) {
    return false;
  }
  if (x >= ROWS || y >= COLS) {
    return false;
  }

  let position = toKeyString([x, y]);

  if (snakePositionSet.has(position)) {
    errorColor = 'red';
    return false;
  }

  return true;
}

function getSnakePositionSet(snake) {
  let snakePositionSet = new Set();
  for (let [x, y] of snake) {
    let position = toKeyString([x, y]);
    snakePositionSet.add(position);
  }
  return snakePositionSet;
}

function keysAreOpposite(dir1, dir2) {
  if (dir1 === moveUp && dir2 === moveDown) {
    return true;
  }
  if (dir1 === moveLeft && dir2 === moveRight) {
    return true;
  }
  if (dir1 === moveDown && dir2 === moveUp) {
    return true;
  }
  if (dir1 === moveRight && dir2 === moveLeft) {
    return true;
  } else {
    return false;
  }
}

function spawnFood() {
  while (true) {
    let food = [
      Math.floor(Math.random() * ROWS),
      Math.floor(Math.random() * COLS),
    ];
    if (!snakePositionSet.has(toKeyString(food))) {
      return food;
    }
  }
}

function toKeyString([x, y]) {
  return `${x}-${y}`;
}

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowLeft':
    case 'A':
    case 'a':
      directionQueue.push(moveLeft);
      break;
    case 'ArrowRight':
    case 'D':
    case 'd':
      directionQueue.push(moveRight);
      break;
    case 'ArrowUp':
    case 'W':
    case 'w':
      directionQueue.push(moveUp);
      break;
    case 'ArrowDown':
    case 'S':
    case 's':
      directionQueue.push(moveDown);
      break;
    case 'R':
    case 'r':
      stopGame();
      startGame();
      break;
    case 'P':
    case 'p':
      togglePause();
      break;
  }
});

function makeInitialSnake() {
  return [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
  ];
}

function togglePause() {
  paused = !paused;
}

function stopGame() {
  canvas.style.borderColor = errorColor;

  if (score > highScore) {
    window.localStorage.setItem('highScore', score);
    highScoreDisplay.innerHTML = `High Score: ${score}`;
  }

  clearInterval(gameInterval);
}

function startGame() {
  score = 0;
  scoreDisplay.innerHTML = `Score: ${score}`;
  snake = makeInitialSnake();
  snakePositionSet = getSnakePositionSet(snake);
  currentFoodPosition = spawnFood();
  currentDirection = moveRight;
  directionQueue = [];
  canvas.style.border = '';
  gameInterval = setInterval(() => {
    if (!paused) {
      moveSnake();
    }
  }, 500 / SPEED);
  let highScoreStored = window.localStorage.getItem('highScore');
  if (highScoreStored) {
    highScore = highScoreStored;
  } else {
    highScore = 0;
    window.localStorage.setItem('highScore', highScore);
  }
  highScoreDisplay.innerHTML = `High Score: ${highScore}`;
  createGrid();
}

startGame();
