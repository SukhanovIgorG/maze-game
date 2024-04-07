import { sound } from "./utils.js"
const winSound = sound("../assets/sounds/win.mp3");

export function animation() {
  var js1 = document.createElement('link');
  js1.id = "animation";
  js1.href = "../styles/show.css";
  js1.rel = "stylesheet";
  document.head.appendChild(js1);
  winSound.play();
}

export function animationStop() {
  let animation = document.querySelector('#animation');
  if (animation) animation.remove();
}