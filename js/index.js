let canvas = document.querySelector('#canvas');

const ROWS = 30;
const COLS = 50;
const PIXEL = 10; // number of cells row and cols in canvas

const SPEED = 4;

let pixels = new Map();

const moveRight = ([x, y]) => [x, y + 1];
const moveLeft = ([x, y]) => [x, y - 1];
const moveUp = ([x, y]) => [x - 1, y];
const moveDown = ([x, y]) => [x + 1, y];

let currentDirection = moveRight;
let flushedDirection = currentDirection;

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
      pixel.addEventListener('click', (event) => {
        event.target.style.backgroundColor = 'black';
      });
      let key = `${i}-${j}`;
      pixels.set(key, pixel);
      canvas.appendChild(pixel);
    }
  }
}

// draw snake
function drawSnake(snake) {
  let snakePositions = new Set();
  for (let [x, y] of snake) {
    let position = `${x}-${y}`;
    snakePositions.add(position);
  }

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      let position = `${i}-${j}`;
      let pixel = pixels.get(position);
      pixel.style.backgroundColor = snakePositions.has(position)
        ? 'black'
        : '#d4d4d4';
    }
  }
}

createGrid();

let snake = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
];

function moveSnake() {
  let tail = snake[0];
  if (tail[1] < COLS) {
    let head = snake[snake.length - 1];
    let nextHead = currentDirection(head);
    flushedDirection = currentDirection;
    snake.push(nextHead);
    snake.shift();
    drawSnake(snake);
  } else {
    return;
  }
}

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowLeft':
    case 'A':
    case 'a':
      if (flushedDirection !== moveRight) currentDirection = moveLeft;
      break;
    case 'ArrowRight':
    case 'D':
    case 'd':
      if (flushedDirection !== moveLeft) currentDirection = moveRight;
      break;
    case 'ArrowUp':
    case 'W':
    case 'w':
      if (flushedDirection !== moveDown) currentDirection = moveUp;
      break;
    case 'ArrowDown':
    case 'S':
    case 's':
      if (flushedDirection !== moveUp) currentDirection = moveDown;
      break;
    default:
      currentDirection = moveRight;
  }
});

setInterval(() => {
  moveSnake();
}, 500 / SPEED);
