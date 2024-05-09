const forcesContainers = document.querySelectorAll('#forces');
const forcesRandomBtn = document.querySelector('#forcesRandom');
const forcesApplyBtn = document.querySelector('#forcesApply');

const controlsParticles = document.querySelector('#controlsParticles');
const particlesItems = controlsParticles.querySelectorAll('label');

export const particlesCount = {
  purple: 200,
  red: 100,
  green: 150,
  blue: 300,
};

export const forces = {
  purple: {
    purple: 0.8,
    red: 0.4,
    green: -0.2,
    blue: 0.5,
  },
  red: {
    purple: -0.01,
    red: 0.1,
    green: -0.34,
    blue: -0.44,
  },
  green: {
    purple: -0.32,
    red: -0.17,
    green: -0.32,
    blue: -0.15,
  },
  blue: {
    purple: 1,
    red: -1,
    green: 0.64,
    blue: 0.01,
  },
};

export const canvasParams = {
  width: 1000,
  height: 700,
  shiftX: 100,
  shiftY: 100,
}


function setDefaultParticlesCount() {
  particlesItems.forEach(item => {
    const input = item.querySelector('input');
    const currentColor = input.dataset.color;
    input.value = particlesCount[currentColor];

    const span = item.querySelector('span');
    span.textContent = input.value;
    input.onchange = () => {
      span.textContent = input.value;
      particlesCount[currentColor] = Number(input.value);
    }
  })
};
setDefaultParticlesCount();

const limit = 10;

function setDefaultValues() {
  forcesContainers.forEach(container => {
    const inputs = container.querySelectorAll('input');
    const colorContainer = container.dataset.color;

    inputs.forEach(input => {
      const colorItem = input.dataset.color;
      input.min = -limit;
      input.max = limit;
      input.value = forces[colorContainer][colorItem] * 10;
    })
  });
};
setDefaultValues();

function getRandomValue() {
  return Math.random() * (limit - (-limit)) + (-limit);
}

function getRandomValues() {
  forcesContainers.forEach(container => {
    const inputs = container.querySelectorAll('input');
    inputs.forEach(input => {
      input.value = getRandomValue();
    })
  });
};

function setForcesValues() {
  forcesContainers.forEach(container => {
    const inputs = container.querySelectorAll('input');
    const colorContainer = container.dataset.color;
    inputs.forEach(input => {
      const colorItem = input.dataset.color;
      forces[colorContainer][colorItem] = Number(input.value);
    })
  });
};


forcesRandomBtn.addEventListener('click', getRandomValues);
forcesApplyBtn.addEventListener('click', setForcesValues);