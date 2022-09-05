const score = document.querySelector(".score");
const gameArea = document.querySelector(".gameArea");
const gameMessage = document.querySelector(".gameMessage");

document.addEventListener("keydown", pressOn);
document.addEventListener("keyup", pressOff);
gameMessage.addEventListener("click", start);

let player = {
  speed: 2,
  inplay: false,
};
let keys = {
  space: false,
};

function start() {
  gameArea.innerHTML = "";
  if (!player.inplay) {
    gameMessage.classList.add("hide");
    player.inplay = true;
    player.ready = true;
    player.score = 2000;
    player.level = 10;
    player.activeBomb = 0;
    player.plane = document.createElement("div");
    player.plane.classList.add("plane");

    gameArea.appendChild(player.plane);
    player.x = player.plane.offsetLeft;
    player.y = player.plane.offsetTop;

    makeEnemy();

    window.requestAnimationFrame(playGame);
  }
}

function makeEnemy() {
  player.base = document.createElement("div");
  player.base.classList.add("base");

  player.base.style.width = Math.random() * 200 + 30 + "px";
  player.base.style.height = Math.random() * 200 + 50 + "px";
  player.base.style.left =
    Math.random() * (gameArea.offsetWidth - 200) + 50 + "px";

  player.base.style.backgroundColor = getColor();

  gameArea.appendChild(player.base);
}

function playGame() {
  if (player.inplay) {
    player.score--;
    if (player.score < 0) {
      player.score = 0;
    }

    score.innerHTML = player.score;

    if (keys.space) {
      makeBomb();
    }

    moveBomb();

    if (keys.ArrowUp && player.y > 115) {
      player.y -= player.speed;
    }

    if (keys.ArrowDown && player.y < 200) {
      player.y += player.speed;
    }

    if (keys.ArrowLeft) {
      player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < gameArea.offsetWidth - 50) {
      player.x += player.speed;
    }

    player.x += player.speed * 2;
    player.plane.style.left = player.x + "px";
    player.plane.style.top = player.y + "px";

    if (player.x > gameArea.offsetWidth) {
      player.x = 0;
      player.score -= 300;
    }
    window.requestAnimationFrame(playGame);
  }
}

function getColor() {
  return "#" + Math.random().toString(16).substr(-6);
}

function moveBomb() {
  let bombs = document.querySelectorAll(".bomb");

  bombs.forEach((bomb) => {
    bomb.y += 5;
    bomb.style.top = bomb.y + "px";

    if (bomb.y > 700) {
      bomb.parentElement.removeChild(bomb);
      player.activeBomb--;
    }

    if (isCollide(bomb, player.base)) {
      player.score += 300;
      player.activeBomb--;
      player.level--;
      if (player.level == 0) {
        gameOver();
      }
      bomb.parentElement.removeChild(bomb);
      player.base.parentElement.removeChild(player.base);
      makeEnemy();
    }
  });
}

function gameOver() {
  player.inplay = false;
  gameMessage.classList.remove("hide");
}

function isCollide(a, b) {
  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();
  return !(
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

function makeBomb() {
  if (player.ready) {
    player.score -= 200;
    player.activeBomb++;
    let bomb = document.createElement("div");
    bomb.classList.add("bomb");
    player.ready = false;
    bomb.x = player.x;
    bomb.y = player.y;
    bomb.style.backgroundColor = getColor();

    bomb.style.left = bomb.x + "px";
    bomb.style.top = bomb.y + "px";

    bomb.innerHTML = player.activeBomb;

    gameArea.appendChild(bomb);

    setTimeout(function () {
      player.ready = true;
    }, 500);
  }
}
function pressOn(e) {
  let eventName = e.key == " " ? "space" : e.key;

  keys[eventName] = true;
}

function pressOff(e) {
  let eventName = e.key == " " ? "space" : e.key;

  keys[eventName] = false;
}
