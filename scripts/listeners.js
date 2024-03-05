import { start, pauseToggle } from "./drawMaze.js"

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