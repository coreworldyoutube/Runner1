const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// プレイヤーの設定
let playerWidth = 50;
let playerHeight = 50;
let playerX = 100;
let playerY = 500;
let playerVelocity = 5;
let isJumping = false;
let jumpStrength = 15; // ジャンプの強さ
let gravity = 0.8; // 重力の強さ
let velocityY = 0; // Y方向の速度
let isOnGround = false;

// プレイヤー画像を読み込む
const playerImage = new Image();
playerImage.src = 'player.png'; // 画像のパス

// 背景画像を読み込む
const backgroundImage = new Image();
backgroundImage.src = 'background.png'; // 背景画像のパス

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
  // プレイヤー画像の描画
  ctx.drawImage(playerImage, playerX, playerY, playerWidth, playerHeight);
}

// 背景を描画
let backgroundX = 0; // 背景の初期位置

function drawBackground() {
  // 背景画像の描画
  ctx.drawImage(backgroundImage, backgroundX, 0, canvas.width, canvas.height);
}

// 漢数字に変換する関数
function toKanji(number) {
  const kanjiNumbers = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  const str = number.toString();
  let kanjiString = '';
  
  for (let char of str) {
    kanjiString += kanjiNumbers[parseInt(char)];
  }
  return kanjiString;
}

// プレイヤーの動き
function updatePlayer() {
  if (keys["ArrowLeft"] || keys["a"]) {
    playerX -= playerVelocity;
  }
  if (keys["ArrowRight"] || keys["d"]) {
    playerX += playerVelocity;
  }

  // ジャンプ
  if (!isJumping && (keys[" "])) {
    isJumping = true;
    velocityY = -jumpStrength; // ジャンプ開始
  }

  // ジャンプ中の物理演算
  if (isJumping) {
    playerY += velocityY;
    velocityY += gravity; // 重力を加算
  }

  // 地面に到達したら
  if (playerY >= canvas.height - playerHeight) {
    playerY = canvas.height - playerHeight;
    isJumping = false;
    velocityY = 0; // 着地後は速度をリセット
  }

  // 横スクロール: プレイヤーが画面の端に到達すると背景を移動
  if (playerX >= canvas.width / 2) {
    backgroundX -= playerVelocity; // プレイヤーが右に進むと背景が左に移動
  }
  if (playerX <= canvas.width / 4) {
    backgroundX += playerVelocity; // プレイヤーが左に進むと背景が右に移動
  }

  // 背景のスクロール範囲を制限
  if (backgroundX < -canvas.width) {
    backgroundX = 0; // 背景が完全に左にスクロールしたらリセット
  } else if (backgroundX > 0) {
    backgroundX = -canvas.width; // 背景が完全に右にスクロールしたらリセット
  }
}

// ゲームの更新
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground(); // 背景の描画
  updatePlayer();
  drawPlayer();

  // 進行距離の計算と表示
  const distance = playerX / 10; // 進んだ距離 (仮に10pxで1メートルとする)
  const kanjiDistance = toKanji(Math.floor(distance)); // 漢数字に変換

  ctx.font = "30px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(kanjiDistance + "メートル", canvas.width - 150, 50); // 右上に表示

  requestAnimationFrame(gameLoop);
}

// スクロールを無効化
document.body.addEventListener("touchstart", (e) => {
  e.preventDefault();
}, { passive: false });

document.body.addEventListener("touchmove", (e) => {
  e.preventDefault();
}, { passive: false });

// ゲーム開始
gameLoop();
