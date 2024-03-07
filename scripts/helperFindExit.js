class Graph {
  constructor() {
    this.adjacencyList = {};
  }
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }
  addEdge(source, destination) {
    if (!this.adjacencyList[source]) {
      this.addVertex(source);
    }
    if (!this.adjacencyList[destination]) {
      this.addVertex(destination);
    }
    this.adjacencyList[source].push(destination);
    this.adjacencyList[destination].push(source);
  }
  removeEdge(source, destination) {
    this.adjacencyList[source] = this.adjacencyList[source].filter(vertex => vertex !== destination);
    this.adjacencyList[destination] = this.adjacencyList[destination].filter(vertex => vertex !== source);
  }
  removeVertex(vertex) {
    while (this.adjacencyList[vertex]) {
      const adjacentVertex = this.adjacencyList[vertex].pop();
      this.removeEdge(vertex, adjacentVertex);
    }
    delete this.adjacencyList[vertex];
  }
}

Graph.prototype.bfs = function (start) {
  const queue = [start];
  const result = [];
  const visited = {};
  visited[start] = true;
  let currentVertex;
  while (queue.length) {
    currentVertex = queue.shift();
    result.push(currentVertex);
    this.adjacencyList[currentVertex].forEach(neighbor => {
      if (!visited[neighbor]) {
        visited[neighbor] = true;
        queue.push(neighbor);
      }
    });
  }
  return result;
}
Graph.prototype.dfsRecursive = function (start) {
  const result = [];
  const visited = {};
  const adjacencyList = this.adjacencyList;
  (function dfs(vertex) {
    if (!vertex) return null;
    visited[vertex] = true;
    result.push(vertex);
    adjacencyList[vertex].forEach(neighbor => {
      if (!visited[neighbor]) {
        return dfs(neighbor);
      }
    })
  })(start);
  return result;
}
Graph.prototype.dfsIterative = function (start) {
  const result = [];
  const stack = [start];
  const visited = {};
  visited[start] = true;
  let currentVertex;
  while (stack.length) {
    currentVertex = stack.pop();
    result.push(currentVertex);
    this.adjacencyList[currentVertex].forEach(neighbor => {
      if (!visited[neighbor]) {
        visited[neighbor] = true;
        stack.push(neighbor);
      }
    });
  }
  return result;
}

var hasPath = function (maze, start, destination) {
  maze[start[0]][start[1]] = 1;
  return searchMazeHelper(maze, start, destination);
};
function searchMazeHelper(maze, current, end) { // dfs
  if (current[0] == end[0] && current[1] == end[1]) {
    return true;
  }
  let neighborIndices, neighbor;
  // Indices: 0->top,1->right, 2->bottom, 3->left 
  let directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  for (const direction of directions) {
    neighborIndices = [current[0] + direction[0], current[1] + direction[1]];
    if (isFeasible(maze, neighborIndices)) {
      maze[neighborIndices[0]][neighborIndices[1]] = 1;
      if (searchMazeHelper(maze, neighborIndices, end)) {
        return true;
      }
    }
  }
  return false;
}
function isFeasible(maze, indices) {
  let x = indices[0], y = indices[1];
  return x >= 0 && x < maze.length && y >= 0 && y < maze[x].length && maze[x][y] === 0;
}
var maze = [[0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 1, 0], [1, 1, 0, 1, 1], [0, 0, 0, 0, 0]]
hasPath(maze, [0, 4], [3, 2]);