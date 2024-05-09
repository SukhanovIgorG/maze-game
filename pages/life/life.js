import { forces, particlesCount, canvasParams } from "./settings.js";

const startBtn = document.getElementById('start');
const counter = document.getElementById('counter');

const height = canvasParams.height;
const width = canvasParams.width;
const shiftX = canvasParams.shiftX;
const shiftY = canvasParams.shiftY;

const canvas = document.getElementById('canvas');
canvas.height = height;
canvas.width = width;
const space = canvas.getContext('2d');



const draw = (x, y, c, w, h) => {
  space.fillStyle = c;
  space.fillRect(x, y, w, h);
};

let particles = [];
const particle = (x, y, c) => ({
  'x': x, 'y': y, 'vx': 0, 'vy': 0, 'color': c
});


const randomX = () => (Math.random() * (width - (shiftX * 2))) + shiftX;
const randomY = () => (Math.random() * (height - (shiftY * 2))) + shiftY;

const create = (color, number) => {
  let group = [];
  for (let i = 0; i < number; i++) {
    group.push(particle(randomX(), randomY(), color));
    particles.push(group[i]);
  };
  return group;
};

const rule = (p1, p2, g) => {
  let a, b;
  for (let i = 0; i < p1.length; i++) {
    let fx = 0;
    let fy = 0;
    for (let j = 0; j < p2.length; j++) {
      a = p1[i]
      b = p2[j]
      
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > 0 && d < 150) {
        const F = g * 1 / d;
        fx += F * dx;
        fy += F * dy;
      }
    }
    if (a.x < shiftX || a.x > width - shiftX) a.vx *= -1;
    if (a.y < shiftY || a.y > height - shiftY) a.vy *= -1;
    a.vx = (a.vx + fx) / 2;
    a.vy = (a.vy + fy) / 2;
    a.x += a.vx;
    a.y += a.vy;
  };
}

// создаем частицы
function start() {
  let purple, red, green, blue;

  purple = create('purple', particlesCount['purple']);
  red = create('red', particlesCount['red']);
  green = create('green', particlesCount['green']);
  blue = create('blue', particlesCount['blue']);

  counter.textContent = particles.length;

  const update = () => {
    // правила ( частица1, частица2, гравитация(- притягивает, + отталкивает) )

    rule(purple, purple, forces['purple']['purple']);
    rule(purple, red, forces['purple']['red']);
    rule(purple, green, forces['purple']['green']);
    rule(purple, blue, forces['purple']['value']);

    rule(red, red, forces['red']['red']);
    rule(red, purple, forces['red']['purple']);
    rule(red, green, forces['red']['green']);
    rule(red, blue, forces['red']['blue']);

    rule(green, green, forces['green']['green']);
    rule(green, purple, forces['green']['purple']);
    rule(green, red, forces['green']['red']);
    rule(green, blue, forces['green']['blue']);

    rule(blue, blue, forces['blue']['blue']);
    rule(blue, purple, forces['blue']['purple']);
    rule(blue, red, forces['blue']['red']);
    rule(blue, green, forces['blue']['green']);

    space.clearRect(shiftX, shiftY, width - shiftX * 2, height - shiftY * 2);
    draw(shiftX, shiftY, 'black', width - shiftX * 2, height - shiftY * 2);
    for (let i = 0; i < particles.length; i++) {
      draw(particles[i].x, particles[i].y, particles[i].color, 5, 5)
    };
    requestAnimationFrame(update);
  };
  update();
};


startBtn.addEventListener('click', () => {
  start();
})
