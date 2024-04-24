export function sound (url) {
  var audio = new Audio(url);
  audio.volume = 0.1;
  return audio
};