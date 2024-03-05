import { generateMaze } from "./generateMaze.js";
import { animation, animationStop } from "./animation.js";
import { colors } from "./settings.js"
import { playSound } from "./utils.js"

const soundStep = "./assets/sound/step.mp3"

const canvas = document.querySelector('canvas');
const scoreElement = document.querySelector('.score');
const context = canvas.getContext('2d');

const widthInput = document.querySelector('#width');
const heightInput = document.querySelector('#height');
const startButton = document.querySelector('#startButton')
const pauseBanner = document.querySelector('#pause')

let columnsSize, rowsSize, map, tractorsNumber
let gameRun = false;
const fieldSize = 10;
const padding = 10;
var player = {};
var finish = {};
// переменные сдвига
var shiftX = 0;
var shiftY = 0;

function setPause() {
  gameRun = false;
  pauseBanner.textContent = "Пауза";
}
function unsetPause() {
  gameRun = true;
  pauseBanner.textContent = "";
}

export function pauseToggle() {
  gameRun ? setPause() : unsetPause();
}

export function start() {
  animationStop();
  columnsSize = +widthInput.value > 3 ? +widthInput.value : 3;
  rowsSize = +heightInput.value > 3 ? +heightInput.value : 3;
  tractorsNumber = Number((columnsSize + rowsSize) / 10).toFixed();
  if (columnsSize % 2 == 0) { shiftX = fieldSize } else { shiftX = 0 };
  if (rowsSize % 2 == 0) { shiftY = fieldSize } else { shiftY = 0 };
  map = generateMaze(columnsSize, rowsSize, tractorsNumber);
  player.X = 0;
  player.Y = 0;
  player.score = 0;
  scoreElement.textContent = player.score;
  finish.X = +columnsSize - 1;
  finish.Y = +rowsSize - 1;
  unsetPause();
  loop();
}


function init() {
  // устанавливаем размеры холста
  canvas.width = padding * 2 + columnsSize * fieldSize;
  canvas.height = padding * 2 + rowsSize * fieldSize;

  // холст
  context.fillStyle = colors.wall;
  context.rect(0, 0, canvas.width, canvas.height);
  context.fill();
  context.fillStyle = colors.space;
  context.beginPath();

  // рисуем прямоугольник, отступив от границ холста на толщину рамки
  context.rect(padding, padding, canvas.width - padding * 2, canvas.height - padding * 2);
  context.fill();
}

// получаем значение ячейки из лабиринта
function getField(x, y) {
  if (x < 0 || x >= columnsSize || y < 0 || y >= rowsSize) {
    return null;
  }
  return map[y][x];
}

function drawExit() {
  context.fillStyle = colors.space;
  context.beginPath();
  context.rect(padding, 0, fieldSize, padding);
  context.fill();

  context.fillStyle = colors.space;
  context.beginPath();
  context.rect((columnsSize - 1) * fieldSize + padding - shiftX, rowsSize * fieldSize + padding - shiftY, fieldSize, padding + shiftY);
  context.fill();
}

function drawPlayer() {
  context.fillStyle = colors.player;
  context.beginPath();
  context.rect(padding + player.X * fieldSize, padding + player.Y * fieldSize, fieldSize, fieldSize);
  context.fill();
}

function drawMap() {
  for (let x = 0; x < columnsSize; x++) {
    for (let y = 0; y < rowsSize; y++) {
      if (getField(x, y) === '🟥') {
        context.fillStyle = colors.wall;
        context.beginPath();
        context.rect(padding + x * fieldSize, padding + y * fieldSize, fieldSize, fieldSize);
        context.fill();
      }
    }
  }
}
function drawInfo() {
  scoreElement.textContent = player.score;
}

function loop() {
  const lp = requestAnimationFrame(loop);
  init();
  drawMap();
  drawExit();
  drawPlayer();
  drawInfo();
  if ((player.X == finish.X) && (player.Y == finish.Y) && player.score > 0) {
    animation();
    cancelAnimationFrame(lp);
    gameRun = false;
  }
};


export function moveRight() {
  if (gameRun) {
    if (((player.X + 1) <= columnsSize - 1) && (getField(player.X + 1, player.Y) != '🟥')) {
      playSound(soundStep);
      player.X += 1;
      player.score += 1;
    }
  } else {
    widthInput.value = +widthInput.value + 10
  }
}

export function moveLeft() {
  if (gameRun) {
    if (((player.X - 1) >= 0) && (getField(player.X - 1, player.Y) != '🟥')) {
      playSound(soundStep);
      player.X -= 1;
      player.score += 1;
    }
  } else {
    widthInput.value = +widthInput.value > 13 ? +widthInput.value - 10 : +widthInput.value
  }
}

export function moveDown() {
  if (gameRun) {
    if (((player.Y + 1) <= rowsSize - 1) && (getField(player.X, player.Y + 1) != '🟥')) {
      playSound(soundStep);
      player.Y += 1;
      player.score += 1;
    }
  } else {
    heightInput.value = +heightInput.value > 13 ? +heightInput.value - 10 : +heightInput.value
  }
}

export function moveUp() {
  if (gameRun) {
    if (((player.Y - 1) >= 0) && (getField(player.X, player.Y - 1) != '🟥')) {
      playSound(soundStep);
      player.Y -= 1;
      player.score += 1;
    }
  } else {
    heightInput.value = +heightInput.value + 10
  }
}

document.addEventListener('keydown', function (e) {
    if (e.which === 38) {
      moveUp();
    };
    if (e.which === 40) {
      moveDown();
    };
    if (e.which === 37) {
      moveLeft();
    };
    if (e.which === 39) {
      moveRight();
    };
});

// запускаем игру
startButton.addEventListener('click', start)
