const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// プレイヤーの設定
let playerWidth = 50;
let playerHeight = 50;
let playerX = 100;
let playerY = 500;
let playerVelocity = 5;
let isJumping = false;
let jumpCount = 10;

// ゲームの設定
const gravity = 0.5;
let velocityY = 0;
let isOnGround = false;

// キーの状態
let keys = {};

// キーが押されたときの処理
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

// キーが離されたときの処理
window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// プレイヤーを描画
function drawPlayer() {
  ctx.fillStyle = "blue";
  ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
}

// プレイヤーの動き
function updatePlayer() {
  if (keys["ArrowLeft"] || keys["a"]) {
    playerX -= playerVelocity;
  }
  if (keys["ArrowRight"] || keys["d"]) {
    playerX += playerVelocity;
  }

  if (!isJumping && (keys[" "])) {
    isJumping = true;
  }

  if (isJumping) {
    if (jumpCount >= -10) {
      let jumpVelocity = jumpCount < 0 ? 1 : -1;
      playerY -= (jumpCount ** 2) * 0.5 * jumpVelocity;
      jumpCount -= 1;
    } else {
      isJumping = false;
      jumpCount = 10;
    }
  } else {
    if (!isOnGround) {
      velocityY += gravity;
      playerY += velocityY;
    }
  }

  // 地面に到達したら
  if (playerY >= canvas.height - playerHeight) {
    playerY = canvas.height - playerHeight;
    isOnGround = true;
    velocityY = 0;
  } else {
    isOnGround = false;
  }
}

// ゲームの更新
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updatePlayer();
  drawPlayer();

  requestAnimationFrame(gameLoop);
}

// ゲーム開始
gameLoop();
