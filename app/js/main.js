"./map.js";

let brick = new Image();
brick.src = "../img/brick.jpg";
let flag = new Image();
flag.src = "../img/flag.jpg";
let pavement = new Image();
pavement.src = "../img/pavement.webp";
let user = new Image();
user.src = "../img/user.png";

// control the wining message
let winBlock = document.querySelector(".win");
winBlock.addEventListener("click", function () {
  console.log("remove");
  winBlock.classList.add("active");
});
let map = [
  [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
];
let mooves = 0;

const score = document.querySelector(".score");
const hit = document.querySelector(".hit");
function updateScore(n) {
  return (score.innerText = `Score: ${n}`);
}

// create the map and player behavior

let c = document.getElementById("canvas");
let ctx = c.getContext("2d");

let player = {
  x: 0,
  y: 0,
  newX: 0,
  newY: 0,
};
let collBox = [];

let tailSize = 50;
let mapHeight = map.length;
let mapWidth = map[0].length;

function drawMap(m) {
  for (let i = 0; i < m.length; i++) {
    collBox.push([]);
    for (let j = 0; j < m[i].length; j++) {
      if (m[i][j] === 1) {
        ctx.beginPath();
        // ctx.fillStyle = "#000000";
        // ctx.fillRect(j * tailSize, i * tailSize, tailSize, tailSize);
        ctx.drawImage(brick, j * tailSize, i * tailSize, tailSize, tailSize);
      } else if (m[i][j] === 2) {
        ctx.beginPath();
        // ctx.fillStyle = "#00ff00";
        // ctx.fillRect(j * tailSize, i * tailSize, tailSize, tailSize);
        ctx.drawImage(flag, j * tailSize, i * tailSize, tailSize, tailSize);
      } else {
        ctx.beginPath();
        ctx.drawImage(pavement, j * tailSize, i * tailSize, tailSize, tailSize);
      }
      collBox[i].push({
        x: j * tailSize,
        y: i * tailSize,
        status: m[i][j] === 1 ? 1 : m[i][j] === 2 ? 2 : 0,
      });
    }
  }
}

function drawPlayer(x, y) {
  ctx.beginPath();
  // ctx.fillStyle = "#FF0000";
  // ctx.fillRect(x, y, tailSize, tailSize);
  ctx.drawImage(user, x, y, tailSize, tailSize);
}

function deleteMapAndPlayer() {
  ctx.clearRect(0, 0, mapWidth * tailSize, mapHeight * tailSize);
  // ctx.clearRect(player.newX, player.newY, tailSize, tailSize);

  // ctx.beginPath();
  ctx.clearRect(
    player.newX,
    player.newY,
    player.newX + tailSize,
    player.newY + tailSize
  );
  player = {
    x: 0,
    y: 0,
    newX: 0,
    newY: 0,
  };

  console.log("deleted");
}

function move(x, y) {
  ctx.clearRect(0, 0, mapWidth * tailSize, mapHeight * tailSize);
  drawMap(map);
  drawPlayer(x, y);
  player.x = player.newX;
  player.y = player.newY;
}

function showAlert() {
  hit.classList.add("show")
  setTimeout(() => {
    hit.classList.remove("show")
  }, 2000);
}

function checkMoove() {
  console.log(player);
  for (let i = 0; i < mapHeight; i++) {
    for (let j = 0; j < mapWidth; j++) {
      let b = collBox[i][j];
      if (player.newX === b.x && player.newY === b.y) {
        if (b.status === 1) {
          showAlert();
          console.log("Hit the rock");
        } else if (b.status === 2) {
          console.log("WIN");
          move(player.newX, player.newY);
          winBlock.classList.remove("active");

          mooves = 0;
          updateScore(mooves);

          deleteMapAndPlayer();
          drawMap(map);
          drawPlayer(0, 0);
        } else {
          move(player.newX, player.newY);
        }
      } else if (
        player.newX < 0 ||
        player.newY < 0 ||
        player.newX >= mapWidth * tailSize ||
        player.newY >= mapHeight * tailSize
      ) {
        console.log("OUT of the wall");
      }
    }
  }
}

window.onkeydown = function (event) {
  mooves++;
  updateScore(mooves);
  if (event.keyCode === 37) {
    player.newX = player.x - tailSize;
    player.newY = player.y;
  }
  if (event.keyCode === 38) {
    player.newY = player.y - tailSize;
    player.newX = player.x;
  }
  if (event.keyCode === 39) {
    player.newX = player.x + tailSize;
    player.newY = player.y;
  }
  if (event.keyCode === 40) {
    player.newY = player.y + tailSize;
    player.newX = player.x;
  }
  checkMoove();
};

window.onload = function () {
  drawMap(map);
  drawPlayer(0, 0);
};
