export function playSound (url) {
  var audio = new Audio(url);
  audio.volume = 0.1;
  audio.play();
}