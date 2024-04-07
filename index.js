window.onload = async () => {
  if (navigator.serviceWorker) {
    try {
      await navigator.serviceWorker.register('./sw.js')
    } catch (error) {
      console.log('error register SWW :>> ', error);
    }
  }
};

const imageMute = "url('./assets/images/mute.svg')"
const imageMusic = "url('./assets/images/music.svg')"
const music = document.querySelector('.audioplayer')
music.volume = 0.3;
const audioButton = document.querySelector('.audio_button')
audioButton.addEventListener('click', () => {
  if (music.paused) {
    music.play();
    audioButton.style.content = imageMute;
  } else {
    music.pause();
    audioButton.style.content = imageMusic;
  }
});