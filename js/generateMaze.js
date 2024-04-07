function getRandomFrom(array) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

function isEven(n) {
  return n % 2 === 0;
};

function getLen(len) {
  return isEven(len) ? len - 1 : len
}

export function getHelp(data, player) {
  const graph = {};
  const height = Array.isArray(data) ? getLen(data.length) : 0;
  const width = Array.isArray(data[0]) ? getLen(data[0].length) : 0;
  const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  for (let x = 0; x < width; x += 2) {
    for (let y = 0; y < height; y += 2) {
      const name = String(y) + "-" + String(x);
      graph[name] = [];
      directions.forEach(dir => {
        if (0 <= x + dir[1] && x + dir[1] < width && 0 <= y + dir[0] && y + dir[0] < height) {
          if (data[y + dir[0]][x + dir[1]] == 0) {
            const neighborName = String(Math.abs(y + dir[0] * 2) + "-" + String(Math.abs(x + dir[1] * 2)));
            graph[name].push(neighborName);
          };
        };
      });
    };
  };

  let check = {};
  const start = `${isEven(player.Y) ? player.Y : player.Y + 1}-${isEven(player.X) ? player.X : player.X + 1}`;
  const finish = String(height - 1) + "-" + String(width - 1)
  const RES = [];
  function getPath(path, name) {
    check[name] = true;
    graph[name].forEach(N => {
      if (N === finish) { RES.push(path + name + "," + N) }
      else if (!check[N]) {
        return getPath(path + name + ",", N)
      }
    })
  }
  getPath('', start);
  return RES[0];
};

function painInConsole(map, cols, rows) {
  var s, d = '';
  for (var i = 0; i < cols; i++) {
    d = d + '1';
  }
  console.log('1' + d + '1');
  for (var i = 0; i < rows; i++) {
    s = '';
    for (var j = 0; j < cols; j++) {

      s += map[i][j];
    }
    console.log('1' + s + '1');
  }
  console.log('1' + d + '1');
  console.log('_________________');
}


export function generateMaze(columnsNumber, rowsNumber, tractorsNumber) {
  const map = [];

  function setField(x, y, value) {
    if (x < 0 || x >= columnsNumber || y < 0 || y >= rowsNumber) {
      return null;
    };
    map[y][x] = value;
  }

  function getField(x, y) {
    if (x < 0 || x >= columnsNumber || y < 0 || y >= rowsNumber) {
      return null;
    }
    return map[y][x];
  }

  for (let y = 0; y < rowsNumber; y++) {
    const row = [];
    for (let x = 0; x < columnsNumber; x++) {
      row.push('1');
    };
    map.push(row);
  }

  // выбираем случайным образом чётные координаты на карте с лабиринтом
  const startX = getRandomFrom(Array(columnsNumber).fill(0).map((_, index) => index).filter(x => isEven(x)));
  const startY = getRandomFrom(Array(rowsNumber).fill(0).map((_, index) => index).filter(x => isEven(x)));

  // трактор, который будет очищать дорожки в лабиринте
  var tractors = []
  for (let i = 0; i < tractorsNumber; i++) {
    // пока они не закончились — отправляем в массив с тракторами пары случайных координат для старта
    tractors.push({ x: startX, y: startY });
    setField(startX, startY, '0');
  }

  // функция проверяет, готов лабиринт или ещё нет
  // возвращает true, если лабиринт готов; false, если ещё нет
  function isMaze() {
    // во вложенном цикле проверяем по очереди все ячейки карты
    for (let x = 0; x < columnsNumber; x++) {
      for (let y = 0; y < rowsNumber; y++) {
        // если на чётных местах ещё можно встретить стену, 
        if (isEven(x) && isEven(y) && getField(x, y) === '1') {
          return false
        }
      }
    }

    // painInConsole(map, columnsNumber, rowsNumber);
    // getHelp(map);
    return true;
  }

  while (!isMaze()) {
    moveTractor();
  }
  return map;

  function moveTractor() {
    // перебираем в цикле все тракторы из массива
    for (const tractor of tractors) {
      const directs = [];
      if (tractor.x > 0) {
        directs.push('left');
      };
      if (tractor.x < columnsNumber - 2) {
        directs.push('right');
      };
      if (tractor.y > 0) {
        directs.push('up');
      };

      if (tractor.y < rowsNumber - 2) {
        directs.push('down');
      };

      const direct = getRandomFrom(directs);

      switch (direct) {
        case 'left':
          // если через 2 ячейки стена, то очищаем обе
          if (getField(tractor.x - 2, tractor.y) === '1') {
            setField(tractor.x - 1, tractor.y, '0');
            setField(tractor.x - 2, tractor.y, '0');
          };
          // меняем координату трактора
          tractor.x -= 2;
          break;
        case 'right':
          if (getField(tractor.x + 2, tractor.y) === '1') {
            setField(tractor.x + 1, tractor.y, '0');
            setField(tractor.x + 2, tractor.y, '0');
          };
          tractor.x += 2;
          break;
        case 'up':
          if (getField(tractor.x, tractor.y - 2) === '1') {
            setField(tractor.x, tractor.y - 1, '0');
            setField(tractor.x, tractor.y - 2, '0');
          };
          tractor.y -= 2
          break;
        case 'down':
          if (getField(tractor.x, tractor.y + 2) === '1') {
            setField(tractor.x, tractor.y + 1, '0');
            setField(tractor.x, tractor.y + 2, '0');
          };
          tractor.y += 2;
          break;
      }
    }
  }
};
