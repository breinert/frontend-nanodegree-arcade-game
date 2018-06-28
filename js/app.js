let score = 0;
const currentScore = document.querySelector('.score');
let lives = 3;
const currentLives = document.querySelector('.lives');
const currentTime = document.querySelector('.timer');
let time;
let elapsed;
let start;
let playing = false;
let sec;
// Enemies our player must avoid
var Enemy = function(x, y) {
    this.x = x;
    this.y = y;
    this.enemySpeed = ((Math.random() * 3) + 0.5);
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.update = function(dt) {
    this.isOutOfBoundsX = this.x > 5;
    this.isOutOfBoundsY = this.y < 1;
    if (this.isOutOfBoundsX) {
        this.x = -1;
    } else {
        this.x += (dt * this.enemySpeed);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83);
};

var Player = function() {
    this.x = 2;
    this.y = 5;
    this.sprite = 'images/char-boy.png';
    this.moving = false;
    this.win = false;
    playing = false;
};

Player.prototype.update = function() {
    this.isOutOfBoundsX = this.x > 5;
    this.isOutOfBoundsY = this.y < 1;
    if (this.isOutOfBoundsY && !this.moving && !this.win) {
        score += 20;
        this.x = 2;
        this.y = 5;
        playing = false;
        clearTimer();
        initialClick();
    }
    if (sec === 0) {
        this.x = 2;
        this.y = 5;
        playing = false;
        clearTimer();
        initialClick();
        lives -= 1;
        sec -= 15;
        if (lives <= 0) {
            alert('Game Over');
        }
    }
    currentScore.innerHTML = score;
    currentLives.innerHTML = lives;
    currentTime.innerHTML = sec;
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83);
    this.moving = false;
};


const allEnemies = [...Array(3)].map((_,i)=>new Enemy(i, i+1));
const player = new Player();


document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    initialClick();
    player.handleInput(allowedKeys[e.keyCode])

});

function initialClick() {
    if (playing == false) {
        start = new Date().getTime();
        setTimer();
        playing = true;
    }
}

function setTimer() {
    timer = setInterval(function() {
        time = ((new Date().getTime()) - start);
        elapsed = Math.floor(time / 100) / 10;
        sec = 15  - (parseInt(elapsed%60));
    }, 100);
}

function clearTimer() {
    clearInterval(timer);
}

Player.prototype.handleInput = function(input){
    switch(input) {
        case 'left':
            this.x = this.x > 0 ? this.x - 1: this.x;
            break;
        case 'up':
            this.y = this.y > 0 ? this.y - 1: this.y;
            break;
        case 'right':
            this.x = this.x < 4 ? this.x + 1: this.x;
            break;
        case 'down':
            this.y = this.y < 5 ? this.y + 1: this.y;
            break;
        default:
            break;
    }
    this.moving = true;
}


function checkCollisions() {
    allEnemies.forEach(function(enemy) {
        if (enemy.y === player.y) {
            if (enemy.x >= player.x - 0.5 && enemy.x <= player.x + 0.5) {
                player.y = 5;
                player.x = 2;
                lives -= 1;
                if (lives <= 0) {
                    alert('Game Over');
                }
                playing = false;
                clearTimer();
                initialClick();
            }
        }
    });
}
