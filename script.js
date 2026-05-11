const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

let paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  width: 80,
  height: 10,
  dx: 6
};

let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 8,
  dx: 3,
  dy: -3
};

let rows = 5;
let cols = 7;
let blockWidth = 35;
let blockHeight = 15;
let padding = 10;
let offsetTop = 30;
let offsetLeft = 20;

let blocks = [];
let score = 0;

// Create blocks
for (let r = 0; r < rows; r++) {
  blocks[r] = [];
  for (let c = 0; c < cols; c++) {
    blocks[r][c] = { x: 0, y: 0, status: 1 };
  }
}

// Draw ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.closePath();
}

// Draw paddle
function drawPaddle() {
  ctx.fillStyle = "white";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Draw blocks
function drawBlocks() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (blocks[r][c].status === 1) {
        let x = c * (blockWidth + padding) + offsetLeft;
        let y = r * (blockHeight + padding) + offsetTop;

        blocks[r][c].x = x;
        blocks[r][c].y = y;

        ctx.fillStyle = "#00ffc8";
        ctx.fillRect(x, y, blockWidth, blockHeight);
      }
    }
  }
}

// Collision detection
function collisionDetection() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let b = blocks[r][c];

      if (b.status === 1) {
        if (
          ball.x > b.x &&
          ball.x < b.x + blockWidth &&
          ball.y > b.y &&
          ball.y < b.y + blockHeight
        ) {
          ball.dy *= -1;
          b.status = 0;
          score++;
          scoreEl.textContent = score;
        }
      }
    }
  }
}

// Main draw loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawBlocks();
  collisionDetection();

  // Wall collision
  if (ball.x + ball.dx > canvas.width || ball.x + ball.dx < 0) {
    ball.dx *= -1;
  }

  if (ball.y + ball.dy < 0) {
    ball.dy *= -1;
  } 
  else if (ball.y + ball.dy > canvas.height) {
    if (
      ball.x > paddle.x &&
      ball.x < paddle.x + paddle.width
    ) {
      ball.dy *= -1;
    } else {
      alert("Game Over");
      document.location.reload();
    }
  }

  ball.x += ball.dx;
  ball.y += ball.dy;

  requestAnimationFrame(draw);
}

// Controls
document.addEventListener("keydown", function(e) {
  if (e.key === "ArrowRight" && paddle.x < canvas.width - paddle.width) {
    paddle.x += paddle.dx;
  } 
  else if (e.key === "ArrowLeft" && paddle.x > 0) {
    paddle.x -= paddle.dx;
  }
});

// Start game
draw();