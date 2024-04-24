const height = 700;
const width = 1000;
const shiftX = 100;
const shiftY = 100;

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


const randomX = () => (Math.random() * (width-(shiftX*2))) + shiftX;
const randomY = () => (Math.random() * (height-(shiftY*2))) + shiftY;

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
      if (d > 0 && d < 100) {
        const F = g * 1 / d;
        fx += F * dx;
        fy += F * dy;
      }
    }
    a.vx = (a.vx + fx)/2;
    a.vy = (a.vy + fy)/2;
    a.x += a.vx;
    a.y += a.vy;
  };
  if (a.x <= shiftX || a.x >= width-shiftX) { a.vx *= -1; };
  if (a.y <= shiftY || a.y >= width-shiftY) { a.vy *= -1; };
}

const yellow = create('yellow', 200);
const red = create('red', 200);
const green = create('green', 200);
const blue = create('blue', 200);

const update = () => {
  rule(yellow, yellow, 0.15);
  rule(yellow, red, 0.2);
  rule(yellow, green, -0.2);
  rule(yellow, blue, 0.3);

  rule(red, red, -0.1);
  rule(red, yellow, -0.01);
  rule(red, green, -0.34);
  rule(red, blue, -0.44);

  rule(green, green, -0.32);
  rule(green, yellow, 0.34);
  rule(green, red, -0.17);
  rule(green, blue, -0.2);


  rule(blue, blue, 0.01);
  rule(blue, yellow, 0);
  rule(blue, red, 0);
  rule(blue, green, 0);

  space.clearRect(shiftX, shiftY, width-shiftX*2, height-shiftY*2);
  draw(shiftX, shiftY, 'black', width-shiftX*2, height-shiftY*2);
  for (let i = 0; i < particles.length; i++) {
    draw(particles[i].x, particles[i].y, particles[i].color, 5, 5)
  };
  requestAnimationFrame(update);
};
update();
