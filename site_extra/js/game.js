let canvas, ctx;
let player;
let obstacles = [];
let platforms = [];
let coins = [];
let levelIndex = 0;

let speed = 6;
let running = false;
let gameOver = false;
let levelComplete = false;

let worldOffset = 0;

const groundY = 400;

const startBtn = document.getElementById("startBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const statusText = document.getElementById("statusText");
const coinDisplay = document.getElementById("coinDisplay");

let collectedCoins = 0;

window.onload = () => {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  new InputHandler(() => {
    if (running && !gameOver && !levelComplete) {
      player.jump();
    }
  });

  fullscreenBtn.onclick = toggleFullscreen;
  startBtn.onclick = startLevel;

  resetGame();
  drawStatic();
};

function resetGame() {
  player = new Player(80, groundY);
  obstacles = [];
  platforms = [];
  coins = [];
  levelIndex = 0;
  speed = 6;
  running = false;
  gameOver = false;
  levelComplete = false;
  worldOffset = 0;
  collectedCoins = 0;
  coinDisplay.textContent = "Coins: 0";
}

function startLevel() {
  resetGame();
  running = true;
  statusText.textContent = "Good luck!";
  requestAnimationFrame(gameLoop);
}

function gameLoop() {
  if (!running) return;

  update();
  draw();

  if (!gameOver && !levelComplete) {
    requestAnimationFrame(gameLoop);
  }
}

function update() {
  worldOffset += speed;

  if (levelIndex < levelData.length) {
    const obj = levelData[levelIndex];
    if (obj.x - worldOffset < canvas.width + 200) {
      spawnObject(obj);
      levelIndex++;
    }
  }

  player.update(platforms);

  obstacles.forEach(o => o.update(speed));
  platforms.forEach(p => p.update(speed));
  coins.forEach(c => c.update(speed));

  obstacles = obstacles.filter(o => o.x + o.width > 0);
  platforms = platforms.filter(p => p.x + p.width > 0);
  coins = coins.filter(c => !c.collected && c.x > -50);

  checkObstacleCollision();
  checkCoinCollision();

  if (levelComplete) {
    statusText.textContent = "LEVEL COMPLETE!";
  }
}

function spawnObject(obj) {
  if (obj.type === "spike" || obj.type === "double" || obj.type === "wall") {
    obstacles.push(new Obstacle(obj.x, groundY, obj.type));
  }

  if (obj.type === "platform") {
    platforms.push(new Platform(obj.x, obj.y));
  }

  if (obj.type === "coin") {
    coins.push(new Coin(obj.x, obj.y));
  }

  if (obj.type === "end") {
    levelComplete = true;
  }
}

function checkObstacleCollision() {
  const p = player.getBounds();

  for (const o of obstacles) {
    const b = o.getBounds();
    if (
      p.x < b.x + b.w &&
      p.x + p.w > b.x &&
      p.y < b.y + b.h &&
      p.y + p.h > b.y
    ) {
      gameOver = true;
      running = false;
      statusText.textContent = "Game Over!";
    }
  }
}

function checkCoinCollision() {
  const p = player.getBounds();

  for (const c of coins) {
    const b = c.getBounds();
    if (
      !c.collected &&
      p.x < b.x + b.w &&
      p.x + p.w > b.x &&
      p.y < b.y + b.h &&
      p.y + p.h > b.y
    ) {
      c.collected = true;
      collectedCoins++;
      coinDisplay.textContent = "Coins: " + collectedCoins;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#333";
  ctx.fillRect(0, groundY, canvas.width, 50);

  platforms.forEach(p => p.draw(ctx));
  obstacles.forEach(o => o.draw(ctx));
  coins.forEach(c => c.draw(ctx));

  player.draw(ctx);

  if (gameOver) drawOverlay("GAME OVER");
  if (levelComplete) drawOverlay("LEVEL COMPLETE!");
}

function drawOverlay(text) {
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "40px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

function drawStatic() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#333";
  ctx.fillRect(0, groundY, canvas.width, 50);

  player.draw(ctx);
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch(err => console.log(err));
  } else {
    document.exitFullscreen();
  }
}
