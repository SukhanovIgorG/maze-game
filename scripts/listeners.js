import { start, pauseToggle, moveUp, moveLeft, moveRight, moveDown } from "./drawMaze.js"

window.addEventListener("keydown", function (e) {
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
    e.preventDefault();
  }
  if (e.code === "Enter") {
    start();
  }
  if (e.code === "Space") {
    pauseToggle()
  }
}, false);

const keyUp = document.querySelector("#keyUp");
const keyDown = document.querySelector("#keyDown");
const keyLeft = document.querySelector("#keyLeft");
const keyRight = document.querySelector("#keyRight");
const keySP = document.querySelector("#keySP");

keyUp.addEventListener("click", moveUp)
keyDown.addEventListener("click", moveDown)
keyLeft.addEventListener("click", moveLeft)
keyRight.addEventListener("click", moveRight)
keySP.addEventListener("click", pauseToggle)