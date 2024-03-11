import { generateMaze, getHelp } from "./generateMaze.js";
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
const helpButton = document.querySelector('#helpButton')
const pauseBanner = document.querySelector('#pause')

let columnsSize, rowsSize, map, tractorsNumber
let gameRun = false;
let help = false;
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
function toggleHelp() {
  help = !help;
}

export function pauseToggle() {
  gameRun ? setPause() : unsetPause();
}

export function start() {
  animationStop();
  help = false;
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
  finish.X = +columnsSize - 1 - shiftX / fieldSize;
  finish.Y = +rowsSize - 1 - shiftY / fieldSize;
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
function drawHelp() {
  const path = getHelp(map, player);
  if (path) {
    const pathArr = path.split(",");
    const cropPath = pathArr.slice(0, 5)
    for (let step of cropPath) {
      let row = step.split("-")[0];
      let col = step.split("-")[1];
      context.fillStyle = 'green';
      context.beginPath();
      context.rect(padding + col * fieldSize, padding + row * fieldSize, fieldSize, fieldSize);
      context.fill();
    }
  }
}

function drawMap() {
  for (let x = 0; x < columnsSize; x++) {
    for (let y = 0; y < rowsSize; y++) {
      if (getField(x, y) === '1') {
        context.fillStyle = colors.wall;
        context.beginPath();
        context.rect(padding + x * fieldSize, padding + y * fieldSize, fieldSize, fieldSize);
        context.fill();
      }
    }
  }
}

function loop() {
  const lp = requestAnimationFrame(loop);
  init();
  drawMap();
  if (help) drawHelp();
  drawExit();
  drawPlayer();
  if ((player.X == finish.X) && (player.Y == finish.Y) && player.score > 0) {
    animation();
    cancelAnimationFrame(lp);
    gameRun = false;
  }
};

document.addEventListener('keydown', function (e) {
  if (gameRun) {
    help = false;
    if (e.which === 38) {
      if (((player.Y - 1) >= 0) && (getField(player.X, player.Y - 1) != '1')) {
        playSound(soundStep);
        player.Y -= 1;
        player.score += 1;
      }
    };

    // стрелка вниз
    if (e.which === 40) {
      if (((player.Y + 1) <= rowsSize - 1) && (getField(player.X, player.Y + 1) != '1')) {
        playSound(soundStep);
        player.Y += 1;
        player.score += 1;
      }
    };

    // стрелка влево
    if (e.which === 37) {
      if (((player.X - 1) >= 0) && (getField(player.X - 1, player.Y) != '1')) {
        playSound(soundStep);
        player.X -= 1;
        player.score += 1;
      }
    };
    // стрелка вправо
    if (e.which === 39) {
      if (((player.X + 1) <= columnsSize - 1) && (getField(player.X + 1, player.Y) != '1')) {
        playSound(soundStep);
        player.X += 1;
        player.score += 1;
      }
    };
    scoreElement.textContent = player.score;
  } else {
    if (e.which === 38) {
      heightInput.value = +heightInput.value + 10
    };

    // стрелка вниз
    if (e.which === 40) {
      heightInput.value = +heightInput.value > 13 ? +heightInput.value - 10 : +heightInput.value
    };

    // стрелка влево
    if (e.which === 37) {
      widthInput.value = +widthInput.value > 13 ? +widthInput.value - 10 : +widthInput.value
    };
    // стрелка вправо
    if (e.which === 39) {
      widthInput.value = +widthInput.value + 10
    };
  }
});
// запускаем игру
startButton.addEventListener('click', start)
helpButton.addEventListener('click', toggleHelp)
