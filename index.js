/* 
main concept
drawing box and when moving redrawing of same box and clearing previous box
same goes with obstacles
when creating obstacles storing it in array and looping through each obstacles to move obstacles 
*/


// selecting all 4 buttons
let up_button = document.querySelector(".up");
let down_button = document.querySelector(".down");
let left_button = document.querySelector(".left");
let right_button = document.querySelector(".right");
let body = document.body;

body.addEventListener("keypress", moveBox);

// moving box using keys
function moveBox(event) {
  console.log(event.code);
  if (event.code == "KeyW") {
    moveBoxUp();
  } else if (event.code == "KeyS") {
    moveBoxDown();
  } else if (event.code == "KeyA") {
    moveBoxLeft();
  } else if (event.code == "KeyD") {
    moveBoxRight();
  }
}

up_button.addEventListener("click", moveBoxUp);
down_button.addEventListener("click", moveBoxDown);
left_button.addEventListener("click", moveBoxLeft);
right_button.addEventListener("click", moveBoxRight);

// creting canvas
function createGameArea() {
  let canvas = document.createElement("canvas");
  canvas.width = 500;
  canvas.height = 300;
  canvas.id = "canvas";
  document.body.insertBefore(canvas, document.body.childNodes[0]);
  return canvas;
}
let canvas = createGameArea();

let ctx = canvas.getContext("2d");
let score = 0;

// box and obstacle share common things so makeing class component
class component {
  constructor(x, y, width, height, color) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  clearBox() {
    ctx.clearRect(this.x, this.y, this.width, this.height);
  }
}
let box = new component(20, canvas.height / 2 - 20, 40, 40, "red");

function moveBoxUp() {
  // we can't move box ouside of canvas and when game is over
  if (box.y > 0 && !isGameOver) {
    let moveBy = 10;
    let y = box.y - moveBy;
    box.clearBox();
    box = new component(box.x, y, box.width, box.height, box.color);
  }
}

function moveBoxDown() {
  if (box.y + box.height < canvas.height && !isGameOver) {
    let moveBy = 10;
    let y = box.y + moveBy;
    box.clearBox();
    box = new component(box.x, y, box.width, box.height, box.color);
  }
}

function moveBoxLeft() {
  if (box.x > 0 && !isGameOver) {
    let moveBy = 10;
    let x = box.x - moveBy;
    box.clearBox();
    box = new component(x, box.y, box.width, box.height, box.color);
  }
}

function moveBoxRight() {
  if (box.x + box.width < canvas.width && !isGameOver) {
    let moveBy = 10;
    let x = box.x + moveBy;
    box.clearBox();
    box = new component(x, box.y, box.width, box.height, box.color);
  }
}

// creating gap betweeen two obstacles
let obstacleGap = 250;
// storing last obstacles position so that we can draw antoher obstacle
let lastObstacleX = 300;
function createObstacle(x) {
  lastObstacleX += obstacleGap;
  let obstacle = new component(x, 0, 15, canvas.height, "red");
  let gap = box.height + 35;
  // generating random number to make gap inside obstacle where box can enter
  let randomNumber = Math.trunc(Math.random() * (canvas.height - gap));
  ctx.clearRect(x, randomNumber, 15, gap, "red");
  // we need this gap so returning it
  return { obstacle, randomNumber, gap };
}

// storing all obstacles
let obstaclesArray = [];
let isGameOver = false;
// showing two obstacles on loading file
obstaclesArray.push(createObstacle(lastObstacleX));
obstaclesArray.push(createObstacle(lastObstacleX));

function moveObstacles() {
  let moveBy = 10;
  // moving all obstacles left by 10px
  for (let { obstacle, randomNumber, gap } of obstaclesArray) {
    // clearing previous obstacle
    ctx.clearRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    // creating new obstacle
    let newObstacle = new component(
      obstacle.x - moveBy,
      obstacle.y,
      obstacle.width,
      obstacle.height,
      obstacle.color
    );
    // here x positioned is change so changing value of obstacle stored in array
    obstacle.x = newObstacle.x;
    ctx.clearRect(newObstacle.x, randomNumber, 15, gap, "red");
  }
}

// checking gameover or not in every 20 seconds
let crashCheckId = setInterval(() => {
  // drawing box again to fix flickering effect and removed part of box
  box = new component(box.x, box.y, box.width, box.height, box.color);
  for (let { obstacle, randomNumber, gap } of obstaclesArray) {
    if (isCrash(obstacle, randomNumber, gap)) {
      isGameOver = true;
      gameOver();
    }
  }
}, 20);

function isCrash(obstacle, randomNumber, gap) {
  let boxLeftSide = box.x;
  let boxRightSide = box.x + box.width;
  let boxTopSide = box.y;
  let boxBottomSide = box.y + box.height;
  let crash = false;
  // when box touches obstacle then checking following conditions
  // checking box is inside the gap of obstacle or not
  if (
    boxRightSide >= obstacle.x &&
    boxLeftSide <= obstacle.x + obstacle.width
  ) {
    if (boxTopSide <= randomNumber || boxBottomSide >= randomNumber + gap) {
      crash = true;
    } 
    // if box is inside of gap of obstacle
    else {
      box = new component(box.x, box.y, box.width, box.height, box.color);
    }
  }

  return crash;
}

document.querySelector(".show_score button").addEventListener("click", restartGame)

function restartGame() {
  // clearing entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  document.querySelector(".show_score button").style.opacity = 0
  canvas.style.opacity = 1;
  score = 0;
  box = new component(20, canvas.height / 2 - 20, 40, 40, "red");
  lastObstacleX = 300;
  obstaclesArray = []
  obstaclesArray.push(createObstacle(lastObstacleX));
  obstaclesArray.push(createObstacle(lastObstacleX));
  isGameOver = false;
  movingTime = 200

  // creating and moving obstacles and checking gameover or not
  obstacleId = setInterval(() => {
    movingTime--;
    obstaclesArray.push(createObstacle(lastObstacleX));
  }, 1000);
  
  moveId = setInterval(() => {
    score++;
    document.querySelector(".show_score span").textContent = `Score : ${score}`;
    moveObstacles();
  }, movingTime);

  crashCheckId = setInterval(() => {
    box = new component(box.x, box.y, box.width, box.height, box.color);
    for (let { obstacle, randomNumber, gap } of obstaclesArray) {
      if (isCrash(obstacle, randomNumber, gap)) {
        isGameOver = true;
        gameOver();
      }
    }
  }, 20);
}

let movingTime = 200;
function gameOver() {
  document.querySelector(".show_score button").style.opacity = 1;
  canvas.style.opacity = 0.5;
  clearInterval(crashCheckId);
  clearInterval(obstacleId);
  clearInterval(moveId);
}

// creating obstacle on every 1 second
let obstacleId = setInterval(() => {
  // reducing moving time by 1ms on every 1 second
  movingTime--;
  obstaclesArray.push(createObstacle(lastObstacleX));
}, 1000);

// moving obstacle
let moveId = setInterval(() => {
  // updating score on moving of obstacle
  score++;
  document.querySelector(".show_score span").textContent = `Score : ${score}`;
  moveObstacles();
}, movingTime);
